"""SEPTA (Philadelphia) adapter.

Feed: https://www3.septa.org/api/Arrivals/index.php?station={id}&results={n}
Public, no API key. Station ids are numeric (e.g. 90005 = Suburban Station).
Direction: "Northbound" / "Southbound" (matched case-insensitively).
"""
import json
import re
import urllib.request
from datetime import datetime

from .base import Departure, TransitSource

BASE = "https://www3.septa.org/api/Arrivals/index.php"


class SeptaSource(TransitSource):
    name = "septa"

    def _fetch(self, station: str, n: int):
        url = f"{BASE}?station={station}&results={n}"
        req = urllib.request.Request(url, headers={"User-Agent": "lakehouse-localtransit/1.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.load(r)
        # response is keyed "{Station} Departures: {date}" -> take first value
        return next(iter(data.values()))

    @staticmethod
    def _seconds(item) -> int:
        dt = item.get("depart_time")
        if dt:
            try:
                t = datetime.strptime(dt, "%Y-%m-%d %H:%M:%S.%f")
                return max(0, int((t - datetime.now()).total_seconds()))
            except ValueError:
                pass
        m = re.match(r"(\d+)\s*min", item.get("status", ""))
        return int(m.group(1)) * 60 if m else -1

    def departures(self, station: str, direction: str, n: int = 2) -> list[Departure]:
        groups = self._fetch(station, n)
        # shape: [ {"Northbound": [...]}, {"Southbound": [...]} ]
        if isinstance(groups, dict):
            groups = [{k: v} for k, v in groups.items()]
        want = direction.lower()
        for grp in groups:
            for grp_name, items in grp.items():
                if want and want not in grp_name.lower():
                    continue
                out: list[Departure] = []
                for it in items[:n]:
                    secs = self._seconds(it)
                    eta = f"{secs // 60} min" if secs >= 0 else (it.get("status") or "--")
                    out.append(Departure(
                        target=it.get("destination", "?"),
                        eta_text=eta,
                        seconds=secs,
                        headsign=it.get("destination", ""),
                    ))
                if out:
                    return out
        return []

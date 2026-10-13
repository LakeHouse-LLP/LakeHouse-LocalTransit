"""Wiener Linien (Vienna) adapter.

Feed: https://www.wienerlinien.at/ogd_realtime/monitor?rbl={stopId}
Public, no API key. Station: RBL stop number, e.g. "4406" = Rossauer Laende.
Direction: matched case-insensitively against the line's "towards" field;
empty matches all lines at the stop.
"""
import json
import urllib.request

from .base import Departure, TransitSource

BASE = "https://www.wienerlinien.at/ogd_realtime/monitor"


class WienerLinienSource(TransitSource):
    name = "wienerlinien"

    def departures(self, station: str, direction: str, n: int = 2) -> list[Departure]:
        req = urllib.request.Request(
            f"{BASE}?rbl={station}",
            headers={"User-Agent": "lakehouse-localtransit/1.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.load(r)
        want = direction.lower()
        cands: list[tuple[int, Departure]] = []
        for mon in data.get("data", {}).get("monitors", []):
            for line in mon.get("lines", []):
                towards = line.get("towards", "")
                if want and want not in towards.lower():
                    continue
                for dep in line.get("departures", {}).get("departure", []):
                    dt = dep.get("departureTime", {})
                    cd = dt.get("countdown")
                    if cd is None:
                        continue
                    cands.append((cd, Departure(
                        target=line.get("name", "?"),
                        eta_text="now" if cd == 0 else f"{cd} min",
                        seconds=cd * 60,
                        headsign=towards,
                    )))
        cands.sort(key=lambda c: c[0])
        return [d for _, d in cands[:n]]

"""Port Authority PATH adapter (Jersey City <-> NYC).

Feed: https://www.panynj.gov/bin/portauthority/ridepath.json
Public, no API key — the same feed the official RidePATH app uses.
"""
import json
import urllib.request

from .base import Departure, TransitSource

FEED_URL = "https://www.panynj.gov/bin/portauthority/ridepath.json"


class PathSource(TransitSource):
    name = "path"

    def __init__(self, url: str = FEED_URL):
        self.url = url
        self._cache = None

    def _fetch(self):
        req = urllib.request.Request(self.url, headers={"User-Agent": "lakehouse-localtransit/1.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            self._cache = json.load(r)
        return self._cache

    def departures(self, station: str, direction: str, n: int = 2) -> list[Departure]:
        data = self._fetch()
        for res in data.get("results", []):
            if res.get("consideredStation") != station:
                continue
            for dest in res.get("destinations", []):
                if dest.get("label") != direction:
                    continue
                out = []
                for m in dest.get("messages", [])[:n]:
                    try:
                        secs = int(m.get("secondsToArrival", -1))
                    except (TypeError, ValueError):
                        secs = -1
                    out.append(Departure(
                        target=m.get("target", "?"),
                        eta_text=m.get("arrivalTimeMessage", "--"),
                        seconds=secs,
                        color=m.get("lineColor", "FFFFFF"),
                        headsign=m.get("headSign", ""),
                    ))
                return out
        return []

    def stations(self) -> list[str]:
        data = self._fetch()
        return [r.get("consideredStation", "?") for r in data.get("results", [])]

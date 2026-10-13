"""BART (San Francisco Bay Area) adapter.

Feed: https://api.bart.gov/api/etd.aspx?cmd=etd&orig={STATION}&key={KEY}&json=y
Needs a key, but BART publishes a public demo key; a free personal key is
available at api.bart.gov. Set BART_KEY env or pass key= to override.
Station: 4-letter code, e.g. "EMBR" = Embarcadero.
Direction: "North" / "South" (matched case-insensitively).
"""
import json
import os
import urllib.request

from .base import Departure, TransitSource

DEMO_KEY = "MW9S-E7SL-26DU-VV8V"  # BART's public demo key
BASE = "https://api.bart.gov/api/etd.aspx"
STN_URL = "https://api.bart.gov/api/stn.aspx"


class BartSource(TransitSource):
    name = "bart"

    def __init__(self, key: str | None = None):
        self.key = key or os.environ.get("BART_KEY", DEMO_KEY)

    def _get(self, url: str):
        req = urllib.request.Request(url, headers={"User-Agent": "lakehouse-localtransit/1.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.load(r)

    def departures(self, station: str, direction: str, n: int = 2) -> list[Departure]:
        data = self._get(f"{BASE}?cmd=etd&orig={station}&key={self.key}&json=y")
        want = direction.lower()
        out: list[Departure] = []
        stations = data.get("root", {}).get("station", [])
        st = stations[0] if stations else {}
        for etd in st.get("etd", []):
            dest = etd.get("destination", "?")
            for est in etd.get("estimate", []):
                if want and want not in est.get("direction", "").lower():
                    continue
                mins = est.get("minutes", "")
                secs = 0 if mins == "Leaving" else (int(mins) * 60 if mins.isdigit() else -1)
                color = (est.get("hexcolor") or "#FFFFFF").lstrip("#")
                out.append(Departure(
                    target=etd.get("abbreviation", dest),
                    eta_text="now" if secs == 0 else f"{mins} min",
                    seconds=secs,
                    color=color,
                    headsign=dest,
                ))
                if len(out) >= n:
                    return out
        return out

    def stations(self) -> list[str]:
        data = self._get(f"{STN_URL}?cmd=stns&key={self.key}&json=y")
        return [s.get("abbr", "?") for s in data.get("root", {}).get("stations", {}).get("station", [])]

"""TfL (London) adapter.

Feed: https://api.tfl.gov.uk/StopPoint/{naptanId}/Arrivals
Public, no API key (optional app_id/app_key raises rate limits).
Station: NaPTAN id, e.g. "940GZZLUBST" = Baker Street.
Direction: "inbound" / "outbound" matched against the prediction's direction
field (case-insensitive); empty matches all.
"""
import json
import urllib.request

from .base import Departure, TransitSource

BASE = "https://api.tfl.gov.uk/StopPoint"

LINE_COLORS = {
    "bakerloo": "B36305", "central": "E32017", "circle": "FFD300",
    "district": "00782A", "hammersmith-city": "F3A9BB", "jubilee": "A0A5A9",
    "metropolitan": "9B0056", "northern": "000000", "piccadilly": "003078",
    "victoria": "0098D4", "waterloo-city": "95CDBA", "dlr": "00A4A7",
    "london-overground": "EE7C0E", "elizabeth": "9364CD",
}


class TflSource(TransitSource):
    name = "tfl"

    def departures(self, station: str, direction: str, n: int = 2) -> list[Departure]:
        req = urllib.request.Request(
            f"{BASE}/{station}/Arrivals",
            headers={"User-Agent": "lakehouse-localtransit/1.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            preds = json.load(r)
        want = direction.lower()
        preds.sort(key=lambda p: p.get("timeToStation", 10 ** 9))
        out: list[Departure] = []
        for p in preds:
            if want and want not in str(p.get("direction", "")).lower():
                continue
            secs = p.get("timeToStation", -1)
            line_id = str(p.get("lineId", "")).lower()
            dest = p.get("destinationName", "?")
            out.append(Departure(
                target=p.get("towards", dest),
                eta_text="due" if secs <= 30 else f"{secs // 60} min",
                seconds=secs,
                color=LINE_COLORS.get(line_id, "FFFFFF"),
                headsign=dest,
            ))
            if len(out) >= n:
                break
        return out

"""MBTA (Boston) adapter.

Feed: https://api-v3.mbta.com/predictions (JSON:API)
Keyless at low rate; a free key raises limits (set MBTA_KEY env or pass key=).
Stop ids: GTFS stop ids, e.g. "70068" = Harvard (Red line).
Direction: "0"/"1", or "outbound"/"inbound" (MBTA: 0 = outbound, 1 = inbound).
"""
import json
import os
import urllib.parse
import urllib.request
from datetime import datetime, timezone

from .base import Departure, TransitSource

BASE = "https://api-v3.mbta.com"


class MbtaSource(TransitSource):
    name = "mbta"

    def __init__(self, key: str | None = None):
        self.key = key or os.environ.get("MBTA_KEY")

    def _get(self, path: str, params: dict):
        if self.key:
            params["api_key"] = self.key
        url = f"{BASE}{path}?{urllib.parse.urlencode(params)}"
        req = urllib.request.Request(url, headers={"User-Agent": "lakehouse-localtransit/1.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.load(r)

    def departures(self, station: str, direction: str, n: int = 2) -> list[Departure]:
        want = direction.lower()
        if want in ("inbound", "in"):
            want = "1"
        elif want in ("outbound", "out"):
            want = "0"
        params = {
            "filter[stop]": station,
            "page[limit]": n * 3,
            "include": "trip,route",
            "sort": "departure_time",
        }
        if want in ("0", "1"):
            params["filter[direction_id]"] = want
        doc = self._get("/predictions", params)
        included = {}
        for inc in doc.get("included", []):
            included[(inc.get("type"), inc.get("id"))] = inc.get("attributes", {})
        out: list[Departure] = []
        now = datetime.now(timezone.utc)
        for ent in doc.get("data", []):
            if len(out) >= n:
                break
            a = ent.get("attributes", {})
            if a.get("schedule_relationship") in ("CANCELLED", "SKIPPED"):
                continue
            iso = a.get("departure_time") or a.get("arrival_time")
            if not iso:
                continue
            try:
                t = datetime.fromisoformat(iso)
            except ValueError:
                continue
            secs = max(0, int((t - now).total_seconds()))
            rel = ent.get("relationships", {})
            trip_id = (rel.get("trip") or {}).get("data", {}).get("id")
            route_id = (rel.get("route") or {}).get("data", {}).get("id")
            trip = included.get(("trip", trip_id), {})
            route = included.get(("route", route_id), {})
            color = route.get("color") or "FFFFFF"
            headsign = trip.get("headsign") or route.get("long_name") or ""
            out.append(Departure(
                target=headsign or route.get("short_name") or "?",
                eta_text=f"{secs // 60} min",
                seconds=secs,
                color=color,
                headsign=headsign,
            ))
        return out

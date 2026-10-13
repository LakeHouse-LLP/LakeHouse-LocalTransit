"""Config-driven adapter for any JSON departure feed.

Many agencies publish a simple JSON endpoint. Describe its shape once in a
config file and the board can read it without new code.

Config schema:
{
  "url": "https://agency.example.com/departures.json",
  "stations": "results",              // dotted path to the station list
  "station_key": "consideredStation", // field holding the station code
  "groups": "destinations",           // dotted path to direction groups
  "group_key": "label",               // field holding the direction label
  "items": "messages",                // dotted path to departure items
  "fields": {
    "target": "target",               // destination code field
    "eta_text": "arrivalTimeMessage", // human ETA field
    "seconds": "secondsToArrival",    // seconds-to-arrival field (optional)
    "color": "lineColor",             // RRGGBB line color field (optional)
    "headsign": "headSign"            // full destination name (optional)
  }
}

Dotted paths support nested objects ("a.b.c") and automatically map over
arrays. station/group matching is exact string equality against the CLI args.
"""
import json
import urllib.request

from .base import Departure, TransitSource


def _resolve_simple(obj, path):
    cur = obj
    for part in path.split("."):
        if not isinstance(cur, dict):
            return None
        cur = cur.get(part)
        if cur is None:
            return None
    return cur


def _as_list(value):
    if value is None:
        return []
    return value if isinstance(value, list) else [value]


class GenericJsonSource(TransitSource):
    name = "generic"

    def __init__(self, config: str | dict):
        if isinstance(config, str):
            with open(config) as f:
                config = json.load(f)
        self.cfg = config
        self._cache = None

    def _fetch(self):
        req = urllib.request.Request(
            self.cfg["url"], headers={"User-Agent": "lakehouse-localtransit/1.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            self._cache = json.load(r)
        return self._cache

    def departures(self, station: str, direction: str, n: int = 2) -> list[Departure]:
        cfg = self.cfg
        data = self._fetch()
        fields = cfg.get("fields", {})
        out: list[Departure] = []
        for st in _as_list(_resolve_simple(data, cfg["stations"])):
            if _resolve_simple(st, cfg["station_key"]) != station:
                continue
            for grp in _as_list(_resolve_simple(st, cfg.get("groups", "")) or []):
                if cfg.get("groups") and _resolve_simple(grp, cfg["group_key"]) != direction:
                    continue
                items = _as_list(_resolve_simple(grp, cfg["items"]))
                if not cfg.get("groups"):
                    items = _as_list(_resolve_simple(st, cfg["items"]))
                for m in items[:n]:
                    secs = _resolve_simple(m, fields.get("seconds", ""))
                    try:
                        secs = int(secs)
                    except (TypeError, ValueError):
                        secs = -1
                    out.append(Departure(
                        target=str(_resolve_simple(m, fields.get("target", "")) or "?"),
                        eta_text=str(_resolve_simple(m, fields.get("eta_text", "")) or "--"),
                        seconds=secs,
                        color=str(_resolve_simple(m, fields.get("color", "")) or "FFFFFF"),
                        headsign=str(_resolve_simple(m, fields.get("headsign", "")) or ""),
                    ))
                return out
        return out

    def stations(self) -> list[str]:
        data = self._fetch()
        return [str(_resolve_simple(st, self.cfg["station_key"]))
                for st in _as_list(_resolve_simple(data, self.cfg["stations"]))]

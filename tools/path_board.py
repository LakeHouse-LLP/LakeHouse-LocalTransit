#!/usr/bin/env python3
"""LocalTransit board CLI — query any registered transit source.

Usage:
  python3 path_board.py --source path JSQ ToNY
  python3 path_board.py --source path --list-stations
  python3 path_board.py --source generic --config configs/septa.json 90804
  python3 path_board.py --list-sources
"""
import argparse
import sys

sys.path.insert(0, __file__.rsplit("/", 1)[0])

from sources import REGISTRY, get_source


def main():
    ap = argparse.ArgumentParser(description="LocalTransit departure board CLI")
    ap.add_argument("--source", default="path", help="source name (default: path)")
    ap.add_argument("--config", help="config file for the generic JSON source")
    ap.add_argument("--list-sources", action="store_true")
    ap.add_argument("--list-stations", action="store_true")
    ap.add_argument("--n", type=int, default=2, help="departures per row")
    ap.add_argument("station", nargs="?")
    ap.add_argument("direction", nargs="?")
    args = ap.parse_args()

    if args.list_sources:
        for name in sorted(REGISTRY):
            print(name)
        return

    kwargs = {"config": args.config} if args.config else {}
    src = get_source(args.source, **kwargs)

    if args.list_stations:
        for s in src.stations():
            print(s)
        return

    if not args.station:
        ap.error("station is required (or use --list-stations)")
    direction = args.direction or ""
    deps = src.departures(args.station, direction, args.n)
    if not deps:
        print(f"no departures for {args.station} {direction} on {src.name}")
        sys.exit(1)
    for d in deps:
        name = d.headsign or d.target
        print(f"{args.station} -> {name}: {d.eta_text} ({d.seconds}s)")


if __name__ == "__main__":
    main()

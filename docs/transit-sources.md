# Transit sources

LocalTransit talks to agencies through small adapters. Each adapter normalizes
a feed to departures: destination, human ETA text, seconds to arrival, line
color, headsign. The ESP32 firmware and the Python CLI share this shape.

## Python adapters (`tools/sources/`)

| Source | Agency | Feed | Key | Status |
|---|---|---|---|---|
| `path` | Port Authority PATH (NJ/NYC) | `https://www.panynj.gov/bin/portauthority/ridepath.json` | none | live verified |
| `generic` | any JSON feed | config file (see `tools/configs/`) | depends | live verified |
| `septa` | SEPTA (Philadelphia) | `https://www3.septa.org/api/Arrivals/index.php?station={id}&results={n}` | none | live verified |
| `mbta` | MBTA (Boston) | `https://api-v3.mbta.com/predictions` | optional (raises limits) | live verified keyless |
| `bart` | BART (SF Bay Area) | `https://api.bart.gov/api/etd.aspx` | demo key built in | live verified |
| `tfl` | TfL (London) | `https://api.tfl.gov.uk/StopPoint/{id}/Arrivals` | none | live verified |
| `wienerlinien` | Wiener Linien (Vienna) | `https://www.wienerlinien.at/ogd_realtime/monitor?rbl={id}` | none | live verified |

Examples:

```bash
python3 tools/path_board.py --source path JSQ ToNY
python3 tools/path_board.py --source septa 90005 Northbound
python3 tools/path_board.py --source mbta 70068 inbound
python3 tools/path_board.py --source bart EMBR North
python3 tools/path_board.py --source tfl 940GZZLUBST
python3 tools/path_board.py --source wienerlinien 4406
```

## Key-gated feeds (documented, adapters welcome)

These need a free API key, so they are not verified live here. Each is a good
candidate for the next adapter; the signup links are free.

| Agency | Feed | Key |
|---|---|---|
| NJ Transit | `https://raildata.njtransit.com/api/TrainData/` (token flow) and `/api/GTFSRT` | free registration at developer.njtransit.com (username + password, per-API tokens) |
| MTA subway (NYC) | `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs` (+ per-line feeds) | none for GTFS-RT since 2023; protobuf, needs static GTFS for stop names |
| CTA (Chicago) | `http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx` | free key at transitchicago.com/developers/traintrackerapply |
| WMATA (DC) | `https://api.wmata.com/StationPrediction.svc/json/jStationPredictions` | free key at developer.wmata.com |

## `generic` adapter

`generic` needs no code. Point it at a config describing the JSON shape:

```bash
python3 tools/path_board.py --source generic --config tools/configs/path.json JSQ ToNY
```

See `tools/configs/path.json` for the full schema. Copy it for a new agency,
adjust the dotted paths, and the board reads the new feed.

## Adding a native adapter

1. Subclass `TransitSource` in `tools/sources/<name>.py`.
2. Implement `departures(station, direction, n)` returning `Departure` objects.
3. Register it in `tools/sources/__init__.py` `REGISTRY`.
4. Verify live with the CLI before committing: `--source <name> --list-stations`.

## Firmware sources (`firmware/path_board/`)

The `.ino` defines a `TransitSource` C++ interface. `PathSource` is the
reference implementation. To add an agency, subclass it, implement `fetchRow()`,
and point the `transit` pointer at your class. Use an ArduinoJson filter so the
feed fits in ESP32 RAM. GTFS-RT protobuf feeds are too heavy to parse on the
ESP32 directly; for those, run the Python adapter on a Pi or server and expose
a small JSON endpoint the firmware can poll.

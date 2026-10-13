#!/usr/bin/env python3
"""LocalTransit departure board — Raspberry Pi + HUB75 LED matrix.

Drives the panel with hzeller/rpi-rgb-led-matrix Python bindings and reuses
the tools/sources/ transit adapters, so any supported agency works.

Setup (once, on the Pi):
  1. Build the library per https://github.com/hzeller/rpi-rgb-led-matrix
     (needs root for GPIO; on Pi 4 use --led-slowdown-gpio=4 equivalent,
     set below via gpio_slowdown).
  2. Disable onboard audio (it conflicts with the matrix driver):
     add "dtparam=audio=off" to /boot/firmware/config.txt and reboot.
  3. Wire Pi header pins to the panel's HUB75 input (see docs/pi-wiring.md).
  4. Power the panel from a 5V supply (>=4A for one 64x64 panel), the Pi from
     its own USB-C. Join grounds (one GND wire Pi -> panel).

Run:  sudo python3 pi_board.py
"""
import os
import sys
import time
from datetime import datetime

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "tools"))

try:
    from rgbmatrix import RGBMatrix, RGBMatrixOptions, graphics
except ImportError:
    sys.exit("rpi-rgb-led-matrix Python bindings not found. Build them per "
             "https://github.com/hzeller/rpi-rgb-led-matrix then retry.")

from sources import get_source  # noqa: E402

# ============ CONFIG ============
SOURCE_NAME = "path"   # path | septa | mbta | bart | tfl | wienerlinien | generic
SOURCE_ARGS = {}       # e.g. {"config": "tools/configs/septa.json"} for generic
ROWS = [               # (station, direction) per board row
    ("JSQ", "ToNY"),
    ("JSQ", "ToNJ"),
    ("HOB", "ToNY"),
    ("NWK", "ToNY"),
]
TRAINS_PER_ROW = 2
POLL_S = 20

PANEL_ROWS = 64
PANEL_COLS = 64
# ================================


def hex_to_color(g, hexstr):
    hexstr = (hexstr or "FFFFFF").lstrip("#")
    try:
        v = int(hexstr[:6], 16)
    except ValueError:
        v = 0xFFFFFF
    return graphics.Color((v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF)


def find_font():
    candidates = [
        "/usr/local/share/rpi-rgb-led-matrix/fonts/7x13.bdf",
        os.path.expanduser("~/rpi-rgb-led-matrix/fonts/7x13.bdf"),
        os.path.join(HERE, "fonts", "7x13.bdf"),
    ]
    for p in candidates:
        if os.path.exists(p):
            return p
    sys.exit("7x13.bdf not found; set FONT_PATH. Tried: " + ", ".join(candidates))


def main():
    options = RGBMatrixOptions()
    options.rows = PANEL_ROWS
    options.cols = PANEL_COLS
    options.chain_length = 1
    options.parallel = 1
    options.hardware_mapping = "regular"
    options.gpio_slowdown = 4  # required on Pi 4, harmless elsewhere
    options.drop_privileges = False
    matrix = RGBMatrix(options=options)

    font = graphics.Font()
    font.LoadFont(find_font())
    white = graphics.Color(255, 255, 255)
    dim = graphics.Color(120, 120, 120)
    amber = graphics.Color(255, 200, 0)

    source = get_source(SOURCE_NAME, **SOURCE_ARGS)
    canvas = matrix.CreateFrameCanvas()

    while True:
        try:
            board = [source.departures(st, dr, TRAINS_PER_ROW) for st, dr in ROWS]
        except Exception as e:  # keep last frame on fetch failure
            print("fetch failed:", e, flush=True)
            time.sleep(POLL_S)
            continue

        canvas.Clear()
        # header: clock like the reference build
        graphics.DrawText(canvas, font, 2, 10, amber, datetime.now().strftime("%H:%M"))
        graphics.DrawText(canvas, font, 40, 10, dim, "PATH" if SOURCE_NAME == "path" else SOURCE_NAME.upper()[:4])

        y = 25
        for (st, _), deps in zip(ROWS, board):
            color = hex_to_color(None, deps[0].color) if deps else dim
            graphics.DrawText(canvas, font, 1, y, color, st)
            etas = " ".join(d.eta_text for d in deps[:TRAINS_PER_ROW]) or "--"
            graphics.DrawText(canvas, font, 24, y, white, etas[:10])
            y += 13

        matrix.SwapOnVSync(canvas)
        time.sleep(POLL_S)


if __name__ == "__main__":
    main()

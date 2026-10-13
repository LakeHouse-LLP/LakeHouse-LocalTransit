# Bill of Materials

Two build paths. The Raspberry Pi path is recommended if you already own a
Pi 3/4/5: no new controller to buy, no soldering at all.

## Path A: Raspberry Pi build (recommended)

| # | Part | Spec | Price | Why this one |
|---|------|------|-------|--------------|
| 1 | 64x64 RGB LED matrix panel | P3, HUB75, indoor, 1/32 scan | ~$64.95 (Adafruit) | The display. 64x64 fits 4 station rows + clock header at readable size |
| 2 | 5V 10A switching power supply | 5V, 10A, 2.1mm jack or screw terminal | ~$29.95 (Adafruit) | One 64x64 panel can draw up to 4A at full brightness; 10A leaves headroom and already covers a second panel if you extend later |
| 3 | Dupont jumper wires, female-to-female | 40-pack, ~20cm | ~$7 | 16 wires connect the Pi header to the panel's HUB75 input (wiring table in docs/pi-wiring.md) |
| 4 | Raspberry Pi 3/4/5 | you already own one | $0 | Runs pi/pi_board.py, which reuses the tools/sources/ transit adapters |

Estimated total: **~$102**. No soldering iron, no extra tools.

## Path B: ESP32 build (no Pi on hand)

| # | Part | Spec | Price | Why this one |
|---|------|------|-------|--------------|
| 1 | ESP32 dev board, 30-pin | ESP32-WROOM-32, Type-C | ~$10.69 | Cheapest board the firmware is written for |
| 2 | 64x64 RGB LED matrix panel | P3, HUB75, indoor, 1/32 scan | ~$64.95 (Adafruit) | Same panel as Path A |
| 3 | HUB75 adapter board for ESP32 | Fits ESP32-DevKitC, must expose the **E address pin** | ~$10 | Skips hand-wiring: ESP32 plugs in, ribbon cable plugs in. E pin is required for 64x64 panels (1/32 scan) |
| 4 | 5V 10A switching power supply | 5V, 10A | ~$29.95 (Adafruit) | Same reasoning as Path A |
| 5 | HUB75 ribbon + power cable set | 16-pin IDC + 4-pin VH3.96 | usually included with the panel | Check the panel listing's "what's included" |

Estimated total: **~$115**. Firmware: firmware/path_board/path_board.ino.

## Why not the Adafruit Matrix Portal?

The Matrix Portal (S3) is the nicer controller, but its Address E line ships as
an **open solder jumper** on the back of the board. A 64x64 panel needs the E
line, so you must solder-bridge that jumper (center pad to `8` for Adafruit's
own 64x64 panel). It is also out of stock at both Adafruit and DigiKey as of
2026-10-13 (restock expected 2026-11-18).

## Extending later (no new controller needed)

- **Second 64x64 panel** (~$30): chain it via the panel's IDC output for a
  128x64 board. Firmware change is one line (`PANEL_CHAIN 2`); the 10A supply
  above already covers two panels. No new ESP32 needed.
- **Diffuser / frame**: a frosted acrylic sheet in front of the panel softens
  the LEDs for indoor use; panels have mounting holes / magnetic feet options.
- **More cities**: the firmware's `TransitSource` interface and the Python
  `tools/sources/` adapters already cover PATH, SEPTA, MBTA, BART, TfL and
  Wiener Linien; adding an agency does not change the hardware.

## Power notes

- Power the panel from the 5V supply directly; power the ESP32 over USB.
- Tie the grounds together (adapter shield does this for you).
- Never power a 64x64 panel from the ESP32's USB port.
- Start brightness at ~120/255 in the firmware; full white at 255 can brown
  out a marginal supply.

Prices checked 2026-10-13; Amazon listings rotate, so treat them as ballpark.

# Bill of Materials

Shopping list for the LocalTransit departure board (ESP32 + 64x64 HUB75 LED
matrix). Everything below is plug-together: no soldering iron, no extra tools.

## Core build (one 64x64 panel)

| # | Part | Spec | Price | Why this one |
|---|------|------|-------|--------------|
| 1 | ESP32 dev board, 30-pin | ESP32-WROOM-32, Type-C, CP2102/CH340 USB | ~$10.69 (Amazon) | Cheapest board the firmware is written for; 30-pin layout matches the adapter shield below |
| 2 | 64x64 RGB LED matrix panel | P3, HUB75, indoor, 1/32 scan | ~$29.95 (Amazon) | The display. 64x64 fits 4 station rows + clock header at readable size |
| 3 | HUB75 adapter board for ESP32 | Fits ESP32-DevKitC, must expose the **E address pin** | ~$10 (Amazon) | Skips all hand-wiring: ESP32 plugs in, ribbon cable plugs in. E pin is required for 64x64 panels (1/32 scan); most "HUB75 (E) kit" boards have it |
| 4 | 5V 10A switching power supply | 5V, 10A, 2.1mm jack or screw terminal | ~$29.95 (Adafruit) | One 64x64 panel can draw up to 4A at full brightness; 10A leaves headroom and already covers a second panel if you extend later. Tighter budget: a 5V 4A supply (~$14.95, Adafruit, UL listed) is enough for a single panel |
| 5 | HUB75 ribbon + power cable set | 16-pin IDC + 4-pin VH3.96 | usually included with the panel (~$2 spare) | Check the panel listing's "what's included"; Adafruit's panel ships both cables |

Estimated core total: **~$80** (with 10A supply) or **~$65** (with 4A supply).

## Why not the Adafruit Matrix Portal?

The Matrix Portal (S3) is the nicer controller, but its Address E line ships as
an **open solder jumper** on the back of the board. A 64x64 panel needs the E
line, so you must solder-bridge that jumper (center pad to `8` for Adafruit's
own 64x64 panel). With no soldering tools, the generic ESP32 + adapter shield
above is the truly tool-free path: E is just a wire to GPIO 32, which the
firmware already drives.

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

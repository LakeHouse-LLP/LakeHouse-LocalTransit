# Raspberry Pi wiring and setup

If you have a Raspberry Pi (3/4/5), it can drive the panel directly: no
ESP32, no adapter shield, no soldering. 16 female-to-female Dupont wires
connect the Pi's 40-pin header to the panel's 16-pin HUB75 input.

## Wiring (Pi header PIN numbers, not BCM)

| Pi header pin | HUB75 pin | Signal |
|---|---|---|
| 23 | 1 | R1 |
| 13 | 2 | G1 |
| 26 | 3 | B1 |
| 6 | 4 | GND |
| 24 | 5 | R2 |
| 21 | 6 | G2 |
| 19 | 7 | B2 |
| 10 | 8 | E (required for 64-row panels) |
| 15 | 9 | A |
| 16 | 10 | B |
| 18 | 11 | C |
| 22 | 12 | D |
| 11 | 13 | CLK |
| 7 | 14 | LAT / STB |
| 12 | 15 | OE |
| 6 (or any GND pin) | 16 | GND |

Pin mapping reference: hzeller/rpi-rgb-led-matrix `wiring.md` (chain 1).
The HUB75 layout above is the standard 16-pin order (E on pin 8); if your
panel's silkscreen shows E on pin 4, move that one wire accordingly.

## Power

- Panel: 5V supply (>=4A for one 64x64 panel) into the panel's power jack.
- Pi: its own USB-C supply.
- The GND wire in the table joins the two grounds. Do not power the panel
  from the Pi.

## Software setup (on the Pi)

```bash
# 1. Build the driver (https://github.com/hzeller/rpi-rgb-led-matrix)
sudo apt install git python3-dev python3-pillow cython3 -y
git clone https://github.com/hzeller/rpi-rgb-led-matrix.git
cd rpi-rgb-led-matrix
make -C lib
make -C bindings/python build
sudo make -C bindings/python install

# 2. Disable onboard audio (conflicts with the matrix driver)
echo "dtparam=audio=off" | sudo tee -a /boot/firmware/config.txt
sudo reboot

# 3. Run the board (must be root for GPIO)
cd ~/LakeHouse-LocalTransit
sudo python3 pi/pi_board.py
```

`pi/pi_board.py` reuses the `tools/sources/` adapters, so every supported
agency (PATH, SEPTA, MBTA, BART, TfL, Wiener Linien, generic JSON) works.
Edit `SOURCE_NAME` and `ROWS` at the top of the script for your station.

To start on boot: add `@reboot sudo /usr/bin/python3 /home/pi/LakeHouse-LocalTransit/pi/pi_board.py`
to root's crontab (`sudo crontab -e`).

## Troubleshooting

- **Flicker / glitches on Pi 4**: `gpio_slowdown = 4` is already set in the
  script; raise to 5 if needed.
- **Permission errors**: the script must run as root (`sudo`).
- **No sound after setup**: expected; the matrix driver takes over the PWM
  hardware that onboard audio uses. A USB sound card still works.
- **Wrong colors / garbled rows**: check the E wire first, then verify the
  panel is 1/32 scan (most 64x64 indoor panels are).

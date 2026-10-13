// LocalTransit departure board — ESP32 + HUB75 LED matrix
//
// Pluggable transit sources: the board talks to a TransitSource interface,
// so adding a new agency means writing one small class (see PathSource below
// for the pattern). The Python twin in tools/ has the same architecture with
// a config-driven generic JSON adapter.
//
// Libraries (Arduino IDE Library Manager):
//   - "ESP32 HUB75 LED MATRIX PANEL DMA Display" by mrfaptastic
//   - "ArduinoJson" by Benoit Blanchon (v7)
//
// Board: any ESP32 dev board. Panel: 64x64 HUB75 (P3/P4 indoor).
// Wire per the DEFAULT pinout in ESP32-HUB75-MatrixPanel-I2S-DMA
// (or use a cheap HUB75 adapter shield and skip hand-wiring).

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ESP32-HUB75-MatrixPanel-I2S-DMA.h>

// ============ CONFIG — edit these ============
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASS = "YOUR_WIFI_PASSWORD";

#define PANEL_WIDTH   64
#define PANEL_HEIGHT  64
#define PANEL_CHAIN   1

// Rows on the board. Station codes: NWK HAR JSQ GRV NEW EXP HOB WTC
// CHR 09S 14S 23S 33S. Directions in the feed: "ToNY" / "ToNJ".
struct BoardRow { const char* station; const char* direction; };
BoardRow ROWS[] = {
  { "JSQ", "ToNY" },
  { "JSQ", "ToNJ" },
  { "HOB", "ToNY" },
  { "NWK", "ToNY" },
};
const int NUM_ROWS = sizeof(ROWS) / sizeof(ROWS[0]);
const int TRAINS_PER_ROW = 2;      // next N trains shown per row
const unsigned long POLL_MS = 20000; // refresh every 20 s
// =============================================

MatrixPanel_I2S_DMA* display = nullptr;

struct Departure { char target[8]; char eta[10]; uint16_t color; };

// ---- Transit source plugin interface ----
// To support a new agency: subclass TransitSource, implement fetchRow() to
// fill up to n Departures for (station, direction), then point `transit`
// at your class in setup(). Keep the JSON small: use an ArduinoJson filter
// like PathSource does so the 10-100KB feed fits in RAM.
class TransitSource {
public:
  virtual const char* name() = 0;
  virtual bool fetchRow(const char* station, const char* direction,
                        Departure* out, int n) = 0;
};

uint16_t hexColor(const char* hex) {
  // "D93A30" -> 16-bit 565
  long v = strtol(hex, nullptr, 16);
  uint8_t r = (v >> 16) & 0xFF, g = (v >> 8) & 0xFF, b = v & 0xFF;
  return display->color565(r, g, b);
}

// ---- Port Authority PATH (Jersey City <-> NYC) ----
// Public JSON, no API key: https://www.panynj.gov/bin/portauthority/ridepath.json
class PathSource : public TransitSource {
public:
  const char* name() override { return "path"; }
  bool fetchRow(const char* station, const char* direction,
                Departure* out, int n) override {
    WiFiClientSecure client;
    client.setInsecure();
    HTTPClient http;
    http.setTimeout(10000);
    if (!http.begin(client, "https://www.panynj.gov/bin/portauthority/ridepath.json"))
      return false;
    if (http.GET() != 200) { http.end(); return false; }

    JsonDocument filter;
    filter["results"][0]["consideredStation"] = true;
    filter["results"][0]["destinations"][0]["label"] = true;
    filter["results"][0]["destinations"][0]["messages"][0]["target"] = true;
    filter["results"][0]["destinations"][0]["messages"][0]["arrivalTimeMessage"] = true;
    filter["results"][0]["destinations"][0]["messages"][0]["lineColor"] = true;

    JsonDocument doc;
    DeserializationError err =
        deserializeJson(doc, http.getStream(), DeserializationOption::Filter(filter));
    http.end();
    if (err) return false;

    for (JsonObject res : doc["results"].as<JsonArray>()) {
      if (strcmp(res["consideredStation"], station) != 0) continue;
      for (JsonObject dest : res["destinations"].as<JsonArray>()) {
        if (strcmp(dest["label"], direction) != 0) continue;
        int t = 0;
        for (JsonObject m : dest["messages"].as<JsonArray>()) {
          if (t >= n) break;
          strncpy(out[t].target, m["target"] | "?", 7);
          strncpy(out[t].eta, m["arrivalTimeMessage"] | "--", 9);
          out[t].color = hexColor(m["lineColor"] | "FFFFFF");
          t++;
        }
        for (; t < n; t++) { strcpy(out[t].eta, "--"); strcpy(out[t].target, ""); }
        return true;
      }
    }
    return false;
  }
};

TransitSource* transit = new PathSource();  // swap for another agency here

Departure board[8][3];  // up to 8 rows x 3 trains
int boardRows = 0;
bool haveData = false;

void fetchFeed() {
  boardRows = 0;
  bool ok = false;
  for (int i = 0; i < NUM_ROWS && i < 8; i++) {
    if (transit->fetchRow(ROWS[i].station, ROWS[i].direction, board[i], TRAINS_PER_ROW))
      ok = true;
    else
      for (int t = 0; t < 3; t++) strcpy(board[i][t].eta, "--");
    boardRows++;
  }
  if (ok) haveData = true;
}

void drawBoard() {
  display->clearScreen();
  display->setTextWrap(false);

  // header: current time (like the author's board showing 18:35)
  char tbuf[6];
  struct tm tm;
  if (getLocalTime(&tm)) {
    snprintf(tbuf, sizeof(tbuf), "%02d:%02d", tm.tm_hour, tm.tm_min);
  } else {
    strcpy(tbuf, "--:--");
  }
  display->setCursor(2, 1);
  display->setTextColor(display->color565(255, 200, 0));
  display->print(tbuf);
  display->setCursor(40, 1);
  display->setTextColor(display->color565(120, 120, 120));
  display->print("PATH");

  // 4 rows x 12px
  int y = 12;
  for (int i = 0; i < boardRows; i++) {
    display->setCursor(1, y);
    display->setTextColor(board[i][0].color);
    display->print(ROWS[i].station);
    display->setTextColor(display->color565(255, 255, 255));
    display->setCursor(24, y);
    char line[24];
    snprintf(line, sizeof(line), "%s %s", board[i][0].eta, board[i][1].eta);
    display->print(line);
    y += 13;
  }
  if (!haveData) {
    display->setCursor(4, 30);
    display->setTextColor(display->color565(255, 0, 0));
    display->print("loading...");
  }
  display->flipDMABuffer();
}

void setup() {
  Serial.begin(115200);

  HUB75_I2S_CFG::i2s_pins pins = {
    25, 26, 27,   // R1, G1, B1
    14, 12, 13,   // R2, G2, B2
    23, 19, 5,    // A, B, C
    17, 32,       // D, E (E needed for 64x64 1/32 scan)
    4, 15, 16     // LAT, OE, CLK
  };
  HUB75_I2S_CFG mxconfig(PANEL_WIDTH, PANEL_HEIGHT, PANEL_CHAIN, pins);
  display = new MatrixPanel_I2S_DMA(mxconfig);
  display->begin();
  display->setBrightness8(120);
  display->clearScreen();

  WiFi.begin(WIFI_SSID, WIFI_PASS);
  int tries = 0;
  while (WiFi.status() != WL_CONNECTED && tries++ < 40) delay(500);
  configTzTime("EST5EDT,M3.2.0,M11.1.0", "pool.ntp.org");  // US Eastern, DST-aware

  fetchFeed();
  drawBoard();
}

void loop() {
  static unsigned long last = 0;
  if (millis() - last > POLL_MS) {
    last = millis();
    if (WiFi.status() == WL_CONNECTED) fetchFeed();
    drawBoard();
  }
  delay(500);
}

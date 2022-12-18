#include <WiFiConnection.h>

#define WIFI_SSID "WIFI_SSID_HERE"
#define WIFI_PASSWORD "WIFI_PASSWORD_HERE"

WiFiConnection wiFiConnection = WiFiConnection(WIFI_SSID, WIFI_PASSWORD);

void setup() {
	Serial.begin(9600);
}

void loop() {
	if (!wiFiConnection.connected()) wiFiConnection.reconnect();
  
	wiFiConnection.printStatus();
	delay(50);
}

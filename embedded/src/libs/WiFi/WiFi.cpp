#include "WiFi.h"


WiFi::WiFi(char* ssid, char* password) {
	this->ssid = ssid;
	this->password = password;
}

void WiFi::connect() {
  WiFi.begin(this->ssid, this->password);
}

bool WiFi::connected() {
	return WiFi.status() == WL_CONNECTED;
}

IPAddress WiFi::getLocalIP() {
	return WiFi.localIP();
}

String WiFi::getMacAddress() {
	return WiFi.macAddress();
}

void WiFi::printStatus() {
	static unsigned long lmillis = millis();
	
	if ((millis() - lmillis) >= PRINT_STATUS_IN_MS) {
		Serial.println("=====================================");
		Serial.print("Status da conexão wi-fi: ");
		Serial.println(this->connected()? "CONECTADO" : "DESCONECTADO");
		Serial.println("=====================================");
		
		lmillis = millis();
	}
}
#include "WiFiConnection.h"


WiFiConnection::WiFiConnection(char* ssid, char* password) {
	this->ssid = ssid;
	this->password = password;
}

void WiFiConnection::connect() {
  WiFiConnection.begin(this->ssid, this->password);
}

bool WiFiConnection::connected() {
	return WiFiConnection.status() == WL_CONNECTED;
}

IPAddress WiFiConnection::getLocalIP() {
	return WiFiConnection.localIP();
}

String WiFiConnection::getMacAddress() {
	return WiFiConnection.macAddress();
}

void WiFiConnection::printStatus() {
	static unsigned long lmillis = millis();
	
	if ((millis() - lmillis) >= PRINT_STATUS_IN_MS) {
		Serial.println("=====================================");
		Serial.print("Status da conexão wi-fi: ");
		Serial.println(this->connected()? "CONECTADO" : "DESCONECTADO");
		Serial.println("=====================================");
		
		lmillis = millis();
	}
}
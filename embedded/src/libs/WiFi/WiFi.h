#ifndef WI_FI_H
#define WI_FI_H

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ConnectionManager.h>

#define PRINT_STATUS_IN_MS 2000


class WiFi : public ConnectionManager {

private:
  char* ssid;
  char* password;

protected:
  void connect();

public:
  WiFi(char*,char*);
  bool connected();
	String getMacAddress();
	IPAddress getLocalIP();
	void printStatus();

};


#endif
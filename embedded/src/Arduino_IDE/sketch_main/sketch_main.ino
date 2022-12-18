#include <PubSubClient.h>
#include <WiFiConnection.h>

#define WIFI_SSID "WIFI_SSID_HERE"
#define WIFI_PASSWORD "WIFI_PASSWORD_HERE"

#define MQTT_PORT MQTT_PORT_HERE
#define MQTT_HOST "MQTT_HOST_HERE"
#define MQTT_SECRET_HASH "MQTT_SECRET_HASH_HERE"

void connectionsStatus();
const char* getJSONToPublish();
void onMQTTMessageCallback(char*,byte*,unsigned int);

float tempConverted = -1;
float analogReadFromLM35 = -1;

WiFiClient wiFiClient;
PubSubClient mqttClient(wiFiClient);
WiFiConnection wiFiConnection = WiFiConnection(WIFI_SSID, WIFI_PASSWORD);

void setup() {
	Serial.begin(9600);
	randomSeed(analogRead(A0));

	mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCallback(onMQTTMessageCallback);
}

void loop() {

	if (!wiFiConnection.connected()) wiFiConnection.reconnect();
	else 
		if (!mqttClient.connected())
			mqttClient.connect("__MQTTClientId LM35-app" + random(300));
		else 
			mqttClient.publish(
				"/mqtt/engcomp/lm35/"MQTT_SECRET_HASH"/diffusion", 
				getJSONToPublish()
			);
  
	mqttClient.loop();
	wiFiConnection.printStatus();

	delay(50);
}

const char* getJSONToPublish() {
	return "{\"temp\":\"10\",\"analog\":\"10\"}";
}

void onMQTTMessageCallback(char* topic, byte* payload, unsigned int size) {
  Serial.println("MQTT Client received message at: ");
  Serial.print(topic);

  Serial.print(" / Message: ");
  for (int i = 0; i < size; i++) {
    Serial.print((char) payload[i]);
  }

  Serial.println();
}

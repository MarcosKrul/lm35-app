#include <PubSubClient.h>
#include <WiFiConnection.h>

#define ADC_RESOLUTION 10

#define PIN_LM35 A0

#define MQTT_PIN_LED_FEEDBACK 4
#define WIFI_PIN_LED_FEEDBACK 5

#define MQTT_PORT MQTT_PORT_HERE
#define MQTT_HOST "MQTT_HOST_HERE"
#define MQTT_SECRET_HASH "MQTT_SECRET_HASH_HERE"
#define MQTT_MAX_LM35_JSON_LENGTH 50

#define GET_CELSIUS_BY_RAW_VALUE(value) (value * 5.0 / (pow(2, ADC_RESOLUTION))-1) / 0.01

void publishLM35Json();
void onMQTTMessageCallback(char*,byte*,unsigned int);

float tempConverted = -1;
float analogReadFromLM35 = -1;

WiFiClient wiFiClient;
PubSubClient mqttClient(wiFiClient);
WiFiConnection wiFiConnection = WiFiConnection(WIFI_SSID, WIFI_PASSWORD);

void setup() {
	Serial.begin(9600);
	randomSeed(analogRead(A0));

  pinMode(PIN_LM35, INPUT);
  
	pinMode(WIFI_PIN_LED_FEEDBACK, OUTPUT);
	pinMode(MQTT_PIN_LED_FEEDBACK, OUTPUT);

	mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCallback(onMQTTMessageCallback);
}

void loop() {

  analogReadFromLM35 = analogRead(PIN_LM35);
	tempConverted = GET_CELSIUS_BY_RAW_VALUE(analogReadFromLM35);

	if (!wiFiConnection.connected()) wiFiConnection.reconnect();
	else 
		if (!mqttClient.connected())
			mqttClient.connect("__MQTTClientId LM35-app" + random(300));
		else publishLM35Json(); 
  
	mqttClient.loop();
	wiFiConnection.printStatus();

	digitalWrite(MQTT_PIN_LED_FEEDBACK, mqttClient.connected());
	digitalWrite(WIFI_PIN_LED_FEEDBACK, wiFiConnection.connected());

	delay(50);
}

void publishLM35Json() {
  char* buffer = (char*) malloc(MQTT_MAX_LM35_JSON_LENGTH * sizeof(char));

  sprintf(
    buffer,
    "{\"temp\":\"%.2f\",\"analog\":\"%.2f\"}",
    tempConverted,
    analogReadFromLM35
  );

	mqttClient.publish(
		"/mqtt/engcomp/lm35/"MQTT_SECRET_HASH"/diffusion", 
		buffer
	);

  free(buffer);
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

#include <PubSubClient.h>
#include <LiquidCrystal.h>
#include <WiFiConnection.h>

#define ADC_RESOLUTION 10

#define PIN_LM35 A0

#define MQTT_PIN_LED_FEEDBACK 4
#define WIFI_PIN_LED_FEEDBACK 5

#define MQTT_PORT MQTT_PORT_HERE
#define MQTT_HOST "MQTT_HOST_HERE"
#define MQTT_SECRET_HASH "MQTT_SECRET_HASH_HERE"
#define MQTT_MAX_LM35_JSON_LENGTH 50

#define LCD_RS 0
#define LCD_DB4 13
#define LCD_DB5 12
#define LCD_DB6 14
#define LCD_DB7 16
#define LCD_ENABLED 15
#define LCD_ROWS 2
#define LCD_COLUMNS 16

#define GET_CELSIUS_BY_RAW_VALUE(value) (value * 5.0 / (pow(2, ADC_RESOLUTION)-1)) / 0.01

void publishLM35Json();
byte length_char(const void*);
void onMQTTMessageCallback(char*,byte*,unsigned int);

float tempConverted = -1;
float analogReadFromLM35 = -1;
const char* title_temp = "Temp: ";
const char* title_analog = "Analog: ";

WiFiClient wiFiClient;
PubSubClient mqttClient(wiFiClient);
WiFiConnection wiFiConnection = WiFiConnection(WIFI_SSID, WIFI_PASSWORD);

LiquidCrystal lcd(
	LCD_RS,
	LCD_ENABLED,
	LCD_DB4,
	LCD_DB5,
	LCD_DB6,
	LCD_DB7
);

byte custom_degrees_char[8] = {
	0b00000110,
	0b00001001,
	0b00001001,
	0b00000110,
	0b00000000,
	0b00000000,
	0b00000000,
	0b00000000,
};

void setup() {
	Serial.begin(9600);
	randomSeed(analogRead(A0));

	lcd.begin(LCD_COLUMNS, LCD_ROWS);
	lcd.createChar(0, custom_degrees_char);

	lcd.setCursor(0, 0);
	lcd.print(title_temp);
	
	lcd.setCursor(0, 1);
	lcd.print(title_analog);

  pinMode(PIN_LM35, INPUT);
  
	pinMode(WIFI_PIN_LED_FEEDBACK, OUTPUT);
	pinMode(MQTT_PIN_LED_FEEDBACK, OUTPUT);

	mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCallback(onMQTTMessageCallback);
}

void loop() {

  analogReadFromLM35 = analogRead(PIN_LM35);
	tempConverted = GET_CELSIUS_BY_RAW_VALUE(analogReadFromLM35);

	lcd.setCursor(length_char(title_temp), 0);
	lcd.print(tempConverted, 1);
	lcd.write((byte) 0);
	lcd.print("C ");
	
	lcd.setCursor(length_char(title_analog), 1);
	lcd.print(analogReadFromLM35, 1);

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

byte length_char(const void* content) {
  String str = (const char*) content;
  return str.length();
}

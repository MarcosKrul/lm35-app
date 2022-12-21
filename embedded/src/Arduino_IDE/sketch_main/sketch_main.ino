#include <PubSubClient.h>
#include <LiquidCrystal.h>
#include <WiFiConnection.h>

#define VOLTAGE_REF 3.3

#define ADC_RESOLUTION 10

#define PIN_LM35 A0

#define MQTT_PIN_LED_FEEDBACK 4
#define WIFI_PIN_LED_FEEDBACK 5

#define MQTT_PORT MQTT_PORT_HERE
#define MQTT_HOST "MQTT_HOST_HERE"
#define MQTT_SECRET_HASH "MQTT_SECRET_HASH_HERE"
#define MQTT_MAX_LM35_JSON_LENGTH 80
#define MQTT_LED_BLINK_TIME_IN_MS 1000

#define MQTT_TOPIC_LM35_DATA "/mqtt/engcomp/lm35/"MQTT_SECRET_HASH"/diffusion"
#define MQTT_TOPIC_CONTROL_TOGGLE "/mqtt/engcomp/lm35/"MQTT_SECRET_HASH"/control/toggle"
#define MQTT_TOPIC_CONTROL_CHANGE_FREQUENCY "/mqtt/engcomp/lm35/"MQTT_SECRET_HASH"/control/frequency"

#define LCD_RS 0
#define LCD_DB4 13
#define LCD_DB5 12
#define LCD_DB6 14
#define LCD_DB7 16
#define LCD_ENABLED 15
#define LCD_ROWS 2
#define LCD_COLUMNS 16
#define LCD_DISPLAY_VALUES_IN_MS 1000
#define LCD_FIRST_FREE_COLUMN 3

#define GET_CELSIUS_BY_RAW_VALUE(value) (value * VOLTAGE_REF / (pow(2, ADC_RESOLUTION))) / 0.01

void publishLM35Json();
byte length_char(const void*);
void onMQTTMessageCallback(char*,byte*,unsigned int);

float tempConverted = -1;
int analogReadFromLM35 = -1;
byte publish_lm35_data = 1;
byte last_state_blink_mqtt_led = 1;
unsigned long last_millis_blink_mqtt_led = millis();
unsigned long last_displayed_from_lcd = millis();
unsigned long last_publish_lm35data = millis();
unsigned long time_to_publish = 1000;
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

byte custom_temp_char[4][8] = {
	{
		0b00001, 0b00011, 0b00011, 0b00111,
    0b01111, 0b01111, 0b01111, 0b11111
	},
	{
		0b10000, 0b11000, 0b11000, 0b11100,
    0b11110, 0b11110, 0b11110, 0b11111
	},
	{
		0b11111, 0b11111, 0b11100, 0b11100,
    0b11100, 0b11100, 0b11100, 0b11100
	},
	{
		0b11111, 0b11111, 0b11111, 0b10001,
    0b10001, 0b11111, 0b11111, 0b11111
	},
};

void setup() {
	Serial.begin(9600);
	randomSeed(analogRead(A0));

	lcd.begin(LCD_COLUMNS, LCD_ROWS);
	lcd.createChar(0, custom_degrees_char);
	lcd.createChar(1, custom_temp_char[0]);
	lcd.createChar(2, custom_temp_char[1]);
	lcd.createChar(3, custom_temp_char[2]);
	lcd.createChar(4, custom_temp_char[3]);

	lcd.setCursor(0, 0); lcd.write((byte) 1);
	lcd.setCursor(1, 0); lcd.write((byte) 2);
	lcd.setCursor(0, 1); lcd.write((byte) 3);
	lcd.setCursor(1, 1); lcd.write((byte) 4);

	lcd.setCursor(LCD_FIRST_FREE_COLUMN, 0);
	lcd.print(title_temp);
	
	lcd.setCursor(LCD_FIRST_FREE_COLUMN, 1);
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

	if (millis() > (last_displayed_from_lcd + LCD_DISPLAY_VALUES_IN_MS)) {
		lcd.setCursor(length_char(title_temp) + LCD_FIRST_FREE_COLUMN, 0);
		lcd.print(tempConverted, 1);
		lcd.write((byte) 0);
		lcd.print("C ");
		
		lcd.setCursor(length_char(title_analog) + LCD_FIRST_FREE_COLUMN, 1);
		lcd.print(analogReadFromLM35, 1);

		last_displayed_from_lcd = millis();
	}

	if (!wiFiConnection.connected()) wiFiConnection.reconnect();
	else 
		if (!mqttClient.connected()) {
			mqttClient.connect("__MQTTClientId LM35-app" + random(300));
			mqttClient.subscribe(MQTT_TOPIC_CONTROL_TOGGLE);
			mqttClient.subscribe(MQTT_TOPIC_CONTROL_CHANGE_FREQUENCY);
		}
		else if (publish_lm35_data && millis() > (last_publish_lm35data + time_to_publish)) {
			publishLM35Json();
			last_publish_lm35data = millis(); 
		}
  
	mqttClient.loop();
	//wiFiConnection.printStatus();

	if (!mqttClient.connected())
		digitalWrite(MQTT_PIN_LED_FEEDBACK, LOW);
	else if (publish_lm35_data) 
		digitalWrite(MQTT_PIN_LED_FEEDBACK, HIGH);
	else if (millis() > (last_millis_blink_mqtt_led + MQTT_LED_BLINK_TIME_IN_MS)) {
		digitalWrite(
		  MQTT_PIN_LED_FEEDBACK, 
		  last_state_blink_mqtt_led = !last_state_blink_mqtt_led
	  );
		last_millis_blink_mqtt_led = millis();
	}
		
	digitalWrite(WIFI_PIN_LED_FEEDBACK, wiFiConnection.connected());

	delay(50);
}

void publishLM35Json() {
  char* buffer = (char*) malloc(MQTT_MAX_LM35_JSON_LENGTH * sizeof(char));

  sprintf(
    buffer,
    "{\"temp\":\"%.2f\",\"milliVolts\":\"%.2f\",\"analog\":\"%d\"}",
    tempConverted,
		tempConverted * 10,
    analogReadFromLM35
  );

	mqttClient.publish(MQTT_TOPIC_LM35_DATA, buffer);

  free(buffer);
}

void onMQTTMessageCallback(char* topic, byte* payload, unsigned int size) {
  Serial.println("MQTT Client received message at: ");
  Serial.print(topic);

	if (strcmp(topic, MQTT_TOPIC_CONTROL_TOGGLE) == 0) {
		publish_lm35_data = !publish_lm35_data;
		return;
	}

	if (strcmp(topic, MQTT_TOPIC_CONTROL_CHANGE_FREQUENCY) == 0) {
		time_to_publish = atol((char*) payload);
		return;
	}

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

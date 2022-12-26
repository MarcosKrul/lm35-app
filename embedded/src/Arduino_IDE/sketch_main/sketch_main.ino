#include <PubSubClient.h>

#define VOLTAGE_REF 3.3

#define ADC_RESOLUTION 10

#define PIN_LM35 A0
#define MAX_LM35_JSON_LENGTH 80

#define GET_CELSIUS_BY_RAW_VALUE(value) (value * VOLTAGE_REF / (pow(2, ADC_RESOLUTION)-1)) / 0.01

void sendLM35Data();
void uart_receive();

float tempConverted = -1;
int analogReadFromLM35 = -1;
unsigned int seconds_to_wait_and_publish = 1;
unsigned long last_publish = millis();
const char* title_temp = "Temp: ";
const char* title_analog = "Analog: ";

void setup() {
	Serial.begin(115200);

  pinMode(PIN_LM35, INPUT);
}

void loop() {

  analogReadFromLM35 = map(analogRead(PIN_LM35), 14, 1024, 0, 1024);
	tempConverted = GET_CELSIUS_BY_RAW_VALUE(analogReadFromLM35);

	if (millis() > (seconds_to_wait_and_publish * 1000 + last_publish)) {
  	sendLM35Data();
		last_publish = millis();
	}

  uart_receive();

	delay(50);
}

void sendLM35Data() {
  char* buffer = (char*) malloc(MAX_LM35_JSON_LENGTH * sizeof(char));

  sprintf(
    buffer,
    "{\"temp\":\"%.2f\",\"milliVolts\":\"%.2f\",\"analog\":\"%d\"}",
    tempConverted,
		tempConverted * 10,
    analogReadFromLM35
  );

	Serial.println(buffer);

  free(buffer);
}

void uart_receive() {
  if (Serial.available())
    seconds_to_wait_and_publish = Serial.read() - '0';
}

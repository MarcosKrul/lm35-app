#include <PubSubClient.h>
#include <LiquidCrystal.h>

#define VOLTAGE_REF 3.3

#define ADC_RESOLUTION 10

#define PIN_LM35 A0
#define MAX_LM35_JSON_LENGTH 80

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

void sendLM35Data();
void uart_receive();
byte length_char(const void*);

float tempConverted = -1;
int analogReadFromLM35 = -1;
unsigned long last_displayed_from_lcd = millis();
unsigned int seconds_to_wait_and_publish = 1;
unsigned long last_publish = millis();
const char* title_temp = "Temp: ";
const char* title_analog = "Analog: ";

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
	Serial.begin(115200);

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

byte length_char(const void* content) {
  String str = (const char*) content;
  return str.length();
}

void uart_receive()
{
  if (Serial.available())
    seconds_to_wait_and_publish = Serial.read() - '0';
}

import serial
from os import getenv
from dotenv import load_dotenv
import random
from paho.mqtt import client as mqtt_client

PORT = "COM8"

def exec():
  try:
    ser = serial.Serial(PORT, 115200)
  except:
    print(f"Error open communication at {PORT}")

  try:
    def on_connect(client, userdata, flags, rc):
      print(
        "MQTT Connected" if rc == 0 
        else f"MQTT Failed to connect {rc}"
      )

    def on_message(client, userdata, msg):
      if msg.topic == MQTT_TOPIC_CONTROL_TOGGLE:
        global publish
        publish = not publish
      elif msg.topic == MQTT_TOPIC_CONTROL_CHANGE_FREQUENCY:
        ser.write(msg.payload.decode().encode())

    client = mqtt_client.Client(f'engcomp/lm35app-{random.randint(0, 1000)}')
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(
      getenv("MQTT_HOST"), 
      int(getenv("MQTT_PORT"))
    )

    client.subscribe(MQTT_TOPIC_CONTROL_TOGGLE)
    client.subscribe(MQTT_TOPIC_CONTROL_CHANGE_FREQUENCY)
    
    client.loop_start()
  except:
    print(f'Error at MQTT client handling')
  
  while True:
    message = ser.readline().decode().rstrip('\n')
    if len(message) != 0 and publish:
      client.publish(MQTT_TOPIC_LM35_DATA, message)

if __name__ == '__main__':
  load_dotenv()
  publish = True
  
  MQTT_TOPIC_LM35_DATA = f"/mqtt/engcomp/lm35/{getenv('MQTT_SECRET_HASH')}/diffusion"
  MQTT_TOPIC_CONTROL_TOGGLE = f"/mqtt/engcomp/lm35/{getenv('MQTT_SECRET_HASH')}/control/toggle"
  MQTT_TOPIC_CONTROL_CHANGE_FREQUENCY = f"/mqtt/engcomp/lm35/{getenv('MQTT_SECRET_HASH')}/control/frequency"
  
  exec()

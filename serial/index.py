import serial
from os import getenv
from dotenv import load_dotenv
import random
from paho.mqtt import client as mqtt_client

PORT = "COM8"

def exec():
  try:
    def on_connect(client, userdata, flags, rc):
      print(
        "MQTT Connected" if rc == 0 
        else f"MQTT Failed to connect {rc}"
      )

    client = mqtt_client.Client(f'engcomp/lm35app-{random.randint(0, 1000)}')
    client.on_connect = on_connect
    client.connect(
      getenv("MQTT_HOST"), 
      int(getenv("MQTT_PORT"))
    )
    client.loop_start()
  except:
    print(f'Error at MQTT client handling')
  
  try:
    with serial.Serial(PORT, 115200) as ser:
      while True:
        message = ser.readline().decode().rstrip('\n')
        if len(message) != 0:
          client.publish(MQTT_TOPIC_LM35_DATA, message)
  except:
    print(f"Error open communication at {PORT}")

if __name__ == '__main__':
  load_dotenv()
  
  MQTT_TOPIC_LM35_DATA = f"/mqtt/engcomp/lm35/{getenv('MQTT_SECRET_HASH')}/diffusion"
  MQTT_TOPIC_CONTROL_TOGGLE = f"/mqtt/engcomp/lm35/{getenv('MQTT_SECRET_HASH')}/control/toggle"
  MQTT_TOPIC_CONTROL_CHANGE_FREQUENCY = f"/mqtt/engcomp/lm35/{getenv('MQTT_SECRET_HASH')}/control/frequency"
  
  exec()

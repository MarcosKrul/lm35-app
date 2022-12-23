import serial

PORT="COM8"

def exec():
  try:
    with serial.Serial(PORT, 115200) as ser:
      while True:
        print(ser.readline().decode().rstrip('\n'))
  except:
    print(f"Error open communication at {PORT}")

if __name__ == '__main__':
  exec()

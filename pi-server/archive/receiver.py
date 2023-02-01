import serial

ser = serial.Serial('/dev/pts/2', 9600)

while True:
    message = ser.readline().decode()
    print("Received message: ", message)
ser.close()

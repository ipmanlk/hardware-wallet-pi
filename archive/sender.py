import serial

ser = serial.Serial("/dev/ttyUSB0", 9600)

while True:
    message = input("Enter message to send: ")
    ser.write(message.encode())
ser.close()

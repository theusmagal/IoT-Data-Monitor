import time
import dht
import urequests 
from machine import Pin


WIFI_SSID = "Wokwi-GUEST"  
WIFI_PASSWORD = ""  
BACKEND_URL = "http://20.82.137.24/api/data"  # my backend IP and end URL

class IoTProject:
    def __init__(self, wifi_ssid, wifi_password, backend_url):
        self.wifi_ssid = wifi_ssid
        self.wifi_password = wifi_password
        self.backend_url = backend_url
        self.sensor_1 = dht.DHT22(Pin(4))  # pin 4 for sensor1
        self.sensor_2 = dht.DHT22(Pin(5))  # pin5 for sensor 2

    def connect_to_wifi(self):
        import network
        wlan = network.WLAN(network.STA_IF)
        wlan.active(True)
        if not wlan.isconnected():
            print("Connecting to Wi-Fi...")
            wlan.connect(self.wifi_ssid, self.wifi_password)
            while not wlan.isconnected():
                pass

    def send_to_backend(self, data):
        try:
            headers = {"Content-Type": "application/json"}
            response = urequests.post(self.backend_url, json=data, headers=headers)
            if response.status_code == 200:
                print(data)
            else:
                print("Failed to send data. Response code:", response.status_code)
            response.close()
        except Exception as e:
            print("Error sending data:", e)

    def read_sensor(self, sensor, sensor_id):
        try:
            sensor.measure()  # Trigger a measurement
            temperature = float(sensor.temperature())  #read temperature in Celsius
            humidity = float(sensor.humidity())        # read humidity percentage
            return {"sensor_id": sensor_id, "temperature": temperature, "humidity": humidity}
        except Exception as e:
            print(f"Error reading sensor {sensor_id}:", e)
            return None

    def main_loop(self):
        self.connect_to_wifi()  #making sure wifi is conected before sending any data.
        print("Starting data collection...\n")

        while True:
            # read and send data for sensor 1
            data_1 = self.read_sensor(self.sensor_1, "1")
            if data_1:
                self.send_to_backend(data_1)

            #ead and send data for sensor 2
            data_2 = self.read_sensor(self.sensor_2, "2")
            if data_2:
                self.send_to_backend(data_2)

            time.sleep(0.5)  


#run the project
iot_project = IoTProject(
    wifi_ssid=WIFI_SSID,        
    wifi_password=WIFI_PASSWORD, 
    backend_url=BACKEND_URL      #Backend URL from configuration
)
iot_project.main_loop()

# IoT-Data-Monitor
An IoT project for real-time monitoring of environmental data. Includes MicroPython code for sensor data, Node.js backend for InfluxDB storage, and an HTML dashboard for visualization. Demonstrates integration of IoT devices, cloud storage, and web technologies.

# IoT Project: Temperature and Humidity - Sensor Data 

This project collects data from DHT22 sensors and displays it on a webpage. 
The data is processed by a Node.js backend and visualized using Nginx.

# Files and Folders

- iot-backend/: Node.js backend for handling API requests and sending data to InfluxDB.

- nginx-iot-vps.conf: Nginx configuration for routing API requests and serving the HTML page.

- index.html: HTML page for visualizing sensor data.

- iot-device.py: MicroPython code for collecting data from DHT22 sensors (2sensors).

- prototype.png: Screenshot of the Wokwi prototype.

- README.txt: Documentation about the project.

## How to Run
1. Deploy the backend (`iot-backend/index.js`) on your VPS.
2. Set up your Nginx using "nginx-iot-vps.conf".
3. Use "index.html" to display the data.

## Done by Matheus Bueno Magalhães

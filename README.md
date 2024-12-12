# IoT Project Workflow: MicroPython, Nginx, Node.js, and InfluxDB

### **GitHub and Youtube**:
   - https://www.youtube.com/watch?v=UNJCaLH9HKo
   - https://github.com/theusmagal/IoT-Data-Monitor
   - wokwi link: https://wokwi.com/projects/415646006068066305

## **1. MicroPython and IoT Device**
This project collects data from DHT22 sensors and displays it on a webpage. 
The data is processed by a Node.js backend and visualized using Nginx.

# Files and Folders

- iot-backend/: Node.js backend for handling API requests and sending data to InfluxDB.

- nginx-iot-vps.conf: Nginx configuration for routing API requests and serving the HTML page.

- index.html: HTML page for visualizing sensor data.

- iot-device.py: MicroPython code for collecting data from DHT22 sensors (2sensors).

- prototype.png: Screenshot of the Wokwi prototype.

- README.txt: Documentation about the project.

### **Steps**:
1. **Prototype Creation**:
   - Developed a prototype using Raspberry Pi Pico W and DHT22 sensors.
   - Simulated the setup using Wokwi to test functionaity.

2. **Key Features**:
   - **Wi-Fi Connection**:
     Ensures the IoT device connects to the internet before sending data.
   - **HTTP POST Requests**:
     Sends JSON data to the backend at `http://20.82.137.24/api/data`.

3. **Code File**:
   - **`iot-device.py`**: Contains the logic for Wi-Fi setup, sensor readings, and HTTP POST requests.

---

## **2. Setting Up Virtual Machine**
To host the backend and database, I created two server in the virttual machineon Azure.

### **Virtual Machine**:
1. **Main Server (iot-vps)**:
   - Hosts Nginx, Node.js, and PM2 for backend services.
2. **InfluxDB Server (iot-vps-influx)**:
   - Dedicated to storing time-series data using InfluxDB.

---

## **3. SSH Configuration for Tunneling**
An SSH tunnel was set up to securely connect the main server to the InfluxDB server.

### **Steps**:
1. **SSH Config File**:
   - Added the following configurations to make the tunnel (short cut for connecting):

       ```plaintext
       Host iot-vps
       HostName IP_address
       User <yourusername>
       IdentityFile your_key_file_location
       ```

       ```plaintext
       Host iot-vps-influx
       HostName IP_address
       User <username>
       IdentityFile your_key_file_location
       LocalForward 8086 localhost:8086' 
       ```
2. **Accessed InfluxDB**:
   - Connected to the database using `localhost:8086` in the browser.

---

## **4. Installing Software on the Server**
The main server was set up with the necessary software for backend and frontend operations.

### **Installed Software**:
1. **Nginx**: To serve the HTML webpage and act as a reverse proxy (moving forward the data to node.js - like a filter).
2. **Node.js**: For backend API handling.
3. **PM2**: To keep the Node.js server running.
4. **InfluxDB**: To store sensor dta (install here it but to conect it you need to access the other server -> iot-vps-influx)

---

## **5. Nginx Configuration**
Nginx was configured to serve static files and forward API requests to the backend.

### **Steps**:
1. **Main Configuration File**:
   - Updated `/etc/nginx/nginx.conf` to include virtual host configurations:
     `include /etc/nginx/sites-enabled/*;`

2. **Virtual Host Configuration**:
   - Created `/etc/nginx/sites-available/iot-vps` with the following settings:
     - **API Requests**:
       ```plaintext
       location /api/ {
           proxy_pass http://localhost:3000/api/;
       }
       ```

     - **HTML Dashboard**:
        ```plaintext
        location / {
           root /var/www/html;
           index index.html;
       }
       ```
3. **Enabled Configuration**:
   - Disabled the default configuration and enabled the custom configuration:
     in gitbash:
     `sudo unlink /etc/nginx/sites-enabled/default`
     `sudo ln -s /etc/nginx/sites-available/iot-vps /etc/nginx/sites-enabled/`

4. **Restarted Nginx**:
   - Restarted the Nginx service to apply the changes.

---

## **6. Node.js Backend**
Node.js was configured to handle API requests and interact with InfluxDB.

### **Steps**:
1. **Backend Folder**:
   - Created a folder named `iot-backend` to store backend files.
2. **Backend Code**:
   - **index.js**:
     - **POST `/api/data`**:
       Receives data from the IoT device and writes it to InfluxDB.
     - **GET `/api/sensor-data`**:
       Retrieves data from InfluxDB for the frontend.
3. **PM2 Configuration**:
   - Used PM2 to run the backend continuously, in gitbash:

     ```plaintext
     pm2 start index.js --name iot-backend
     pm2 save
     pm2 startup
     ```

---

## **7. InfluxDB Setup**
InfluxDB was configured to store sensor data.

### **Steps**:
1. **Bucket Creation**:
   - I created a bucket named **`Temperature Collecting`**.
2. **Authentication**:
   - Generated a token for secure access (remember to save it always).
3. **Integration with Node.js**:
   - Configured the backend to connect to InfluxDB using the token and bucket.

---

## **8. HTML Dashboard**
The frontend dashboard visualizes the sensor data in real time.

### **Steps**:
1. **HTML File**:
   - Located at `/var/www/html/index.html`.
2. **JavaScript**:
   - Fetches data from `/api/sensor-data` every 10 seconds.
   - Dynamically updates two tables, one for each sensor.
3. **CSS Styling**:
   - Making it nice and clean for the users.

---

## **9. End-to-End Data Flow**
1. **IoT Device**:
   - Sends data to `/api/data` via POST requests.
2. **Nginx**: Show the location for html static file and it sends forward the data to Node.js 
3. **Node.js Backend**:
   - Using POST request it receives data from Iot Device and writes it to InfluxDB. 
     Then it retrieves data for the frontend (using GET request).
4. **HTML Dashboard**:
   - Fetches data using GET requests and updates the webpage.

---

## **10. Resume**
This project integrates MicroPython, Nginx, Node.js, InfluxDB, and HTML to create a complete IoT solution. 
It shows real-time data collection, processing, storage, and visualization.

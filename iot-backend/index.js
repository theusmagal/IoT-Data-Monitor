
const express = require('express');
const bodyParser = require('body-parser');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const app = express();
app.use(bodyParser.json());

// InfluxDB configuration
require('dotenv').config();
const INFLUX_URL = 'http://localhost:8086'; // send correct ip always
const INFLUX_TOKEN = process.env.INFLUX_TOKEN;
const INFLUX_ORG = 'LAB';
const INFLUX_BUCKET = 'Temperature Collecting';

const influxDB = new InfluxDB({ url: INFLUX_URL, token: INFLUX_TOKEN });
const writeApi = influxDB.getWriteApi(INFLUX_ORG, INFLUX_BUCKET);
const queryApi = influxDB.getQueryApi(INFLUX_ORG);

writeApi.useDefaultTags({ location: 'iot-vps' });

// API endpoint to receive data
app.post('/api/data', (req, res) => {
    const { sensor_id, temperature, humidity } = req.body;
    if (!sensor_id || temperature === undefined || humidity === undefined) {
        return res.status(400).send('Invalid data');
    }
    console.log(`Received data: sensor_id=${sensor_id}, temperature=${temperature}, humidity=${humidity}`);
    const point = new Point('sensor_data')
        .tag('sensor_id', sensor_id)
        .floatField('temperature', temperature)
        .floatField('humidity', humidity);

    writeApi.writePoint(point);
    writeApi.flush()
        .then(() => res.status(200).send('Data written successfully!'))
        .catch(err => res.status(500).send(`Failed to write data: ${err}`));
});

// API endpoint to fetch data
app.get('/api/sensor-data', async (req, res) => {
    const fluxQuery = `
        from(bucket: "${INFLUX_BUCKET}")
            |> range(start: -1h)
            |> filter(fn: (r) => r._measurement == "sensor_data")
            |> keep(columns: ["_time", "sensor_id", "_field", "_value"])
    `;
    try {
        const rows = [];
        await queryApi.queryRows(fluxQuery, {
            next(row, tableMeta) {
                const data = tableMeta.toObject(row);
                rows.push(data);
            },
            error(error) {
                console.error('Error querying InfluxDB:', error);
                res.status(500).send('Error querying data');
            },
            complete() {
                res.json(rows);
            },
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal server error');
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});


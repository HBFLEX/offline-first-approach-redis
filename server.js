const bodyParser = require('body-parser');
const cors = require('cors');
const Redis = require('redis');
const express = require('express');

const dotenv = require('dotenv');

// register environment variables to app
dotenv.config();

const app = express();
const PORT = 5000;

// redis credentials
const REDIS_URL = process.env.REDIS_URL;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

// initialise the redis Client
const redisClient = Redis.createClient({
    password: REDIS_PASSWORD,
    socket: { host: REDIS_URL, port: REDIS_PORT }
});

redisClient.on('error', (err) => console.log('Error connecting to REDIS', err));
redisClient.on('connect', () => console.log('connected to REDIS CLOUD'));

(async () => {
    await redisClient.connect();
})();

// register middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// endpoint to process pending data from client after connection
app.post('/sync', async (req, res) => {
   const { data } = req.body;
   console.log('client data', data);
   // store data in redis(in a QUEUE)
    await redisClient.rPush("syncQueue", JSON.stringify(data));
    return res.status(200).json({ 'message': `Data Queued for syncing` });
});

// endpoint to process the sync Queue
app.get('/process-sync', async (req, res) => {
    try {
        const items = await redisClient.lRange('syncQueue', 0, -1);

        if (!items || items.length === 0) {
            return res.status(200).json({ message: 'Sync Queue is empty!' });
        }
        // we can process the synced data here either save to DB
        // or do something else on the data
        const SYNCED_DATA = items.map(item => JSON.parse(item));
        // after processing all data in the Queue, we now delete the Queue(data)
        // since it is not longer needed
        await redisClient.del('syncQueue');

        return res.status(200).json({ message: 'Sync Queue processed successfully!', syncedData: SYNCED_DATA });
    } catch (error) {
        console.error('Error processing syncQueue:', error);
        return res.status(500).json({ message: 'Error processing syncQueue' });
    }
});


app.listen(PORT, () => console.log('SERVER is listening on port:' + PORT));

require('dotenv').config();
const cron = require('node-cron');
const express = require('express');
const cors = require('cors');
const request = require('./utils/request');
const terminate = require('./utils/terminate');
const { checkState } = require('./app/controller');
const { updateState } = require('./app/updateState');

const app = express();
const port = process.env.PORT || 3001;
const updateInterval = process.env.UPDATE_INTERVAL || 300000; // default 5mins

const exitHandler = terminate(app, {
    coredump: false,
    timeout: 500
  })  

app.use(cors());
app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.get('/', (req, res)=> {
    res.send("Api Running")
});

app.listen(port, () => {
    console.log(`Node app listening on port ${port}`);
});

app.post('/check', (req, res, next) => request(checkState, req, res, next) );

const init = () => {
    updateState();
    // const task = cron.schedule(
    //     "* * * * *",
    //     async () => {
    //         if(process.env.DEBUG==='true') console.log("Running Worker..... ");
    //         try {
    //             updateState();
    //         } catch(err) {
    //             console.log(err)
    //         }
    //     },
    //     { scheduled: true }
    // );

    // task.start();
    setInterval(() => {
        if(process.env.DEBUG==='true') console.log("Running Worker..... ");
        try {
            updateState();
        } catch(err) {
            console.log(err)
        }
    }, updateInterval);
}

init();

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'))
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'))
process.on('SIGTERM', exitHandler(0, 'SIGTERM'))
process.on('SIGINT', exitHandler(0, 'SIGINT'))
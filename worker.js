const cron = require("node-cron");
const { updateState } = require('./app/updateState');

updateState();

const task = cron.schedule(
    "* * * * *",
    async () => {
        if(process.env.DEBUG==='true') console.log("Running Worker..... ");
        try {
            updateState();
        } catch(err) {
            console.log(err)
        }
    },
    { scheduled: true }
);

task.start();
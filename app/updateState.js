const moment = require('moment');
const Users = require('../database/tables/Users');
const UsagePlans = require('../database/tables/UsagePlans');
const InteractrStreamingMins = require('../database/tables/InteractrStreamingMins');

const usersState = {};

const getUsedMins = async (userId) => {
    try {
        const tbInteractrStreamingMins = new InteractrStreamingMins();
        const currentDate = moment().utc();
        const firstDayOfMonth = moment(currentDate).startOf('month').format('YYYY-MM-DD');
        const lastDayOfMonth = moment(currentDate).endOf('month').format('YYYY-MM-DD');
        
        const query = `SELECT SUM(count) AS used_mins
        FROM interactr_streaming_mins 
        WHERE date >= '${firstDayOfMonth}' AND date <= '${lastDayOfMonth}' AND user_id = ${userId}`;
        
        const data = await tbInteractrStreamingMins.query(query);
        if(data[0]?.used_mins) {
            return data[0]?.used_mins;
        }
        return 0;
    } catch(e) {
        console.error(e);
    }
}

const updateState = async () => {
    try {
        const tbUsers = new Users();
        const tbUsagePlans = new UsagePlans();
        
        const users = await tbUsers.getAll();
        if(users?.length > 0) {
            for(const user of users) {
                const planId = user.usage_plan_id;
                const plan = await tbUsagePlans.where('id', planId).first();
                if(plan) {
                    const usedMins = await getUsedMins(user.id);
                    if(usedMins < plan.streaming_mins) {
                        usersState[user.id] = true;
                    }
                }
            }
        }
    } catch(e) {
        console.error(e);
    }
}

module.exports = {
    usersState,
    updateState
}
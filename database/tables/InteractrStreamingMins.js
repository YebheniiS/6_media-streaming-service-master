const Database = require("../core/database");
const { connectAnalytics } = require("../core/mysqlHelper");
/**
 * Return the Watchers from our persistent
 * storage
 * @type {Watcher}
 */
module.exports = class Table extends Database {
  constructor() {
    super("interactr_streaming_mins", connectAnalytics);
  }
};

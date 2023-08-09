const Database = require("../core/database");
const { connectInteractr } = require("../core/mysqlHelper");
/**
 * Return the Watchers from our persistent
 * storage
 * @type {Watcher}
 */
module.exports = class Table extends Database {
  constructor() {
    super("usage_plans", connectInteractr);
  }
};

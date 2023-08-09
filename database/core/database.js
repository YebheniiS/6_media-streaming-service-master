require("dotenv").config();
const mysql = require("mysql2");
const {
  SELECT_STATEMENT,
  UPDATE_STATEMENT,
  INSERT_STATEMENT,
  CREATE_TABLE,
  GET_STATEMENT,
  DELETE_STATEMENT
} = require("./queryBuilder");
const reduce = require("lodash/reduce");

module.exports = class Database {
  constructor(table, connection) {
    this.table = table;
    this.connection = connection;
    this._where = {};    
    return this;
  }

  where(key, value) {
    this._where[key] = value;
    return this;
  }

  /**
   * Return the first result in the table based of a filter provided in a key value pair
   * @param table
   * @param filters
   * @returns {Promise<null|*>}
   */
  async first() {
    let queryString = SELECT_STATEMENT(this.table, this._where);

    queryString += " ORDER BY id DESC LIMIT 1 ";

    try {
      const result = await this.query(queryString);
      if (result) {
        return result[0];
      } else {
        return null;
      }
    } catch (err) {
      this.error(err, queryString);
    }
  }

  /**
   * Return the first result in the table based of a filter provided in a key value pair
   * @param table
   * @param filters
   * @returns {Promise<null|*>}
   */
  async last() {
    let queryString = "SELECT * FROM `" + this.table + "`";

    queryString += " ORDER BY created_at DESC LIMIT 1 ";

    try {
      const result = await this.query(queryString);
      if (result) {
        return result[0];
      } else {
        return null;
      }
    } catch (err) {
      this.error(err, queryString);
    }
  }

  async getSorted(filter = false) {
    let queryString = GET_STATEMENT(this.table);
    if (filter) queryString = SELECT_STATEMENT(this.table, this._where);

    queryString += " ORDER BY created_at DESC LIMIT 25 ";

    try {
      const result = await this.query(queryString);
      if (result) {
        return result;
      } else {
        return null;
      }
    } catch (err) {
      this.error(err, queryString);
    }
  }

  async get() {
    let queryString = SELECT_STATEMENT(this.table, this._where);
    try {
      return await this.query(queryString);
    } catch (err) {
      return this.error(err, queryString);
    }
  }

  async getAll() {
    let queryString = GET_STATEMENT(this.table);

    try {
      return await this.query(queryString);
    } catch (err) {
      return this.error(err, queryString);
    }
  }

  async delete(){
    let queryString = DELETE_STATEMENT(this.table, this._where);
    try {
      return await this.query(queryString);
    } catch (err) {
      return this.error(err, queryString);
    }
  }

  async update(id, values) {
    let queryString = UPDATE_STATEMENT(this.table, id, values);

    queryString += " WHERE id = " + id;

    try {
      return await this.query(queryString);
    } catch (err) {
      this.error(err, queryString);
    }
  }

  /**
   * Create a new record in a database
   * @param data
   * @returns {Promise<unknown>}
   */
  async create(data) {
    const queryString = INSERT_STATEMENT(this.table, data);

    try {
      const q = await this.query(queryString);
      // const eventName = "CREATE_" + this.table.toUpperCase() ;
      // console.log(eventName + "___CREATED");
      // global.emitter.emit(eventName, q.insertId);
      return q.insertId;
    } catch (err) {
      return this.error(err, queryString);
    }
  }

  closeConnection() {
    this.connection.end();
  }

  error(err, query) {
    console.error(this.table + " : " + query);
    console.error(err);
    return null;
  }

  async createTable(table, columns) {
    const queryString = CREATE_TABLE(table, columns);
    await this.query(queryString);
  }

  async getTables() {
    const tables = await this.query("SHOW TABLES");
    return reduce(
      tables,
      (result, value, key) => {
        result.push(Object.values(value)[0]);
        return result;
      },
      []
    );
  }

  query(q) {
    //console.log(q);
    return new Promise((resolve, reject) => {
      this.connection.query(q, (error, results) => {
        if (error) {
          return reject(error);
        }
        this._where = {};
        return resolve(results);
      });
    });
  }
};

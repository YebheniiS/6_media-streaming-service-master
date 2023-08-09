const forEach = require("lodash/forEach");

const SELECT_STATEMENT = (table, filters) => {
  let queryString = "SELECT * FROM `"+table+"` WHERE ";

  let i = 0;
  forEach(filters, (value, key)=>{
    if(i !== 0) {
      queryString += " AND "
    }
    i++;
    queryString += " `"+key+"` = ";

    if(value===true){
      queryString += value+" ";
    }else {
      queryString += " '"+value+"' ";
    }
  });
  return queryString;
};

const GET_STATEMENT = (table) => {
  let queryString = "SELECT * FROM `"+table+"`";
  return queryString;
};

const UPDATE_STATEMENT = (table, id, values) => {
  let queryString = "UPDATE "+table+" SET updated_at=NOW(), "

  let i = 0;
  forEach(values, (value, key) => {

    queryString += " `"+key+"` = '" + value + "'";

    if(i < Object.keys(values).length - 1){
      queryString += ", ";
    }
    i++;
  });

  return queryString;
};

const DELETE_STATEMENT = (table, filters) => {
  let queryString = "DELETE FROM `"+table+"` WHERE ";

  let i = 0;
  forEach(filters, (value, key)=>{
    if(i !== 0) {
      queryString += " AND "
    }
    i++;
    queryString += " `"+key+"` = ";

    if(value===true){
      queryString += value+" ";
    }else {
      queryString += " '"+value+"' ";
    }
  });
  return queryString;
};

const INSERT_STATEMENT = (table, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  let queryString = "INSERT INTO "+table+" (created_at, updated_at,"

  forEach(keys, (key, index) => {
    queryString += " `"+key+"`";

    if(index < keys.length - 1){
      queryString += ", ";
    }
  });

  queryString += ") VALUES (NOW(), NOW(),";

  forEach(values, (value, index)=>{
    queryString += " '"+value+"'"

    if(index < values.length - 1){
      queryString += ", ";
    }
  });

  queryString += ")";

  return queryString;
}

const CREATE_TABLE = (name, columns) => {
  let queryString = "CREATE TABLE " + name + " (id INT AUTO_INCREMENT PRIMARY KEY, created_at DATETIME, updated_at DATETIME";

  const colNames = Object.keys(columns);

  forEach(colNames, (colName) => {
    queryString += ", " + colName + " " + columns[colName] + " "
  })

  queryString += ");";

  return queryString;
}

module.exports = {
  SELECT_STATEMENT, UPDATE_STATEMENT,
  INSERT_STATEMENT, CREATE_TABLE, GET_STATEMENT,
  DELETE_STATEMENT
}

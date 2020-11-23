const { table } = require("../dbConfig");

exports.up = function(knex) {
    return knex.schema.createTable("Power", tbl => {
        tbl.increments('id').primary();
        tbl.boolean("Power");
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("Power")
  };
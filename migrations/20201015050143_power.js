exports.up = function(knex) {
    return knex.schema.createTable("Power", tbl => {
        tbl.boolean("Power");
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("Power")
  };
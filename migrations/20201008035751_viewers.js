exports.up = function(knex) {
    return knex.schema.createTable("Viewers", tbl => {
        tbl.string("UID");
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("Viewers")
  };
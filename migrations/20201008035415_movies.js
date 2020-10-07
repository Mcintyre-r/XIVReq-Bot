
exports.up = function(knex) {
  return knex.schema.createTable("Movies", tbl => {
      tbl.string("Title");
      tbl.string("Time");
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("Movies")
};

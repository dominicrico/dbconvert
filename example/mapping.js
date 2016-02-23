//jshint ignore: start

module.exports = [{
  table: "mysqlTable1:mongoTable1",
  rows: [{
    a: "rowMongo1",
    convertFn: function(entry) {
      return 'convertFn ' + entry;
    }
  }, {
    b: "rowMongo2",
    type: "string"
  }, {
    c: "rowMongo3",
    type: "string"
  }, {
    d: "rowMongo4",
    type: "integer"
  }, {
    e: "rowMongo5",
    type: "timestamp"
  }, {
    f: "rowMongo6",
    type: "array"
  }, {
    g: "rowMongo7",
    type: "json"
  }]
}]

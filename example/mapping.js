//jshint ignore: start

module.exports = [{
  table: 'table1:collection1',
  fields: [{
    a: 'rowMongo1',
    convertFn: function(entry) {
      return 'convertFn ' + entry;
    }
  }, {
    b: 'rowMongo2',
    type: 'string'
  }, {
    c: 'rowMongo3',
    type: 'string'
  }, {
    d: 'rowMongo4',
    type: 'integer'
  }, {
    e: 'rowMongo5',
    type: 'timestamp'
  }, {
    f: 'rowMongo6',
    type: 'array'
  }, {
    g: 'rowMongo7',
    type: 'json'
  }]
}, {
  table: 'table2:collection2',
  fields: [{
    parent: 'relate',
    type: 'objectId'
  }, {
    data: 'data',
    type: 'string'
  }]
}, {
  table: 'table3:collection3',
  fields: [{
    title: 'title',
    name: 'name',
    data: 'data'
  }],
  merge: [{
    fields: ['data'],
    if: ['title', 'name']
  }]
}];

/* register all workers */

var fs = require('fs');
var path = require('path');
var workers = fs.readdirSync(__dirname);

for (var worker in workers) {
  if (workers[worker] !== 'index.js' && workers[worker] !==
    'worker_template.js') {
    var name = path.basename(workers[worker], path.extname(workers[worker]));
    exports[name] = require('./' + workers[worker]);
  }
}

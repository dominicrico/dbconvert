'use strict';

var _ = require('lodash');

module.exports = function(entries, mapping, cb) {
  var dbConv = this;

  if (mapping.merge && mapping.merge.length > 0) {
    dbConv.log.verbose('Merging entries...');

    var mergeConfig = mapping.merge;

    mergeConfig.forEach(function(toMerge) {
      entries = _.mergeDuplicates(entries, toMerge);
      entries.forEach(function(entry) {
        entry.events = _.killDuplicates(entry.events);
      });
    });

    dbConv.log.verbose('Merging entries successfully done.');
  }

  return cb(null, entries);
};

_.mixin({
  mergeDuplicates: function(arr, merge) {
    var out = _.reduce(arr, function(p, c) {

      var res = {},
        key = '';
      merge.if.forEach(function(field) {
        key += '|' + c[field];
      });

      var rest = _.difference(_.keys(c), merge.fields);
      res = _.pick(c, rest);

      res[merge.name] = [];

      p[key] = p[key] || res;
      p[key][merge.name].push(_.pick(c, merge.fields));
      return p;
    }, {});

    return _.map(_.keys(out), function(el) {
      return out[el];
    });
  },
  killDuplicates: function(arr, crit) {
    var out = _.reduce(arr, function(p, c) {

      if (!crit) {
        crit = Object.keys(c);
      }

      var res = {},
        key = '';
      crit.forEach(function(field) {
        res[field] = c[field];
        key += '|' + c[field];
      });

      p[key] = p[key] || res;
      return p;
    }, {});
    return _.map(_.keys(out), function(el) {
      return out[el];
    });
  }
});

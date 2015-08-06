'use strict';

module.exports = {
  rules: {
    'no-privates': require('./lib/rules/no-privates')
  },
  rulesConfig: {
    'no-privates': 1
  }
};

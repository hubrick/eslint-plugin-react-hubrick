/**
 * @fileoverview Tests for 'no-privates' rule (underscore in the beginning of the object members)
 */
'use strict';

var rule = require('../../lib/rules/no-privates');
var RuleTester = require('eslint').RuleTester;
require('babel-eslint');

var ruleTester = new RuleTester();

ruleTester.run('no-privates', rule, {

  valid: [['',
      'var Foo = React.createClass({',
      '  someHelper: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ], ['',
      'class Foo extends React.Component {',
      '  static staticProperty = 1;',
      '  aProperty = 2;',
      '  static staticHelper() {',
      '    return \'Hello World\';',
      '  }',
      '}'
    ], ['',
      'class Foo {',
      '  static _staticProperty = 1;',
      '  _someHelper() {}',
      '}'
    ]
  ].map(function(code) {
        return {
          code: code.join('\n'),
          parser: 'babel-eslint',
          ecmaFeatures: {
            classes: true,
            jsx: true
          }
        };
      }),

  invalid: [['',
    'var Foo = React.createClass({',
    '  _someHelper: function() {',
    '    return <div>Hello {this.props.name}</div>;',
    '  }',
    '});'
  ], ['',
    'class Foo extends React.Component {',
    '  static _staticHelper() {',
    '    return \'Hello World\';',
    '  }',
    '}'
  ], ['',
    'class Foo extends React.Component {',
    '  constructor() {',
    '    this._aProperty = 1;',
    '  }',
    '}'
  ], ['',
    'class Foo extends React.Component {',
    '  static _staticProperty = 1;',
    '  aProperty = 2;',
    '}'
  ], ['',
    'class Foo extends React.Component {',
    '  _aProperty = 2;',
    '}'
  ]
  ].map(function(code) {
    return {
      code: code.join('\n'),
      parser: 'babel-eslint',
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [{
        message: 'Underscore notation to mark "private" members is not allowed'
      }]
    };
  })
});

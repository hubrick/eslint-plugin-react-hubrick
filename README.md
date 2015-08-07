# eslint-plugin-react-hubrick

A collection of custom `ESLint` rules that we use at Hubrick, targeted at react components.


## Configuration

Before you go ahead and add this plugin to `package.json`, do ensure that `ESLint` is configured to support JSX.

```json
{
  "ecmaFeatures": {
    "jsx": true
  }
}
```

Enable then the rules that you would like to use. So far, only one is available:
```json
{
  "rules": {
    "react-hubrick/no-privates": 2,
  }
}
```

## Rules

### no-privates

Prevents underscore notation in the beginning of a class member's name as a way
of marking it as being "private".

It doesn't take options.

The following patterns are accepted:
```js
// example without ES6 classes
var Foo = React.createClass({
  someHelper: function () {
    return true;
  },
  someProperty: 'bar',
  render: function () {
    return <div>Hello world</div>;
  }
});

// with ES6 classes
class Foo extends React.Component {
  static staticProperty = 1;
  static staticHelper () {
    return true;
  }
  aProperty = 2;
  render () {
    return <div>Hello world</div>;
  }
}
```

The following patterns are considered warnings:
```js
// example without ES6 classes
var Foo = React.createClass({
  _someHelper: function() {
    return 1;
  },
  render: function() {
    return <div>Hello world</div>;
  }
});

// a static method
class Foo extends React.Component {
  static _staticHelper() {
    return false;
  }
  render() {
    return <div>Hello world</div>;
  }
}

// more with properties
class Foo extends React.Component {
  static _staticProperty = 1; // nope
  _aProperty = 2; // nor this one
  render() {
    return <div>{this.aProperty}</div>;
  }
}

// assignments are also prevented
class Foo extends React.Component {
  constructor() {
    this._aProperty = 1;
  }
  render() {
    return <div>Hello world</div>;
  }
}
```

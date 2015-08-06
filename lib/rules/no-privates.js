/**
 * @fileoverview Prevent underscore notation for "private" members in React components (e.g. `_someHelper() {}`)
 */
'use strict';

var componentUtil = require('../util/component');
var ComponentList = componentUtil.List;

module.exports = function(context) {

  /**
   * @param {ASTNode} node The AST node that was found with illegal underscore
   */
  function reportIllegalUnderscore(node) {
    context.report(node,
        'Underscore notation to mark "private" members is not allowed',
        { identifier: getIdentifier(node) });
  }

  /**
   * @param {ASTNode} node The AST node
   * @returns {String} The identifier (name) of the node
   */
  function getIdentifier(node) {
    // babel-eslint doesn't expose property name
    if (node.type === 'ClassProperty') {
      var tokens = context.getFirstTokens(node, 2);
      return tokens[0].value !== 'static' && tokens[0].value || (tokens[1] && tokens[1].value);
    }
    //console.log('NODE\n',node);
    return node && (node.name || (node.key && node.key.name));
  }

  /**
   * @param {ASTNode} node The AST node being checked.
   * @returns {Boolean} Does node's name start with '_'?
   */
  function startsWithUnderscore(node) {
    var nodeName = getIdentifier(node);
    return Boolean(nodeName && nodeName.charAt(0) === '_');
  }

  return {

    ClassProperty: function(node) {
      //console.log('\nCLASS PROP: ', getIdentifier(node));

      if (startsWithUnderscore(node)/* && componentUtil.isReactComponent(context, node)*/) {
        reportIllegalUnderscore(node);
      }
    },

    MemberExpression: function(node) {
      //console.log('\nMember EXPR:', node.object.name || node); // node.property.name
      if (node.object.type === 'ThisExpression' && startsWithUnderscore(node.property)) {
        reportIllegalUnderscore(node.property);
      }
      //var component = componentList.getByName(node.object.name);
      //if (!component) {
      //  return;
      //}
      //markDisplayNameAsDeclared(component.node);
    },

    MethodDefinition: function(node) {
      //console.log('\nMETHOD DEF: ',getIdentifier(node));
      if (startsWithUnderscore(node)) {
        reportIllegalUnderscore(node);
      }
    },

    ObjectExpression: function(node) {
      //console.log('\nOBJ EXPR:',node.properties);
      //return;
      //if (componentUtil.isComponentDefinition(node)) {
        node.properties.forEach(function (property) {
          if (startsWithUnderscore(property.key)) {
            reportIllegalUnderscore(property);
          }
        });
      //}
    },

    //'Program:exit': function() {
    //  var list = componentList.getList();
    //  // Report missing display name for all classes
    //  for (var component in list) {
    //    if (!list.hasOwnProperty(component) || !mustBeValidated(list[component])) {
    //      continue;
    //    }
    //    context.report(component.node, ERROR_MESSAGE, { component: list[component].name });
    //
    //  }
    //},

    ReturnStatement: function(node) {
      if (!componentUtil.isReactComponent(context, node)) {
        return;
      }
      componentList.set(context, node, {
        isReactComponent: true
      });
    }
  };

};

module.exports.schema = [{
  type: 'object',
  properties: {},
  additionalProperties: false
}];

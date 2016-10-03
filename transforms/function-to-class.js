'use strict';

module.exports = function(file, api, options) {
  const j = api.jscodeshift;
  const ReactUtils = require('./utils/ReactUtils')(j);
  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  const stripType = param => {
    param.typeAnnotation = null;
    return param;
  }

  const makePropsDestructuring = param =>
    param &&
    param.type === 'ObjectPattern' &&
    j.variableDeclaration('const', [
      j.variableDeclarator(
        stripType(param),
        j.memberExpression(j.thisExpression(), j.identifier('props'))
      )
    ])

  const f = j(file.source);

  // JSX returning functions w/ 0 or 1 args, arg must be Identifier or ObjectPattern
  const jsxFuncs = f.find(j.FunctionDeclaration)
    .filter(p =>
      j(p).find(j.ReturnStatement, { argument: { type: 'JSXElement' } }).size()
    )
    .filter(p => p.value.params.length <= 1)
    .filter(p => {
      const [param] = p.value.params
      return !param || param.type === 'Identifier' || param.type === 'ObjectPattern';
    });

  jsxFuncs.replaceWith(p => {
    const [param] = p.value.params;
    const isDestruc = param && param.type === 'ObjectPattern';
    const hasType = param && param.typeAnnotation;

    // props.name -> this.props.name
    if (param && !isDestruc) {
      const propUsages = j(p.value.body.body)
        .find(j.MemberExpression, { object: { type: 'Identifier', name: param.name }})
        .replaceWith(p =>
          j.memberExpression(
            j.memberExpression(j.thisExpression(), j.identifier('props')),
            p.value.property
          )
        )
    }

    const makeMethod = (name, body) =>
      j.methodDefinition(
        'method', j.identifier('render'), j.functionExpression(
          null, [], j.blockStatement(body.filter(Boolean))
        )
      )

    const makePropsProperty = param =>
      param && param.typeAnnotation && j.classProperty(j.identifier('props'), null, param.typeAnnotation)

    const makeClassBody = body =>
      j.classBody(body.filter(Boolean))

    const superClass = j.memberExpression(
      j.identifier('React'), j.identifier('Component')
    )

    const makeClass = (name, param, body) =>
      j.classDeclaration(name, makeClassBody([
        makePropsProperty(param),
        makeMethod('render', [makePropsDestructuring(param), ...body]),
      ]), superClass)

    return makeClass(p.value.id, param, p.value.body.body)
  });

  // console.log(x.get())

  return f.toSource();
};

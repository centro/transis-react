const DEFAULT_OPTION = {
  quote: "single",
  flowObjectCommas: true,
  arrowParensAlways: true,
  arrayBracketSpacing: true,
  objectCurlySpacing: true,
  reuseWhitespace: true,
  tabWidth: 2
};

// https://astexplorer.net/#/gist/079ea950ec06ad87f31036ff6119b757/d33f58167f4cbcb362f68b827693fda72bf2d266

const replaceStateWithProps = (fileInfo, api, options) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  const stateMixinDec = root.find(j.VariableDeclaration).filter(
    path => path.node.declarations.map(d => d.id.name).includes('stateMixin')
  ).at(0).get().node

  // find the state variable names to look out for
  const mixinStateVarNames = stateMixinDec.declarations[0]
    .init.properties
    .find(p => p.key.name === "state")
    .value.properties.map(prop => prop.key.name)


  const classExpr = root.find(j.ClassExpression)

  // find all regular pattern of `this.state.{varName}`
  const regularUsage = classExpr.find(j.MemberExpression, {
    object: { object: j.ThisExpression, property: { name: "state" } }
  }).filter(stateVarPath => mixinStateVarNames.includes(stateVarPath.node.property.name));

  // replace this usage with props
  regularUsage
    .find(j.Identifier, { name: "state" })
    .replaceWith(j.identifier("props"));

  // find all destruct pattern of `const { varName } = this.state`

  const destructureUsage = classExpr.find(j.VariableDeclarator, {
    id: j.ObjectPattern,
    init: { object: j.ThisExpression, property: { name: "state" } }
  })

  destructureUsage.find(j.Identifier, { name: "state" })
    .replaceWith(j.identifier("props"))


  return root.toSource(DEFAULT_OPTION);
};

export default replaceStateWithProps;

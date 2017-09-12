const COMPONENT_SUPERCLASS = {
  object: { name: "React" },
  property: { name: "Component" }
};

const DEFAULT_OPTION = {
  quote: "single",
  flowObjectCommas: true,
  arrowParensAlways: true,
  arrayBracketSpacing: true,
  objectCurlySpacing: true,
  reuseWhitespace: true,
  tabWidth: 2
};

const transisReactTransform = (fileInfo, api, options) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  const stateMixinDec = root
    .find(j.VariableDeclaration)
    .filter(path =>
      path.node.declarations.map(d => d.id.name).includes("stateMixin")
    )
    .at(0);

  const compClass = root.find(j.ClassDeclaration, {
    superClass: COMPONENT_SUPERCLASS
  });

  const targetClass = compClass.at(0);

  if (targetClass.length) {
    compClass.replaceWith(
      j.expressionStatement(
        j.callExpression(
          j.identifier("transisReact"),
          [
            j.objectExpression(
              stateMixinDec.length
                ? [
                    ...stateMixinDec.get().node.declarations[0].init
                      .properties
                  ]
                : []
            ),
            j.classExpression(
              // NOTE: need to change classDeclaration to classExpression
              targetClass.get().node.id,
              targetClass.get().node.body,
              targetClass.get().node.superClass
            )
          ]
        )
      )
    );
  }


  return root.toSource(DEFAULT_OPTION);
};

export default transisReactTransform;

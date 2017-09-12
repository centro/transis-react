const MEMBER_EXPRESSION = 'MemberExpression'

const recreateObjectFromMemberExpr = memberExpr => {
  if (memberExpr.type !== MEMBER_EXPRESSION) {
    throw new Error(`not a memer expression, probalby isnt object ${JSON.stringify(memberExpr)}`)
  }
  const {object, property} = memberExpr
  return j.memberExpression(j.identifier(object.name), j.identifier(property.name))
}

const DEFAULT_OPTION = {
  quote: 'single',
  flowObjectCommas: true,
  arrowParensAlways: true,
  arrayBracketSpacing: true,
  objectCurlySpacing: true,
  reuseWhitespace: true,
  tabWidth: 2,
}

export const canFindStateMixin = (root, j) => {
  var comp = root.find(j.CallExpression, {
    callee: { object: { name: "React" }, property: { name: "createClass" } }
  })

  return comp.filter(path => {
    const reactParams = path.node.arguments[0].properties;
    const usesReactMixins = reactParams.some(prop => {
      const usesMixin = prop.key.name === "mixins";

      return (
        usesMixin &&
        prop.value.elements.map(mixin => {
          var { object, property } = mixin.callee;
          return (
            object.name === "Transis" &&
            ["ReactPropsMixin", "ReactStateMixin"].includes(property.name)
          )
        })
      )
    })
    return usesReactMixins;
  }).length
}

const mixinDataExtract = (fileInfo, api, options) => {
  const j = api.jscodeshift
  const root = j(fileInfo.source)

  if (!canFindStateMixin(root, j)) {
    return '' // TODO: NOTE: skips if cannot find react transis mixins
  }

  // State Mixins
  var stateMixinPath = root.find(j.CallExpression, {
    callee: {
      type: "MemberExpression",
      object: {
        name: "Transis"
      },
      property: {
        name: "ReactStateMixin"
      }
    }
  });

  if (stateMixinPath.length) {
    var [globalObject,
    stateObjectLiteral] = stateMixinPath.nodes()[0].arguments;

    root
      .find(j.Declaration)
      .at(0)
      .insertBefore(
        j(
          j.variableDeclaration("var", [
            j.variableDeclarator(
              j.identifier("stateMixin"),
              j.objectExpression([
                j.property("init", j.identifier("global"), globalObject),
                j.property("init", j.identifier("state"), stateObjectLiteral)
              ])
            )
          ])
        ).toSource(DEFAULT_OPTION)
      )
  }

  // Props Mixins
  var propsMixinPath = root.find(j.CallExpression, {
    callee: {
      type: "MemberExpression",
      object: {
        name: "Transis"
      },
      property: {
        name: "ReactPropsMixin"
      }
    }
  });
  if (propsMixinPath.length) {
    var propsObjectExpression = propsMixinPath.nodes()[0].arguments[0];

    root.find(j.Declaration).at(0).insertBefore(
      j(
        j.variableDeclaration("var", [
          j.variableDeclarator(
            j.identifier('propsMixin'),
            j.objectExpression([
              j.property('init', j.identifier('props'), propsObjectExpression)
            ])
          )
        ])
      ).toSource(DEFAULT_OPTION)
    )
  }

  // clean up
  let mixinKeyExpression = root.find(j.Property, {
    key: {
      name: "mixins"
    }
  })
  mixinKeyExpression.remove()

  return root.toSource(DEFAULT_OPTION);
}

export default mixinDataExtract
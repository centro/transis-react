const findStateMixin = (root, j) => {
  var comp = root.find(j.CallExpression, {
    callee: { object: { name: "React" }, property: { name: "createClass" } }
  });

  const usedMixins = {
    StateMixin: false,
    PropsMixin: false,
  }

  const foundComponents = comp.filter(path => {
    const reactParams = path.node.arguments[0].properties;
    const usesReactMixins = reactParams.some(prop => {
      const usesMixin = prop.key.name === "mixins";

      return (
        usesMixin &&
        prop.value.elements.map(mixin => {
          if (!(mixin.type === 'CallExpression' && mixin.callee.type === 'MemberExpression')) { return false }

          var { object, property } = mixin.callee;
          if ('ReactPropsMixin' === property.name ) {
            usedMixins.PropsMixin = true;
          }
          if ('ReactStateMixin' === property.name) {
            usedMixins.StateMixin = true;
          }
          return object.name === 'Transis' && ['ReactPropsMixin', 'ReactStateMixin'].includes(property.name)
        }).some(v => v)
      );
    });
    return usesReactMixins;
  });

  return {
    usedMixins,
    foundComponents
  }
};

const PROPS_MIXIN_SIGNATURE = { object: { name: 'Transis' }, property: { name: 'ReactPropsMixin'}}
const STATE_MIXIN_SIGNATURE = { object: { name: 'Transis' }, property: { name: 'ReactStateMixin'}}

export default (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source)

  const { foundComponents, usedMixins } = findStateMixin(root, j)

  const mixinString = Object.keys(usedMixins).filter(key => usedMixins[key]).join(', ')
  if (!foundComponents.length) { return '' }
  else {
    root.find(j.Declaration).at(0).get().insertBefore(
      `import { ${mixinString} } from 'transis-react';`
    )

    foundComponents.map(p => {
      const mixin = j(p).find(j.Property, { key: { name: 'mixins' }})
      mixin.find(j.MemberExpression, STATE_MIXIN_SIGNATURE)
        .replaceWith(j.identifier('StateMixin'))

      mixin.find(j.MemberExpression, PROPS_MIXIN_SIGNATURE)
        .replaceWith(j.identifier('PropsMixin'))
    })
  }

  return root.toSource();
}

// module.exports = legacy_mixin;
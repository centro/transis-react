const findStateMixin = (root, j) => {
  var comp = root.find(j.CallExpression, {
    callee: { object: { name: "React" }, property: { name: "createClass" } }
  });

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
          );
        })
      );
    });
    return usesReactMixins;
  });
};

const PROPS_MIXIN_SIGNATURE = { object: { name: 'Transis' }, property: { name: 'ReactPropsMixin'}}
const STATE_MIXIN_SIGNATURE = { object: { name: 'Transis' }, property: { name: 'ReactStateMixin'}}

export default (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source)

  const foundComponents = findStateMixin(root, j)
  console.warn('foundComponents', foundComponents.length)
  if (foundComponents.length) {
    root.find(j.Declaration).at(0).get().insertBefore(
      "import { StateMixin, PropsMixin } from 'transis-react';"
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
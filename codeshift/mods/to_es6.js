/*

# Original
jscodeshift -t ~/code/react-codemod/transforms/class.js ./codeshift/sample.js -d -p

# This
jscodeshift -t codeshift/to_es6.js codeshift/sample.js -d -p


# Plan
## Metadata
{
  StateMixins: [{globalVar, mixinInfo}, ...others],
  PropsMixins: [mixinInfo, ...others]
}

1. Extract Metadata into an object on the top of the page, delete the references in code
  -[ ] look for `Transis.ReactStateMixin`, saves to StateMixins
  -[ ] look for `Transis.ReactPropsMixin`, saves to PropsMixins

2. Run classTransform

3. Convert metadata on the top of the page to Recreate the component with transisReact


4. Replace State with Props

5. Delete the metadata

*/
import mixinDataExtract, { canFindStateMixin } from "../submods/mixinDataExtract";
import transisReactTransform from '../submods/transisReactTransform';
import replaceStateWithProps from "../submods/replaceStateWithProps";
var jscodeshift = require("jscodeshift");
var fs = require("fs");
var path = require("path");
// var assert = require("assert");

/* LOCAL DEPS */
var classTransform = require(path.resolve(__dirname, "../node_modules/react-codemod/transforms/class"));

const CREATE_COMPONENT_EXPRESSION = {
  callee: { object: { name: "React" }, property: { name: "createClass" } }
}

export default function to_es6(fileInfo, api) {
  // console.warn(1, fileInfo);
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  let result = root.toSource();

  // Step 1. Extract Metadata
  if (!canFindStateMixin(root, j)) {
    return ""; // TODO: NOTE: skip if no mixin found
  }

  result = mixinDataExtract(
    { source: result },
    { jscodeshift },
    {}
  );

  // Step 2. Class Transform
  result = classTransform(
    { source: result },
    { jscodeshift },
    {}
  ); // fileInfo // api // options`

  // Step 3. Metadata to transisReactMixin
  // TODO: NOTE: failed at this point, no need to continue
  if (!result) return "";
  result = transisReactTransform(
    { source: result },
    { jscodeshift },
    {}
  );

  // Step 4: Substitute `@state.varName` with `@props.varName` if mixed in.
  result = replaceStateWithProps(
    { source: result },
    { jscodeshift },
    {}
  );

  // Step 5: remove var declaration
  const step5Root = j(result)
	let stateMixinDec = step5Root
    .find(j.VariableDeclaration)
    .filter(path =>
      path.node.declarations.map(d => d.id.name).includes("stateMixin")
    )
    .remove();

  let propsMixinDec = step5Root
    .find(j.VariableDeclaration)
    .filter(path =>
      path.node.declarations.map(d => d.id.name).includes("propsMixin")
    )
    .remove();
  result = step5Root.toSource()

  return result;
};

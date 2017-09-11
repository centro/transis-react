// jscodeshift -t codeshift/to_es6.js codeshift/sample.js -d -p
export default (fileInfo, api) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  const callExpressions = root.find(j.CallExpression, {
    callee: {
      type: "MemberExpression",
      object: { type: "Identifier", name: "console" }
    }
  });

  callExpressions.remove(); // remove the console

  return root.toSource();
};

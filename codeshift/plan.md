# with working insert statement
https://astexplorer.net/#/gist/5f513661d07213de13b7043c9115cef6/160236d53430814e9cbb9da795060d12c0e1ae81


```js
let MEMBER_EXPRESSION = 'MemberExpression'

const recreateObjectFromMemberExpr = memberExpr => {
  if (memberExpr.type !== MEMBER_EXPRESSION) {
    throw new Error(`not a memer expression, probalby isnt object ${JSON.stringify(memberExpr)}`)
  }
  const { object, property } = memberExpr
  return j.memberExpression(
    j.identifier(object.name),
    j.identifier(property.name)
  )
}

export default function(fileInfo, api) {
const j = api.jscodeshift
  const root = j(fileInfo.source)

  var stateMixinPath = root.find(j.CallExpression, {
    callee: {
      type: "MemberExpression",
      object: { name: "Transis" },
      property: { name: "ReactStateMixin" }
    }
  });
	var [globalObject, stateObjectLiteral] = stateMixinPath.nodes()[0].arguments;

  debugger

  root.find(j.Program).replaceWith(path => j.program([

	j.variableDeclaration(
      'const',
[	j.variableDeclarator(
      j.identifier('var1'),
      j.callExpression(
        j.identifier('require'),
        [j.literal('file1')]
      )
    )]
      )
    ,
    ...path.node.body]))

  stateMixinPath.replaceWith(path => j.variableDeclarator(
      j.identifier('var1'),
      j.callExpression(
        j.identifier('require'),
        [j.literal('file1')]
      )
    ))

  var propsMixinPath = root.find(j.CallExpression, {
    callee: {
      type: "MemberExpression",
      object: { name: "Transis" },
      property: { name: "ReactStateMixin" }
    }
  });

  // clean up
  let mixinKeyExpression = root
      .find(j.Property, { key: { name: "mixins" } })
   // mixinKeyExpression.remove()

  return root.toSource()
};
```

https://astexplorer.net/#/gist/5f513661d07213de13b7043c9115cef6/aafada6472f7d61957bee741a964a04115f882b8

```js
export default function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  const stateMixinDec = root.find(j.VariableDeclaration).filter(
    path => path.node.declarations.map(d => d.id.name).includes('stateMixin')
  ).at(0).get().node

  debugger

const COMPONENT_SUPERCLASS = {
    object: { name: 'React' },
    property: { name: 'Component' }
  }
  const compClass = root.find(j.ClassDeclaration, {
    superClass: COMPONENT_SUPERCLASS
  })

const targetClass =   compClass.at(0).get().node
  compClass
    .replaceWith(
    j.expressionStatement(
		j.callExpression(
        	j.identifier('transisAware'),
        	[
			  j.objectExpression([
                j.property(
                  'init',
                   j.identifier('stateMixin'),
                   j.objectExpression([
                    ...stateMixinDec.declarations[0].init.properties
                  ])
                )
              ])
              ,
              j.classExpression( // NOTE: need to change classDeclaration to classExpression
                targetClass.id,
                targetClass.body,
                targetClass.superClass
            	)
            ]
      	)
    )
  )

  //
  // root.find(j.Declaration).at(0)
    // .insertBefore(j(stateMixinDec.node.declarations[0].init).toSource())



  return root.toSource();
}
```
import ts from 'typescript'

ts.isAsyncKeyword = node => node?.kind === ts.SyntaxKind.AsyncKeyword

function find(ast, cb) {
  function _find(node) {
    const r = cb(node)
    if (r) {
      return r
    }

    // for (const child of node.getChildren()) {
    //   const r = _find(child)
    //   if (r) {
    //     return r
    //   }
    // }
    return ts.forEachChild(node, _find)
  }

  return _find(ast)
}

export function getV(ast, key) {
  const valueNode = find(ast, (node) => {
    if (ts.isPropertyAssignment(node) && node.name.escapedText === key) {
      return node.getChildAt(2)
    }
  })
  return valueNode
}

export function getVText(ast, key) {
  const valueNode = getV(ast, key)
  if (ts.isStringLiteral(valueNode)) {
    return valueNode.text
  } else {
    return valueNode?.getText?.()
  }
}

export function funcIsAsync(ast) {
  if (ts.isArrowFunction(ast)) {
    if (ast.modifiers) {
      return !!ast.modifiers.find(it => ts.isAsyncKeyword(it))
    } else {
      return false
    }
  }

  throw new Error('unknown function type')
}
export function findTokenHasUsed(ast, name) {
  return !!find(ast, (node) => {
    if (ts.isIdentifier(node) && node.escapedText === name) {
      return true
    }
  })
}

export const getParamByGeneric = () => undefined
export const getParamByParameter = () => undefined

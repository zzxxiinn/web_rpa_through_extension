export const getDomListByXpath = (xpath) => {
  const nodes = []
  try {
    const list = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null)
    let res = list.iterateNext()
    while (res) {
      nodes.push(res)
      res = list.iterateNext()
    }
  } catch (e) {
    console.error(e)
  }
  return nodes
}
export const clickByXpath = (xpath, isSingle = true) => {
  const nodes = getDomListByXpath(xpath)
  if (nodes.length === 0) {
    return
  }
  function clickNode (node) {
    node.click()
  }
  if (isSingle) {
    clickNode(nodes[0])
  } else {
    for (const node of nodes) {
      clickNode(node)
    }
  }
}

function clickNode (node) {
  node.click()
}
export const getDomListBySelector = (selector) => {
  const nodes = document.querySelectorAll(selector)
  console.log(nodes)
  return nodes
}
export const clickBySelector = (selector, isSingle = true) => {
  const nodes = getDomListBySelector(selector)
  if (nodes.length === 0) {
    return
  }
  if (isSingle) {
    clickNode(nodes[0])
  } else {
    for (const node of nodes) {
      clickNode(node)
    }
  }
}

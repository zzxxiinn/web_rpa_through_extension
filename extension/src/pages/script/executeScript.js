
function init () {
  console.log('execute')
  const query = window.executeParams
  // eslint-disable-next-line no-unused-vars
  const { tabId, code, directive } = query
  console.log(code)
  // eslint-disable-next-line no-eval
  eval.call(window, code)
}
init()

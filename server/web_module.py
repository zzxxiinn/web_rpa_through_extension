import json


async def ws_swap_msg(ws, msg):
    await ws.send(json.dumps(msg))
    result = await ws.recv()
    return result


async def browser_open(ws, url):
    return await ws_swap_msg(ws, {"directive": "browser.open", "data": {"url": url}})


async def browser_close(ws, url, tab_id):
    return await ws_swap_msg(ws, {"directive": "browser.close", "data": {"url": url, "tabId": tab_id}})


async def browser_close_all(ws):
    return await ws_swap_msg(ws, {"directive": "browser.closeAll"})


async def browser_reload(ws, tab_id):
    return await ws_swap_msg(ws, {"directive": "browser.reload", "data": {"tabId": tab_id}})


async def browser_go_forward(ws, tab_id):
    return await ws_swap_msg(ws, {"directive": "browser.goForward", "data": {"tabId": tab_id}})


async def browser_go_back(ws, tab_id):
    return await ws_swap_msg(ws, {"directive": "browser.goBack", "data": {"tabId": tab_id}})


async def browser_negative(ws, tab_id, url):
    return await ws_swap_msg(ws, {
        "directive": "browser.negative",
        "data": {
            "tabId": tab_id,
            "url": url
        }
    })


async def browser_get_tab(ws, url):
    return await ws_swap_msg(ws, {
        "directive": "browser_getTab",
        "data": {
            "url": url
        }
    })


async def browser_get_tabs(ws):
    return await ws_swap_msg(ws, {"directive": "browser_getTabs"})


async def element_set_input(ws, tab_id, xpath='', selector='', value=''):
    return await ws_swap_msg(ws, {
        "directive": "element.setInput",
        "data": {
            "tabId": tab_id,
            "xpath": xpath,
            "selector": selector,
            "value": value
        }
    })


async def element_click(ws, tab_id, xpath='', selector=''):
    return await ws_swap_msg(ws, {
        "directive": "element.click",
        "data": {
            "tabId": tab_id,
            "xpath": xpath,
            "selector": selector
        }
    })


async def select(ws):
    return await ws_swap_msg(ws, {"directive": "select"})


async def cancel_select(ws):
    return await ws_swap_msg(ws, {"directive": "cancelSelect"})


async def scroll(ws, url, scroll_x=float('Infinity')):
    return await ws_swap_msg(ws, {
        "directive": "scroll",
        "data": {
            "url": url,
            "scrollX": scroll_x
        }
    })

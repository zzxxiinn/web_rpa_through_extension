import json
import time

SUCC = 'SUCCESS'
FAIL = 'FAILED'


async def ws_swap_msg(ws, msg):
    await ws.send(json.dumps(msg))
    result = await ws.recv()
    try:
        result = json.loads(result).get('res', {})
        return SUCC, result
    except Exception as e:
        result['err'] = e
        return FAIL, result


# ============ browser ==============
async def browser_open(ws, url, timeout=10):
    status, open_result = await ws_swap_msg(ws, {"directive": "browser.open", "data": {"url": url}})
    if status != SUCC:
        return status, open_result
    tab_id = open_result['tabId']
    timer = 0.5
    while timer < timeout:
        time.sleep(0.5)
        status, result = await browser_is_loaded(ws, tab_id=tab_id)
        if result.get('isLoadCompleted', False):
            # page loaded!
            return SUCC, open_result
        timer += 0.5
    return FAIL, {'msg': 'page load timeout'}


async def browser_close(ws, tab_id):
    return await ws_swap_msg(ws, {"directive": "browser.close", "data": {"tabId": tab_id}})


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
        "directive": "browser.getTab",
        "data": {
            "url": url
        }
    })


async def browser_get_tabs(ws):
    return await ws_swap_msg(ws, {"directive": "browser.getTabs"})


async def browser_is_loaded(ws, tab_id):
    return await ws_swap_msg(ws, {
        "directive": "browser.isLoadCompleted",
        "data": {"tabId": tab_id}
    })


# ============ element ==============

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


async def element_select_by_index(ws, tab_id, xpath='', selector='', index=0):
    return await ws_swap_msg(ws, {
        "directive": "element.selectByIndex",
        "data": {
            "tabId": tab_id,
            "xpath": xpath,
            "selector": selector,
            "index": index
        }
    })


async def element_select(ws, tab_id, xpath='', selector='', items=''):
    return await ws_swap_msg(ws, {
        "directive": "element.select",
        "data": {
            "tabId": tab_id,
            "xpath": xpath,
            "selector": selector,
            "items": items
        }
    })


async def element_get_select_options(ws, tab_id, xpath='', selector=''):
    return await ws_swap_msg(ws, {
        "directive": "element.getSelectOptions",
        "data": {
            "tabId": tab_id,
            "xpath": xpath,
            "selector": selector,
        }
    })


async def element_get_bounding_box(ws, tab_id, xpath='', selector=''):
    return await ws_swap_msg(ws, {
        "directive": "element.getBoundingBox",
        "data": {
            "tabId": tab_id,
            "xpath": xpath,
            "selector": selector,
        }
    })


async def element_get_text(ws, tab_id, xpath='', selector=''):
    return await ws_swap_msg(ws, {
        "directive": "element.getText",
        "data": {
            "tabId": tab_id,
            "xpath": xpath,
            "selector": selector,
        }
    })


async def element_get_html(ws, tab_id, xpath='', selector=''):
    return await ws_swap_msg(ws, {
        "directive": "element.getHtml",
        "data": {
            "tabId": tab_id,
            "xpath": xpath,
            "selector": selector,
        }
    })


# async def select(ws):
#     return await ws_swap_msg(ws, {"directive": "select"})
#
#
# async def cancel_select(ws):
#     return await ws_swap_msg(ws, {"directive": "cancelSelect"})


async def scroll(ws, url, scroll_x=float('Infinity')):
    return await ws_swap_msg(ws, {
        "directive": "scroll",
        "data": {
            "url": url,
            "scrollX": scroll_x
        }
    })

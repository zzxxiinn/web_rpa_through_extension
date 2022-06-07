import time
from asyncio import Queue

import sanic
from sanic import Sanic, Request

from server.utils.get_browser_path import open_browser
from web_module import (
    browser_open,
    browser_close,
    browser_close_all,
    browser_reload,
    browser_negative,
    browser_go_back,
    browser_go_forward,
    browser_get_tab,
    browser_get_tabs,
    browser_is_loaded,
    element_click,
    element_set_input,
    scroll, element_get_bounding_box
)

task_map = {
    'browser_open': browser_open,
    'browser_close': browser_close,
    'browser_close_all': browser_close_all,
    'browser_reload': browser_reload,
    'browser_negative': browser_negative,
    'browser_go_back': browser_go_back,
    'browser_go_forward': browser_go_forward,
    'browser_get_tab': browser_get_tab,
    'browser_get_tabs': browser_get_tabs,
    'element_click': element_click,
    'element_set_input': element_set_input,
    'browser_is_loaded': browser_is_loaded,
    'element_get_bounding_box': element_get_bounding_box,
    # 'select': select,
    # 'cancel_select': cancel_select,
    'scroll': scroll
}

SUCC = 'SUCCESS'
FAIL = 'FAILED'

app = Sanic("MyHelloWorldApp")


@app.listener('after_server_start')
def create_task_queue(_app, loop):
    _app.ctx.task_queue = Queue(loop=loop, maxsize=10)
    _app.ctx.task_result_queue = Queue(loop=loop, maxsize=10)


async def run_task(data):
    task_queue = app.ctx.task_queue
    task_result_queue = app.ctx.task_result_queue

    task_queue.put_nowait(data)
    status, result = await task_result_queue.get()
    return status, result


@app.websocket("/action")
async def feed(request: Request, ws):
    while True:
        task_result_queue = request.app.ctx.task_result_queue
        try:
            task_data = await request.app.ctx.task_queue.get()
            data = task_data.get('data', {})
            task_result = await task_map[task_data['directive']](ws, **data)
            task_result_queue.put_nowait(task_result)
        except Exception as e:
            print(e)
            raise e
            # todo put failed result back to queue


@app.get("/")
async def hello_world(request):
    test_url = "https://www.baidu.com/"
    open_browser()
    status, task_result = await run_task({"directive": "browser_open", "data": {"url": test_url}})
    if status == SUCC:
        # data: dict = task_result['res']
        # data = {'url': test_url, 'xpath': '//*[@id="hotsearch-content-wrapper"]/li[1]/a'}
        await run_task({"directive": "element_click", "data": {
            "tab_id": task_result['res']['tabId'],
            "selector": "#kw",
        }})

        await run_task({"directive": "element_set_input", "data": {
            "tab_id": task_result['res']['tabId'],
            "selector": "#kw",
            "value": "raid0"
        }})

        await run_task({"directive": "element_click", "data": {
            "tab_id": task_result['res']['tabId'],
            "selector": "#su",
        }})

    return sanic.json(task_result)


# 1. 打开美能华登录页
# 2. 输入邮箱和密码
# 3. 点击登录
@app.get("/login_metis")
async def hello_world(request):
    test_url = "https://www.meinenghua.com/user/login?redirect=https%3A%2F%2Fmetis.meinenghua.com"
    open_browser()
    status, task_result = await run_task({"directive": "browser_open", "data": {"url": test_url}})
    if status == SUCC:
        current_tab = task_result.get('tabId')

        status, task_result = await run_task({"directive": "element_get_bounding_box", "data": {
            "tab_id": current_tab,
            "selector": "#email",
        }})

        status, task_result = await run_task({"directive": "element_set_input", "data": {
            "tab_id": current_tab,
            "selector": "#email",
            "value": "xin.zhang@meinenghua.com"
        }})

        time.sleep(1)
        status, task_result = await run_task({"directive": "element_set_input", "data": {
            "tab_id": current_tab,
            "selector": "#password",
            "value": "123456"
        }})

        time.sleep(1)
        status, task_result = await run_task({"directive": "element_click", "data": {
            "tab_id": current_tab,
            "selector": "#userLayout > div > div.main > div.main > form > div:nth-child(4) > div > div > span > button"
        }})

    return sanic.json(task_result)


# 关闭所有tab
@app.get('/close_all')
async def browser_close_all(request):
    status, task_result = await run_task({"directive": 'browser_close_all'})
    return sanic.json({
        "status": status,
        "result": task_result
    })


@app.get("/baidu")
async def open_and_close_tab(request):
    test_url = "https://www.baidu.com/"
    print('step 1: open page')
    open_browser()
    status, task_result = await run_task({"directive": "browser_open", "data": {"url": test_url}})
    if status == SUCC:
        current_tab = task_result.get('tabId')
        await run_task({"directive": "element_set_input", "data": {
            "tab_id": current_tab,
            "selector": "#kw",
            "value": "高考"
        }})

        time.sleep(1)
        await run_task({"directive": "element_click", "data": {
            "tab_id": current_tab,
            "selector": "#su",
        }})

        time.sleep(1)
        await run_task({"directive": "element_click", "data": {
            "tab_id": current_tab,
            "xpath": '//*[@id="1"]/div/div[1]/h3/a[1]',
        }})
        time.sleep(1)
        status, task_result = await run_task({"directive": "browser_close", "data": {
            'tab_id': current_tab
        }})

    return sanic.json(task_result)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3058)

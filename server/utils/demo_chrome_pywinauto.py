# -*- coding: UTF-8 -*-
import logging
import os
import time

import psutil
from pywinauto.application import Application

logger = logging.getLogger(__name__)


class ChromeAuto:
    def __init__(self, process=None):
        self.app = None
        self._start(process=process)

    def _start(self, process=None):
        if process:
            self.app = Application(backend='uia').connect(process=process)
        else:
            logger.debug(f'IeAuto _start err')
            return

    def quit(self):
        if self.app:
            self.app.kill()
            self.app = None

    def get_url(self):
        try:
            # print(self.app.top_window()) # pywinauto.application.WindowSpecification
            # print(self.app.window()) # pywinauto.application.WindowSpecification
            # print(self.app.windows()) # [] 不能再往下进行查找操作了

            for i in self.app.windows():  # 下面的流程比较耗时，进程号不对的没有self.app.windows()不会走下面的逻辑，优化速度
                edit_ctrl = self.app.top_window().child_window(title='地址和搜索栏', control_type='Edit')
                print(edit_ctrl.texts) # 控件信息：>
                # print(edit_ctrl.get_value())

                edit_ctrl.double_click_input()  # 地址栏显示的不是全链接，缺少'https://'https://，或者 'https://www,还有http的等等，双击后显示全链接
                time.sleep(0.5)
                edit_ctrl.double_click_input()  # 地址栏显示的不是全链接，缺少'https://'https://，或者 'https://www,还有http的等等，双击后显示全链接
                time.sleep(0.5)

                url = edit_ctrl.get_value()  # uia_controls.py中有各种类型的控件类，可查看各自的方法属性
                if url:
                    return url
        except:
            logger.info(f'ChromeAuto get_url err')


def get_pid(pname):
    pid_lis = []
    for proc in psutil.process_iter():
        # print(“pid-%d,name:%s” % (proc.pid,proc.name()))
        if proc.name() == pname:
            pid_lis.append(proc.pid)
            # return proc.pid
    return pid_lis


pid_list = get_pid('chrome.exe')
for idx, pid in enumerate(pid_list):
    print(idx, '-->', pid)
    chrome = ChromeAuto(pid)
    link = chrome.get_url()
    if link:
        chrome.quit()
        os.system(f"taskkill /t /f /im chrome.exe")
        print(link)
        break

else:
    logger.info(f'url get none')

# -*- coding: UTF-8 -*-
import time
import winreg

from pywinauto.application import Application

not_installed = '未安装'


# 取得浏览器的安装路径
def get_path(mainkey, subkey):
    try:
        key = winreg.OpenKey(mainkey, subkey)
    except FileNotFoundError:
        return not_installed
    value, type_int = winreg.QueryValueEx(key, "")  # 获取默认值
    full_file_name = value.split(',')[0]  # 截去逗号后面的部分
    # [dir_name, app_name] = os.path.split(full_file_name)  # 分离文件名和路径
    return full_file_name


browser_exec_path = get_path(winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\Clients\StartMenuInternet\Google Chrome\DefaultIcon")
print(browser_exec_path)

app = Application()
app.start(cmd_line=browser_exec_path)

time.sleep(3)
# chrome_window = app.Chrome_WidgetWin_1
# chrome_window.set_focus()
# chrome_window.maximize()

print(1)

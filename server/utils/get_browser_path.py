import os
import winreg

import psutil

# print("IE : " + get_path(winreg.HKEY_LOCAL_MACHINE, ico_ie))
# print("火狐 : " + get_path(winreg.HKEY_LOCAL_MACHINE, ico_firefox))
# google_path = get_path(winreg.HKEY_LOCAL_MACHINE, ico_google)
# print("谷歌 : " + google_path)
# print("360极速: " + get_path(winreg.HKEY_LOCAL_MACHINE, ico_360js))
# print("Python : " + get_path(winreg.HKEY_CURRENT_USER, install_python))

# ico_ie = r"SOFTWARE\Clients\StartMenuInternet\IEXPLORE.EXE\DefaultIcon"
# ico_firefox = r"SOFTWARE\Clients\StartMenuInternet\FIREFOX.EXE\DefaultIcon"
# ico_360js = r"SOFTWARE\Clients\StartMenuInternet\360Chrome\DefaultIcon"
# install_python = r"Software\Python\PythonCore\3.7\InstallPath"
# ico_google = r"SOFTWARE\Clients\StartMenuInternet\Google Chrome\DefaultIcon"

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


def open_app(app_dir):
    os.startfile(app_dir)


def open_browser(browser_type='chrome'):
    browser_map = {
        "chrome": r"SOFTWARE\Clients\StartMenuInternet\Google Chrome\DefaultIcon"
    }
    browser_exec_path = get_path(winreg.HKEY_LOCAL_MACHINE, browser_map[browser_type])
    browser_app_name = os.path.split(browser_exec_path)[1]

    if browser_exec_path == not_installed:
        raise Exception(browser_type + 'not installed!')

    if browser_app_name in (p.name() for p in psutil.process_iter()):
        print(browser_app_name, 'is running.')
    else:
        print('No such process: ', browser_app_name, ', will open')
        open_app(browser_exec_path)


if __name__ == '__main__':
    open_browser()

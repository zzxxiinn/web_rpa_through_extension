import os

import psutil


class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


def proc_exist(process_name):
    pl = psutil.pids()
    for pid in pl:
        if psutil.Process(pid).name() == process_name:
            try:
                os.kill(pid, 0)
            except Exception as e:
                print(f'kill -0 {pid} FAILED, maybe dead process', e)
                return None
            else:
                return pid
    return None

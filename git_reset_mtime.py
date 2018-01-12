# -*- coding: utf-8 -*-

import subprocess
import os

if __name__ != '__main__':
    raise ImportError("%s should not be used as a module." % __name__)

magic_cmd: str = 'git ls-files -z | xargs -0 -n1 -I{} -- git log -1 --format="%ct {}" {} | sort'

work_dir = os.getcwd()

result = subprocess.run(magic_cmd, stdout=subprocess.PIPE, shell=True)

timestamp_file_list = [tuple(it.split(' ', 1)) for it in result.stdout.decode('utf-8').split('\n')][:-1]

for timestamp, file_path in timestamp_file_list:
    os.utime(os.path.join(work_dir, file_path), (int(timestamp), int(timestamp)))

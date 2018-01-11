#!usr/bin/env python3

import os
from subprocess import call

if __name__ == '__main__':
    root_dir = 'themes/next-reloaded/source/lib'

    for dir_path, dir_names, files in os.walk(root_dir):
        if '.git' in dir_names:
            call(['git', '--git-dir', os.path.join(dir_path, '.git'), 'pull'])

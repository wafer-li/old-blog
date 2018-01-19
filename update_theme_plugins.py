#!usr/bin/env python3

import os
import shlex
from subprocess import call

from typing import List

if __name__ == '__main__':
    theme_root = os.path.abspath('themes/next-reloaded')
    theme_lib_root = os.path.abspath('themes/next-reloaded/source/lib')
    git_dirs: List[str] = []

    for dir_path, dir_names, files in os.walk(theme_lib_root):
        if '.git' in dir_names:
            git_dirs.append(dir_path)

    if len(git_dirs) == 0:
        os.chdir(theme_root)
        call(shlex.split('git clone https://github.com/theme-next/theme-next-canvas-nest source/lib/canvas-nest'))
        call(shlex.split('git clone https://github.com/theme-next/theme-next-fancybox3 source/lib/fancybox'))
        call(shlex.split('git clone https://github.com/theme-next/theme-next-reading-progress source/lib/reading_progress'))
        call(shlex.split('git clone https://github.com/theme-next/theme-next-pangu.git source/lib/pangu'))
    else:
        for git_dir in git_dirs:
            os.chdir(git_dir)
            print(os.path.basename(git_dir))
            call(['git', 'pull'])
            print()

#!usr/bin/env python3

import os
from subprocess import call

from typing import List

if __name__ == '__main__':
    root_dir = os.path.abspath('themes/next-reloaded/source/lib')
    git_dirs: List[str] = []

    for dir_path, dir_names, files in os.walk(root_dir):
        if '.git' in dir_names:
            git_dirs.append(dir_path)

    for git_dir in git_dirs:
        os.chdir(git_dir)
        print(os.path.basename(git_dir))
        call(['git', 'pull'])
        print()

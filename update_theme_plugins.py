#!usr/bin/env python3

import os
import shlex
from subprocess import call

from typing import List
from typing import Dict

dependencies_calls: Dict[str, str] = {
    'reading_progress': 'git clone https://github.com/theme-next/theme-next-reading-progress ' +
                        'source/lib/reading_progress',
    'bookmark': 'git clone https://github.com/theme-next/theme-next-bookmark.git source/lib/bookmark'
}

if __name__ == '__main__':
    theme_root = os.path.abspath('themes/next-reloaded')
    theme_lib_root = os.path.abspath('themes/next-reloaded/source/lib')
    git_dirs: List[str] = []

    for dir_path, dir_names, files in os.walk(theme_lib_root):
        if '.git' in dir_names:
            git_dirs.append(dir_path)

    base_git_dirs = [os.path.basename(os.path.normpath(it)) for it in git_dirs]
    install_git_dirs = set(dependencies_calls.keys()) - set(base_git_dirs)

    for it in install_git_dirs:
        os.chdir(theme_root)
        call(shlex.split(dependencies_calls[it]))

    for git_dir in git_dirs:
        os.chdir(git_dir)
        print(os.path.basename(git_dir))
        call(['git', 'pull'])
        print()

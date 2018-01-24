#!usr/bin/env python3

'''
Automatically install and update theme plugins
Which is git submodules.
'''

import os
import shlex
from subprocess import call

DEPENDENCIES = {
    'reading_progress': 'git clone https://github.com/theme-next/theme-next-reading-progress ' +
                        'source/lib/reading_progress',
    'bookmark': 'git clone https://github.com/theme-next/theme-next-bookmark.git ' +
                'source/lib/bookmark'
}

if __name__ == '__main__':
    THEME_ROOT = os.path.abspath('themes/next-reloaded')
    THEME_LIB_ROOT = os.path.abspath('themes/next-reloaded/source/lib')
    GIT_DIRS = []

    for dir_path, dir_names, files in os.walk(THEME_LIB_ROOT):
        if '.git' in dir_names:
            GIT_DIRS.append(dir_path)

    BASE_GIT_DIRS = [os.path.basename(os.path.normpath(it)) for it in GIT_DIRS]
    INSTALL_GIT_DIRS = set(DEPENDENCIES.keys()) - set(BASE_GIT_DIRS)

    for it in INSTALL_GIT_DIRS:
        os.chdir(THEME_ROOT)
        call(shlex.split(DEPENDENCIES[it]))

    for git_dir in GIT_DIRS:
        os.chdir(git_dir)
        print(os.path.basename(git_dir))
        call(['git', 'pull'])
        print()

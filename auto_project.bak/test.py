import shutil
import os
pwd = os.path.dirname(os.path.abspath(__file__))
_li = shutil.copytree(pwd, '/opt/app')
print _li
print pwd


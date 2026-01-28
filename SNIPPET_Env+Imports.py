import sys, os

#### STATIC DEFINITIONS for VENV ####
retry = 0
virtual_dir = ".venv"
requirements_path = ".\\py\\requirements.txt"
### STATIC DEFINITIONS for VENV ####

# attempt importation of stuff if it fails we do a pip install of the requirements.txt from %requirements_path%
def tryImportStuff():
    global retry
    try:
        ########### add imports to test here here ###########
        import PyQt6
        import PyQt6.QtWidgets
        
        ########### optional ###########
        # # optional remove them after the check in reverse order preferably if not all things are used in specifically this script alone
        # del PyQt6.QtWidgets
        # del PyQt6
        ########### end ###########
    #on import exception then we do the magic :D
    except ImportError:
        import subprocess
        
        #activate venv for shell
        venv_activate      = ".\\"+virtual_dir+"\\Scripts\\activate"
        subprocess.call(venv_activate, shell=True)
        
        # upgrade pip
        venv_upgrade_pip   = "python -m pip install --upgrade pip"
        subprocess.call(venv_upgrade_pip, shell=True)
        
        #install requirements
        venv_install_reqs  = "pip install --no-input -r " + requirements_path
        subprocess.call(venv_install_reqs, shell=True)
        
        #if retry is greater then 3 we force quit
        if retry > 3: print("UNABLE TO IMPORT!?"); exit()
        retry += 1
        
        #repeat
        tryImportStuff()
        #then check if subprocess still exists
        if subprocess: # if it does
            del subprocess # yeet it

#check if we are in an venv if not we make and enter one. this keeps the main python install clean
if not (sys.prefix != (getattr(sys, "base_prefix", None) or getattr(sys, "real_prefix", None) or sys.prefix)):
    print("FORCING VIRTUAL ENVIROMENT")
    from venv import EnvBuilder
    
    #check if path exists
    if not os.path.exists(virtual_dir):
        #build venv
        virtual = EnvBuilder(with_pip=True)
        virtual.create(env_dir="./" + virtual_dir)
    #remove EnvBuilder import
    del EnvBuilder #bye bye, we don't need you anymore!
    
    #script location
    activator = "./" + virtual_dir + "/Scripts/activate_this.py"
    local_activator = "./py/activate_this.py"
    
    #import shutil here before we use it
    import shutil, filecmp
    
    #if we do not have a copy of the script locally we make one
    if not os.path.exists(local_activator):
        import gzip, base64
        with open(local_activator, "w") as text_file:
        # this script is manually shrunk, gzip compressed and base64 encoded to fit neatly into a "small" string.
        # To see both the original and shrunk code, check this [repo folder]{@link https://github.com/hybolic/Nadirs-Open-Chat-Widget/blob/main/py }
        # specifically [./py/activate_this.og.py] and [./py/activate_this.small.py] for details or if you are on the snippet at the bottom of the page
            text_file.write(gzip.decompress(base64.b64decode("H4sIAAAAAAAC/z1RwW7jIBC9+yt8G2gcpN4qIw45VNqVut2om+3FtSxsjx0SBxBDV83fF5xtT7wZ5vHmPabgLqWj0ly8C7H0Oh5LTaWv0P4zwdl"
                                                             "cmCq3CX0uSP4fJRMxN44VXSmDWS5qFnm0iOFaD8oL3VOuWddNZsGu4wV+DOhj+awv+BiCC5l4rp2C8G79FWTQhrDcEWGIxtl1hl1oVjCZj68tYe"
                                                             "M2IG+HSMRuFckSHPiUHZ0LneRHE2wSYgOXvdJNvV3QMvgzBOMjAd/et/KkYL87/ABpmlOrSJycsazR1Z0RM0Z2qgC4IL+YyIi3XFoFrz9fDn93T"
                                                             "93j82um2Vb1+dhAt3/5/Wt/gFYBJGde9JpwXaDnElUWv+XDiyndT6WxIMTbk+nfcphbr4eznpHgW7Aek4uAelkN+tt2upo4l0ehxzHTkkk2ihEH"
                                                             "NyKD9zhtH4CbCQCXlOTIi6WpW7U0WLebBLGV8/pk5wOmTPOXrUB+AdV/AqZng0UVAgAA")).decode())
            text_file.close() #close the file
            new_path = shutil.copy(src=local_activator, dst=activator) #copy the newly created file to /Scripts folder in %virtual_dir%
        #we nolonger need to use these so to say memory get rid of them
        del gzip, base64
    #check if the script exits in the venv or if they do not match, we copy it over ourselves
    elif filecmp.cmp(local_activator, activator) or not os.path.exists(activator):
        #new path of script added to virtual env
        new_path = shutil.copy(src=local_activator, dst=activator)
    # we no longer need access to shutil so yeet it
    del shutil
    
    #open a %CWD%\\%virtual_dir%\\Scripts\\activate_this.py as a TextIOWrapper
    with open(os.path.abspath(os.path.dirname(sys.argv[0])) + "\\"+virtual_dir+"\\Scripts\\activate_this.py") as f:
        # read file and compile the code for exec and execute it in script
        exec(compile(f.read(), activator, 'exec'), dict(__file__=activator))
    #check if we are now in a virtual enviroment!
    if not sys.prefix != (getattr(sys, "base_prefix", None) or getattr(sys, "real_prefix", None) or sys.prefix):
        exit()

#try to do imports after everything
tryImportStuff()
############################# activate_this.py ##########################
"""
Activate virtualenv for current interpreter:

import runpy
runpy.run_path(this_file)

This can be used when you must use an existing Python interpreter, not the virtualenv bin/python.
"""  # noqa: D415

from __future__ import annotations

import os
import site
import sys

try:
    abs_file = os.path.abspath(__file__)
except NameError as exc:
    msg = "You must use import runpy; runpy.run_path(this_file)"
    raise AssertionError(msg) from exc

bin_dir = os.path.dirname(abs_file)
base = bin_dir[: -len('Scripts') - 1]  # strip away the bin part from the __file__, plus the path separator

# prepend bin to PATH (this file is inside the bin directory)
os.environ["PATH"] = os.pathsep.join([bin_dir, *os.environ.get("PATH", "").split(os.pathsep)])
os.environ["VIRTUAL_ENV"] = base  # virtual env is right above bin directory
os.environ["VIRTUAL_ENV_PROMPT"] = '' or os.path.basename(base)

# add the virtual environments libraries to the host python import mechanism
prev_length = len(sys.path)
for lib in '..\\Lib\\site-packages'.split(os.pathsep):
    path = os.path.realpath(os.path.join(bin_dir, lib))
    site.addsitedir(path.decode("utf-8") if '' else path)
sys.path[:] = sys.path[prev_length:] + sys.path[0:prev_length]

sys.real_prefix = sys.prefix
sys.prefix = base
############################ activate_this.small.py ##########################
# this comes from the gzip compressed and base64 encoded string
# readbility was given up for compressable content for example replacing long names
# with shorter variables like "os.path" becoming "p", "site" becoming "h" or replacing a duplicated string part
# with "VIRTUAL_ENV" with "n"
# these changes brought the file size from 1318 bytes to 538 and further still to 512 with gzip and base64
# to get this lovely string
##################################################################################################################
# H4sIAAAAAAAC/z1RwW7jIBC9+yt8G2gcpN4qIw45VNqVut2om+3FtSxsjx0SBxBDV83fF5xtT7wZ5vHmPabgLqWj0ly8C7H0Oh5LTaWv0P4zwdl
# cmCq3CX0uSP4fJRMxN44VXSmDWS5qFnm0iOFaD8oL3VOuWddNZsGu4wV+DOhj+awv+BiCC5l4rp2C8G79FWTQhrDcEWGIxtl1hl1oVjCZj68tYe
# M2IG+HSMRuFckSHPiUHZ0LneRHE2wSYgOXvdJNvV3QMvgzBOMjAd/et/KkYL87/ABpmlOrSJycsazR1Z0RM0Z2qgC4IL+YyIi3XFoFrz9fDn93T
# 93j82um2Vb1+dhAt3/5/Wt/gFYBJGde9JpwXaDnElUWv+XDiyndT6WxIMTbk+nfcphbr4eznpHgW7Aek4uAelkN+tt2upo4l0ehxzHTkkk2ihEH
# NyKD9zhtH4CbCQCXlOTIi6WpW7U0WLebBLGV8/pk5wOmTPOXrUB+AdV/AqZng0UVAgAA
##################################################################################################################
from os import path as p,environ as i,pathsep as s;import site as h,sys as g;l=g.path
try:c=p.abspath(__file__)
except NameError as k:o='runpy';raise AssertionError(msg='fix import '+o+'; '+o+'.run_path(file)')from k
a=p.dirname(c);b=a[:-len('Scripts')-1];j='PATH';i[j]=s.join([a,*i.get(j,'').split(s)]);n='VIRTUAL_ENV';i[n]=b;i[n+'_PROMPT']=''or p.basename(b);e=len(g.path)
for f in'..\Lib\site-packages'.split(s):d=p.realpath(p.join(a,f));h.addsitedir(d.decode('utf-8')if''else d)
l[:]=l[e:]+l[:e];g.real_prefix=g.prefix;g.prefix=b
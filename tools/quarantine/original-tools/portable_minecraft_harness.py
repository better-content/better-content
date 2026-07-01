#!/usr/bin/env python3

from pathlib import Path
import runpy
import sys


sys.argv[0] = str(Path(__file__).resolve())
runpy.run_path(str(Path(__file__).with_name("_run_pyc_wrapper.py")), run_name="__main__")

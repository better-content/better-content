#!/usr/bin/env python3

from pathlib import Path
import runpy
import sys

# Archived entrypoint for the Lost Cities + The Flesh That Hates + C2ME +
# DistantHorizons stability harness, including the historical modernfix_watchdog
# checks preserved in the compiled implementation.

sys.argv[0] = str(Path(__file__).resolve())
runpy.run_path(str(Path(__file__).with_name("_run_pyc_wrapper.py")), run_name="__main__")

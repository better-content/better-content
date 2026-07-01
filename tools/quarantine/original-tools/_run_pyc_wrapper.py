#!/usr/bin/env python3

from __future__ import annotations

import os
import runpy
import sys
from pathlib import Path


def main() -> None:
    wrapper_dir = Path(__file__).resolve().parent
    script_path = Path(os.environ.get("BTM_PYC_WRAPPER_TARGET", sys.argv[0])).resolve()
    pyc_name = script_path.stem + ".cpython-311.pyc"
    pyc_path = script_path.parents[2] / "__pycache__" / pyc_name
    if not pyc_path.is_file():
        raise SystemExit(f"missing archived bytecode: {pyc_path}")
    sys.argv[0] = str(script_path)
    runpy.run_path(str(pyc_path), run_name="__main__")


if __name__ == "__main__":
    main()

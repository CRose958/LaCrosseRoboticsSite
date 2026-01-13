#!/usr/bin/env python3
"""
Normalize trailing whitespace and ensure newline-at-EOF for text files.
Run from the repository root.
"""
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXTS = {'.html', '.css', '.js', '.md', '.txt', '.json'}

changed = []
for path in ROOT.rglob('*'):
    if path.is_file() and path.suffix.lower() in EXTS:
        try:
            text = path.read_text(encoding='utf-8')
        except Exception:
            try:
                text = path.read_text(encoding='latin-1')
            except Exception:
                continue
        lines = text.splitlines()
        new_lines = [ln.rstrip(' \t') for ln in lines]
        new_text = '\n'.join(new_lines) + '\n'
        if new_text != text.replace('\r\n', '\n').replace('\r','\n'):
            path.write_text(new_text, encoding='utf-8')
            changed.append(str(path.relative_to(ROOT)))

print('Normalized files:', len(changed))
for p in changed:
    print(' -', p)

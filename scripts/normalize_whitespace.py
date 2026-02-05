#!/usr/bin/env python3
"""
Normalize trailing whitespace and ensure newline-at-EOF for text files.
Run from the repository root.
"""
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
        new_lines = [line.rstrip(' \t') for line in lines]
        new_text = '\n'.join(new_lines) + '\n'
        normalized_original = text.replace('\r\n', '\n').replace('\r', '\n')
        if new_text != normalized_original:
            path.write_text(new_text, encoding='utf-8')
            changed.append(str(path.relative_to(ROOT)))

print(f'Normalized files: {len(changed)}')
for path in changed:
    print(f' - {path}')

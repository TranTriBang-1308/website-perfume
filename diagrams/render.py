#!/usr/bin/env python3
"""Render toàn bộ file .puml trong thư mục hiện tại sang PNG + SVG.

Yêu cầu: pip install plantweb
Cách dùng:  python render.py
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

try:
    from plantweb.render import render
except ImportError:
    print("Thiếu thư viện plantweb. Cài đặt bằng:\n  pip install plantweb")
    sys.exit(1)


HERE = Path(__file__).resolve().parent
EXPORT_DIR = HERE / "exports"
EXPORT_DIR.mkdir(exist_ok=True)


def render_one(puml_path: Path, fmt: str) -> None:
    out_path = EXPORT_DIR / f"{puml_path.stem}.{fmt}"
    print(f"  → {fmt.upper():4s}  {out_path.relative_to(HERE)}")
    src = puml_path.read_text(encoding="utf-8")
    output, _, _, _ = render(
        src,
        engine="plantuml",
        format=fmt,
        cacheopts={"use_cache": False},
    )
    out_path.write_bytes(output)


def main() -> int:
    pumls = sorted(HERE.glob("*.puml"))
    if not pumls:
        print("Không tìm thấy file .puml nào trong", HERE)
        return 1

    for puml in pumls:
        print(f"Render {puml.name}")
        for fmt in ("png", "svg"):
            try:
                render_one(puml, fmt)
            except Exception as e:  # noqa: BLE001
                print(f"  ! Lỗi {fmt}: {e}")
                return 2
    print(f"\nXong. Ảnh đã lưu trong {EXPORT_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env bash
# Render toàn bộ .puml -> PNG + SVG bằng plantuml.jar
# Yêu cầu: Java 8+. Script tự tải plantuml.jar nếu chưa có.

set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JAR="$HERE/plantuml.jar"
EXPORT_DIR="$HERE/exports"

if [[ ! -f "$JAR" ]]; then
  echo "Tải plantuml.jar..."
  URL="https://github.com/plantuml/plantuml/releases/download/v1.2024.7/plantuml-1.2024.7.jar"
  curl -L -o "$JAR" "$URL"
fi

mkdir -p "$EXPORT_DIR"

echo "Render PNG..."
java -jar "$JAR" -tpng -o "$EXPORT_DIR" "$HERE"/*.puml

echo "Render SVG..."
java -jar "$JAR" -tsvg -o "$EXPORT_DIR" "$HERE"/*.puml

echo ""
echo "Xong. Ảnh đã lưu trong: $EXPORT_DIR"
ls -la "$EXPORT_DIR"

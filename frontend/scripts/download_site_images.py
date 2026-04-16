#!/usr/bin/env python3
"""
Скачивает изображения для прототипа из Wikimedia Commons (стабильные thumb URL через API).
Требуется сеть. Запуск: из каталога frontend — python3 scripts/download_site_images.py
"""
from __future__ import annotations

import json
import os
import urllib.parse
import urllib.request

# https://meta.wikimedia.org/wiki/User-Agent_policy
UA = "MedcenterSitePrototype/1.0 (https://github.com/; educational layout demo)"

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
OUT_DIR = os.path.join(ROOT, "public", "images", "medcenter")

# (файл на диске без расширения -> полное имя на Commons, ширина превью API)
ASSETS: list[tuple[str, str, int]] = [
    ("hero-clinic", "File:A waiting room at a medical healthcare clinic, doctor's office, hospital.jpg", 1600),
    ("hall", "File:Hospital corridor.jpg", 1200),
    ("consult", "File:Medical ultrasound examination.JPG", 1200),
    ("lab", "File:Testing in a Medical Lab Laquintinie Hospital Douala.jpg", 1200),
    ("mri", "File:Magnetic Resonance Imaging.png", 1200),
    ("cardio", "File:Stethoscope-2.jpg", 1200),
    ("blog-heart", "File:Electrocardiogram of a healthy man, 21 years old.jpg", 1200),
    ("blog-sleep", "File:Patient room with hospital bed.jpg", 1200),
    ("blog-checkup", "File:Checking Blood Sample (9955279835).jpg", 1200),
    ("doctor-1", "File:Dr. Natalia Pătrașcu.jpg", 800),
    ("doctor-2", "File:Shirish Hiremath Cardiologist.jpg", 800),
    ("doctor-3", "File:Amr Amal portrait 2025.jpg", 800),
    ("doctor-4", "File:David Altshuler.jpg", 800),
    ("doctor-5", "File:Dr. Moosa Kunhi 11.jpg", 800),
    ("doctor-6", "File:Thomas Lewis (cardiologist).jpg", 800),
    ("masthead-doctors", "File:Covid-19 San Salvatore 05.jpg", 1200),
    ("masthead-prices", "File:Reception desk for Clinical Physiology - NÄL hospital 1.jpg", 1200),
    ("masthead-blog", "File:Measuring tape next to a stack of books on a wooden table. (51145551839).jpg", 1200),
    ("not-found", "File:Miyahara Eye Hospital - Interior 01.jpg", 1000),
]


def api_imageinfo(titles: list[str], width: int) -> dict[str, dict]:
    q = urllib.parse.urlencode(
        {
            "action": "query",
            "titles": "|".join(titles),
            "prop": "imageinfo",
            "iiprop": "url|thumburl|mime",
            "iiurlwidth": str(width),
            "format": "json",
        },
        safe="|",
    )
    url = "https://commons.wikimedia.org/w/api.php?" + q
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = json.load(r)
    out: dict[str, dict] = {}
    for _pid, page in data.get("query", {}).get("pages", {}).items():
        title = page.get("title", "")
        if page.get("missing"):
            out[title] = {"missing": True}
            continue
        ii = (page.get("imageinfo") or [{}])[0]
        out[title] = ii
    return out


def pick_download_url(info: dict) -> str | None:
    if info.get("missing"):
        return None
    return info.get("thumburl") or info.get("url")


def ext_for_mime(mime: str | None, fallback: str) -> str:
    if not mime:
        return fallback
    if "png" in mime:
        return "png"
    if "jpeg" in mime or "jpg" in mime:
        return "jpg"
    if "webp" in mime:
        return "webp"
    return fallback


def download(url: str, dest: str) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=120) as r:
        body = r.read()
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "wb") as f:
        f.write(body)


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    # Пакетами по 8 файлов — надёжнее для длины URL
    batch: list[tuple[str, str, int]] = []
    for slug, title, w in ASSETS:
        batch.append((slug, title, w))
    # по одному запросу на файл — проще с разными width
    manifest: dict[str, str] = {}
    for slug, title, width in ASSETS:
        info = api_imageinfo([title], width).get(title, {})
        url = pick_download_url(info)
        if not url:
            raise SystemExit(f"Нет URL для {title!r}")
        mime = info.get("mime")
        ext = ext_for_mime(mime, "jpg")
        # если thumb ведёт на jpg, имя всё равно ок
        fname = f"{slug}.{ext}"
        dest = os.path.join(OUT_DIR, fname)
        print("GET", title[:50], "->", fname)
        download(url, dest)
        manifest[slug] = f"/images/medcenter/{fname}"

    att = os.path.join(OUT_DIR, "ATTRIBUTION.txt")
    with open(att, "w", encoding="utf-8") as f:
        f.write(
            "Изображения загружены с Wikimedia Commons; лицензии указаны на страницах файлов.\n"
            "Список файлов: см. scripts/download_site_images.py (ASSETS).\n"
        )
    print("OK:", len(manifest), "files ->", OUT_DIR)
    print("Paths:", json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

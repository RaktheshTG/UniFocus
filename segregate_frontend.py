import re
from pathlib import Path


def extract_first(pattern: str, text: str):
    m = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
    if not m:
        return None, text
    return m.group(1), text[: m.start()] + text[m.end() :]


def main():
    root = Path("FrontEnd")
    html_dir = root / "html"
    css_dir = root / "css"
    js_dir = root / "js"
    html_dir.mkdir(parents=True, exist_ok=True)
    css_dir.mkdir(parents=True, exist_ok=True)
    js_dir.mkdir(parents=True, exist_ok=True)

    files = list(root.glob("*.html"))
    processed = 0
    for p in files:
        name = p.stem
        text = p.read_text(encoding="utf-8", errors="ignore")

        css, text = extract_first(r"<style[^>]*>(.*?)</style>", text)
        js, text = extract_first(r"<script[^>]*>(.*?)</script>", text)

        css_file = f"../css/{name}.css"
        js_file = f"../js/{name}.js"

        link_tag = f'  <link rel="stylesheet" href="{css_file}">\n'
        if re.search(r"</head>", text, re.IGNORECASE):
            text = re.sub(r"\s*</head>", "\n" + link_tag + "</head>", text, count=1, flags=re.IGNORECASE)
        else:
            text = link_tag + text

        script_tag = f'  <script src="{js_file}"></script>\n'
        if re.search(r"</body>", text, re.IGNORECASE):
            text = re.sub(r"\s*</body>", "\n" + script_tag + "</body>", text, count=1, flags=re.IGNORECASE)
        else:
            text += "\n" + script_tag

        (css_dir / f"{name}.css").write_text((css or "/* no styles extracted */") + "\n", encoding="utf-8")
        (js_dir / f"{name}.js").write_text((js or "// no scripts extracted") + "\n", encoding="utf-8")
        (html_dir / p.name).write_text(text, encoding="utf-8")
        processed += 1

    print(f"Processed {processed} html files into FrontEnd/html, css, js")


if __name__ == "__main__":
    main()


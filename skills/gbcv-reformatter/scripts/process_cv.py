#!/usr/bin/env python3
"""
GBCV Skill - CV Reformatter
Auto-batching: processes in groups of BATCH_SIZE (default 3).
Fail-and-continue: a bad file is skipped, never stops the run.
"""
import os, sys, json, shutil, subprocess, tempfile, argparse
from pathlib import Path
from datetime import datetime
from typing import List, Dict

SCRIPT_DIR = Path(__file__).parent
SKILL_DIR  = SCRIPT_DIR.parent
ASSETS_DIR = SKILL_DIR / "assets"
LOGO_PATH  = ASSETS_DIR / "logo.png"
BUILDER_JS = SCRIPT_DIR / "build_docx.js"
BATCH_SIZE = 3

PREPARED_BY_OPTIONS = [
    "Duffy, Helen","Ford, Molly","Hadley, Eric","Hadley, Gina",
    "Haines, Jay","Harwood, Tania","Lasiter, Laura","Melcher, Randy","Steib, Kemp",
]

def extract_text(filepath: str) -> str:
    path = Path(filepath)
    ext  = path.suffix.lower()
    if ext == ".doc":
        path = _convert_doc_to_docx(path); ext = ".docx"
    if ext == ".pdf":
        r = subprocess.run(["pdftotext", str(path), "-"], capture_output=True, text=True)
        if r.returncode == 0 and r.stdout.strip(): return r.stdout
        r = subprocess.run(["pandoc", str(path), "-t", "plain"], capture_output=True, text=True)
        return r.stdout
    if ext == ".docx":
        r = subprocess.run(["pandoc", str(path), "-t", "plain", "--track-changes=all"], capture_output=True, text=True)
        return r.stdout
    r = subprocess.run(["pandoc", str(path), "-t", "plain"], capture_output=True, text=True)
    return r.stdout

def _convert_doc_to_docx(path: Path) -> Path:
    soffice = Path("/mnt/skills/public/docx/scripts/office/soffice.py")
    tmp = Path(tempfile.mkdtemp())
    subprocess.run(["python3", str(soffice), "--headless", "--convert-to", "docx",
                    "--outdir", str(tmp), str(path)], capture_output=True)
    results = list(tmp.glob("*.docx"))
    if results: return results[0]
    raise RuntimeError(f"Could not convert {path.name} from .doc to .docx")

def parse_cv_with_claude(raw_text: str) -> dict:
    import urllib.request
    schema = (SKILL_DIR / "references" / "cv_schema.md").read_text()
    prompt = f"You are parsing a candidate CV into structured JSON.\nReturn ONLY valid JSON — no markdown fences, no preamble.\n\nSchema reference:\n{schema}\n\nCV TEXT:\n{raw_text[:15000]}"
    payload = json.dumps({
        "model": "claude-sonnet-4-20250514", "max_tokens": 4000,
        "messages": [{"role": "user", "content": prompt}]
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages", data=payload,
        headers={"Content-Type": "application/json", "anthropic-version": "2023-06-01"}
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read())
    text = data["content"][0]["text"].strip()
    if text.startswith("```"):
        lines = text.split("\n")
        text = "\n".join(lines[1:-1] if lines[-1] == "```" else lines[1:])
    return json.loads(text)

def build_docx(cv_data: dict, prepared_by: str, output_path: str):
    tmp = Path(tempfile.mkdtemp())
    data_file = tmp / "payload.json"
    data_file.write_text(json.dumps({
        "cv_data": cv_data, "prepared_by": prepared_by,
        "date": datetime.now().strftime("%B %-d, %Y"),
        "output_path": output_path, "logo_path": str(LOGO_PATH),
    }))
    r = subprocess.run(["node", str(BUILDER_JS), str(data_file)], capture_output=True, text=True)
    shutil.rmtree(tmp, ignore_errors=True)
    if r.returncode != 0:
        raise RuntimeError(f"DOCX builder failed:\n{r.stderr}\n{r.stdout}")

def output_filename(cv_data: dict) -> str:
    name  = cv_data.get("candidate_name", "Unknown_Candidate")
    parts = name.strip().split()
    first = parts[0]  if len(parts) >= 1 else "Unknown"
    last  = parts[-1] if len(parts) >= 2 else ""
    safe  = lambda s: "".join(c for c in s if c.isalnum() or c in "-_")
    return f"{safe(first)}_{safe(last)}_GBCV.docx"

def process_one(cv_file: str, prepared_by: str, output_dir: str) -> Dict:
    try:
        raw = extract_text(cv_file)
        if not raw.strip(): raise ValueError("No text could be extracted from this file")
        cv_data  = parse_cv_with_claude(raw)
        filename = output_filename(cv_data)
        out_path = os.path.join(output_dir, filename)
        build_docx(cv_data, prepared_by, out_path)
        return {"status": "success", "file": cv_file, "output": out_path,
                "candidate": cv_data.get("candidate_name", "Unknown"),
                "flagged": cv_data.get("missing_sections", [])}
    except Exception as e:
        return {"status": "failed", "file": cv_file, "error": str(e)}

def process_in_batches(cv_files: List[str], prepared_by: str, output_dir: str) -> List[Dict]:
    total   = len(cv_files)
    batches = [cv_files[i:i + BATCH_SIZE] for i in range(0, total, BATCH_SIZE)]
    results = []

    print(f"\n{'='*52}")
    print(f"  {total} CV(s)  |  {len(batches)} batch(es) of up to {BATCH_SIZE}  |  By: {prepared_by}")
    print(f"{'='*52}\n")

    for batch_num, batch in enumerate(batches, 1):
        print(f"── Batch {batch_num}/{len(batches)} ({len(batch)} file(s)) ──────────")
        for cv_file in batch:
            print(f"  Processing: {Path(cv_file).name}")
            result = process_one(cv_file, prepared_by, output_dir)
            if result["status"] == "success":
                print(f"  ✓  {result['candidate']}  →  {Path(result['output']).name}")
                if result["flagged"]:
                    print(f"     ⚠  Flagged missing: {', '.join(result['flagged'])}")
            else:
                print(f"  ✗  FAILED — {result['error']}")
            results.append(result)

        batch_results = results[-len(batch):]
        ok = sum(1 for r in batch_results if r["status"] == "success")
        print(f"  Batch {batch_num} done: {ok}/{len(batch)} written\n")

    return results

def print_summary(results: List[Dict]):
    success = [r for r in results if r["status"] == "success"]
    failed  = [r for r in results if r["status"] == "failed"]
    flagged = [r for r in success if r.get("flagged")]
    print(f"{'='*52}")
    print(f"  COMPLETE: {len(success)}/{len(results)} CVs processed successfully")
    if failed:
        print(f"\n  FAILED ({len(failed)}):")
        for r in failed: print(f"    - {Path(r['file']).name}: {r['error']}")
    if flagged:
        print(f"\n  SECTIONS FLAGGED IN DOC (highlighted amber):")
        for r in flagged: print(f"    - {r['candidate']}: {', '.join(r['flagged'])}")
    print(f"{'='*52}\n")

def select_prepared_by() -> str:
    print("\nWho prepared these CVs?\n")
    for i, name in enumerate(PREPARED_BY_OPTIONS, 1):
        print(f"  {i}. {name}")
    print()
    while True:
        try:
            choice = int(input("Enter number: ").strip())
            if 1 <= choice <= len(PREPARED_BY_OPTIONS):
                last, first = PREPARED_BY_OPTIONS[choice-1].split(", ", 1)
                return f"{first.strip()} {last.strip()}"
        except (ValueError, KeyboardInterrupt): pass
        print("  Invalid — enter a number from the list.")

def main():
    parser = argparse.ArgumentParser(description="Convert CVs to GBCV format")
    parser.add_argument("cv_files", nargs="+", help="CV files to process")
    parser.add_argument("--prepared-by", help="Preparer name (skip prompt)")
    parser.add_argument("--output-dir",  default=".", help="Output directory")
    parser.add_argument("--batch-size",  type=int, default=BATCH_SIZE)
    args = parser.parse_args()

    global BATCH_SIZE
    BATCH_SIZE = args.batch_size

    prepared_by = args.prepared_by or select_prepared_by()
    os.makedirs(args.output_dir, exist_ok=True)
    results = process_in_batches(args.cv_files, prepared_by, args.output_dir)
    print_summary(results)
    return 1 if any(r["status"] == "failed" for r in results) else 0

if __name__ == "__main__":
    sys.exit(main())

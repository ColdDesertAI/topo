#!/usr/bin/env python3
"""Read-only GitHub monitor. Writes only its own status/brief outside the repo."""
import argparse
import datetime as dt
import json
import os
from pathlib import Path
import signal
import subprocess
import time

REPOSITORY = "ColdDesertAI/topo"


def command(args, deadline):
    remaining = min(45, deadline - time.monotonic())
    if remaining <= 0:
        raise RuntimeError("Tijdslimiet bereikt")
    proc = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                            text=True, start_new_session=True)
    try:
        out, _ = proc.communicate(timeout=remaining)
    except subprocess.TimeoutExpired:
        os.killpg(proc.pid, signal.SIGKILL)
        proc.communicate()
        raise RuntimeError("GitHub-controle overschreed de tijdslimiet") from None
    if proc.returncode:
        # No raw stderr: authentication diagnostics may contain private details.
        raise RuntimeError("GitHub niet bereikbaar of gh niet ingelogd; controle onvolledig")
    return out


def api(path, deadline, paginate=False):
    args = ["gh", "api", "--method", "GET", f"repos/{REPOSITORY}/{path}"]
    if paginate:
        args += ["--paginate", "--slurp"]
    data = json.loads(command(args, deadline))
    return [item for page in data for item in page] if paginate else data


def snapshot(deadline):
    main = api("commits/main", deadline)
    branches = api("branches?per_page=100", deadline, True)
    pulls = api("pulls?state=open&per_page=100", deadline, True)
    issues = api("issues?state=open&per_page=100", deadline, True)
    return {
        "main": main["sha"],
        "branches": sorted((b["name"], b["commit"]["sha"]) for b in branches),
        "pulls": sorted((p["number"], p["title"], p["updated_at"], p["head"]["sha"])
                        for p in pulls),
        "issues": sorted((i["number"], i["title"], i["updated_at"])
                         for i in issues if "pull_request" not in i),
    }


def render(current, previous):
    if current == previous:
        return ["Geen wijzigingen sinds de vorige geslaagde controle."]
    lines = [f"Main: {current['main'][:12]}",
             f"Branches: {len(current['branches'])} · open PR's: {len(current['pulls'])} · open issues: {len(current['issues'])}"]
    if not previous:
        lines.append("Eerste meting; geen eerdere vergelijking beschikbaar.")
    elif current["main"] != previous["main"]:
        lines.append("Main gewijzigd sinds vorige controle.")
    if len(current["branches"]) > 10:
        lines.append("Blokkade consolidatie: meer dan 10 branches; opruiming nog niet afgerond.")
    old_prs = {p[0]: p for p in (previous or {}).get("pulls", [])}
    for p in current["pulls"]:
        if old_prs.get(p[0]) != p:
            lines.append(f"PR #{p[0]}: {p[1]}")
    return lines[:15]


def write_atomic(path, text):
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(text)
    temp.replace(path)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--state-dir", type=Path, default=Path.home() / ".topo-night" / "monitor")
    parser.add_argument("--dry-run", action="store_true", help="Controleer GitHub, schrijf niets")
    args = parser.parse_args()
    deadline = time.monotonic() + 600
    cache = args.state_dir / "snapshot.json"
    try:
        previous = json.loads(cache.read_text()) if cache.exists() else None
    except (ValueError, OSError):
        previous = None
    now = dt.datetime.now().astimezone().isoformat(timespec="seconds")
    current = None
    try:
        # JSON round-trip gives stable list representations across cached runs.
        current = json.loads(json.dumps(snapshot(deadline)))
        lines = render(current, previous)
        # Inspect existing CI only after main changes. Never run repo code or npm.
        if not previous or current["main"] != previous["main"]:
            checks = api(f"commits/{current['main']}/check-runs?per_page=100", deadline)
            runs = checks.get("check_runs", [])
            lines.append(f"GitHub-checks: {checks.get('total_count', len(runs))}; geen lokale tests gestart.")
            for check in runs:
                if check.get("conclusion") not in ("success", "neutral", "skipped"):
                    lines.append(f"Check: {check['name']} — {check.get('conclusion') or check['status']}")
        rc = 0
    except (RuntimeError, OSError, ValueError, KeyError) as exc:
        lines = [f"Controle onvolledig: {exc}", "Laatste geslaagde meting behouden; geen groen oordeel."]
        rc = 1
    brief = "# TOPO controleronde\n\n" + now + "\n\n" + "\n".join(f"- {line}" for line in lines) + "\n"
    print(brief)
    if not args.dry_run:
        args.state_dir.mkdir(parents=True, exist_ok=True)
        write_atomic(args.state_dir / "latest.md", brief)
        if rc == 0:
            write_atomic(cache, json.dumps(current, indent=2) + "\n")
    return rc


if __name__ == "__main__":
    raise SystemExit(main())

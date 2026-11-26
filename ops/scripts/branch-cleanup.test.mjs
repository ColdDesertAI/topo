import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

function run(mode, execute = false) {
  const dir = mkdtempSync(join(tmpdir(), 'topo-cleanup-test-'));
  try {
    writeFileSync(join(dir, 'git'), `#!/bin/bash
printf '%s\\n' "$*" >> "$TEST_DIR/calls"
case "$1" in
remote) echo https://github.com/ColdDesertAI/topo.git ;;
ls-remote)
  echo 'aaaaaaaa refs/heads/night/2026-11-22'
  if [ "$TEST_MODE" = conflict ]; then echo 'bbbbbbbb refs/tags/archive/night/2026-11-22'; fi
  if [ -f "$TEST_DIR/tag" ]; then
    echo 'aaaaaaaa refs/tags/archive/night/2026-11-22'
    if [ "$TEST_MODE" = race ]; then echo 'bbbbbbbb refs/heads/night/2026-11-22'; fi
  fi ;;
push)
  case "$*" in
  *aaaaaaaa:refs/tags/archive/night/2026-11-22*)
    [ "$TEST_MODE" != failure ] || exit 1
    touch "$TEST_DIR/tag" ;;
  esac ;;
esac
`, { mode: 0o755 });
    const result = spawnSync('bash', ['ops/scripts/branch-cleanup-2026-11-22.sh', ...(execute ? ['--uitvoeren'] : [])], {
      encoding: 'utf8', env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, TEST_DIR: dir, TEST_MODE: mode }
    });
    return { ...result, calls: readFileSync(join(dir, 'calls'), 'utf8') };
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
test('dry run does not fetch, push or change tags', () => {
  const r = run('ok'); assert.equal(r.status, 0); assert.doesNotMatch(r.calls, /^(fetch|push|tag) /m);
});
test('conflicting archive stops before mutation', () => {
  const r = run('conflict', true); assert.notEqual(r.status, 0); assert.doesNotMatch(r.calls, /^(fetch|push|tag) /m);
});
test('archive push failure prevents deletion', () => {
  const r = run('failure', true); assert.notEqual(r.status, 0); assert.doesNotMatch(r.calls, /--force-with-lease/);
});
test('remote change after archive prevents deletion', () => {
  const r = run('race', true); assert.notEqual(r.status, 0); assert.doesNotMatch(r.calls, /--force-with-lease/);
});
test('verified archive precedes deletion guarded by exact SHA', () => {
  const r = run('ok', true); assert.equal(r.status, 0);
  assert.match(r.calls, /push --force-with-lease=refs\/heads\/night\/2026-11-22:aaaaaaaa origin :refs\/heads\/night\/2026-11-22/);
  assert.ok(r.calls.indexOf('aaaaaaaa:refs/tags/archive/') < r.calls.indexOf('--force-with-lease'));
  assert.doesNotMatch(r.calls, /night\/2026-11-23/);
});

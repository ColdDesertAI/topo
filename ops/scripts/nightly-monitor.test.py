import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('monitor', Path(__file__).with_name('nightly-monitor.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
DATA = {'main': 'a' * 40, 'branches': [['main', 'a' * 40]], 'pulls': [], 'issues': []}

class MonitorTests(unittest.TestCase):
    def run_monitor(self, directory, *extra):
        with patch('sys.argv', ['monitor', '--state-dir', str(directory), *extra]), patch('builtins.print'):
            return m.main()

    def test_unchanged_skips_checks(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            (path / 'snapshot.json').write_text(json.dumps(DATA))
            with patch.object(m, 'snapshot', return_value=DATA), patch.object(m, 'api') as api:
                self.assertEqual(self.run_monitor(path), 0)
                api.assert_not_called()
            self.assertIn('Geen wijzigingen', (path / 'latest.md').read_text())

    def test_failure_keeps_snapshot(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            (path / 'snapshot.json').write_text(json.dumps(DATA))
            with patch.object(m, 'snapshot', side_effect=RuntimeError('offline')):
                self.assertEqual(self.run_monitor(path), 1)
            self.assertEqual(json.loads((path / 'snapshot.json').read_text()), DATA)
            self.assertIn('onvolledig', (path / 'latest.md').read_text())

    def test_first_run_reads_checks_and_saves(self):
        with tempfile.TemporaryDirectory() as directory:
            with patch.object(m, 'snapshot', return_value=DATA), patch.object(m, 'api', return_value={'check_runs': []}) as api:
                self.assertEqual(self.run_monitor(directory), 0)
                self.assertEqual(api.call_count, 1)
            self.assertTrue((Path(directory) / 'snapshot.json').exists())

    def test_dry_run_writes_nothing(self):
        with tempfile.TemporaryDirectory() as directory:
            with patch.object(m, 'snapshot', return_value=DATA), patch.object(m, 'api', return_value={'check_runs': []}):
                self.assertEqual(self.run_monitor(directory, '--dry-run'), 0)
            self.assertEqual(list(Path(directory).iterdir()), [])

    def test_api_is_get_only(self):
        with patch.object(m, 'command', return_value='[]') as command:
            m.api('branches', 123)
            self.assertEqual(command.call_args.args[0][:4], ['gh', 'api', '--method', 'GET'])

if __name__ == '__main__':
    unittest.main()

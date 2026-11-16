import test from 'node:test';import assert from 'node:assert/strict';import {ratio} from '../../scripts/audit/contrast.mjs';
test('WCAG reference extremes and symmetry',()=>{assert.equal(ratio([0,0,0],[255,255,255]),21);assert.equal(ratio([30,40,50],[30,40,50]),1);assert.equal(ratio([12,50,90],[220,240,255]),ratio([220,240,255],[12,50,90]));});

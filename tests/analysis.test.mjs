import test from 'node:test';
import assert from 'node:assert/strict';
import { extractNumberedClauses, keepGroundedReferences, relevantClauses } from '../lib/analysis.js';

test('extracts numbered clauses and keeps their source wording', () => {
  const clauses = extractNumberedClauses('1. Notice period\nGive thirty days notice after probation.\n2. Training cost\nRepay documented training costs if conditions apply.');
  assert.equal(clauses.length, 2);
  assert.match(clauses[0].text, /thirty days notice/);
  assert.equal(clauses[1].risk, 'high');
});

test('rejects unknown clause references and invented evidence quotes', () => {
  const clauses = [{ id: 7, text: 'Give thirty days notice after probation.' }];
  const answer = keepGroundedReferences([
    { clauseId: 7, documentSays: 'thirty days notice' },
    { clauseId: 7, documentSays: 'the company pays a bonus' },
    { clauseId: 99, documentSays: 'anything' },
  ], clauses);
  assert.deepEqual(answer, [{ clauseId: 7, documentSays: 'thirty days notice' }]);
});

test('rejects oversized input rather than processing arbitrary document text', () => {
  assert.deepEqual(extractNumberedClauses('1. Clause\n' + 'x'.repeat(150_001)), []);
});

test('finds situation-relevant clauses by their wording, not hard-coded demo IDs', () => {
  const clauses = [
    { id: 41, title: 'Exit notice', text: 'Provide 30 days notice before leaving.' },
    { id: 88, title: 'Equipment', text: 'Return the laptop at the end of work.' },
    { id: 93, title: 'Learning costs', text: 'Repay training costs if leaving during the first year.' },
  ];
  assert.deepEqual(relevantClauses('What if I resign?', clauses).map(x => x.id), [41, 93]);
});

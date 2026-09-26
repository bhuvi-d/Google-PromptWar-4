import test from 'node:test';
import assert from 'node:assert/strict';
import { generateGeminiAnswer } from '../lib/gemini.js';

test('sends the API key only in the header and keeps only source-grounded quotes', async () => {
  const apiKey = 'test-key-not-a-real-credential-123456789';
  let sent;
  const fakeFetch = async (url, options) => {
    sent = { url, options };
    return { ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: JSON.stringify({
      directAnswer: 'Notice applies as written.',
      relevantClauses: [
        { clauseId: 7, documentSays: 'thirty days notice', potentialImplication: 'Leaving sooner may raise a compliance question.' },
        { clauseId: 7, documentSays: 'the company owes a bonus', potentialImplication: 'Could cost money.' },
        { clauseId: 99, documentSays: 'unrelated quote', potentialImplication: 'Unknown.' },
      ], whatToCheck: ['Check any notice exception.'], questionsForLawyer: ['Does this apply here?'],
    }) }] } }] }) };
  };
  const clauses = [{ id: 7, title: 'Notice', text: 'Give thirty days notice after probation.' }];
  const answer = await generateGeminiAnswer(apiKey, 'Can I leave?', clauses, fakeFetch);
  assert.equal(sent.url.includes(apiKey), false);
  assert.equal(sent.options.headers['x-goog-api-key'], apiKey);
  assert.equal(sent.options.body.includes(apiKey), false);
  assert.equal(answer.relevantClauses.length, 1);
  assert.equal(answer.relevantClauses[0].clauseId, 7);
});

test('fails safely when the provider rejects a request', async () => {
  await assert.rejects(
    generateGeminiAnswer('test-key-not-a-real-credential-123456789', 'Question', [], async () => ({ ok: false })),
    /Check API key, model access, and quota/,
  );
});

test('does not present an ungrounded direct answer when no source quote verifies', async () => {
  const fakeFetch = async () => ({ ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: JSON.stringify({
    directAnswer: 'You can leave without notice.',
    relevantClauses: [{ clauseId: 7, documentSays: 'No notice is required.', potentialImplication: 'No notice.' }],
    whatToCheck: [], questionsForLawyer: [],
  }) }] } }] }) });
  const answer = await generateGeminiAnswer('test-key-not-a-real-credential-123456789', 'Can I leave?', [{ id: 7, title: 'Notice', text: 'Give thirty days notice.' }], fakeFetch);
  assert.equal(answer.relevantClauses.length, 0);
  assert.match(answer.directAnswer, /could not verify a relevant passage/i);
});

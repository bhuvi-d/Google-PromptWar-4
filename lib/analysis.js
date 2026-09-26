/** Clause extraction and evidence guards shared by the UI and tests. */
export function extractNumberedClauses(text, limit = 30) {
  if (typeof text !== 'string' || text.length > 150_000) return [];
  const matcher = /(?:^|\n)\s*(?:Clause\s+)?(\d{1,2})[.)]\s+|(?<![\w])Clause\s+(\d{1,2})\s*[:.)-]\s*/gi;
  const starts = [];
  for (const match of text.matchAll(matcher)) {
    starts.push({ index: match.index + match[0].search(/(?:Clause\s+)?\d/), id: Number(match[1] || match[2]) });
    if (starts.length >= limit) break;
  }
  return starts.map((entry, index) => {
    const end = starts[index + 1]?.index ?? text.length;
    const section = text.slice(entry.index, end).trim();
    const body = section.replace(/^(?:Clause\s+)?\d{1,2}[.)\s:-]*/i, '').trim();
    if (body.length < 20) return null;
    const title = (body.split(/[.!?\n]/, 1)[0] || `Clause ${entry.id}`).slice(0, 72);
    const risk = /repay|reimburse|penalty|liquidated|fee|cost|non-compete|non-solicit/i.test(body) ? 'high' : 'low';
    return { id: entry.id, title, category: risk === 'high' ? 'Potential financial or post-employment obligation' : 'Document clause', text: body, plain: body, impact: 'Review this wording with the surrounding terms and your circumstances.', risk };
  }).filter(Boolean);
}

export function normalizeEvidence(value) {
  return String(value ?? '').normalize('NFKC').replace(/[“”‘’]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase();
}

/** Keep model references only when the quoted words are present in that clause. */
export function keepGroundedReferences(references, clauses) {
  if (!Array.isArray(references)) return [];
  const byId = new Map(clauses.map(clause => [Number(clause.id), clause]));
  return references.flatMap(reference => {
    const clause = byId.get(Number(reference?.clauseId));
    const quote = typeof reference?.documentSays === 'string' ? reference.documentSays.trim() : '';
    if (!clause || !quote || !normalizeEvidence(clause.text).includes(normalizeEvidence(quote))) return [];
    return [{ ...reference, clauseId: clause.id, documentSays: quote }];
  });
}

export function relevantClauses(question, clauses) {
  const q = String(question).toLowerCase();
  const leaving = /resign|quit|leave|early|notice|terminat/.test(q);
  const money = /cost|money|repay|payment|fee|expensive/.test(q);
  if (leaving) {
    const score = clause => (/notice|terminat/i.test(`${clause.title} ${clause.text}`) ? 3 : 0) + (/train|repay|reimburse|cost/i.test(`${clause.title} ${clause.text}`) ? 3 : 0) + (/confidential|solicit|non-compete|after (?:employment|termination)/i.test(`${clause.title} ${clause.text}`) ? 1 : 0);
    return clauses.map(clause => ({ clause, score: score(clause) })).filter(item => item.score > 0).sort((a, b) => b.score - a.score || a.clause.id - b.clause.id).slice(0, 4).map(item => item.clause);
  }
  if (money) return clauses.filter(clause => /cost|repay|reimburse|fee|payment|salary|compensation|penalty/i.test(`${clause.title} ${clause.text}`)).slice(0, 4);
  const terms = new Set(q.split(/\W+/).filter(word => word.length > 3));
  return clauses.filter(clause => [...terms].some(term => `${clause.title} ${clause.text}`.toLowerCase().includes(term))).slice(0, 4);
}

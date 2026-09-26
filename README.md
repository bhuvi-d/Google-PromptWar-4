# ClauseCompass

**Navigate the fine print. Know your next step.**

A responsive legal document navigation MVP that connects a user's situation to clause-level evidence. Educational information only; not legal advice.

## Run locally

1. Install Node.js 18 or newer.
2. Run `npm install`.
3. Run `npm run dev`, then open http://localhost:3000.
4. Choose **Try demo contract**, upload `.txt` or text-based `.pdf`, or paste numbered clauses on the dashboard.

## Demo behavior and limits

The built-in fictional 12-clause employment agreement, clause explorer, resignation scenario, lawyer-prep checklist, and illustrative comparison work without an API key. Uploaded documents are analyzed in the browser. PDF text extraction loads the PDF.js worker from cdnjs; scanned/image-only PDFs need OCR, which this MVP does not include. Uploaded text is split into numbered clauses and quoted as evidence. Scenario responses use deterministic demo rules, not an LLM or legal analysis. Avoid uploading sensitive documents to a public demo.

## Deploy

Import this repository into Vercel or another Next.js host and deploy with the defaults. No environment variables are required.

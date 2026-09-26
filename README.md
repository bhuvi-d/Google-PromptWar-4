# ClauseCompass

**Navigate the fine print. Know your next step.**

A responsive legal document navigation MVP that connects a user's situation to clause-level evidence. Educational information only; not legal advice.

## Run locally

1. Install Node.js 18 or newer.
2. Run `npm install`.
3. Run `npm run dev`, then open http://localhost:3000.
4. Choose **Try demo contract**, upload `.txt` or text-based `.pdf`, or paste numbered clauses on the dashboard.

## Demo behavior and limits

The built-in fictional 12-clause employment agreement, clause explorer, scenario navigator, lawyer-prep checklist, and comparison demo work without an API key. Scenario answers use local demo guidance unless a user enters a Gemini API key and checks the explicit document-sharing consent box. With consent, the question and relevant clause excerpts are sent directly from the browser to Google Gemini 3.8 Flash; the key is held in tab memory only and is never saved to this repository or local storage. This static public demo has no server-side key proxy, so users should use a restricted key and review Google AI Studio data-handling terms before sharing sensitive documents. Uploaded documents are parsed in the browser, with a 12 MB/100-page limit; PDFs use a locally served PDF.js worker, and scanned/image-only PDFs need OCR, which is not included. AI-generated quotes are checked against source clauses; this reduces unsupported citations but does not validate legal interpretation. Do not treat the output as legal advice.

## Tests

Run `npm test` for clause parsing, evidence-quote validation, input-size guard, wording-based scenario matching, API-key handling, citation grounding, and provider failure behavior. The GitHub Pages workflow runs the same tests before each static export.

## Deploy

GitHub Actions builds a static export and deploys it to GitHub Pages on every push to `main`. In the repository's **Settings → Pages**, set the build and deployment source to **GitHub Actions** once. The project site will be served from `https://bhuvi-d.github.io/Google-PromptWar-4/` after the workflow succeeds. No API key is required for the demo. Gemini users enter their own key in the What If panel.

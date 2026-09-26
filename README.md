# ClauseCompass

**Navigate the fine print. Know your next step.**

A responsive legal document navigation MVP that connects a user's situation to clause-level evidence. Educational information only; not legal advice.

## Run locally

1. Install Node.js 18 or newer.
2. Run `npm install`.
3. Run `npm run dev`, then open http://localhost:3000.
4. Choose **Try demo contract**, upload `.txt` or text-based `.pdf`, or paste numbered clauses on the dashboard.

## Demo behavior and limits

The built-in fictional 12-clause employment agreement, clause explorer, scenario navigator, lawyer-prep checklist, and comparison demo work without an API key. This deployment does not send contract text to an AI provider; scenario answers use deterministic rules. Uploaded documents are parsed in the browser, with a 12 MB/100-page limit; PDFs use a locally served PDF.js worker, and scanned/image-only PDFs need OCR, which is not included. Do not treat the output as legal advice.

## Tests

Run `npm test` for the clause parsing, evidence-quote validation, input-size guard, and wording-based scenario matching checks. The GitHub Pages workflow runs the same tests before each static export.

## Deploy

GitHub Actions builds a static export and deploys it to GitHub Pages on every push to `main`. In the repository's **Settings → Pages**, set the build and deployment source to **GitHub Actions** once. The project site will be served from `https://bhuvi-d.github.io/Google-PromptWar-4/` after the workflow succeeds. No environment variables are required.

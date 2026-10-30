# Luvia Portugal

Next.js App Router, TypeScript. Node.js 22+; `npm ci`; `npm run dev`.
`npm run build` builds the Next.js application, including the server-side quote API.
Static export is no longer used because email credentials must stay on the server.

## Publication

GitHub: Blendd-agencia/luvia-portugal. `staging` → Vercel preview; `main` → production.
Preserve the Vercel project `luvia-portugal`, team `gads-5906s-projects` and existing domains.
Vercel uses `vercel.json`: Next.js, `npm run build`, output `.next`.
Only promote to main with the user's production authorization, after preview verification.
Check the exact commit's Vercel deployment status and then the actual site.

## Quote email configuration

Set server-only environment variables in Vercel (Preview and Production):
- `RESEND_API_KEY`: sending-only key, restricted to the verified sender domain.
- `QUOTE_FROM_EMAIL`: `Luvia <luvia@blendd.pt>` (blendd.pt was verified in Resend).
- `QUOTE_TO_EMAILS`: `joaosousa@blendd.pt` initially; comma-separated recipients for future changes.

Do not put credentials in source, browser code, NEXT_PUBLIC variables, or chat.
The old NEXT_PUBLIC_QUOTE_ENDPOINT is unused and may be removed from Vercel.
Redeploy after environment changes. No Supabase or database is used.

POST `/api/quote/` checks same-origin requests, content type, bounded body size,
required fields, consent and honeypot. A per-instance IP limiter provides basic
mitigation only, not a distributed guarantee; configure a Vercel Firewall rate
limit for this endpoint if abuse occurs. Resend idempotency avoids duplicate email
on retries for the same submission and content. Server logs contain only provider
status codes, never submitted contact details. Recipients and sender are server-configured;
reply-to is the validated visitor email. Success means the provider accepted the email,
not proof it reached the inbox. Verify a real submission and delivery event before release.
If secrets are missing the API returns 503 and the form retains the visitor's fields.

## Search indexing

Only `VERCEL_ENV=production` permits indexing. Preview and local builds remain
noindex, with robots disallow and an empty sitemap. Production has canonical
https://luvia.pt/, robots.txt, sitemap.xml and Organization structured data.
Verify production HTML, headers, robots and sitemap after release. Add/verify
luvia.pt in Google Search Console, submit https://luvia.pt/sitemap.xml and request
indexing for the homepage. Google controls indexing timing and ranking.

## Product images

Vein Cut gallery uses the four VEINCUT images supplied in Drive folder
https://drive.google.com/drive/folders/1D3gXguetqPbWQpUPeXMpe2aQQFKhHqUV
on 30 October 2026, resized/encoded as WebP without changing the depicted material.
Files numbered 1, 2, 3, 4 correspond to VEINCUT 1, VEINCUT UNF1, VEINCUT UNF2,
and VEINCUT2 respectively. No finish specifications are inferred from filenames.
Other product photos are unchanged. Vein Cut is 64.90 EUR/m² including VAT;
VAT on other families and commercial details remain subject to confirmation.

## Validation

`npm run typecheck`, `npm run build`, `node --test tests/*.test.mjs`.
Check form success, provider failure, duplicate submission, honeypot, missing
configuration, and mobile/desktop gallery interactions. Full legal privacy wording
and retention policy still need client confirmation; the form describes its purpose,
email processors, contact and NIF and does not subscribe to marketing.

## Google Ads quote conversion

Destination: `AW-18078478688/mnsTCPOd864dEODivqxD` (Luvia only).
The client requires both a successful HTTP response and `{ok:true}` from the
quote endpoint before calling `trackQuoteSuccess`. A synchronous ref locks
concurrent submissions. The existing UUID is reused for retries and sent as
`transaction_id`; memory and session storage suppress repeat conversion calls.
Tracking failures do not turn an accepted quote into a form error.

Basic consent mode: Google is not loaded before explicit measurement consent.
The choice expires after 180 days and can be changed in the footer. Contact
permission is separate. Ad personalization and Analytics remain denied. No form
contact details, message, or invented lead value are sent to Google. Leads sent
without measurement consent are not replayed later.

Only production builds on `luvia.pt` / `www.luvia.pt` load the tag. Preview emits
`luvia:conversion-preview` locally after a consenting successful submission and
never sends test conversions to Ads. `node --test tests/*.test.mjs` covers error
responses, consent, duplicate IDs, preview isolation and consent withdrawal.
After production authorization, validate with Google Tag Assistant, including
one successful submission, refusal, and failed submissions. A tag dispatch is
not proof of ad attribution or a reported Ads conversion; blockers and consent
can prevent measurement. The conversion remains secondary in Ads until the
campaign team chooses otherwise. No campaign/account goals are modified here.

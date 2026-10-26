# Fliq.it website

A dependency-free static marketing site ready for GitHub Pages.

## Publish with GitHub Pages

1. Create a GitHub repository, push this folder to its `main` branch, then open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
3. In Pages, set the custom domain to `fliqit.co.uk` and enable **Enforce HTTPS** after the certificate is issued. The root `CNAME` file is already included.

## Point GoDaddy at GitHub Pages

In GoDaddy DNS management, remove conflicting forwarding records and add these A records for the apex domain (`@`):

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

Add a `www` CNAME record pointing to `<your-github-username>.github.io` (replace the placeholder). Do not add `https://`.

DNS and certificate issuance can take several hours. Keep the domain configured in GitHub Pages during that period.

## Before launch

- Replace `hello@fliqit.co.uk` if a different support inbox is used.
- Waitlist lives at `/waitlist` and posts to `POST /v1/waitlist` on the production Cloud Function.
- Review and have counsel approve the privacy and account-deletion pages before app-store submission.
- Test the site locally with a static server (for example `npx serve`) so root-relative paths like `/waitlist` resolve. Opening files directly in the browser will not.

Pages are published as folders (`waitlist/index.html`, and so on) so URLs stay extensionless: `/waitlist`, `/privacy`, `/account-deletion`, `/child-safety`. The old `.html` paths redirect to those URLs.

## Quizzes (funnels) and the app handoff

Two quiz funnels live at `/solo-quiz` and `/friends-quiz` (menu items on the home page). Shared code is in `funnel/`:

- `core.js`: step engine (back button, browser back, resume), waitlist signup, handoff builder.
- `solo.js` / `friends.js`: each funnel's content and screens.
- `funnel.css`: styles for both (the quiz pages do not load `styles.css`).

The app isn't live, so there is no download button. The call to action is the waitlist (`POST /v1/waitlist`, which accepts `{email}` only). Email is optional at the results gate and offered again on the last screen.

### Funnel handoff

When someone locks in a plan, the funnel saves a **handoff** to `localStorage` (`fliq_handoff_v1`) and updates it when anything in it changes. It is the full description of the plan they built, in a versioned envelope (`v: 1`), so the app can create it for them later:

```json
{
  "v": 1, "id": "uuid", "source": "web_funnel", "created_at": "ISO", "timezone": "Europe/London", "locale": "en-GB",
  "funnel": { "id": "friend_type", "mode": "friends" },
  "profile": { "type": "reconnect", "name": "The Reconnector" },
  "user": { "first_name": "Favour", "age_range": "25–29" },
  "invitee": { "first_name": "Sarah", "relationship": "My best friend", "on_fliq": false },
  "plan": {
    "mode": "friends|solo", "title": "Coffee, phones away", "activity": "coffee|custom|…",
    "place": { "type": "out|home|online", "name": "Gail's Bakery" },
    "start_date": "2026-10-31", "start_time": "10:00", "start_at": "2026-10-31T10:00",
    "duration_minutes": 90, "energy": "low|mid|high",
    "recurrence": "once|weekly|fortnightly|monthly", "rrule": "FREQ=WEEKLY;INTERVAL=1",
    "invite_message": "…"
  },
  "challenge": { "id": "friends_8_week", "weeks": 8, "planned_weeks": [1], "start_date": "2026-10-31" },
  "reminders": { "day_before": true, "invitee": true },
  "attribution": { "how_found": "TikTok", "referrer": "host|null", "utm_source": "…" },
  "consent": { "waitlist": true }
}
```

Notes for the app side:

- `start_at` is local wall-clock time. Interpret it with `timezone`. If it's already in the past when the app opens, ask the user to pick a new time.
- `invitee` (friends only) is a name, not a user. The app has to create a pending invite (share link / contact), not a normal invite.
- `recurrence: "fortnightly"` has no equivalent in the app today (friends support daily/weekly/monthly; solo plans have no recurrence). Map it or add it.
- `energy` uses the app's `low | mid | high`. The app's required `mood` and `color` are not collected here; pick sensible defaults.
- No email in the handoff. The app knows the account email.
- Names and free text (custom plan or place) are in the handoff only. Analytics events (`window.dataLayer`) carry categories only.

To switch on the app link once a store / deferred-deep-link URL exists, set `CONFIG.APP_LINK_BASE` in `funnel/core.js`. `Fliq.appLink(handoff)` then appends `fliq_handoff=<base64url JSON>` and the final screen shows an "Open in Fliq.it" button. Passing the whole payload in a URL is fine for a prototype, but a short `id` that the app exchanges with the backend is more robust (length limits, privacy). See the questions below if that's the plan.

Testing locally: serve the folder (for example `python3 -m http.server 8099`) and open `/solo-quiz/`. Use a stubbed `fetch` or a throwaway email, because the waitlist call hits production.

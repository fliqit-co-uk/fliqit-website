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
- Connect the waitlist form to an email provider or backend; it currently confirms in the browser only.
- Review and have counsel approve the privacy and account-deletion pages before app-store submission.
- Test the site locally by opening `index.html` in a browser.

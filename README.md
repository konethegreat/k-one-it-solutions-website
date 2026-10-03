# K-ONE IT SOLUTIONS website

Source for the K-ONE IT SOLUTIONS company website: service information, an about
page, and contact details. The site uses plain HTML, CSS, and JavaScript.

## Current status

GitHub Pages publishes the static files from `main` at
[k-oneitsolutions.live](https://k-oneitsolutions.live/). A successful Pages build
does not establish that every page, DNS configuration, or contact flow works.

The repository also contains a PHP/PHPMailer contact handler (`submit.php`).
GitHub Pages cannot execute PHP, and the current contact form has an empty
`action`; it is not connected to that handler. Treat email submission as an
unfinished integration. Use the contact details displayed on the site meanwhile.

## Preview the static site

```sh
git clone https://github.com/konethegreat/k-one-it-solutions-website.git
cd k-one-it-solutions-website
python -m http.server 8080 --bind 127.0.0.1
```

Open `http://127.0.0.1:8080/`. This previews static pages only.

| File | Purpose |
| --- | --- |
| `index.html` | Landing page |
| `about.html` | Company information |
| `services.html` | Service descriptions |
| `contact.html` | Contact details and unfinished form integration |
| `styles.css`, `script.js` | Shared styling and client behavior |
| `submit.php`, `composer.json` | Optional PHP email-handler prototype |
| `CNAME` | GitHub Pages custom-domain declaration |

## PHP contact-handler development

The PHP prototype requires Composer, PHPMailer, and phpdotenv. On a local PHP
host, run `composer install`, copy `.env.example` to `.env`, and configure your
own SMTP credentials privately. `EMAIL_USERNAME` and `EMAIL_PASSWORD` are used
by the existing Gmail SMTP handler. The sender and recipient are currently
configured in `submit.php`.

Before connecting the form on a PHP-capable deployment, finish server-side email
validation, request throttling, error handling, and local or sandbox delivery
tests. Do not submit real contact details during automated tests. No live SMTP
delivery was tested as part of the documentation update.

## Contributing

Open an issue with the page, expected result, and reproduction steps. For a pull
request, preview the affected pages at desktop and mobile widths and describe
what you checked. Keep `.env`, credentials, generated dependencies, and private
contact submissions out of Git.

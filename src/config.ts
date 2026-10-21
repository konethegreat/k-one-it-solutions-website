// Written by Kone Tshivhinda & Claude
// Single source of truth for company details, contact info and links.

export const site = {
  name: 'K-ONE IT SOLUTIONS',
  tagline: 'Your vision, our code.',
  description:
    'K-ONE IT SOLUTIONS is an independent software studio in Johannesburg building AI systems, web and mobile apps, and cloud infrastructure that are auditable, cost-capped and built to last.',
  founder: 'Kone Tshivhinda',
  location: 'Johannesburg, South Africa',
  locale: 'en_ZA',
};

export const contact = {
  email: 'erictshivhinda@gmail.com',
  phone: '+27 81 302 5435',
  phoneHref: 'tel:+27813025435',
};

export const links = {
  github: 'https://github.com/konethegreat',
  linkedin: 'https://www.linkedin.com/in/kone-tshivhinda-32a760233',
  credly: 'https://www.credly.com/users/kone-tshivhinda/badges',
  facebook: 'https://www.facebook.com/share/1A4q81U8vX/',
  tiktok: 'https://www.tiktok.com/@kone.tshivhinda',
  portfolio: 'https://konethegreat.github.io',
  ibmCertificate: 'https://coursera.org/account/accomplishments/specialization/ESSIQ8HCQBA6',
};

/**
 * Contact form endpoint. Leave empty to use the mailto fallback (no third party,
 * no data collected). To enable a hosted form, create a Formspree form
 * (https://formspree.io), then paste its URL here, e.g. 'https://formspree.io/f/abcdwxyz'.
 */
export const formEndpoint = '';

export const nav = [
  { href: '/services/', label: 'Services' },
  { href: '/work/', label: 'Work' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

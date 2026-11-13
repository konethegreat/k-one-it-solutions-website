// Written by Kone Tshivhinda & Claude
// About copy. Wording stays close to the existing site and the public dossiers.
import { principles, timeline } from './content';
import { dossiers } from './dossiers';
import { links } from '../config';

// Spells out small counts so the copy reads as before ("five dossiers", "Five technical dossiers").
// A count with no word in the list falls back to its digits.
const COUNT_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

const countWord = (count: number): string => COUNT_WORDS[count] ?? String(count);

const capitalise = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

const dossierCount = countWord(dossiers.length);

export interface AboutData {
  intro: string[];
  principles: { title: string; body: string }[];
  timeline: { when: string; role: string; org: string; body: string; current?: boolean }[];
  building: { title: string; status: string; tone: 'ok' | 'warn'; summary: string; href: string }[];
  credentials: { title: string; detail: string; href?: string }[];
  languages: { name: string; level: string }[];
  location: string;
  availability: string;
  response: string;
}

export const about: AboutData = {
  intro: [
    'I am Kone Tshivhinda, founder of K-ONE IT SOLUTIONS. I am an AI systems engineer and full-stack developer based in Johannesburg.',
    'I ship agent-driven software from the first commit to live deployment: sovereign and local-first AI, legal tech, civic tech and developer tooling, always with a person signing off the decisions that matter.',
    `I use the major AI coding tools every day, and I am just as comfortable running local and open-weight models. The ${dossierCount} dossiers on this site show the work, including the parts that are still in development.`,
  ],
  principles,
  timeline: timeline.map((entry, index) => ({ ...entry, current: index === 0 })),
  building: dossiers.map((dossier) => ({
    title: dossier.title,
    status: dossier.statusLabel,
    tone: dossier.statusTone === 'ok' ? 'ok' : 'warn',
    summary: dossier.summary,
    href: `/work/${dossier.slug}/`,
  })),
  credentials: [
    {
      title: 'Diploma in Information Technology (NQF 6)',
      detail: 'Damelin, 2022 to 2024',
    },
    {
      title: 'IBM Full Stack Software Developer Professional Certificate',
      detail: '12 courses, IBM and Coursera',
      href: links.ibmCertificate,
    },
    {
      title: 'Public engineering record',
      detail: `${capitalise(dossierCount)} technical dossiers and every public repository`,
      href: '/work/',
    },
  ],
  languages: [
    { name: 'English', level: 'Advanced' },
    { name: 'Tshivenda', level: 'Native' },
    { name: 'Northern Sotho', level: 'Intermediate' },
  ],
  location: 'Johannesburg, South Africa',
  availability: 'Available for new work',
  response: 'Usually within two business days',
};

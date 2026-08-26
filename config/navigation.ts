export interface NavItem {
  label: string;
  href: string;
}

export const mainNavigation: NavItem[] = [
  { label: "Calculators", href: "/calculators" },
  { label: "Categories", href: "/categories" },
  { label: "Guides", href: "/guides" },
];

export const footerNavigation: {
  resources: NavItem[];
  company: NavItem[];
  legal: NavItem[];
} = {
  resources: [
    { label: "Guides", href: "/guides" },
    { label: "Categories", href: "/categories" },
    { label: "Calculators", href: "/calculators" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Methodology", href: "/methodology" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};
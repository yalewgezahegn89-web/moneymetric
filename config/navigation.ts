export interface NavItem {
  label: string;
  href: string;
}

export const mainNavigation: NavItem[] = [
  { label: "Calculators", href: "/calculators" },
  { label: "Categories", href: "/categories" },
  { label: "Guides", href: "/guides" },
];

export const footerNavigation: { resources: NavItem[] } = {
  resources: [
    { label: "Guides", href: "/guides" },
    { label: "Categories", href: "/categories" },
  ],
};

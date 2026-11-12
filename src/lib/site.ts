/** Navigation and service data shared across the site. */
export const nav = [
  { href: "/services/", label: "Services" },
  { href: "/work/", label: "Work" },
  { href: "/about/", label: "About" },
  { href: "/insights/", label: "Insights" },
  { href: "/learn/", label: "Learn" },
] as const;

export const servicePages = [
  { href: "/services/", name: "Digital services" },
  { href: "/services/website-design/", name: "Website design and development" },
  { href: "/services/custom-platforms/", name: "Custom platforms and portals" },
  { href: "/web-design-company-lagos/", name: "Web design company in Lagos" },
] as const;

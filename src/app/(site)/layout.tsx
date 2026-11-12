/** Every page except the homepage uses the inner-page design system (styles scoped to .pg). */
export default function SiteLayout({ children }: { children: React.ReactNode }) { return <div className="pg">{children}</div>; }

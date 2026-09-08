import Logo from "./logo";

const links = [
  { href: "#pipeline", label: "转换流程" },
  { href: "#methods", label: "五种方法" },
  { href: "#comparison", label: "方法对照" },
  { href: "#benchmarks", label: "评测基准" },
  { href: "#sources", label: "资料来源" },
] as const;

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-slate-50/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="主导航">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-blue-700"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#methods"
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 active:translate-y-px"
        >
          浏览方法
        </a>
      </div>
    </header>
  );
}

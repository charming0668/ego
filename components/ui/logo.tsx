import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
      aria-label="Ego-VLA Guide 首页"
    >
      <span className="grid size-8 place-items-center rounded-lg bg-blue-700 text-sm font-bold text-white transition-transform group-active:scale-[0.98]">
        E
      </span>
      <span className="text-sm font-semibold tracking-[-0.02em] text-slate-950 sm:text-base">
        Ego-VLA Guide
      </span>
    </Link>
  );
}

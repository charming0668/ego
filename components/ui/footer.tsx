import Logo from "./logo";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="space-y-2">
          <Logo />
          <p className="text-sm text-slate-600">
            人体第一人称数据到机器人动作的结构化技术指南。
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-slate-600">
          <a className="hover:text-blue-700" href="#methods">
            方法
          </a>
          <a className="hover:text-blue-700" href="#benchmarks">
            基准
          </a>
          <span className="text-slate-400">更新于 2026-09-06</span>
        </div>
      </div>
    </footer>
  );
}

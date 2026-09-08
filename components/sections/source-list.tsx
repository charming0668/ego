import SectionHeading from "@/components/sections/section-heading";
import { caveats, sources } from "@/content/site-data";

const groups = [
  { title: "EgoVLA", ids: ["egovla-paper", "egovla-code"] },
  { title: "H-RDT", ids: ["hrdt-paper", "hrdt-code"] },
  { title: "EgoHumanoid", ids: ["egohumanoid-paper", "egohumanoid-code"] },
  { title: "Qwen-RobotManip", ids: ["qwen-paper", "ego2robot"] },
  { title: "EgoScale", ids: ["egoscale-paper", "egoscale-project"] },
  { title: "LIBERO", ids: ["libero-paper", "libero-project", "libero-docs"] },
  { title: "RoboTwin 2.0", ids: ["robotwin-project", "robotwin-docs"] },
] as const;

export default function SourceList() {
  return (
    <section id="sources" className="scroll-mt-20 border-t border-slate-200 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="论文、代码与项目资料"
          description="页面保留结论层，原始定义、实验设置与版本差异请以一手资料为准。"
        />
        <div className="mt-8 grid gap-x-10 border-y border-slate-200 md:grid-cols-2">
          {groups.map((group, index) => {
            const items = group.ids
              .map((id) => sources.find((source) => source.id === id))
              .filter((source): source is NonNullable<typeof source> => Boolean(source));

            return (
              <div
                key={group.title}
                className={`flex flex-col gap-3 border-slate-200 py-5 md:p-5 ${index % 2 === 0 ? "md:border-r" : ""} ${index < groups.length - 2 ? "border-b" : ""}`}
              >
                <h3 className="font-semibold text-slate-950">{group.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((source) => (
                    <a
                      key={source.id}
                      href={source.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 hover:border-blue-300 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    >
                      {source.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <details className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <summary className="cursor-pointer font-semibold text-slate-900 marker:text-blue-700">
            阅读前需要注意的口径
          </summary>
          <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-600 md:grid-cols-2">
            {caveats.map((caveat) => (
              <li key={caveat}>{caveat}</li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}

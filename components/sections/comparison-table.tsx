import katex from "katex";

import SectionHeading from "@/components/sections/section-heading";
import { comparisonRows, methods } from "@/content/site-data";

function ComparisonValue({ value }: { value: string }) {
  if (!value) return "未给出";
  if (!value.includes("\\")) return value;

  return (
    <span
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(value, {
          displayMode: false,
          throwOnError: false,
          strict: false,
        }),
      }}
    />
  );
}

export default function ComparisonTable() {
  return (
    <section id="comparison" className="scroll-mt-20 border-y border-blue-100 bg-blue-50/60 py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="差异不在 48 还是 80"
          description="真正决定迁移方式的是坐标系、动作定义，以及人体数据如何接入机器人阶段。"
        />
        <div className="mt-8 overflow-x-auto rounded-2xl border border-blue-100 bg-white shadow-[0_18px_50px_rgba(29,78,216,0.07)]">
          <table className="w-full min-w-[1040px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="sticky left-0 z-10 min-w-36 bg-slate-50 px-5 py-4 font-semibold text-slate-700">
                  对照维度
                </th>
                {methods.map((method) => (
                  <th key={method.id} className="min-w-44 px-5 py-4 font-semibold text-slate-950">
                    {method.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.dimension} className="border-b border-slate-100 last:border-0">
                  <th className="sticky left-0 z-10 bg-white px-5 py-4 font-semibold text-slate-800">
                    {row.dimension}
                  </th>
                  {methods.map((method) => (
                    <td key={method.id} className="px-5 py-4 leading-6 text-slate-600">
                      <ComparisonValue value={row.values[method.id]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-500">移动端可横向滑动查看完整矩阵。</p>
      </div>
    </section>
  );
}

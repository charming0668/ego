import MathText from "@/components/math-text";
import SectionHeading from "@/components/sections/section-heading";
import { comparisonRows, methods } from "@/content/site-data";

export default function ComparisonTable() {
  return (
    <section id="comparison" className="scroll-mt-20 border-y border-blue-100 bg-blue-50/60 py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="五种方法多维对比"
          description="系统比较各方法在输入视角、坐标系定义、动作空间表征、训练目标及人机衔接策略上的异同。"
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
                      <MathText value={row.values[method.id] ?? "未给出"} />
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

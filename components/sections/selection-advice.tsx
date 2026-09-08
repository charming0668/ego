import SectionHeading from "@/components/sections/section-heading";
import { selectionAdvice } from "@/content/site-data";

export default function SelectionAdvice() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="按迁移目标选择路径"
          description="先确定机器人本体、动作表示与数据规模，再选择最接近的训练范式。"
        />
        <div className="mt-8 grid border-y border-slate-200 md:grid-cols-2">
          {selectionAdvice.map((item, index) => (
            <article
              key={item.title}
              className={`py-5 md:p-6 ${index % 2 === 0 ? "md:border-r md:border-slate-200" : ""} ${index < selectionAdvice.length - 2 ? "border-b border-slate-200" : ""}`}
            >
              <h3 className="font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.recommendation}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

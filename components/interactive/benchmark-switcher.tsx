"use client";

import { useState } from "react";

import FigureGallery from "@/components/interactive/figure-gallery";
import SectionHeading from "@/components/sections/section-heading";
import { benchmarks } from "@/content/site-data";
import { cn } from "@/lib/utils";

export default function BenchmarkSwitcher() {
  const [activeIndex, setActiveIndex] = useState(0);
  const benchmark = benchmarks[activeIndex];

  return (
    <section id="benchmarks" className="scroll-mt-20 border-b border-slate-200 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="从单臂标尺到双臂迁移"
          description="LIBERO 适合标准化对标，RoboTwin 2.0 更接近双臂协作与 Sim-to-Real。"
        />

        <div className="mt-8 inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1" role="tablist">
          {benchmarks.map((item, index) => (
            <button
              key={item.id}
              id={`benchmark-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls="benchmark-panel"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700",
                index === activeIndex
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-950",
              )}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div
          id="benchmark-panel"
          role="tabpanel"
          aria-labelledby={`benchmark-tab-${activeIndex}`}
          className="mt-5 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"
        >
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-7">
            <h3 className="text-3xl font-semibold tracking-[-0.035em] text-slate-950">
              {benchmark.name}
            </h3>
            <p className="mt-3 text-base leading-7 text-slate-600">
              {benchmark.positioning}
            </p>
            <div className="mt-7 space-y-6">
              {[
                ["环境与输入", benchmark.setup],
                ["任务组成", benchmark.tasks],
                ["评测指标", benchmark.metrics],
              ].map(([title, items]) => (
                <div key={title as string}>
                  <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                    {(items as string[]).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <FigureGallery figureIds={benchmark.figures} label={benchmark.name} />
        </div>
      </div>
    </section>
  );
}

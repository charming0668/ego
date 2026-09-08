"use client";

import { useState } from "react";
import { Robot, Cube, Gauge } from "@phosphor-icons/react";

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
          <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-7 shadow-xs">
            <div>
              <span className="inline-flex items-center rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {benchmark.badge}
              </span>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-slate-950">
                {benchmark.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                {benchmark.positioning}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs">
              {benchmark.stats.map((stat) => (
                <div key={stat.label} className="text-center px-1">
                  <div className="text-xs font-medium text-slate-500">{stat.label}</div>
                  <div className="mt-1 text-xs sm:text-sm font-semibold text-slate-900 truncate" title={stat.value}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3.5">
              <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <span className="flex size-6 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                    <Robot size={15} weight="bold" />
                  </span>
                  仿真环境与输入
                </div>
                <ul className="mt-2.5 space-y-1.5 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {benchmark.setup.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-700" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <span className="flex size-6 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                    <Cube size={15} weight="bold" />
                  </span>
                  任务与资产库
                </div>
                <ul className="mt-2.5 space-y-1.5 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {benchmark.tasks.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-700" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <span className="flex size-6 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                    <Gauge size={15} weight="bold" />
                  </span>
                  评测机制与指标
                </div>
                <ul className="mt-2.5 space-y-1.5 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {benchmark.metrics.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-700" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <FigureGallery figureIds={benchmark.figures} label={benchmark.name} />
        </div>
      </div>
    </section>
  );
}

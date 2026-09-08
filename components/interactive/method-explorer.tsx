"use client";

import { useState } from "react";
import katex from "katex";

import FigureGallery from "@/components/interactive/figure-gallery";
import MathText from "@/components/math-text";
import SectionHeading from "@/components/sections/section-heading";
import { methods } from "@/content/site-data";
import { cn } from "@/lib/utils";

function renderFormula(value: string) {
  return katex.renderToString(value, {
    displayMode: true,
    throwOnError: false,
    strict: false,
  });
}

export default function MethodExplorer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const method = methods[activeIndex];

  const selectTab = (index: number) => setActiveIndex(index);

  return (
    <section id="methods" className="scroll-mt-20 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="五种方法，一条人机迁移主线"
          description="切换方法，比较数据规模、动作空间、坐标系和人机衔接方式。"
        />

        <div
          className="mt-8 flex gap-2 overflow-x-auto pb-2"
          role="tablist"
          aria-label="Ego-VLA 方法"
          onKeyDown={(event) => {
            const next =
              event.key === "ArrowRight"
                ? (activeIndex + 1) % methods.length
                : event.key === "ArrowLeft"
                  ? (activeIndex + methods.length - 1) % methods.length
                  : event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? methods.length - 1
                      : null;
            if (next !== null) {
              event.preventDefault();
              selectTab(next);
              document.getElementById(`method-tab-${next}`)?.focus();
            }
          }}
        >
          {methods.map((item, index) => (
            <button
              key={item.id}
              id={`method-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls="method-panel"
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => selectTab(index)}
              className={cn(
                "rounded-xl border px-4 py-2.5 text-sm font-semibold whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 active:translate-y-px",
                index === activeIndex
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-slate-950",
              )}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div
          id="method-panel"
          role="tabpanel"
          aria-labelledby={`method-tab-${activeIndex}`}
          className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.06)]"
        >
          {/* 1. Header Bar: Title, Summary and Key Metrics */}
          <div className="border-b border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-3xl font-semibold tracking-[-0.035em] text-slate-950">
                  {method.name}
                </h3>
                <p className="mt-2 max-w-3xl text-base leading-relaxed text-slate-600">
                  {method.summary}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                {method.keyNumbers.map((number) => (
                  <span
                    key={number}
                    className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    {number}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Main Hero Protagonist Area: Full-Width Figure Gallery */}
          <div className="border-b border-slate-200 bg-slate-50/60 p-4 sm:p-6 lg:p-8">
            <FigureGallery figureIds={method.figures} label={method.name} />
          </div>

          {/* 3. Supporting Specification Dashboard: 3 Structured Columns */}
          <div className="p-6 sm:p-8">
            <div className="grid gap-5 md:grid-cols-3">
              {/* Action space */}
              <div className="flex flex-col justify-between rounded-xl border border-blue-100 bg-blue-50/50 p-5 shadow-2xs">
                <span className="text-xs font-semibold text-blue-700">
                  动作空间 (Action Space)
                </span>
                <div className="mt-3 overflow-x-auto rounded-lg border border-blue-200/60 bg-white p-3.5 text-blue-950 shadow-xs">
                  <MathText value={method.actionSpace} />
                </div>
              </div>

              {/* 坐标系与机器人衔接 */}
              <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-3.5">
                <div>
                  <span className="text-xs font-semibold text-slate-500">
                    坐标系定义
                  </span>
                  <div className="mt-1.5 text-sm leading-relaxed text-slate-800">
                    <MathText value={method.coordinateFrame} />
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <span className="text-xs font-semibold text-slate-500">
                    机器人衔接策略
                  </span>
                  <div className="mt-1.5 text-sm leading-relaxed text-slate-800">
                    {method.deployment}
                  </div>
                </div>
              </div>

              {/* 核心公式 */}
              <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs">
                <span className="text-xs font-semibold text-slate-500">
                  核心训练目标 / 公式
                </span>
                <div className="mt-3 space-y-2">
                  {method.formulas.map((formula) => (
                    <div
                      key={formula}
                      className="overflow-x-auto rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-slate-900"
                      dangerouslySetInnerHTML={{ __html: renderFormula(formula) }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Foldable details */}
            <details className="group mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <summary className="cursor-pointer font-semibold text-slate-900 marker:text-blue-700">
                展开数据规模与训练细节
              </summary>
              <div className="mt-4 grid gap-5 text-sm leading-6 text-slate-600 sm:grid-cols-2">
                <div>
                  <p className="font-semibold text-slate-900">数据规模与来源</p>
                  <ul className="mt-2 space-y-2">
                    {method.data.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-700" />
                        <span><MathText value={item} /></span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">训练策略与架构</p>
                  <ul className="mt-2 space-y-2">
                    {method.training.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-700" />
                        <span><MathText value={item} /></span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {method.caveats.length ? (
                <p className="mt-4 border-t border-slate-200 pt-4 text-sm leading-6 text-slate-500">
                  {method.caveats.join(" ")}
                </p>
              ) : null}
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}

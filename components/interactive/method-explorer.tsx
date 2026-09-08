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
          <div className="grid divide-y divide-slate-200 lg:grid-cols-[0.84fr_1.16fr] lg:divide-x lg:divide-y-0">
            <div className="p-5 sm:p-7 lg:p-8">
              <h3 className="text-3xl font-semibold tracking-[-0.035em] text-slate-950">
                {method.name}
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-600">{method.summary}</p>

              <dl className="mt-7 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200 py-4">
                {method.keyNumbers.map((number) => (
                  <div key={number} className="px-3 first:pl-0 last:pr-0">
                    <dt className="sr-only">关键指标</dt>
                    <dd className="text-sm font-semibold text-slate-900 sm:text-base">
                      {number}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7 space-y-6">
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-900">Action space</p>
                  <div
                    className="overflow-x-auto rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2 text-blue-900"
                  >
                    <MathText value={method.actionSpace} />
                  </div>
                </div>
                {method.formulas.length ? (
                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-900">核心公式</p>
                    <div className="grid gap-2.5">
                      {method.formulas.map((formula) => (
                        <div
                          key={formula}
                          className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900"
                          dangerouslySetInnerHTML={{ __html: renderFormula(formula) }}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">坐标系</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      <MathText value={method.coordinateFrame} />
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">机器人衔接</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {method.deployment}
                    </p>
                  </div>
                </div>

                <details className="group rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <summary className="cursor-pointer font-semibold text-slate-900 marker:text-blue-700">
                    展开数据与训练细节
                  </summary>
                  <div className="mt-4 grid gap-5 text-sm leading-6 text-slate-600 sm:grid-cols-2">
                    <div>
                      <p className="font-semibold text-slate-900">数据</p>
                      <ul className="mt-2 space-y-2">
                        {method.data.map((item, index) => (
                          <li key={index}>
                            <MathText value={item} />
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">训练</p>
                      <ul className="mt-2 space-y-2">
                        {method.training.map((item, index) => (
                          <li key={index}>
                            <MathText value={item} />
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

            <div className="bg-slate-50 p-4 sm:p-6 lg:p-8">
              <FigureGallery figureIds={method.figures} label={method.name} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

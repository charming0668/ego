"use client";

import { useState } from "react";
import katex from "katex";
import { Lightbulb, Info, CaretRight } from "@phosphor-icons/react";

import MathText from "@/components/math-text";
import type { FormulaExplanation } from "@/content/site-data";
import { cn } from "@/lib/utils";

type FormulaCardProps = {
  formulas: string[];
  explanation?: FormulaExplanation;
};

type PresentationMode = "inline" | "tooltip" | "drawer";

function renderDisplayFormula(formula: string) {
  return katex.renderToString(formula, {
    displayMode: true,
    throwOnError: false,
    strict: false,
  });
}

export default function FormulaCard({
  formulas,
  explanation,
}: FormulaCardProps) {
  const [mode, setMode] = useState<PresentationMode>("inline");
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs">
      {/* Header & Style Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <span className="text-xs font-semibold text-slate-500">
          核心训练目标 / 公式
        </span>

        {/* Mode Switcher for the User to Compare All 3 Presentation Styles */}
        {explanation && (
          <div className="inline-flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => setMode("inline")}
              className={cn(
                "rounded px-2 py-0.5 font-medium transition-colors",
                mode === "inline"
                  ? "bg-white font-semibold text-blue-700 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800",
              )}
              title="方式 A：直出直觉与变量拆解（推荐）"
            >
              方式 A：直出
            </button>
            <button
              type="button"
              onClick={() => setMode("tooltip")}
              className={cn(
                "rounded px-2 py-0.5 font-medium transition-colors",
                mode === "tooltip"
                  ? "bg-white font-semibold text-blue-700 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800",
              )}
              title="方式 B：交互悬停气泡"
            >
              方式 B：气泡
            </button>
            <button
              type="button"
              onClick={() => setMode("drawer")}
              className={cn(
                "rounded px-2 py-0.5 font-medium transition-colors",
                mode === "drawer"
                  ? "bg-white font-semibold text-blue-700 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800",
              )}
              title="方式 C：折叠抽屉"
            >
              方式 C：抽屉
            </button>
          </div>
        )}
      </div>

      {/* Formulas List */}
      <div className="mt-3 space-y-2">
        {formulas.map((formula) => (
          <div
            key={formula}
            className="overflow-x-auto rounded-lg border border-slate-200/80 bg-slate-50 px-3.5 py-2 text-slate-950"
            dangerouslySetInnerHTML={{ __html: renderDisplayFormula(formula) }}
          />
        ))}
      </div>

      {/* Explanation Area according to Selected Mode */}
      {explanation && (
        <div className="mt-3">
          {/* 方式 A：直出式精炼拆解 (Inline Intuition & Pills) */}
          {mode === "inline" && (
            <div className="space-y-2.5">
              <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/70 p-2.5 text-xs text-blue-950">
                <Lightbulb size={16} className="mt-0.5 shrink-0 text-blue-700" weight="fill" />
                <p className="leading-relaxed">
                  <span className="font-semibold text-blue-900">物理直觉：</span>
                  {explanation.intuition}
                </p>
              </div>
              <div className="space-y-1.5">
                {explanation.variables.map((v, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50/70 p-2 text-xs leading-relaxed text-slate-800"
                  >
                    <span className="shrink-0 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono font-medium text-slate-950">
                      <MathText value={[{ math: v.symbol }]} />
                    </span>
                    <div>
                      <span className="font-semibold text-slate-900">{v.meaning}</span>
                      <span className="text-slate-600"> · {v.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 方式 B：交互悬停气泡 (Interactive Tooltip Badges) */}
          {mode === "tooltip" && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Info size={14} className="text-blue-700" />
                <span>鼠标悬停符号查看变量含义与物理设计：</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {explanation.variables.map((v, i) => (
                  <div key={i} className="group relative">
                    <button
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === i ? null : i)}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-800 transition-colors hover:border-blue-400 hover:bg-blue-50/60 hover:text-blue-700"
                    >
                      <MathText value={[{ math: v.symbol }]} />
                      <span className="text-[10px] text-slate-400">ⓘ</span>
                    </button>
                    {/* Floating Tooltip */}
                    <div
                      className={cn(
                        "pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-60 -translate-x-1/2 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-100 opacity-0 shadow-xl transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-100",
                        activeTooltip === i && "pointer-events-auto opacity-100",
                      )}
                    >
                      <div className="font-semibold text-white">{v.meaning}</div>
                      <div className="mt-1 text-[11px] leading-relaxed text-slate-300">
                        {v.detail}
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="rounded-lg bg-slate-50 p-2 text-xs leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-800">💡 物理直觉：</span>
                {explanation.intuition}
              </p>
            </div>
          )}

          {/* 方式 C：内嵌式折叠抽屉 (Expandable Drawer) */}
          {mode === "drawer" && (
            <details className="group rounded-lg border border-slate-200/80 bg-slate-50 p-3 text-xs">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-700 transition-colors hover:text-blue-700">
                <span>查看公式物理含义与变量拆解</span>
                <CaretRight
                  size={14}
                  className="text-slate-400 transition-transform group-open:rotate-90"
                />
              </summary>
              <div className="mt-3 space-y-2 border-t border-slate-200/80 pt-2.5">
                <div className="rounded border border-blue-100 bg-blue-50/70 p-2 text-blue-950">
                  <span className="font-semibold text-blue-900">物理直觉：</span>
                  {explanation.intuition}
                </div>
                <div className="space-y-1.5 pt-0.5">
                  {explanation.variables.map((v, i) => (
                    <div key={i} className="flex items-start gap-1.5 leading-relaxed text-slate-700">
                      <span className="shrink-0 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-slate-900">
                        <MathText value={[{ math: v.symbol }]} />
                      </span>
                      <div>
                        <span className="font-semibold text-slate-900">{v.meaning}：</span>
                        <span className="text-slate-600">{v.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

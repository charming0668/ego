"use client";

import katex from "katex";
import { CaretRight } from "@phosphor-icons/react";

import MathText from "@/components/math-text";
import type { FormulaExplanation } from "@/content/site-data";

type FormulaCardProps = {
  formulas: string[];
  explanation?: FormulaExplanation;
};

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
  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs">
      {/* Header */}
      <div className="border-b border-slate-100 pb-2.5">
        <span className="text-xs font-semibold text-slate-500">
          核心训练目标 / 公式
        </span>
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

      {/* Explanation Drawer */}
      {explanation && (
        <details className="group mt-3 rounded-lg border border-slate-200/80 bg-slate-50 p-3 text-xs">
          <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-700 transition-colors hover:text-blue-700">
            <span>查看公式物理含义与变量拆解</span>
            <CaretRight
              size={14}
              className="text-slate-400 transition-transform group-open:rotate-90"
            />
          </summary>
          <div className="mt-3 space-y-2.5 border-t border-slate-200/80 pt-2.5">
            <div className="rounded-md border border-blue-100 bg-blue-50/70 p-2.5 text-blue-950">
              <span className="font-semibold text-blue-900">💡 物理直觉：</span>
              {explanation.intuition}
            </div>
            <div className="space-y-1.5 pt-0.5">
              {explanation.variables.map((v, i) => (
                <div key={i} className="flex items-start gap-2 leading-relaxed text-slate-700">
                  <span className="shrink-0 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono font-medium text-slate-950">
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
  );
}

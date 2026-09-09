"use client";

import { useState, type ComponentType } from "react";
import {
  Table,
  Columns,
  SquaresFour,
  ArrowsLeftRight,
  Camera,
  ChatText,
  Crosshair,
  Lightning,
  Cpu,
  Robot,
  type IconProps,
} from "@phosphor-icons/react";

import MathText from "@/components/math-text";
import SectionHeading from "@/components/sections/section-heading";
import { comparisonRows, methods } from "@/content/site-data";
import { cn } from "@/lib/utils";

type ViewMode = "matrix" | "diff" | "cards";

const methodTags: Record<string, string> = {
  egovla: "端到端加权回归",
  hrdt: "Flow 换头微调",
  egohumanoid: "视角动作对齐共训",
  qwen: "80-D 统一槽位",
  egoscale: "三阶段相对腕表示",
};

const dimensionIcons: Record<string, ComponentType<IconProps>> = {
  "ego 相机": Camera,
  语言: ChatText,
  "action 坐标系": Crosshair,
  "action shape": Lightning,
  训练目标: Cpu,
  人机衔接: Robot,
};

function renderDimensionCell(dimension: string, value: any) {
  if (dimension === "训练目标") {
    const textValue = typeof value === "string" ? value : "";
    const isFlow = textValue.toLowerCase().includes("flow");
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold",
          isFlow
            ? "border-blue-200 bg-blue-50 text-blue-700"
            : "border-slate-200 bg-slate-100 text-slate-700",
        )}
      >
        <MathText value={value} />
      </span>
    );
  }

  if (dimension === "action shape") {
    return (
      <span className="inline-block rounded-md border border-slate-200/80 bg-slate-50 px-2 py-1 font-mono text-xs text-slate-900">
        <MathText value={value} />
      </span>
    );
  }

  return <MathText value={value ?? "未给出"} />;
}

export default function ComparisonTable() {
  const [viewMode, setViewMode] = useState<ViewMode>("matrix");
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);

  // State for 1v1 Diff View
  const [diffModelA, setDiffModelA] = useState<string>("egovla");
  const [diffModelB, setDiffModelB] = useState<string>("hrdt");

  // State for Cards View
  const [activeCardMethod, setActiveCardMethod] = useState<string>("egovla");

  const swapDiffModels = () => {
    setDiffModelA(diffModelB);
    setDiffModelB(diffModelA);
  };

  return (
    <section id="comparison" className="scroll-mt-20 border-y border-blue-100 bg-blue-50/60 py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            title="五种方法多维对比"
            description="系统比较各方法在输入视角、坐标系定义、动作空间表征、训练目标及人机衔接策略上的异同。"
          />

          {/* 大厂级 3 种视觉模式切换器 */}
          <div className="inline-flex shrink-0 items-center rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode("matrix")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                viewMode === "matrix"
                  ? "bg-blue-700 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-950",
              )}
            >
              <Table size={15} weight={viewMode === "matrix" ? "bold" : "regular"} />
              全景矩阵
            </button>

            <button
              type="button"
              onClick={() => setViewMode("diff")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                viewMode === "diff"
                  ? "bg-blue-700 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-950",
              )}
            >
              <Columns size={15} weight={viewMode === "diff" ? "bold" : "regular"} />
              1v1 对比
            </button>

            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                viewMode === "cards"
                  ? "bg-blue-700 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-950",
              )}
            >
              <SquaresFour size={15} weight={viewMode === "cards" ? "bold" : "regular"} />
              参数看板
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 模式一：全景高亮矩阵 (Linear / Stripe 风格：十字高亮 + 语义徽章 + 吸附首列) */}
        {/* ========================================================================= */}
        {viewMode === "matrix" && (
          <div className="mt-8">
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(29,78,216,0.06)]">
              <table className="w-full min-w-[1060px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/90">
                    <th className="sticky left-0 z-20 min-w-40 bg-slate-50 px-5 py-4.5 font-semibold text-slate-800 shadow-[2px_0_8px_-2px_rgba(0,0,0,0.06)]">
                      对照维度
                    </th>
                    {methods.map((method) => {
                      const isHovered = hoveredCol === method.id;
                      return (
                        <th
                          key={method.id}
                          onMouseEnter={() => setHoveredCol(method.id)}
                          onMouseLeave={() => setHoveredCol(null)}
                          className={cn(
                            "min-w-48 px-5 py-4.5 transition-colors cursor-pointer",
                            isHovered ? "bg-blue-50/80 text-blue-900" : "text-slate-950",
                          )}
                        >
                          <div className="font-semibold text-base">{method.name}</div>
                          <div className="mt-1 text-xs font-normal text-slate-500">
                            {methodTags[method.id]}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonRows.map((row) => {
                    const Icon = dimensionIcons[row.dimension] ?? Table;
                    return (
                      <tr key={row.dimension} className="group/row transition-colors hover:bg-slate-50/60">
                        <th className="sticky left-0 z-10 bg-white px-5 py-4 font-semibold text-slate-800 shadow-[2px_0_8px_-2px_rgba(0,0,0,0.06)] group-hover/row:bg-slate-50/90">
                          <div className="flex items-center gap-2">
                            <Icon size={16} className="text-blue-700 shrink-0" />
                            <span>{row.dimension}</span>
                          </div>
                        </th>
                        {methods.map((method) => {
                          const isHovered = hoveredCol === method.id;
                          return (
                            <td
                              key={method.id}
                              onMouseEnter={() => setHoveredCol(method.id)}
                              onMouseLeave={() => setHoveredCol(null)}
                              className={cn(
                                "px-5 py-4 leading-6 text-slate-700 transition-colors",
                                isHovered && "bg-blue-50/60 font-medium text-slate-950",
                              )}
                            >
                              {renderDimensionCell(row.dimension, row.values[method.id])}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">提示：鼠标悬停在列或行上可高亮十字聚焦；移动端支持横向平滑滑动。</p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 模式二：1v1 深度对比 (GitHub Diff / Apple 机型对比风格) */}
        {/* ========================================================================= */}
        {viewMode === "diff" && (
          <div className="mt-8 space-y-6">
            {/* Model Selection Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex flex-1 flex-wrap items-center gap-3 min-w-[280px]">
                <span className="text-xs font-semibold text-slate-500">对比模型 A:</span>
                <select
                  value={diffModelA}
                  onChange={(e) => setDiffModelA(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-900 focus:border-blue-700 focus:outline-none"
                >
                  {methods.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({methodTags[m.id]})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={swapDiffModels}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 active:translate-y-px transition-colors"
                title="交换位置"
              >
                <ArrowsLeftRight size={15} />
                交换对比
              </button>

              <div className="flex flex-1 flex-wrap items-center justify-end gap-3 min-w-[280px]">
                <span className="text-xs font-semibold text-slate-500">对比模型 B:</span>
                <select
                  value={diffModelB}
                  onChange={(e) => setDiffModelB(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-900 focus:border-blue-700 focus:outline-none"
                >
                  {methods.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({methodTags[m.id]})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Side-by-Side Dimension Cards */}
            <div className="grid gap-4">
              {comparisonRows.map((row) => {
                const Icon = dimensionIcons[row.dimension] ?? Table;
                const valA = row.values[diffModelA];
                const valB = row.values[diffModelB];
                const isDifferent = JSON.stringify(valA) !== JSON.stringify(valB);

                return (
                  <div
                    key={row.dimension}
                    className={cn(
                      "rounded-2xl border bg-white p-5 shadow-xs transition-shadow",
                      isDifferent ? "border-slate-200" : "border-slate-200/80 bg-slate-50/40",
                    )}
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <span className="flex size-6 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                          <Icon size={15} weight="bold" />
                        </span>
                        {row.dimension}
                      </div>
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-xs font-medium",
                          isDifferent
                            ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                            : "bg-slate-100 text-slate-500",
                        )}
                      >
                        {isDifferent ? "存在差异" : "特性一致"}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:divide-x sm:divide-slate-100">
                      {/* Model A Spec */}
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-slate-400">
                          {methods.find((m) => m.id === diffModelA)?.name}
                        </div>
                        <div className="text-sm leading-relaxed text-slate-800">
                          {renderDimensionCell(row.dimension, valA)}
                        </div>
                      </div>

                      {/* Model B Spec */}
                      <div className="space-y-1 sm:pl-4">
                        <div className="text-xs font-medium text-slate-400">
                          {methods.find((m) => m.id === diffModelB)?.name}
                        </div>
                        <div className="text-sm leading-relaxed text-slate-800">
                          {renderDimensionCell(row.dimension, valB)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 模式三：模块化参数看板 (Vercel Bento 风格：选项卡切换 + 6大维度独立卡片) */}
        {/* ========================================================================= */}
        {viewMode === "cards" && (
          <div className="mt-8 space-y-6">
            {/* Method Pill Selector */}
            <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
              {methods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setActiveCardMethod(method.id)}
                  className={cn(
                    "rounded-xl border px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors",
                    activeCardMethod === method.id
                      ? "border-blue-700 bg-blue-700 text-white shadow-xs"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-slate-950",
                  )}
                >
                  {method.name}
                </button>
              ))}
            </div>

            {/* Method Spec Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {comparisonRows.map((row) => {
                const Icon = dimensionIcons[row.dimension] ?? Table;
                const cellValue = row.values[activeCardMethod];
                return (
                  <div
                    key={row.dimension}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <span className="flex size-6 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                        <Icon size={14} weight="bold" />
                      </span>
                      {row.dimension}
                    </div>
                    <div className="mt-4 text-sm leading-relaxed text-slate-900">
                      {renderDimensionCell(row.dimension, cellValue)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

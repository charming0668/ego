"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowsOut, X } from "@phosphor-icons/react";

import { figures } from "@/content/site-data";
import { cn, withBasePath } from "@/lib/utils";

type FigureGalleryProps = {
  figureIds: string[];
  label: string;
};

type GalleryMode = "fixed-height" | "fixed-ratio" | "smooth-height";

export default function FigureGallery({ figureIds, label }: FigureGalleryProps) {
  const available = figureIds
    .map((id) => figures.find((figure) => figure.id === id))
    .filter((figure): figure is NonNullable<typeof figure> => Boolean(figure));
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<GalleryMode>("fixed-height");
  const [smoothHeight, setSmoothHeight] = useState<number | undefined>(undefined);
  const contentRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const active = available[activeIndex] ?? available[0];
  const figureKey = figureIds.join(":");

  useEffect(() => {
    setActiveIndex(0);
  }, [figureKey]);

  useEffect(() => {
    if (mode !== "smooth-height" || !contentRef.current) return;
    const update = () => {
      if (contentRef.current) {
        setSmoothHeight(contentRef.current.offsetHeight);
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [mode, active.id]);

  if (!active) {
    return (
      <div className="grid min-h-72 place-items-center rounded-2xl border border-slate-200 bg-slate-100 text-sm text-slate-500">
        暂无可用图像
      </div>
    );
  }

  return (
    <div>
      {/* Mode Switcher */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-100/70 p-1 text-xs">
          <span className="hidden px-2 text-slate-500 sm:inline">防跳动模式:</span>
          <button
            type="button"
            onClick={() => setMode("fixed-height")}
            className={cn(
              "rounded-lg px-2.5 py-1 font-medium transition-colors",
              mode === "fixed-height"
                ? "bg-white font-semibold text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900",
            )}
          >
            方案一：锁定高度 (推荐)
          </button>
          <button
            type="button"
            onClick={() => setMode("fixed-ratio")}
            className={cn(
              "rounded-lg px-2.5 py-1 font-medium transition-colors",
              mode === "fixed-ratio"
                ? "bg-white font-semibold text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900",
            )}
          >
            方案二：16:9 比例
          </button>
          <button
            type="button"
            onClick={() => setMode("smooth-height")}
            className={cn(
              "rounded-lg px-2.5 py-1 font-medium transition-colors",
              mode === "smooth-height"
                ? "bg-white font-semibold text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900",
            )}
          >
            方案三：平滑缓动
          </button>
        </div>
      </div>

      <div
        style={mode === "smooth-height" && smoothHeight ? { height: smoothHeight } : undefined}
        className={cn(
          "group relative flex items-center justify-center overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-[height] duration-300 ease-out",
          mode === "fixed-height" && "h-[360px] sm:h-[520px] lg:h-[600px] w-full p-3 sm:p-4",
          mode === "fixed-ratio" && "aspect-[16/9] w-full max-h-[700px] p-3 sm:p-4",
          mode === "smooth-height" && "w-full p-3 sm:p-4",
        )}
      >
        <div ref={contentRef} className="flex h-full w-full items-center justify-center">
          <Image
            key={active.id}
            src={withBasePath(active.src)}
            alt={active.alt}
            width={1800}
            height={1080}
            priority
            sizes="(max-width: 768px) 100vw, 95vw"
            unoptimized={active.src.endsWith(".gif") || active.src.endsWith(".svg")}
            className={cn(
              "object-contain",
              mode === "fixed-height" && "h-full w-full",
              mode === "fixed-ratio" && "h-full w-full",
              mode === "smooth-height" && "h-auto max-h-[720px] w-full",
            )}
          />
        </div>
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/95 px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-md backdrop-blur hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 active:translate-y-px"
          aria-label={`放大查看${active.caption}`}
        >
          <ArrowsOut size={16} aria-hidden="true" />
          放大
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-base font-semibold text-slate-900">{active.caption}</p>
          {active.source ? (
            <p className="mt-0.5 text-xs text-slate-500">外部补充图，来源见资料列表。</p>
          ) : null}
        </div>
        {available.length > 1 ? (
          <div className="flex flex-wrap items-center gap-2" aria-label={`${label}图集`}>
            <span className="text-xs font-medium text-slate-400 mr-1">切换图解:</span>
            {available.map((figure, index) => (
              <button
                key={figure.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "min-w-8 h-8 px-2.5 rounded-lg border text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 active:translate-y-px transition-colors",
                  activeIndex === index
                    ? "border-blue-700 bg-blue-700 text-white shadow-xs"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-slate-950",
                )}
                aria-label={`查看${figure.caption}`}
                aria-pressed={activeIndex === index}
              >
                {index + 1}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <dialog
        ref={dialogRef}
        className="m-auto max-h-[92dvh] w-[min(94vw,1440px)] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl backdrop:bg-slate-950/70"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        <div className="flex items-center justify-between gap-4 px-2 pb-3">
          <p className="font-semibold text-slate-900">{active.caption}</p>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-blue-700"
            aria-label="关闭大图"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="overflow-auto rounded-xl bg-slate-50 p-2">
          <Image
            src={withBasePath(active.src)}
            alt={active.alt}
            width={1800}
            height={1080}
            sizes="90vw"
            unoptimized={active.src.endsWith(".gif") || active.src.endsWith(".svg")}
            className="h-auto max-h-[82dvh] w-full object-contain"
          />
        </div>
      </dialog>
    </div>
  );
}

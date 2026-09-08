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

export default function FigureGallery({ figureIds, label }: FigureGalleryProps) {
  const available = figureIds
    .map((id) => figures.find((figure) => figure.id === id))
    .filter((figure): figure is NonNullable<typeof figure> => Boolean(figure));
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const active = available[activeIndex] ?? available[0];
  const figureKey = figureIds.join(":");

  useEffect(() => {
    setActiveIndex(0);
  }, [figureKey]);

  if (!active) {
    return (
      <div className="grid min-h-72 place-items-center rounded-2xl border border-slate-200 bg-slate-100 text-sm text-slate-500">
        暂无可用图像
      </div>
    );
  }

  return (
    <div>
      <div className="group relative flex min-h-[320px] sm:min-h-[420px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-4 shadow-xs">
        <Image
          key={active.id}
          src={withBasePath(active.src)}
          alt={active.alt}
          width={1800}
          height={1080}
          priority
          sizes="(max-width: 768px) 100vw, 95vw"
          unoptimized={active.src.endsWith(".gif") || active.src.endsWith(".svg")}
          className="h-auto max-h-[720px] w-full object-contain"
        />
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

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowsOut, X } from "@phosphor-icons/react";

import { figures } from "@/content/site-data";
import { cn } from "@/lib/utils";

type FigureGalleryProps = {
  figureIds: string[];
  label: string;
};

export default function FigureGallery({ figureIds, label }: FigureGalleryProps) {
  const available = figureIds
    .map((id) => figures.find((figure) => figure.id === id))
    .filter((figure): figure is NonNullable<typeof figure> => Boolean(figure));
  const [activeIndex, setActiveIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const active = available[activeIndex] ?? available[0];
  const figureKey = figureIds.join(":");

  useEffect(() => {
    setActiveIndex(0);
    setLoaded(false);
    setFailed(false);
  }, [figureKey]);

  if (!active) {
    return (
      <div className="grid min-h-72 place-items-center rounded-2xl border border-slate-200 bg-slate-100 text-sm text-slate-500">
        暂无可用图像
      </div>
    );
  }

  const selectFigure = (index: number) => {
    setLoaded(false);
    setFailed(false);
    setActiveIndex(index);
  };

  const image = (
    <Image
      src={active.src}
      alt={active.alt}
      width={1800}
      height={1080}
      sizes="(max-width: 768px) 100vw, 58vw"
      unoptimized={active.src.endsWith(".gif")}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={cn(
        "h-auto max-h-[70dvh] w-full object-contain transition-opacity",
        loaded ? "opacity-100" : "opacity-0",
      )}
    />
  );

  return (
    <div>
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {!loaded && !failed ? (
          <div className="absolute inset-0 animate-pulse bg-slate-100 motion-reduce:animate-none" />
        ) : null}
        {failed ? (
          <div className="grid min-h-72 place-items-center px-6 text-center text-sm text-slate-500">
            图像加载失败，请稍后刷新页面。
          </div>
        ) : (
          image
        )}
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          className="absolute right-3 bottom-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 active:translate-y-px"
          aria-label={`放大查看${active.caption}`}
        >
          <ArrowsOut size={16} aria-hidden="true" />
          放大
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-800">{active.caption}</p>
          {active.source ? (
            <p className="mt-1 text-xs text-slate-500">外部补充图，来源见资料列表。</p>
          ) : null}
        </div>
        {available.length > 1 ? (
          <div className="flex flex-wrap justify-end gap-2" aria-label={`${label}图集`}>
            {available.map((figure, index) => (
              <button
                key={figure.id}
                type="button"
                onClick={() => selectFigure(index)}
                className={cn(
                  "size-8 rounded-lg border text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700",
                  activeIndex === index
                    ? "border-blue-700 bg-blue-700 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300",
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
        <div className="overflow-auto rounded-xl bg-slate-50">{image}</div>
      </dialog>
    </div>
  );
}

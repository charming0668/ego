"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  X,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  ArrowsCounterClockwise,
} from "@phosphor-icons/react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);

  const active = available[activeIndex] ?? available[0];
  const figureKey = figureIds.join(":");

  useEffect(() => {
    setActiveIndex(0);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [figureKey]);

  const resetView = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const openModal = () => {
    resetView();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetView();
  };

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 0.87;
      setZoom((prev) => {
        const next = Math.min(Math.max(prev * factor, 0.5), 5);
        return Number(next.toFixed(2));
      });
    };
    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  if (!active) {
    return (
      <div className="grid min-h-72 place-items-center rounded-2xl border border-slate-200 bg-slate-100 text-sm text-slate-500">
        暂无可用图像
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={openModal}
        className="group relative flex h-[360px] sm:h-[520px] lg:h-[600px] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-4 shadow-xs transition-colors hover:border-blue-400"
        title="点击查看大图（支持滚轮缩放与拖拽）"
      >
        <Image
          key={active.id}
          src={withBasePath(active.src)}
          alt={active.alt}
          width={1800}
          height={1080}
          priority
          sizes="(max-width: 768px) 100vw, 95vw"
          unoptimized={active.src.endsWith(".gif") || active.src.endsWith(".svg")}
          className="pointer-events-none h-full w-full select-none object-contain"
        />
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

      {/* Lightbox Modal with Zoom & Pan */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-slate-950/85 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          {/* Top Controls Bar */}
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-slate-900/80 px-4 py-3 text-white backdrop-blur sm:px-6">
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold tracking-tight sm:text-base">
                {active.caption}
              </p>
              <span className="hidden rounded-md bg-white/10 px-2 py-0.5 text-xs text-slate-300 md:inline">
                支持滚轮缩放 · 拖拽平移 · 双击重置
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-white/15 bg-white/10 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.max(Number((prev - 0.25).toFixed(2)), 0.5))}
                  className="rounded p-1 text-slate-300 hover:bg-white/15 hover:text-white"
                  title="缩小 (或向下滚轮)"
                >
                  <MagnifyingGlassMinus size={16} />
                </button>
                <span className="w-12 text-center font-mono font-medium text-slate-200">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 5))}
                  className="rounded p-1 text-slate-300 hover:bg-white/15 hover:text-white"
                  title="放大 (或向上滚轮)"
                >
                  <MagnifyingGlassPlus size={16} />
                </button>
                <button
                  type="button"
                  onClick={resetView}
                  className="ml-1 border-l border-white/15 pl-1.5 pr-1 text-slate-300 hover:text-white"
                  title="重置缩放 (100%)"
                >
                  <ArrowsCounterClockwise size={15} />
                </button>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="grid size-8 place-items-center rounded-lg bg-white/10 text-slate-200 hover:bg-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-blue-400"
                aria-label="关闭预览"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Canvas viewport for wheel & pan */}
          <div
            ref={viewportRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={() => {
              if (zoom !== 1) resetView();
              else setZoom(1.8);
            }}
            className="relative flex flex-1 items-center justify-center overflow-hidden"
            style={{
              cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
            }}
          >
            <div
              className="flex items-center justify-center will-change-transform"
              style={{
                transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoom})`,
                transition: isDragging ? "none" : "transform 0.12s ease-out",
              }}
            >
              <Image
                src={withBasePath(active.src)}
                alt={active.alt}
                width={2400}
                height={1440}
                sizes="100vw"
                draggable={false}
                priority
                unoptimized={active.src.endsWith(".gif") || active.src.endsWith(".svg")}
                className="max-h-[86vh] max-w-[92vw] select-none object-contain pointer-events-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

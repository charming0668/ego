"use client";

import { useRef, useState, type ComponentType, type RefObject } from "react";
import {
  Camera,
  Crosshair,
  Hand,
  Lightning,
  type IconProps,
} from "@phosphor-icons/react";
import katex from "katex";

import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { BlurFade } from "@/components/magicui/blur-fade";
import { pipeline } from "@/content/site-data";
import { cn } from "@/lib/utils";

const icons: Array<ComponentType<IconProps>> = [Camera, Crosshair, Hand, Lightning];

export default function Pipeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLButtonElement>(null);
  const secondRef = useRef<HTMLButtonElement>(null);
  const thirdRef = useRef<HTMLButtonElement>(null);
  const fourthRef = useRef<HTMLButtonElement>(null);
  const nodeRefs: Array<RefObject<HTMLButtonElement | null>> = [
    firstRef,
    secondRef,
    thirdRef,
    fourthRef,
  ];
  const activeStep = pipeline[activeIndex];
  const formula = activeStep.formula
    ? katex.renderToString(activeStep.formula, {
        displayMode: false,
        throwOnError: false,
        strict: false,
      })
    : "";

  return (
    <section
      id="pipeline"
      className="scroll-mt-20 overflow-hidden border-b border-slate-200 bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <BlurFade inView className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
            从第一视角到动作片段
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">
            人体状态、参考坐标系与机器人控制在四个阶段中完成对齐。
          </p>
        </BlurFade>

        <div ref={containerRef} className="relative mt-10">
          <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
            {[0, 1, 2].map((index) => (
              <AnimatedBeam
                key={index}
                containerRef={containerRef}
                fromRef={nodeRefs[index]}
                toRef={nodeRefs[index + 1]}
                curvature={index % 2 === 0 ? -18 : 18}
                delay={0.2 + index * 0.2}
                pathColor="#dbeafe"
                gradientStartColor="#1d4ed8"
                gradientStopColor="#1d4ed8"
              />
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-4 md:gap-5">
            {pipeline.map((step, index) => {
              const Icon = icons[index];
              const isActive = activeIndex === index;

              return (
                <BlurFade key={step.title} inView delay={index * 0.06} className="relative z-10">
                  <button
                    ref={nodeRefs[index]}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    onKeyDown={(event) => {
                      const next =
                        event.key === "ArrowRight" || event.key === "ArrowDown"
                          ? (index + 1) % pipeline.length
                          : event.key === "ArrowLeft" || event.key === "ArrowUp"
                            ? (index + pipeline.length - 1) % pipeline.length
                            : null;
                      if (next !== null) {
                        event.preventDefault();
                        setActiveIndex(next);
                        nodeRefs[next].current?.focus();
                      }
                    }}
                    aria-pressed={isActive}
                    className={cn(
                      "flex min-h-44 w-full flex-col rounded-2xl border bg-white p-5 text-left shadow-sm motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700",
                      isActive
                        ? "border-blue-700 shadow-[0_16px_34px_-22px_rgba(29,78,216,0.55)]"
                        : "border-slate-200 hover:border-blue-300",
                    )}
                  >
                    <Icon
                      size={24}
                      weight={isActive ? "fill" : "regular"}
                      className={cn("mb-7 text-slate-400", isActive && "text-blue-700")}
                      aria-hidden="true"
                    />
                    <span className="text-lg font-semibold text-slate-950">{step.title}</span>
                    <span className="mt-2 text-sm leading-6 text-slate-600">
                      {step.description}
                    </span>
                  </button>
                </BlurFade>
              );
            })}
          </div>

          <div
            className="mt-5 grid gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:grid-cols-[1fr_auto] sm:items-center"
            role="region"
            aria-live="polite"
            aria-label="当前流程阶段"
          >
            <div>
              <p className="font-semibold text-slate-950">{activeStep.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{activeStep.description}</p>
            </div>
            <div
              className="overflow-x-auto rounded-xl bg-white px-4 py-3 text-blue-800"
              dangerouslySetInnerHTML={{ __html: formula }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

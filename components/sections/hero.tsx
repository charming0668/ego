import Image from "next/image";

import { BlurFade } from "@/components/magicui/blur-fade";

export default function Hero() {
  return (
    <section className="relative border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-20">
        <BlurFade className="max-w-2xl" duration={0.5}>
          <p className="mb-4 text-sm font-semibold text-blue-700">
            Ego data to robot action
          </p>
          <h1 className="text-4xl leading-[1.05] font-semibold tracking-[-0.045em] text-balance text-slate-950 sm:text-5xl lg:text-6xl">
            用 Ego 数据训练 VLA
          </h1>
          <p className="mt-5 max-w-[34rem] text-lg leading-8 text-slate-600">
            从第一视角像素恢复手与腕轨迹，统一为 action chunk，再映射到机器人动作。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#pipeline"
              className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold whitespace-nowrap text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 active:translate-y-px"
            >
              查看转换流程
            </a>
            <a
              href="#comparison"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold whitespace-nowrap text-slate-800 hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 active:translate-y-px"
            >
              比较五种方法
            </a>
          </div>
        </BlurFade>

        <BlurFade delay={0.08} direction="left" duration={0.55}>
          <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_24px_80px_rgba(30,64,175,0.10)]">
            <Image
              src="/media/ego-vla-figures/egovla-teaser-01.svg"
              alt="EgoVLA 从第一视角人类视频学习机器人操作的整体示意"
              width={3905}
              height={1370}
              priority
              className="h-auto w-full"
            />
          </figure>
        </BlurFade>
      </div>
    </section>
  );
}

import "./css/style.css";
import "katex/dist/katex.min.css";

import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: {
    default: "Ego-VLA Guide",
    template: "%s | Ego-VLA Guide",
  },
  description:
    "从第一人称人类数据到机器人动作，梳理五种 Ego-VLA 方法与仿真评测基准。",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f8fafc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="bg-slate-50 font-sans text-slate-950 antialiased">
        <div className="flex min-h-[100dvh] flex-col overflow-x-clip">
          {children}
        </div>
      </body>
    </html>
  );
}

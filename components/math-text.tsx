import { Fragment } from "react";
import katex from "katex";

import type { RichText } from "@/content/site-data";

type MathTextProps = {
  value: RichText;
};

export default function MathText({ value }: MathTextProps) {
  const parts = typeof value === "string" ? [value] : value;

  return (
    <>
      {parts.map((part, index) =>
        typeof part === "string" ? (
          <Fragment key={`${part}-${index}`}>{part}</Fragment>
        ) : (
          <span
            key={`${part.math}-${index}`}
            className="inline-block max-w-full align-middle"
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(part.math, {
                displayMode: false,
                throwOnError: false,
                strict: false,
              }),
            }}
          />
        ),
      )}
    </>
  );
}

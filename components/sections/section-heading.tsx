type SectionHeadingProps = {
  title: string;
  description: string;
};

export default function SectionHeading({
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <h2 className="text-3xl leading-tight font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">
        {description}
      </p>
    </div>
  );
}

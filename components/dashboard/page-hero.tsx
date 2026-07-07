export function PageHero({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] bg-[#0B1A26] px-8 py-8 text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
          <p className="mt-2 max-w-xl text-sm text-white/60">{description}</p>
        </div>

        {action}
      </div>
    </div>
  );
}
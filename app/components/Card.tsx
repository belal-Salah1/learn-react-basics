type CardProps = {
  hook: string;
  title: string;
  children: React.ReactNode;
  className?: string;
};

function Card({ hook, title, children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-xl border border-border bg-surface p-5 ${className}`}
    >
      <span className="font-mono text-xs text-muted">{hook}</span>
      <h2 className="mt-0.5 text-base font-semibold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default Card;

type HeaderParams = {
  text: string;
  textSubtitle: string;
  className?: string;
};

function Header({ text, textSubtitle, className = "" }: HeaderParams) {
  return (
    <div className={`border-b border-border pb-6 ${className}`}>
      <h1 className="text-2xl font-semibold tracking-tight">{text}</h1>
      <p className="mt-1 text-sm text-muted">{textSubtitle}</p>
    </div>
  );
}

export default Header;

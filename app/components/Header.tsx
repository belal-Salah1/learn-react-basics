  type HeaderParams = {
    text: string;
    textSubtitle: string;
    className?: string;
  };


 function Header({ text, textSubtitle, className }: HeaderParams){
  return (
    <div className={className}>
      <h1>{text}</h1>
      <p>{textSubtitle}</p>
    </div>
  )
}
export default Header;
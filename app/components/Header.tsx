  type HeaderParams = {
    text: string;
    textSubtitle: string;
  };


 function Header({ text, textSubtitle }: HeaderParams){
  return (
    <div>
      <h1>{text}</h1>
      <p>{textSubtitle}</p>
    </div>
  )
}
export default Header;
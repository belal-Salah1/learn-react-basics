  type HeaderParams = {
    text: string;
  };


 function Header(props: HeaderParams){
  return (
    <div>{props.text}</div>
  )
}
export default Header;
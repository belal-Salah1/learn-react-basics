import Image from "next/image";

  type HeaderParams = {
    text: string;
  };


 function Header(props: HeaderParams){
  return (
    <div>{props.text}</div>
  )
}
 function Desc(){
  return (
    <>
    <div>desc</div>
    <List description="This is a sample description"/>
    </>
  )
}

type ListParams = {
  description: string;
};
function List(props: ListParams){
  return (
    <div>list of details: {props.description}</div>
  )
}

 function Home() {
  return (
    <div >
      <main >
        <p>Hello, world from belal</p>
        <Header text="Welcome from main"/>
        <Desc/>
      </main>
    </div>
  );
}
export default Home;
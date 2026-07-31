import Image from "next/image";


 function Header(props: { text: string }){
  return (
    <div>{props.text}</div>
  )
}
 function Desc(){
  return (
    <>
    <div>desc</div>
    <List/>
    </>
  )
}
function List(){
  return (
    <div>list of details</div>
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
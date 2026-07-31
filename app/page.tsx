import Image from "next/image";


 function Header(){
  return (
    <div>header</div>
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
        <Header/>
        <Desc/>
      </main>
    </div>
  );
}
export default Home;
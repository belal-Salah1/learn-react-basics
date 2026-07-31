import Image from "next/image";
import Header from "./components/Header";
import Desc from "./components/Description";






 function Home() {
  let hideDescription = true;
  return (
    <div >
      <main >
        <p>Hello, world from belal</p>
        <Header text="An amazing header " textSubtitle="This is a subtitle"/>
       {hideDescription && <Desc  />}
      </main>
    </div>
  );
}
export default Home;
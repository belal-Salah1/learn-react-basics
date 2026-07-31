import Image from "next/image";
import Header from "./components/Header";
import Desc from "./components/Description";






 function Home() {
  return (
    <div >
      <main >
        <p>Hello, world from belal</p>
        <Header text="An amazing header " textSubtitle="This is a subtitle"/>
        <Desc/>
      </main>
    </div>
  );
}
export default Home;
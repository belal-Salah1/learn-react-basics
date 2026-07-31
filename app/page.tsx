'use client';

import Header from "./components/Header";
import Desc from "./components/Description";
import styles from "./home.module.css";
import Link from "next/link";
import { useState } from "react";



function Home() {
  let hideDescription = true;
   const [counter, setCounter] = useState<number>(0);
   
   const handleClick = () => {
     setCounter(counter + 1);
     console.log("Counter incremented to:", counter);
   }




  return (
    <div >
      <main style={{ color: "red" , backgroundColor: "green " }}>
        <p className="section">Hello, world from belal</p>
        <Header text="An amazing header " textSubtitle="This is a subtitle" className={styles.border}/>
       {hideDescription && <Desc  />}
       <Link href="/about">Go To About Page</Link>
      </main>
       <div>
       <button onClick={handleClick}>Click to Increment</button>
       <p>Counter: {counter}</p>

       </div>
    </div>
  );
}
export default Home;
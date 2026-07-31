'use client';

import Header from "./components/Header";
import Desc from "./components/Description";
import styles from "./home.module.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";



function Home() {
  let hideDescription = true;
   const [counter, setCounter] = useState<number>(0 );
   const [success, setSuccess] = useState<boolean>(false);
   const inputRef = useRef<HTMLInputElement>(null);
   
   const handleClick = () => {
     setCounter(counter + 1);
     if(counter  === 10){
      setSuccess(true);
     }
   }

   const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    console.log("Input is focused", inputRef.current?.value);
   }
   useEffect(() => {
    console.log("event is successful");
  }, [success]);

   useEffect(() => {
    console.log("Counter is triggered");
  }, [counter]);




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

       <div>
        <button onClick={handleFocus}>Click to focus input</button>
        <input ref={inputRef} type="text" placeholder="Enter your name" />
       </div>
    </div>
  );
}
export default Home;
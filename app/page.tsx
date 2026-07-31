import Header from "./components/Header";
import Desc from "./components/Description";
import styles from "./home.module.css";






 function Home() {
  let hideDescription = true;
  return (
    <div >
      <main style={{ color: "red" , backgroundColor: "green " }}>
        <p className="section">Hello, world from belal</p>
        <Header text="An amazing header " textSubtitle="This is a subtitle" className={styles.border}/>
       {hideDescription && <Desc  />}
      </main>
    </div>
  );
}
export default Home;
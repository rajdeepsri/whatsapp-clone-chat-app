/* eslint-disable react-hooks/exhaustive-deps */
import Sidebar from "../components/Sidebar";
import ChatsContainer from "../components/ChatsContainer";
import Modal from "../components/Modal";
import styles from "../styles/Home.module.scss";

const Home = () => {
  return (
    <div className={styles.container}>
      <Modal />
      <Sidebar />
      <ChatsContainer />
    </div>
  );
};

export default Home;

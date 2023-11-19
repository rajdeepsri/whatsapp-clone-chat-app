/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import Lottie from "lottie-react";
import styles from "../styles/ChatsContainer.module.scss";
import chattingAnim from "../lottie/chatting.json";
import Message from "./Message";
import MessageForm from "./MessageForm";
import avatar from "../assets/avatar.jpg";
import { useEffect, useRef, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  writeBatch,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import loadingAnim from "../lottie/loading3.json";
import chatLoadingAnim from "../assets/loading.json";
import { useSelector } from "react-redux";
import { deleteObject, ref } from "firebase/storage";

const ChatsContainer = () => {
  const user1 = auth.currentUser.uid;
  const scrollRef = useRef();
  const { chattingUser } = useSelector((state) => state.chats);
  const [messages, setMessages] = useState([]);
  const [isClearingChat, setIsClearingChat] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages([]);
    setChatLoading(true);
    const user2 = chattingUser?.uid;
    const combinedId = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const msgRef = collection(db, "messages", combinedId, "chat");
    const q = query(msgRef, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMessages([...msgs]);
      setChatLoading(false);
    });

    return () => unsub();
  }, [chattingUser]);

  const handleClearChat = async () => {
    if (!chattingUser || messages.length === 0) {
      alert("No Chat to Clear");
      return;
    }

    const confirm = window.confirm("Do you want to clear the chat?");
    if (!confirm) return;

    try {
      setIsClearingChat(true);
      const user2 = chattingUser.uid;
      const combinedId =
        user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

      const msgRef = collection(db, "messages", combinedId, "chat");
      const querySnapshot = await getDocs(msgRef);
      const batch = writeBatch(db);

      let imagesArray = [];

      // queueing messages to be deleted
      querySnapshot.forEach((doc) => {
        const mediaURL = doc.data().media;
        if (mediaURL) {
          const storageRef = ref(storage, mediaURL);
          imagesArray.push(storageRef);
        }

        batch.delete(doc.ref);
      });

      // deleting the whole "message" batch at once
      await batch.commit();

      // deleting images
      if (imagesArray.length > 0) {
        for (const img of imagesArray) {
          await deleteObject(img);
        }
      }

      // deleting last message as well
      await deleteDoc(doc(db, "lastMsg", combinedId));
      setIsClearingChat(false);
    } catch (error) {
      console.log(error);
      alert("Some error occured!");
      setIsClearingChat(false);
    }
  };

  return (
    <div className={`${styles.container} ${chattingUser ? styles.bg : ""}`}>
      {chattingUser ? (
        <>
          <div className={styles.topbar}>
            <div className={styles.chat_info}>
              <img src={chattingUser?.avatar || avatar} alt="avatar" />
              <div>
                <p className={styles.chat_name}>{chattingUser.name}</p>
                <p className={styles.chat_status}>
                  {chattingUser.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            {isClearingChat ? (
              <Lottie
                animationData={loadingAnim}
                loop={true}
                style={{ height: "60px", marginRight: "0.5rem" }}
              />
            ) : (
              <button onClick={handleClearChat}>Clear Chat</button>
            )}
          </div>
          <div className={styles.chats_container}>
            {chatLoading ? (
              <ChatLoadingScreen />
            ) : messages.length === 0 && !chatLoading ? (
              <h1 className={styles.no_chat}>No Chat to Display</h1>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <Message key={idx} msg={msg} />
                ))}
                <div ref={scrollRef} />
              </>
            )}
          </div>
          <MessageForm />
        </>
      ) : (
        <DefaultScreen />
      )}
    </div>
  );
};

export default ChatsContainer;

const DefaultScreen = () => {
  return (
    <div className={styles.default_screen}>
      <Lottie
        animationData={chattingAnim}
        loop={true}
        style={{ height: "300px" }}
      />
      <h1 className={styles.default_title}>WhatsApp Web Clone</h1>
      <p className={styles.default_text}>
        Select an user or create a new one to start conversation
      </p>
    </div>
  );
};

const ChatLoadingScreen = () => {
  return (
    <div className={styles.chat_loading}>
      <Lottie
        animationData={chatLoadingAnim}
        loop={true}
        style={{ height: "150px" }}
      />
    </div>
  );
};

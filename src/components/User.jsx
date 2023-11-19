/* eslint-disable react/prop-types */
import styles from "../styles/Sidebar.module.scss";
import avatar from "../assets/avatar.jpg";
import { useState } from "react";
import { useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setChattingUser } from "../redux/features/chatSlice";

const User = ({ user }) => {
  const dispatch = useDispatch();
  const { chattingUser } = useSelector((state) => state.chats);
  const [data, setData] = useState("");

  const { name, isOnline } = user;
  const user1 = auth.currentUser.uid;
  const user2 = user?.uid;
  const combinedId = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

  useEffect(() => {
    let unsub = onSnapshot(doc(db, "lastMsg", combinedId), (doc) => {
      setData(doc.data());
    });
    return () => unsub;
  }, [combinedId]);

  const selectUser = async (user) => {
    dispatch(setChattingUser(user));

    // getting last message between loggedin and selected user
    const docSnap = await getDoc(doc(db, "lastMsg", combinedId));
    // if last message exists and messages is from selected user
    if (docSnap.data() && docSnap.data().from !== user1) {
      // update last message doc and set unread to false
      await updateDoc(doc(db, "lastMsg", combinedId), {
        unread: false,
      });
    }
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const formattedTime = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);

    return formattedTime;
  };

  const isUnread = data?.from !== user1 && data?.unread;
  const lastMessageTime =
    data?.createdAt?.seconds && formatTime(data.createdAt.seconds);

  return (
    <div
      className={`${styles.chatBox} ${
        chattingUser === user ? styles.selected_chat : ""
      }`}
      onClick={() => selectUser(user)}
    >
      <div className={styles.userDiv}>
        <img src={user?.avatar || avatar} alt="avatar" />
        <div className={isOnline ? styles.online : styles.offline} />
        <div className={styles.userInfo}>
          <h6>{name}</h6>
          <p>
            {data?.from === user1 && <span>me: </span>}
            {data && data.text}
          </p>
        </div>
      </div>
      <div className={styles.status_div}>
        <div className={styles.last_msg_time}>{lastMessageTime}</div>
        {isUnread && <div className={styles.unread}>new</div>}
      </div>
    </div>
  );
};

export default User;

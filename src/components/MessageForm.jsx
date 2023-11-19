/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import Attachment from "../components/svg/Attachment";
import styles from "../styles/ChatsContainer.module.scss";
import Send from "./svg/Send";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { setImageToSend, setTextToSend } from "../redux/features/chatSlice";
import { useState } from "react";
import Lottie from "lottie-react";
import loadingAnim from "../assets/loading2.json";

const MessageForm = () => {
  const dispatch = useDispatch();
  const { imageToSend, textToSend, chattingUser } = useSelector(
    (state) => state.chats
  );
  const [sendLoading, setSendLoading] = useState(false);

  const handleMessageSend = async (e) => {
    e.preventDefault();
    if (!imageToSend && (!textToSend || textToSend.trim() === "")) {
      alert("please select some text or image to send");
      return;
    }

    setSendLoading(true);

    const user1 = auth.currentUser.uid;
    const user2 = chattingUser.uid;
    const combinedId = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    let url = "";
    if (imageToSend) {
      const imageRef = ref(
        storage,
        `images/${new Date().getTime()} - ${imageToSend.name}`
      );
      const snap = await uploadBytes(imageRef, imageToSend);
      const downloadUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = downloadUrl;
    }

    await addDoc(collection(db, "messages", combinedId, "chat"), {
      text: textToSend,
      from: user1,
      to: user2,
      createdAt: serverTimestamp(),
      media: url,
    });

    // creating another collection for last messages
    await setDoc(doc(db, "lastMsg", combinedId), {
      text: textToSend,
      from: user1,
      to: user2,
      media: url,
      createdAt: serverTimestamp(),
      unread: true,
    });

    dispatch(setTextToSend(""));
    dispatch(setImageToSend(""));
    setSendLoading(false);
  };

  return (
    <form onSubmit={handleMessageSend} className={styles.message_form}>
      <label htmlFor="img">
        <Attachment />
      </label>
      <input
        type="file"
        id="img"
        style={{ display: "none" }}
        accept="image/*"
        onChange={(e) => dispatch(setImageToSend(e.target.files[0]))}
      />
      <input
        type="text"
        placeholder="Enter Message"
        value={textToSend}
        onChange={(e) => dispatch(setTextToSend(e.target.value))}
        className={styles.message_input}
      />
      {sendLoading ? (
        <SendLoading />
      ) : (
        <button type="submit" className={styles.send_btn}>
          <Send />
        </button>
      )}
    </form>
  );
};

export default MessageForm;

const SendLoading = () => {
  return (
    <Lottie
      animationData={loadingAnim}
      loop={true}
      style={{ height: "27px" }}
    />
  );
};

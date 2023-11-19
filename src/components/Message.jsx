/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import styles from "../styles/ChatsContainer.module.scss";
import Moment from "react-moment";

const Message = ({ msg }) => {
  const timeAgo = msg?.createdAt?.seconds * 1000;
  const { chattingUser } = useSelector((state) => state.chats);

  return (
    <div
      className={`${styles.message} ${
        chattingUser.uid === msg.from ? styles.friend_message : ""
      }`}
    >
      {msg.media && (
        <div className={styles.message_with_media}>
          <img src={msg.media} alt="media" />
          {msg.text && <p>{msg.text}</p>}
        </div>
      )}

      {!msg.media && <p className={styles.message_text}>{msg.text}</p>}

      <p className={styles.message_time}>
        <Moment fromNow>{timeAgo}</Moment>
      </p>
    </div>
  );
};

export default Message;

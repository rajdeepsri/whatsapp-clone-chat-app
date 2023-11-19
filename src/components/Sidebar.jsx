/* eslint-disable react/prop-types */
import styles from "../styles/Sidebar.module.scss";
import SignOutBtn from "../components/SignOutBtn";
import avatar from "../assets/avatar.jpg";
import User from "./User";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/features/modalSlice";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenModal = () => dispatch(openModal());

  useEffect(() => {
    const user1 = auth.currentUser.uid;
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "not-in", [user1]));
    // execute the query
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
      setFilteredUsers(users);
    });
    return () => unsub;
  }, []);

  useEffect(() => {
    let filteredUsers = [];
    filteredUsers = users.filter((user) =>
      user.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setFilteredUsers(filteredUsers);
  }, [searchTerm, users]);

  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <img
          src={currentUser?.avatar || avatar}
          alt="avatar"
          onClick={handleOpenModal}
        />
        <SignOutBtn />
      </div>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search for users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className={styles.chatBox_container}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => <User key={user.uid} user={user} />)
        ) : (
          <div className={styles.no_users}>no matching users</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

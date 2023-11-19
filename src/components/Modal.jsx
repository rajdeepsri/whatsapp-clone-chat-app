/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Modal.module.scss";
import avatar from "../assets/avatar.jpg";
import Camera from "./svg/Camera";
import Delete from "./svg/Delete";
import { storage, db, auth } from "../firebase";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../redux/features/modalSlice";
import Lottie from "lottie-react";
import loadingAnim from "../lottie/loading2.json";

const Modal = () => {
  const dispatch = useDispatch();
  const modalRef = useRef();
  const { showModal } = useSelector((state) => state.modal);
  const [img, setImg] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        dispatch(closeModal());
      }
    };

    if (showModal) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  useEffect(() => {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) setUser(docSnap.data());
    });

    const uploadImage = async () => {
      if (!img) return;
      const imageRef = ref(
        storage,
        `avatar/${new Date().getTime()} - ${img.name}`
      );
      try {
        setLoading(true);
        if (user.avatarPath) {
          await deleteObject(ref(storage, user.avatarPath));
        }
        const snap = await uploadBytes(imageRef, img);
        const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          avatar: url,
          avatarPath: snap.ref.fullPath,
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }

      setImg("");
    };

    uploadImage();
  }, [img]);

  const deleteImage = async () => {
    try {
      const confirm = window.confirm("Do you want to delete the avatar?");
      if (confirm) {
        setLoading(true);
        if (user.avatarPath) {
          await deleteObject(ref(storage, user.avatarPath));
        }
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          avatar: "",
          avatarPath: "",
        });
        setLoading(false);
        dispatch(closeModal());
        getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
          if (docSnap.exists) setUser(docSnap.data());
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    showModal && (
      <div className={styles.modal_bg}>
        <div className={styles.modal_container} ref={modalRef}>
          <div className={styles.overlay_container}>
            {loading ? (
              <Loading />
            ) : (
              <>
                <img src={user?.avatar || avatar} alt="avatar" />
                <div className={styles.overlay}>
                  <label htmlFor="photo">
                    <Camera />
                  </label>
                  {user?.avatar ? <Delete deleteImage={deleteImage} /> : null}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    id="photo"
                    onChange={(e) => setImg(e.target.files[0])}
                  />
                </div>
              </>
            )}
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.name}</p>
            <p className={styles.userEmail}>{user?.email}</p>
            <p className={styles.joined}>
              Joined on : {user?.createdAt.toDate().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;

const Loading = () => {
  return (
    <Lottie
      animationData={loadingAnim}
      loop={true}
      style={{ height: "70px", margin: "2.75rem 0" }}
    />
  );
};

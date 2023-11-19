import Lottie from "lottie-react";
import styles from "../styles/Register.module.scss";
import whatsappAnim from "../lottie/wa.json";
import loadingAnim from "../lottie/loading3.json";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, db } from "../firebase";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import googleIcon from "../assets/google.png";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const { name, email, password, error, loading } = data;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setData({ ...data, error: "All fields are required!" });
    }
    setData({ ...data, error: null, loading: true });
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        createdAt: serverTimestamp(),
        isOnline: true,
      });

      setData({
        name: "",
        email: "",
        password: "",
        error: null,
        loading: false,
      });
      navigate("/");
    } catch (error) {
      setData({ ...data, error: error.message, loading: false });
    }
  };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        avatar: result.user.photoURL,
        createdAt: serverTimestamp(),
        isOnline: true,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.upperDiv} />
      <div className={styles.lowerDiv} />
      <div className={styles.mainPage}>
        <form onSubmit={handleSubmit} className={styles.register_form}>
          <h1>Create an Account</h1>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleInputChange}
            placeholder="Enter your username"
          />
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleInputChange}
            placeholder="Enter your password"
          />
          {error && <p className={styles.error}>{error}</p>}
          {loading ? (
            <Lottie
              animationData={loadingAnim}
              loop={true}
              style={{ height: "75px" }}
            />
          ) : (
            <button type="submit" className={styles.login_btn}>
              Register
            </button>
          )}
          <p>or</p>
          <button
            className={styles.google_login_btn}
            type="button"
            onClick={handleGoogle}
          >
            <img src={googleIcon} alt="google" />
            <p>Sign In With Google</p>
          </button>
        </form>
        <div className={styles.lottie_div}>
          <Lottie
            animationData={whatsappAnim}
            loop={true}
            style={{ height: "300px" }}
          />
        </div>
      </div>
      <p className={styles.bottomText}>
        Already an user? Click here to <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;

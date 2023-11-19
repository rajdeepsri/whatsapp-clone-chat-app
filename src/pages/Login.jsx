import Lottie from "lottie-react";
import styles from "../styles/Register.module.scss";
import whatsappAnim from "../lottie/chat.json";
import loadingAnim from "../lottie/loading3.json";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, db } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import googleIcon from "../assets/google.png";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const { email, password, error, loading } = data;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setData({ ...data, error: "All fields are required!" });
    }
    setData({ ...data, error: null, loading: true });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      await updateDoc(doc(db, "users", result.user.uid), {
        isOnline: true,
      });

      setData({
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

  const loginWithGoogle = async () => {
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
          <h1>Sign In</h1>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            placeholder="Type your email"
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleInputChange}
            placeholder="Type your password"
          />
          {error && <p className={styles.error}>{error}</p>}
          {loading ? (
            <Lottie
              animationData={loadingAnim}
              loop={true}
              style={{ height: "80px" }}
            />
          ) : (
            <button
              type="submit"
              disabled={loading}
              className={styles.login_btn}
            >
              Login
            </button>
          )}
          <p>or</p>
          <button
            className={styles.google_login_btn}
            type="button"
            onClick={loginWithGoogle}
          >
            <img src={googleIcon} alt="google" />
            <p>Sign In With Google</p>
          </button>
        </form>
        <div className={styles.lottie_div}>
          <Lottie
            animationData={whatsappAnim}
            loop={true}
            style={{ height: "350px" }}
          />
        </div>
      </div>
      <p className={styles.bottomText}>
        Don&apos;t have an account? Click here to{" "}
        <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;

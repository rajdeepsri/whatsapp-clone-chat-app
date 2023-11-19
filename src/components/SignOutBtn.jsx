import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import loadingAnim from "../lottie/loading2.json";
import Lottie from "lottie-react";
import { useState } from "react";

const SignOutBtn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setLoading(true);
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
    setLoading(false);
    navigate("/");
  };

  return loading ? (
    <Lottie
      animationData={loadingAnim}
      loop={true}
      style={{ height: "55px", marginRight: "1rem" }}
    />
  ) : (
    <button onClick={handleSignOut}>Logout</button>
  );
};

export default SignOutBtn;

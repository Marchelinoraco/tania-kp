import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../configFirebase"; // Import auth dari firebase-config
import { Link } from "react-router-dom";

const Login = () => {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const Auth = (e) => {
    e.preventDefault();

    // Firebase Authentication: sign in with email and password
    signInWithEmailAndPassword(auth, Username, Password)
      .then((userCredential) => {
        // Logged in successfully
        const user = userCredential.user;
        console.log("User logged in:", user);
        navigate("/dasbor"); // Navigate to the dashboard after successful login
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.error("Login failed:", errorMessage);
      });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center pt-20">
        <div className="flex flex-col w-full max-w-md px-4 py-8 bg-[#FFF176] rounded-md shadow-md sm:px-6 md:px-8 lg:px-10">
          <div className="self-center text-xl font-medium text-gray-600 sm:text-2xl">
            BPR Connect
          </div>
          <div className="mt-10">
            <form onSubmit={Auth}>
              <div className="flex flex-col mb-6">
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={Username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-[50px]"
                    placeholder="Nama Pengguna"
                  />
                </div>
              </div>
              <div className="flex flex-col mb-6">
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="py-2 rounded-[3px] px-2 border-gray-300 border w-[366px]"
                    placeholder="Kata Sandi"
                  />
                </div>
              </div>
              <div className="flex w-full">
                <button
                  type="submit"
                  className="bg-blue-400 py-2 px-4 rounded-md mb-3"
                >
                  Masuk
                </button>
              </div>
            </form>
            <p className="text-md text-gray-500">
              Belum memiliki akun?{" "}
              <Link
                className="text-gray-500 hover:text-blue-500"
                to={"/daftar"}
              >
                Daftar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

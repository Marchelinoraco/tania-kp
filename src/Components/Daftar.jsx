import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../configFirebase";
import { useDispatch } from "react-redux";
import { setUser } from "../features/authSlice"; // Import the Redux action

const Daftar = () => {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Name, setName] = useState(""); // New state for the name
  const [ErrorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Dispatch function

  const handleSignUp = (e) => {
    e.preventDefault();

    if (Password !== ConfirmPassword) {
      setErrorMessage("Password dan konfirmasi password tidak cocok.");
      return;
    }

    createUserWithEmailAndPassword(auth, Username, Password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Menambahkan role "user" dan name ke Firestore
        try {
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            role: "user", // Default role
            name: Name, // Add the name here
          });

          // Dispatch user data to Redux
          dispatch(
            setUser({
              uid: user.uid,
              email: user.email,
              role: "user",
              name: Name,
            })
          );

          console.log("User created with role:", user);
          navigate("/dasbor"); // Navigate to dashboard after successful registration
        } catch (error) {
          console.error("Error setting user role:", error.message);
          setErrorMessage("Terjadi kesalahan saat menyimpan data pengguna.");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
          setErrorMessage(
            "Email ini sudah terdaftar. Silakan gunakan email lain."
          );
        } else {
          setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
        }
        console.error("Error signing up:", error.message);
      });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center pt-20">
        <div className="flex flex-col w-full max-w-md px-4 py-8 bg-[#FFF176] rounded-md shadow-md sm:px-6 md:px-8 lg:px-10">
          <div className="self-center text-xl font-medium text-gray-600 sm:text-2xl">
            BPR Connect
          </div>
          {ErrorMessage && (
            <div className="px-4 py-2 text-red-600 bg-red-100 border border-red-300 rounded-md">
              {ErrorMessage}
            </div>
          )}
          <div className="mt-10">
            <form onSubmit={handleSignUp}>
              {/* Name Input Field */}
              <div className="flex flex-col mb-6">
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={Name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-style"
                    placeholder="Nama Pengguna"
                  />
                </div>
              </div>
              {/* Email Input Field */}
              <div className="flex flex-col mb-6">
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={Username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-style"
                    placeholder="Email "
                  />
                </div>
              </div>
              {/* Password Input Field */}
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
              {/* Confirm Password Input Field */}
              <div className="flex flex-col mb-6">
                <div className="relative">
                  <input
                    id="confirm-password"
                    type="password"
                    name="confirm-password"
                    value={ConfirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="py-2 rounded-[3px] px-2 border-gray-300 border w-[366px]"
                    placeholder="Konfirmasi Kata Sandi"
                  />
                </div>
              </div>
              <div className="flex w-full space-x-4">
                <button
                  type="submit"
                  className="bg-yellow-600 py-2 px-4 rounded-md mb-3"
                >
                  Daftar
                </button>
                <Link to="/" className="bg-blue-400 py-2 px-4 rounded-md mb-3">
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Daftar;

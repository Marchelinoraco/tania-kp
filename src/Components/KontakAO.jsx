import React, { useState, useEffect } from "react";
import { db } from "../configFirebase"; // Import Firestore configuration
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase Authentication

const KontakAO = () => {
  const [pesan, setPesan] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [userId, setUserId] = useState(null); // State untuk menyimpan userId pengguna yang login
  const [name, setName] = useState(""); // State untuk menyimpan nama pengguna yang login

  useEffect(() => {
    // Query untuk mendapatkan pesan yang diurutkan berdasarkan waktu
    const q = query(collection(db, "chats"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatHistory(chats);
    });

    // Bersihkan listener saat komponen tidak digunakan lagi
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid); // Set userId dari pengguna yang login
        // Ambil nama dari dokumen pengguna di Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setName(userDoc.data().name || "Anonymous"); // Set nama dari dokumen pengguna
        }
      } else {
        setUserId(null);
        setName("");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleInputChange = (e) => {
    setPesan(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (pesan.trim() === "") return;

    // Tambahkan pesan ke koleksi chats di Firestore dengan userId dan name
    await addDoc(collection(db, "chats"), {
      message: pesan,
      from: name, // Tambahkan nama pengguna ke dokumen pesan
      userId: userId, // Tambahkan userId ke dokumen pesan
      createdAt: serverTimestamp(),
    });

    setPesan("");
  };

  // Filter chat history untuk hanya menampilkan percakapan antara admin dan Lino
  const filteredChatHistory = chatHistory.filter(
    (chat) => chat.userId === userId || chat.from === "Admin" // Menampilkan pesan dari pengguna atau admin
  );

  return (
    <div className="kontak-ao container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
        Kontak AO
      </h2>
      <div className="chat-container bg-white p-6 rounded-lg shadow-lg">
        <div className="chat-history overflow-y-auto max-h-96">
          {/* Menampilkan pesan-pesan berdasarkan urutan, termasuk balasan */}
          {filteredChatHistory.map((chat) => (
            <div key={chat.id}>
              {/* Menampilkan pesan asli pengguna */}
              <div
                className={`message p-3 rounded-lg mb-2 ${
                  chat.userId === userId
                    ? "bg-blue-100 text-left"
                    : "bg-green-100 text-right"
                }`}
              >
                <strong>{chat.from}:</strong>
                <p>{chat.message}</p>
              </div>

              {/* Menampilkan balasan jika ada
              {chat.replyTo && (
                <div className="reply-message p-2 mt-2 bg-gray-200 rounded-lg ml-8">
                  <strong>Balasan Admin:</strong>
                  <p>{chat.message}</p>
                </div>
              )} */}
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="flex mt-4">
          <input
            type="text"
            value={pesan}
            onChange={handleInputChange}
            placeholder="Ketik pesan Anda..."
            className="flex-grow border p-2 rounded-l-lg focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
          >
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
};

export default KontakAO;

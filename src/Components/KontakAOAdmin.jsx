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
  const [role, setRole] = useState(""); // State untuk menyimpan role pengguna (admin/user)
  const [showModal, setShowModal] = useState(false); // State untuk modal balasan
  const [selectedMessageId, setSelectedMessageId] = useState(null); // State untuk menyimpan ID pesan yang dipilih untuk dibalas

  // Fetching chat history from Firestore
  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatHistory(chats);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  // Handling authentication state changes and setting name & role
  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid); // Set userId from the logged-in user
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setName(userDoc.data().name || "Anonymous");
          setRole(userDoc.data().role || "user"); // Store role (admin/user)
        }
      } else {
        setUserId(null);
        setName("");
        setRole(""); // Reset role if no user is logged in
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Handling input change for message
  const handleInputChange = (e) => {
    setPesan(e.target.value);
  };

  // Sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (pesan.trim() === "") return;

    await addDoc(collection(db, "chats"), {
      message: pesan,
      from: name,
      userId: userId,
      createdAt: serverTimestamp(),
      role: role, // Include user role (admin/user)
    });

    setPesan(""); // Clear input field after sending message
  };

  // Handling reply to a message
  const handleReplyMessage = async () => {
    if (pesan.trim() === "") return;

    // Add reply message with reference to the original message ID
    await addDoc(collection(db, "chats"), {
      message: pesan,
      from: name,
      userId: userId,
      createdAt: serverTimestamp(),
      replyTo: selectedMessageId, // Link the reply to the original message
      role: role, // Include user role (admin/user)
    });

    setPesan(""); // Reset input field after sending reply
    setShowModal(false); // Close modal after sending reply
  };

  // Handle modal open when clicking the reply button
  const openModal = (messageId) => {
    setSelectedMessageId(messageId); // Store the ID of the message being replied to
    setShowModal(true); // Show modal
  };

  // Handle modal close
  const closeModal = () => {
    setShowModal(false); // Hide modal
    setPesan(""); // Clear message input
  };

  return (
    <div>
      <div className="kontak-ao container mx-auto p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Kontak AO
        </h2>
        <div className="chat-container bg-white p-6 rounded-lg shadow-lg">
          <div className="chat-history overflow-y-auto max-h-96">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={`message p-3 rounded-lg mb-2 ${
                  chat.userId === userId
                    ? "bg-blue-100 text-left"
                    : "bg-green-100 text-right"
                }`}
              >
                <strong>{chat.from}:</strong>
                <p>{chat.message}</p>

                {/* Show reply message if available */}
                {chat.replyTo && (
                  <div className="reply-message p-2 mt-2 bg-gray-100 rounded-lg">
                    <strong>Balasan:</strong>
                    <p>{chat.message}</p>
                  </div>
                )}

                {/* Show reply button if the user is an admin and the message is not a reply */}
                {role === "admin" && !chat.replyTo && (
                  <button
                    onClick={() => openModal(chat.id)} // Open modal with selected message ID
                    className="bg-gray-500 text-white px-2 py-1 rounded-md mt-2"
                  >
                    Balas
                  </button>
                )}
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

      {/* Modal untuk balasan */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Balas Pesan</h3>
            <textarea
              value={pesan}
              onChange={handleInputChange}
              placeholder="Ketik balasan Anda..."
              className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Batal
              </button>
              <button
                onClick={handleReplyMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Kirim Balasan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KontakAO;

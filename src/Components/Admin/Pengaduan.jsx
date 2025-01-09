import React, { useState, useEffect } from "react";
import { MdDelete, MdCheckCircle } from "react-icons/md";
import { db } from "../../configFirebase"; // Import Firestore configuration
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const AdminPengaduan = () => {
  const [pengaduanData, setPengaduanData] = useState([]);

  // Fetch data from Firestore when the component mounts
  useEffect(() => {
    const fetchPengaduanData = async () => {
      const pengaduanRef = collection(db, "pengaduan_nasabah");
      const querySnapshot = await getDocs(pengaduanRef);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPengaduanData(data); // Update state with fetched data
    };

    fetchPengaduanData();
  }, []);

  // Fungsi untuk merubah status pengaduan menjadi "Selesai"
  const handleResolvePengaduan = async (id) => {
    const pengaduanRef = doc(db, "pengaduan_nasabah", id);
    await updateDoc(pengaduanRef, {
      status: "Selesai",
    });

    // Update local state after resolving
    setPengaduanData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, status: "Selesai" } : item
      )
    );
  };

  // Fungsi untuk menghapus pengaduan
  const handleDeletePengaduan = async (id) => {
    const pengaduanRef = doc(db, "pengaduan_nasabah", id);
    await deleteDoc(pengaduanRef);

    // Update local state after deletion
    setPengaduanData((prevData) => prevData.filter((item) => item.id !== id));
  };

  // Fungsi untuk mengatur warna status berdasarkan status pengaduan
  const getStatusColor = (status) => {
    switch (status) {
      case "Selesai":
        return "text-green-600"; // Hijau untuk selesai
      case "Diproses":
        return "text-yellow-600"; // Kuning untuk sedang diproses
      default:
        return "text-gray-600"; // Abu-abu untuk status lainnya
    }
  };

  // Fungsi untuk merubah keterangan pengaduan menjadi "Diterima"
  const handleAcceptPengaduan = async (id) => {
    const pengaduanRef = doc(db, "pengaduan_nasabah", id);
    await updateDoc(pengaduanRef, {
      keterangan: "Selesai",
    });

    // Update local state after accepting
    setPengaduanData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, keterangan: "Selesai" } : item
      )
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
        Daftar Pengaduan Nasabah
      </h1>

      {/* Daftar Pengaduan Nasabah */}
      <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">No</th>
              <th className="py-3 px-6 text-left">Kategori</th>
              <th className="py-3 px-6 text-left">Deskripsi Pengaduan</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {pengaduanData.map((pengaduan, index) => (
              <tr
                key={pengaduan.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">{index + 1}</td>
                <td className="py-3 px-6 text-left">{pengaduan.kategori}</td>
                <td className="py-3 px-6 text-left">{pengaduan.pengaduan}</td>
                <td className="py-3 px-6 text-left">
                  <span className={getStatusColor(pengaduan.keterangan)}>
                    {pengaduan.keterangan}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">
                  <button
                    onClick={() => handleAcceptPengaduan(pengaduan.id)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Terima
                  </button>

                  {/* Tombol Resolve (Tanggapan Selesai) */}
                  {pengaduan.status === "Diproses" && (
                    <button
                      onClick={() => handleResolvePengaduan(pengaduan.id)}
                      className="text-green-500 hover:text-green-700 mr-2"
                    >
                      <MdCheckCircle size={20} />
                    </button>
                  )}
                  {/* Tombol Hapus Pengaduan */}
                  <button
                    onClick={() => handleDeletePengaduan(pengaduan.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPengaduan;

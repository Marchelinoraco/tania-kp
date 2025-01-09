import React, { useState, useEffect } from "react";
import { db, auth } from "../configFirebase"; // Ensure your Firebase config is properly set up
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { MdDelete, MdCheckCircle } from "react-icons/md";

const PengaduanNasabah = () => {
  const [kategori, setKategori] = useState(""); // Menyimpan kategori pengaduan
  const [pengaduan, setPengaduan] = useState(""); // Menyimpan teks pengaduan
  const [status, setStatus] = useState(""); // Menyimpan status pengaduan
  const [loading, setLoading] = useState(false); // Untuk menampilkan status pengiriman
  const [pengaduanData, setPengaduanData] = useState([]);

  // Fetch data from Firestore when the component mounts
  useEffect(() => {
    const fetchPengaduanData = async () => {
      const user = auth.currentUser;
      if (user) {
        const pengaduanRef = collection(db, "pengaduan_nasabah");
        const querySnapshot = await getDocs(pengaduanRef);
        const data = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((pengaduan) => pengaduan.userId === user.uid); // Filter data by userId

        setPengaduanData(data); // Update state with filtered data
      } else {
        setPengaduanData([]); // If no user is logged in, show no complaints
      }
    };

    fetchPengaduanData();
  }, []); // Empty dependency array to fetch data only once on mount

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

  // Menangani perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "kategori") setKategori(value);
    if (name === "pengaduan") setPengaduan(value);
  };

  // Menangani pengiriman pengaduan
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!kategori || !pengaduan) {
      setStatus("Harap pilih kategori dan tulis pengaduan.");
      return;
    }

    // Cek jika user sudah login
    const user = auth.currentUser;
    if (!user) {
      setStatus("Anda harus login untuk mengajukan pengaduan.");
      return;
    }

    // Menampilkan status "Sedang Diproses"
    setStatus("Sedang Diproses...");
    setLoading(true);

    try {
      // Menambahkan pengaduan ke Firestore dengan userId
      await addDoc(collection(db, "pengaduan_nasabah"), {
        kategori,
        pengaduan,
        userId: user.uid, // Menyimpan userId yang sedang login
        timestamp: new Date(),
        keterangan: "Diproses", // Menambahkan waktu pengaduan
      });

      // Status pengaduan berhasil
      setStatus("Pengaduan berhasil diajukan. Terima kasih atas masukan Anda!");

      // Reset form setelah pengaduan berhasil diajukan
      setKategori("");
      setPengaduan("");
    } catch (error) {
      console.error("Error submitting complaint: ", error);
      setStatus("Terjadi kesalahan saat mengirim pengaduan.");
    } finally {
      setLoading(false); // Menghentikan loading setelah selesai
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
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
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Formulir Pengaduan Nasabah
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pilihan Kategori Pengaduan */}
        <div>
          <label
            htmlFor="kategori"
            className="block text-gray-700 font-medium mb-2"
          >
            Pilih Kategori Pengaduan:
          </label>
          <select
            id="kategori"
            name="kategori"
            value={kategori}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Pilih Kategori</option>
            <option value="Kredit">Kredit</option>
            <option value="Deposito">Deposito</option>
            <option value="Pelayanan AO">Pelayanan AO</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        {/* Input Pengaduan */}
        <div>
          <label
            htmlFor="pengaduan"
            className="block text-gray-700 font-medium mb-2"
          >
            Deskripsi Pengaduan:
          </label>
          <textarea
            id="pengaduan"
            name="pengaduan"
            value={pengaduan}
            onChange={handleInputChange}
            placeholder="Tuliskan pengaduan Anda di sini"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            rows="5"
          />
        </div>

        {/* Status Pengaduan */}
        {status && (
          <div
            className={`text-center p-4 rounded-lg ${
              status.includes("berhasil")
                ? "bg-green-200 text-green-700"
                : "bg-red-200 text-red-700"
            }`}
          >
            {status}
          </div>
        )}

        {/* Tombol Kirim Pengaduan */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white py-3 px-6 rounded-lg transition-all duration-300`}
          >
            {loading ? "Sedang Mengirim..." : "Kirim Pengaduan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PengaduanNasabah;

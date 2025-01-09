import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../../configFirebase"; // Adjust the import path for your Firebase config
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const AdminTopUp = () => {
  const [pengajuanTopUp, setPengajuanTopUp] = useState([]);
  const [selectedPengajuan, setSelectedPengajuan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal state

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPengajuanTopUp = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pengajuan_top_up"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPengajuanTopUp(data);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchPengajuanTopUp();
  }, []);

  const handleApprove = async (id) => {
    try {
      const docRef = doc(db, "pengajuan_top_up", id);
      await updateDoc(docRef, {
        keterangan: "Diterima", // Update the 'keterangan' field to "Approved"
      });

      setPengajuanTopUp((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, keterangan: "Diterima" } : item
        )
      );
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const docRef = doc(db, "pengajuan_top_up", id);
      await updateDoc(docRef, {
        keterangan: "Ditolak", // Update the 'keterangan' field to "Rejected"
      });

      setPengajuanTopUp((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, keterangan: "Ditolak" } : item
        )
      );
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const openModal = (id) => {
    const selected = pengajuanTopUp.find((item) => item.id === id);
    setSelectedPengajuan(selected);
    setIsModalOpen(true); // Open modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close modal
    setSelectedPengajuan(null); // Reset selected pengajuan
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
        Pengajuan Top-Up Kredit
      </h1>

      {/* Daftar Pengajuan Top-Up Kredit */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-300">No</th>
              <th className="px-4 py-2 border border-gray-300">Nama</th>
              <th className="px-4 py-2 border border-gray-300">
                Nomor Rekening
              </th>
              <th className="px-4 py-2 border border-gray-300">
                Nominal Top-Up
              </th>
              <th className="px-4 py-2 border border-gray-300">Keterangan</th>
              <th className="px-4 py-2 border border-gray-300">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pengajuanTopUp.map((item, index) => (
              <tr key={item.id} className="cursor-pointer">
                <td className="px-4 py-2 border border-gray-300">
                  {index + 1}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.nama}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.nomorRekening}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.nominalTopUp}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.keterangan}
                </td>

                <td className="px-4 py-2 border border-gray-300">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(item.id);
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                      Terima
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(item.id);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Tolak
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(item.id); // Open modal on details button click
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal to display the selected pengajuan */}
      {isModalOpen && selectedPengajuan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Detail Pengajuan Top-Up Kredit
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Nama:</strong> {selectedPengajuan.nama}
                </p>
                <p>
                  <strong>Nomor KTP:</strong> {selectedPengajuan.nomorKTP}
                </p>
                <p>
                  <strong>Tempat Lahir:</strong> {selectedPengajuan.tempatLahir}
                </p>
                <p>
                  <strong>Tanggal Lahir:</strong>{" "}
                  {selectedPengajuan.tanggalLahir}
                </p>
                <p>
                  <strong>Alamat:</strong> {selectedPengajuan.alamat}
                </p>
                <p>
                  <strong>Nama Pemilik Rekening:</strong>{" "}
                  {selectedPengajuan.namaPemilikRekening}
                </p>
              </div>
              <div>
                <p>
                  <strong>Nomor Rekening:</strong>{" "}
                  {selectedPengajuan.nomorRekening}
                </p>
                <p>
                  <strong>Nominal Top-Up:</strong>{" "}
                  {selectedPengajuan.nominalTopUp}
                </p>
                <p>
                  <strong>Persetujuan:</strong>{" "}
                  {selectedPengajuan.persetujuan
                    ? "Disetujui"
                    : "Belum Disetujui"}
                </p>
                <p>
                  <strong>Tanda Tangan:</strong> {selectedPengajuan.tandaTangan}
                </p>
              </div>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTopUp;

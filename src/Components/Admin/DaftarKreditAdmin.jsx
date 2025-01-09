import React, { useState, useEffect } from "react";
import { db } from "../../configFirebase"; // Pastikan jalur importnya benar
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const AdminDaftarKredit = () => {
  const [daftarKredit, setDaftarKredit] = useState([]);
  const [selectedKredit, setSelectedKredit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Untuk mengatur modal

  useEffect(() => {
    const fetchDaftarKredit = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "pendaftaran_kredit")
        );
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDaftarKredit(data); // Menyimpan data ke state
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    };

    fetchDaftarKredit();
  }, []);

  const handleApprove = async (id) => {
    try {
      // Perbarui status di Firestore
      const kreditRef = doc(db, "pendaftaran_kredit", id);
      await updateDoc(kreditRef, {
        keterangan: "Diterima", // Update keterangan menjadi "Approved"
      });

      // Perbarui state untuk re-render tabel
      setDaftarKredit((prevData) =>
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
      // Perbarui status di Firestore
      const kreditRef = doc(db, "pendaftaran_kredit", id);
      await updateDoc(kreditRef, {
        keterangan: "Ditolak", // Update keterangan menjadi "Rejected"
      });

      // Perbarui state untuk re-render tabel
      setDaftarKredit((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, keterangan: "Ditolak" } : item
        )
      );
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleUpdateStatus = (id, status) => {
    setDaftarKredit((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, status: status } : item
      )
    );
  };

  const handleSelectKredit = (item) => {
    setSelectedKredit(item);
    setIsModalOpen(true); // Tampilkan modal ketika tombol details diklik
  };

  const closeModal = () => {
    setIsModalOpen(false); // Menutup modal
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
        Daftar Kredit yang Diajukan
      </h1>

      {/* Tabel Daftar Kredit */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-300">No</th>
              <th className="px-4 py-2 border border-gray-300">Nama Lengkap</th>
              <th className="px-4 py-2 border border-gray-300">Nomor KTP</th>
              <th className="px-4 py-2 border border-gray-300">
                Jumlah Kredit
              </th>
              <th className="px-4 py-2 border border-gray-300">
                Pendapatan Bulanan
              </th>
              <th className="px-4 py-2 border border-gray-300">Status</th>
              <th className="px-4 py-2 border border-gray-300">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {daftarKredit.map((item, index) => (
              <tr key={item.id}>
                <td className="px-4 py-2 border border-gray-300">
                  {index + 1}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.namaLengkap}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.noKTP}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.jumlahKredit}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.pendapatanBulanan}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.keterangan}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => handleApprove(item.id)}
                  >
                    Terima
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                    onClick={() => handleReject(item.id)}
                  >
                    Tolak
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                    onClick={() => handleSelectKredit(item)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal untuk Detail Kredit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-3/4">
            <h2 className="text-xl font-semibold text-gray-800">
              Detail Pengajuan Kredit
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <p>
                  <strong>Nama Lengkap:</strong> {selectedKredit.namaLengkap}
                </p>
                <p>
                  <strong>Nomor KTP:</strong> {selectedKredit.nomorKTP}
                </p>
                <p>
                  <strong>Tempat Lahir:</strong> {selectedKredit.tempatLahir}
                </p>
                <p>
                  <strong>Tanggal Lahir:</strong> {selectedKredit.tanggalLahir}
                </p>
                <p>
                  <strong>Pekerjaan:</strong> {selectedKredit.pekerjaan}
                </p>
                <p>
                  <strong>Alamat:</strong> {selectedKredit.alamat}
                </p>
                <p>
                  <strong>Sumber Pendapatan:</strong>{" "}
                  {selectedKredit.sumberPendapatan}
                </p>
                <p>
                  <strong>Jumlah Tanggungan:</strong>{" "}
                  {selectedKredit.jumlahTanggungan}
                </p>
              </div>
              <div>
                <p>
                  <strong>Jumlah Kredit:</strong> {selectedKredit.jumlahKredit}
                </p>
                <p>
                  <strong>Pendapatan Bulanan:</strong>{" "}
                  {selectedKredit.pendapatanBulanan}
                </p>
                <p>
                  <strong>Agunan:</strong> {selectedKredit.agunan}
                </p>
                <p>
                  <strong>Nama Perusahaan:</strong>{" "}
                  {selectedKredit.detailPekerjaan.namaPerusahaan}
                </p>
                <p>
                  <strong>Alamat Perusahaan:</strong>{" "}
                  {selectedKredit.detailPekerjaan.alamatPerusahaan}
                </p>
                <p>
                  <strong>Jabatan:</strong>{" "}
                  {selectedKredit.detailPekerjaan.jabatan}
                </p>
                <p>
                  <strong>Nomor Telepon Perusahaan:</strong>{" "}
                  {selectedKredit.detailPekerjaan.nomorTeleponPerusahaan}
                </p>
                <p>
                  <strong>Lama Bekerja:</strong>{" "}
                  {selectedKredit.detailPekerjaan.lamaBekerja}
                </p>
              </div>
            </div>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDaftarKredit;

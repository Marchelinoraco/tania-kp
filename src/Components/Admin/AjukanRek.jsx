import React, { useState, useEffect } from "react";
import { db } from "../../configFirebase"; // Import Firestore methods
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const AjukanRek = () => {
  const [daftarRestrukturisasi, setDaftarRestrukturisasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null); // To store the selected item for the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // To toggle modal visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "ajukan_restrukturisasi")
        );
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDaftarRestrukturisasi(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      setDaftarRestrukturisasi((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, keterangan: "Diterima" } : item
        )
      );

      const docRef = doc(db, "ajukan_restrukturisasi", id);
      await updateDoc(docRef, {
        keterangan: "Diterima",
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleReject = async (id) => {
    try {
      setDaftarRestrukturisasi((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, keterangan: "Ditolak" } : item
        )
      );

      const docRef = doc(db, "ajukan_restrukturisasi", id);
      await updateDoc(docRef, {
        keterangan: "Ditolak",
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDetailClick = (item) => {
    setSelectedItem(item); // Set the selected item for the modal
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedItem(null); // Clear the selected item
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
        Daftar Pengajuan Restrukturisasi Kredit
      </h1>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-300">No</th>
                <th className="px-4 py-2 border border-gray-300">
                  Nama Lengkap
                </th>
                <th className="px-4 py-2 border border-gray-300">Nomor KTP</th>
                <th className="px-4 py-2 border border-gray-300">
                  Jumlah Kredit
                </th>
                <th className="px-4 py-2 border border-gray-300">
                  Alasan Restrukturisasi
                </th>
                <th className="px-4 py-2 border border-gray-300">Status</th>
                <th className="px-4 py-2 border border-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {daftarRestrukturisasi.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 border border-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {item.namaLengkap}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {item.nomorKTP}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {item.jumlahKredit}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {item.alasanRestrukturisasi}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {item.keterangan}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                      >
                        Terima
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                      >
                        Tolak
                      </button>
                    </div>

                    <button
                      onClick={() => handleDetailClick(item)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Detail Pengajuan</h2>
            <div className="mb-4">
              <p>
                <strong>Nama Lengkap:</strong> {selectedItem.namaLengkap}
              </p>
              <p>
                <strong>Nomor KTP:</strong> {selectedItem.nomorKTP}
              </p>
              <p>
                <strong>Tempat Lahir:</strong> {selectedItem.tempatLahir}
              </p>
              <p>
                <strong>Tanggal Lahir:</strong> {selectedItem.tanggalLahir}
              </p>
              <p>
                <strong>Alamat:</strong> {selectedItem.alamat}
              </p>
              <p>
                <strong>Nomor Telepon:</strong> {selectedItem.nomorTelepon}
              </p>
              <p>
                <strong>Email:</strong> {selectedItem.email}
              </p>
              <p>
                <strong>Jumlah Kredit:</strong> {selectedItem.jumlahKredit}
              </p>
              <p>
                <strong>Alasan Restrukturisasi:</strong>{" "}
                {selectedItem.alasanRestrukturisasi}
              </p>
              <p>
                <strong>Penghasilan Bulanan:</strong>{" "}
                {selectedItem.penghasilanBulanan}
              </p>
              <p>
                <strong>Status Pekerjaan:</strong>{" "}
                {selectedItem.statusPekerjaan}
              </p>
              <p>
                <strong>Jenis Agunan:</strong> {selectedItem.jenisAgunan}
              </p>
              <p>
                <strong>Jumlah Tanggungan:</strong>{" "}
                {selectedItem.jumlahTanggungan}
              </p>
              <p>
                <strong>Jumlah Kredit Sebelumnya:</strong>{" "}
                {selectedItem.jumlahKreditSebelumnya}
              </p>
              <p>
                <strong>Sisa Pinjaman Sebelumnya:</strong>{" "}
                {selectedItem.sisaPinjamanSebelumnya}
              </p>
              <p>
                <strong>Status Pembayaran Sebelumnya:</strong>{" "}
                {selectedItem.statusPembayaranSebelumnya}
              </p>
              <p>
                <strong>Lama Kredit Berjalan:</strong>{" "}
                {selectedItem.lamaKreditBerjalan}
              </p>
            </div>
            <button
              onClick={handleCloseModal}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AjukanRek;

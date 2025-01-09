import React, { useState, useEffect } from "react";
import { db, auth } from "../configFirebase"; // Adjust the import path based on your Firebase configuration
import { collection, addDoc, getDocs } from "firebase/firestore";

const FormPengajuanTopUp = () => {
  const [formData, setFormData] = useState({
    nama: "",
    nomorKTP: "",
    tempatLahir: "",
    tanggalLahir: "",
    alamat: "",
    nominalTopUp: "",
    nomorRekening: "",
    namaPemilikRekening: "",
    persetujuan: false,
  });

  const [pengajuanTopUp, setPengajuanTopUp] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      persetujuan: e.target.checked,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the current logged-in user's userId
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to submit the form");
      return;
    }

    try {
      // Add form data to Firestore under the "pengajuan_top_up" collection
      await addDoc(collection(db, "pengajuan_top_up"), {
        ...formData,
        userId: user.uid, // Associate form with userId
        timestamp: new Date(),
        keterangan: "Diproses", // Optionally add timestamp
      });

      // Log the submitted form data (optional)
      console.log("Data Pengajuan Top-Up Kredit:", formData);

      // Clear the form after successful submission
      setFormData({
        nama: "",
        nomorKTP: "",
        tempatLahir: "",
        tanggalLahir: "",
        alamat: "",
        nominalTopUp: "",
        nomorRekening: "",
        namaPemilikRekening: "",
        persetujuan: false,
      });

      alert("Pengajuan Top-Up Kredit berhasil dikirim!");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Terjadi kesalahan saat mengirim pengajuan.");
    }
  };

  // Fetch data from Firestore when the component mounts
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

  return (
    <div className="container mx-auto p-6">
      {/* Table displaying the pengajuanTopUp */}
      <h2 className="text-xl font-semibold text-center mt-10">
        Historis Pengajuan Top-Up
      </h2>
      <table className="table-auto w-full bg-white border-collapse border border-gray-200 mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-gray-300">No</th>
            <th className="px-4 py-2 border border-gray-300">Nama</th>
            <th className="px-4 py-2 border border-gray-300">Nomor Rekening</th>
            <th className="px-4 py-2 border border-gray-300">Nominal Top-Up</th>
            <th className="px-4 py-2 border border-gray-300">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {pengajuanTopUp.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                No records found.
              </td>
            </tr>
          ) : (
            pengajuanTopUp.map((item, index) => (
              <tr key={item.id}>
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
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h1 className="text-2xl font-bold mt-10 text-center mb-6 text-gray-700">
        Form Pengajuan Top-Up Kredit
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-6 border border-gray-300 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label htmlFor="nama" className="block text-gray-700">
            Nama Lengkap
          </label>
          <input
            type="text"
            id="nama"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="nomorKTP" className="block text-gray-700">
            Nomor KTP
          </label>
          <input
            type="text"
            id="nomorKTP"
            name="nomorKTP"
            value={formData.nomorKTP}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="tempatLahir" className="block text-gray-700">
            Tempat Lahir
          </label>
          <input
            type="text"
            id="tempatLahir"
            name="tempatLahir"
            value={formData.tempatLahir}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="tanggalLahir" className="block text-gray-700">
            Tanggal Lahir
          </label>
          <input
            type="date"
            id="tanggalLahir"
            name="tanggalLahir"
            value={formData.tanggalLahir}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="alamat" className="block text-gray-700">
            Alamat
          </label>
          <textarea
            id="alamat"
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            rows="4"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="nominalTopUp" className="block text-gray-700">
            Nominal Top-Up
          </label>
          <input
            type="number"
            id="nominalTopUp"
            name="nominalTopUp"
            value={formData.nominalTopUp}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="nomorRekening" className="block text-gray-700">
            Nomor Rekening
          </label>
          <input
            type="text"
            id="nomorRekening"
            name="nomorRekening"
            value={formData.nomorRekening}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="namaPemilikRekening" className="block text-gray-700">
            Nama Pemilik Rekening
          </label>
          <input
            type="text"
            id="namaPemilikRekening"
            name="namaPemilikRekening"
            value={formData.namaPemilikRekening}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="persetujuan"
            name="persetujuan"
            checked={formData.persetujuan}
            onChange={handleCheckboxChange}
            className="mr-2"
            required
          />
          <label htmlFor="persetujuan" className="text-gray-700">
            Saya menyetujui syarat dan ketentuan yang berlaku.
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Ajukan Top-Up Kredit
        </button>
      </form>
    </div>
  );
};

export default FormPengajuanTopUp;

import React, { useState, useEffect } from "react";
import { db, auth } from "../configFirebase"; // Adjust the import path as needed
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

const PendaftaranKredit = () => {
  const [formData, setFormData] = useState({
    namaLengkap: "",
    noKTP: "",
    tempatLahir: "",
    tanggalLahir: "",
    pekerjaan: "",
    alamat: "",
    sumberPendapatan: "",
    pendapatanBulanan: "",
    jumlahKredit: "",
    agunan: "",
    jumlahTanggungan: "",
    detailPekerjaan: {
      namaPerusahaan: "",
      alamatPerusahaan: "",
      jabatan: "",
      nomorTeleponPerusahaan: "",
      lamaBekerja: "",
    },
  });

  const [daftarKredit, setDaftarKredit] = useState([]);

  // Fetch daftar kredit based on userId
  const fetchDaftarKredit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in first.");
      return;
    }

    try {
      // Query to fetch documents with userId matching the logged-in user
      const q = query(
        collection(db, "pendaftaran_kredit"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const kredits = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDaftarKredit(kredits);
    } catch (error) {
      console.error("Error fetching daftar kredit: ", error);
    }
  };

  // Fetch data on initial render and whenever user logs in
  useEffect(() => {
    fetchDaftarKredit();
  }, [auth.currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("detailPekerjaan")) {
      const [section, field] = name.split(".");
      setFormData((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get current user ID (assuming the user is logged in)
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in first.");
      return;
    }

    try {
      // Add form data to Firestore
      const docRef = await addDoc(collection(db, "pendaftaran_kredit"), {
        ...formData,
        userId: user.uid, // Store the user ID for reference
        timestamp: new Date(),
        keterangan: "diproses", // Add a timestamp for when the form was submitted
      });

      alert(
        `Form Pendaftaran Kredit berhasil dikirimkan! Data berhasil disimpan dengan ID: ${docRef.id}`
      );

      // Reset the form after successful submission
      setFormData({
        namaLengkap: "",
        noKTP: "",
        tempatLahir: "",
        tanggalLahir: "",
        pekerjaan: "",
        alamat: "",
        sumberPendapatan: "",
        pendapatanBulanan: "",
        jumlahKredit: "",
        agunan: "",
        jumlahTanggungan: "",
        detailPekerjaan: {
          namaPerusahaan: "",
          alamatPerusahaan: "",
          jabatan: "",
          nomorTeleponPerusahaan: "",
          lamaBekerja: "",
        },
      });

      // Fetch updated daftar kredit after submission
      fetchDaftarKredit();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Terjadi kesalahan saat mengirimkan data.");
    }
  };

  return (
    <div className="px-6 my-15">
      {/* Table to display daftar kredit for logged-in user */}
      <div className="overflow-x-auto mt-10">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="text-base my-18 text-center font-bold">
        Form Pendaftaran Kredit
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Nama Lengkap */}
        <div className="mb-4">
          <label
            htmlFor="namaLengkap"
            className="block text-sm font-medium text-gray-700"
          >
            Nama Lengkap
          </label>
          <input
            id="namaLengkap"
            name="namaLengkap"
            type="text"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.namaLengkap}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Nomor KTP */}
        <div className="mb-4">
          <label
            htmlFor="noKTP"
            className="block text-sm font-medium text-gray-700"
          >
            Nomor KTP
          </label>
          <input
            id="noKTP"
            name="noKTP"
            type="text"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.noKTP}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Tempat Lahir */}
        <div className="mb-4">
          <label
            htmlFor="tempatLahir"
            className="block text-sm font-medium text-gray-700"
          >
            Tempat Lahir
          </label>
          <input
            id="tempatLahir"
            name="tempatLahir"
            type="text"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.tempatLahir}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Tanggal Lahir */}
        <div className="mb-4">
          <label
            htmlFor="tanggalLahir"
            className="block text-sm font-medium text-gray-700"
          >
            Tanggal Lahir
          </label>
          <input
            id="tanggalLahir"
            name="tanggalLahir"
            type="date"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.tanggalLahir}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Pekerjaan */}
        <div className="mb-4">
          <label
            htmlFor="pekerjaan"
            className="block text-sm font-medium text-gray-700"
          >
            Pekerjaan
          </label>
          <input
            id="pekerjaan"
            name="pekerjaan"
            type="text"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.pekerjaan}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Alamat */}
        <div className="mb-4">
          <label
            htmlFor="alamat"
            className="block text-sm font-medium text-gray-700"
          >
            Alamat
          </label>
          <input
            id="alamat"
            name="alamat"
            type="text"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.alamat}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Sumber Pendapatan */}
        <div className="mb-4">
          <label
            htmlFor="sumberPendapatan"
            className="block text-sm font-medium text-gray-700"
          >
            Sumber Pendapatan
          </label>
          <input
            id="sumberPendapatan"
            name="sumberPendapatan"
            type="text"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.sumberPendapatan}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Pendapatan Bulanan */}
        <div className="mb-4">
          <label
            htmlFor="pendapatanBulanan"
            className="block text-sm font-medium text-gray-700"
          >
            Pendapatan Bulanan
          </label>
          <input
            id="pendapatanBulanan"
            name="pendapatanBulanan"
            type="number"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.pendapatanBulanan}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Jumlah Kredit */}
        <div className="mb-4">
          <label
            htmlFor="jumlahKredit"
            className="block text-sm font-medium text-gray-700"
          >
            Jumlah Kredit yang Diajukan
          </label>
          <input
            id="jumlahKredit"
            name="jumlahKredit"
            type="number"
            min="5000000" // Batas minimal 5 juta
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.jumlahKredit}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Agunan */}
        <div className="mb-4">
          <label
            htmlFor="agunan"
            className="block text-sm font-medium text-gray-700"
          >
            Agunan atau Jaminan
          </label>
          <input
            id="agunan"
            name="agunan"
            type="text"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.agunan}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Jumlah Tanggungan */}
        <div className="mb-4">
          <label
            htmlFor="jumlahTanggungan"
            className="block text-sm font-medium text-gray-700"
          >
            Jumlah Tanggungan
          </label>
          <input
            id="jumlahTanggungan"
            name="jumlahTanggungan"
            type="number"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.jumlahTanggungan}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Detail Pekerjaan */}
        <h3 className="text-lg font-medium text-gray-700">Detail Pekerjaan</h3>

        <div className="mb-4">
          <label
            htmlFor="detailPekerjaan.namaPerusahaan"
            className="block text-sm font-medium text-gray-700"
          >
            Nama Perusahaan
          </label>
          <input
            id="detailPekerjaan.namaPerusahaan"
            name="detailPekerjaan.namaPerusahaan"
            type="text"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.detailPekerjaan.namaPerusahaan}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="detailPekerjaan.alamatPerusahaan"
            className="block text-sm font-medium text-gray-700"
          >
            Alamat Perusahaan
          </label>
          <input
            id="detailPekerjaan.alamatPerusahaan"
            name="detailPekerjaan.alamatPerusahaan"
            type="text"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.detailPekerjaan.alamatPerusahaan}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="detailPekerjaan.jabatan"
            className="block text-sm font-medium text-gray-700"
          >
            Jabatan
          </label>
          <input
            id="detailPekerjaan.jabatan"
            name="detailPekerjaan.jabatan"
            type="text"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.detailPekerjaan.jabatan}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="detailPekerjaan.nomorTeleponPerusahaan"
            className="block text-sm font-medium text-gray-700"
          >
            Nomor Telepon Perusahaan
          </label>
          <input
            id="detailPekerjaan.nomorTeleponPerusahaan"
            name="detailPekerjaan.nomorTeleponPerusahaan"
            type="text"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.detailPekerjaan.nomorTeleponPerusahaan}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="detailPekerjaan.lamaBekerja"
            className="block text-sm font-medium text-gray-700"
          >
            Lama Bekerja
          </label>
          <input
            id="detailPekerjaan.lamaBekerja"
            name="detailPekerjaan.lamaBekerja"
            type="text"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.detailPekerjaan.lamaBekerja}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Kirim Pendaftaran
        </button>
      </form>
    </div>
  );
};

export default PendaftaranKredit;

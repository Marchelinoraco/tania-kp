import React, { useState, useEffect } from "react";
import { db, auth } from "../configFirebase"; // Adjust the import path
import { collection, addDoc, getDocs, where, query } from "firebase/firestore";

const AjukanRestrukturisasi = () => {
  const [daftarRestrukturisasi, setDaftarRestrukturisasi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.log("Please log in to view the data");
        return;
      }

      try {
        const q = query(
          collection(db, "ajukan_restrukturisasi"),
          where("userId", "==", user.uid) // Filter by userId
        );
        const querySnapshot = await getDocs(q);

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
  const [formData, setFormData] = useState({
    namaLengkap: "",
    nomorKTP: "",
    tempatLahir: "",
    tanggalLahir: "",
    alamat: "",
    nomorTelepon: "",
    email: "",
    jumlahKredit: "",
    alasanRestrukturisasi: "",
    penghasilanBulanan: "",
    statusPekerjaan: "",
    jenisAgunan: "",
    jumlahTanggungan: "",
    jumlahKreditSebelumnya: "", // Data Kredit Sebelumnya
    sisaPinjamanSebelumnya: "", // Sisa Pinjaman Sebelumnya
    statusPembayaranSebelumnya: "", // Status Pembayaran Sebelumnya
    lamaKreditBerjalan: "", // Lama Kredit yang Sudah Berjalan
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("Please log in first.");
      return;
    }

    try {
      // Create a reference to the "ajukan_restrukturisasi" collection
      const docRef = await addDoc(collection(db, "ajukan_restrukturisasi"), {
        ...formData,
        userId: user.uid, // Store the user ID for reference
        timestamp: new Date(),
        keterangan: "Diproses",
      });

      alert("Pengajuan restrukturisasi berhasil dikirim!");

      // Optionally reset the form
      setFormData({
        namaLengkap: "",
        nomorKTP: "",
        tempatLahir: "",
        tanggalLahir: "",
        alamat: "",
        nomorTelepon: "",
        email: "",
        jumlahKredit: "",
        alasanRestrukturisasi: "",
        penghasilanBulanan: "",
        statusPekerjaan: "",
        jenisAgunan: "",
        jumlahTanggungan: "",

        jumlahKreditSebelumnya: "",
        sisaPinjamanSebelumnya: "",
        statusPembayaranSebelumnya: "",
        lamaKreditBerjalan: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Terjadi kesalahan saat mengajukan restrukturisasi.");
    }
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h1 className="text-2xl font-bold text-center mb-6 mt-10 text-gray-700">
        Ajukan Restrukturisasi Kredit
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Data Diri */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="namaLengkap"
              value={formData.namaLengkap}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nomor KTP
            </label>
            <input
              type="text"
              name="nomorKTP"
              value={formData.nomorKTP}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tempat Lahir
            </label>
            <input
              type="text"
              name="tempatLahir"
              value={formData.tempatLahir}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tanggal Lahir
            </label>
            <input
              type="date"
              name="tanggalLahir"
              value={formData.tanggalLahir}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Alamat
            </label>
            <input
              type="text"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nomor Telepon
            </label>
            <input
              type="tel"
              name="nomorTelepon"
              value={formData.nomorTelepon}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        {/* Informasi Kredit */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Jumlah Kredit
          </label>
          <input
            type="number"
            name="jumlahKredit"
            value={formData.jumlahKredit}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Alasan Restrukturisasi
          </label>
          <textarea
            name="alasanRestrukturisasi"
            value={formData.alasanRestrukturisasi}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Penghasilan Bulanan
          </label>
          <input
            type="number"
            name="penghasilanBulanan"
            value={formData.penghasilanBulanan}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status Pekerjaan
          </label>
          <select
            name="statusPekerjaan"
            value={formData.statusPekerjaan}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="Pegawai">Pegawai</option>
            <option value="Wiraswasta">Wiraswasta</option>
            <option value="Freelancer">Freelancer</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Jenis Agunan
          </label>
          <input
            type="text"
            name="jenisAgunan"
            value={formData.jenisAgunan}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Jumlah Tanggungan
          </label>
          <input
            type="number"
            name="jumlahTanggungan"
            value={formData.jumlahTanggungan}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Data Kredit Sebelumnya */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Jumlah Kredit Sebelumnya
          </label>
          <input
            type="number"
            name="jumlahKreditSebelumnya"
            value={formData.jumlahKreditSebelumnya}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sisa Pinjaman Sebelumnya
          </label>
          <input
            type="number"
            name="sisaPinjamanSebelumnya"
            value={formData.sisaPinjamanSebelumnya}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status Pembayaran Sebelumnya
          </label>
          <select
            name="statusPembayaranSebelumnya"
            value={formData.statusPembayaranSebelumnya}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="Lancar">Lancar</option>
            <option value="Terlambat">Terlambat</option>
            <option value="Macet">Macet</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Lama Kredit yang Sudah Berjalan (dalam bulan)
          </label>
          <input
            type="number"
            name="lamaKreditBerjalan"
            value={formData.lamaKreditBerjalan}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Ajukan Restrukturisasi
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjukanRestrukturisasi;

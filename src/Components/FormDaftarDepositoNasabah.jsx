import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { auth, db } from "../configFirebase"; // Sesuaikan dengan konfigurasi Firebase Anda
import "./FormDaftarDeposito.css";

const FormDaftarDeposito = () => {
  const initialFormData = {
    nama: "",
    ktp: "",
    tglLahir: "",
    jenisKelamin: "L",
    alamat: "",
    telepon: "",
    email: "",
    pekerjaan: "",
    status: "single",
    noRekening: "",
    bank: "",
    jumlah: "",
    jangkaWaktu: "1_bulan",
    bunga: 4.5,
    mataUang: "idr",
    persetujuan: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [deposits, setDeposits] = useState([]); // State untuk menyimpan data deposito
  const [loading, setLoading] = useState(true); // State untuk memantau loading data

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      const userId = auth.currentUser.uid;

      try {
        // Membuat query untuk mengambil data deposito berdasarkan userId
        const q = query(
          collection(db, "deposits"),
          where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(q);
        console.log("Query Snapshot:", querySnapshot);
        const depositsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Deposits Data:", depositsData);

        setDeposits(depositsData); // Menyimpan data deposito ke state
      } catch (error) {
        console.error("Error getting documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Panggil fetchData saat komponen pertama kali dimuat
  }, []);

  const calculateBunga = (jumlah) => {
    if (jumlah < 100000000) {
      return 4.5;
    } else if (jumlah >= 100000000 && jumlah < 500000000) {
      return 5;
    } else {
      return 5.5;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "jumlah") {
      const jumlah = Number(value);
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
        bunga: calculateBunga(jumlah),
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("User not authenticated.");
      return;
    }

    const userId = auth.currentUser.uid;

    try {
      // Menggunakan addDoc untuk menambahkan dokumen baru ke koleksi 'deposits'
      await addDoc(collection(db, "deposits"), {
        ...formData,
        userId,
        keterangan: "diproses", // Menambahkan field keterangan dengan nilai default
      });

      alert("Pengajuan deposito berhasil!");

      // Segarkan data deposito setelah submit
      const q = query(
        collection(db, "deposits"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const depositsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDeposits(depositsData); // Update state dengan data terbaru
      setFormData(initialFormData); // Reset form data to initial values
    } catch (error) {
      console.error("Error saving document:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 class="text-xl font-bold mb-4">Daftar Pengajuan Deposito</h2>
      <table class="w-full border-collapse border border-gray-200 shadow-md">
        <thead>
          <tr class="bg-gray-500 text-white">
            <th class="border border-gray-300 px-4 py-2">Nama</th>
            <th class="border border-gray-300 px-4 py-2">Nomor KTP</th>
            <th class="border border-gray-300 px-4 py-2">Jumlah Deposito</th>
            <th class="border border-gray-300 px-4 py-2">Jangka Waktu</th>
            <th class="border border-gray-300 px-4 py-2">Bunga</th>
            <th class="border border-gray-300 px-4 py-2">Status Perkawinan</th>
            <th class="border border-gray-300 px-4 py-2">Tanggal Lahir</th>
            <th class="border border-gray-300 px-4 py-2">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {deposits.map((deposit, index) => (
            <tr key={index} class="hover:bg-gray-100 even:bg-gray-50">
              <td class="border border-gray-300 px-4 py-2">{deposit.nama}</td>
              <td class="border border-gray-300 px-4 py-2">{deposit.ktp}</td>
              <td class="border border-gray-300 px-4 py-2">{deposit.jumlah}</td>
              <td class="border border-gray-300 px-4 py-2">
                {deposit.jangkaWaktu}
              </td>
              <td class="border border-gray-300 px-4 py-2">{deposit.bunga}%</td>
              <td class="border border-gray-300 px-4 py-2">{deposit.status}</td>
              <td class="border border-gray-300 px-4 py-2">
                {deposit.tglLahir}
              </td>
              <td class="border border-gray-300 px-4 py-2">
                {deposit.keterangan}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <h2 className="form-title">Formulir Pengajuan Deposito</h2>

          {/* Data Diri Nasabah */}
          <fieldset>
            <legend>Data Diri Nasabah</legend>
            <label>
              Nama Lengkap:
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <br />

            <label>
              Nomor KTP/Paspor:
              <input
                type="text"
                name="ktp"
                value={formData.ktp}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <br />

            <label>
              Tanggal Lahir:
              <input
                type="date"
                name="tglLahir"
                value={formData.tglLahir}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <br />

            <label>
              Jenis Kelamin:
              <select
                name="jenisKelamin"
                value={formData.jenisKelamin}
                onChange={handleChange}
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </label>
            <br />
            <br />

            <label>
              Alamat Domisili:
              <input
                type="text"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <br />

            <label>
              Nomor Telepon:
              <input
                type="text"
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <br />

            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <br />

            <label>
              Pekerjaan:
              <input
                type="text"
                name="pekerjaan"
                value={formData.pekerjaan}
                onChange={handleChange}
              />
            </label>
            <br />
            <br />

            <label>
              Status Perkawinan:
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="single">Lajang</option>
                <option value="menikah">Menikah</option>
                <option value="janda">Janda</option>
                <option value="duda">Duda</option>
              </select>
            </label>
          </fieldset>

          {/* Informasi Rekening */}
          <fieldset>
            <legend>Informasi Rekening</legend>
            <label>
              Nomor Rekening:
              <input
                type="text"
                name="noRekening"
                value={formData.noRekening}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <br />

            <label>
              Nama Bank:
              <input
                type="text"
                name="bank"
                value={formData.bank}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <br />
          </fieldset>

          {/* Informasi Deposito */}
          <fieldset>
            <legend>Informasi Deposito</legend>
            <label>
              Jumlah Deposito (IDR):
              <input
                type="number"
                name="jumlah"
                value={formData.jumlah}
                onChange={handleChange}
                min="10000000" // Minimal 10 juta
                required
              />
            </label>
            <br />
            <br />

            <label>
              Jangka Waktu Deposito:
              <select
                name="jangkaWaktu"
                value={formData.jangkaWaktu}
                onChange={handleChange}
                required
              >
                <option value="1_bulan">1 Bulan</option>
                <option value="3_bulan">3 Bulan</option>
                <option value="6_bulan">6 Bulan</option>
                <option value="12_bulan">12 Bulan</option>
              </select>
            </label>
            <br />
            <br />

            <label>Bunga Deposito: {formData.bunga}%</label>
            <br />
            <br />

            <label>
              Mata Uang:
              <select
                name="mataUang"
                value={formData.mataUang}
                onChange={handleChange}
                required
              >
                <option value="idr">IDR (Rupiah)</option>
                <option value="usd">USD (Dollar)</option>
                <option value="eur">EUR (Euro)</option>
              </select>
            </label>
          </fieldset>

          {/* Persetujuan */}
          <fieldset>
            <legend>Persetujuan</legend>
            <div className="persetujuan-container">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="persetujuan"
                  checked={formData.persetujuan}
                  onChange={handleChange}
                  required
                />
                <span className="bold">
                  Saya setuju dengan syarat dan ketentuan deposito.
                </span>
              </label>
            </div>
          </fieldset>

          {/* Tombol Daftar Deposito */}
          <button className="submit-btn" type="submit">
            Daftar Deposito
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormDaftarDeposito;

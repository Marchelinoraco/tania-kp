import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../configFirebase"; // Sesuaikan dengan konfigurasi Firebase Anda

const FormDaftarDepositoAdmin = () => {
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "deposits"));
        const depositsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDeposits(depositsData);
      } catch (error) {
        console.error("Error fetching deposits:", error);
      }
    };

    fetchDeposits();
  }, []);

  const updateKeterangan = async (id, newKeterangan) => {
    try {
      const depositRef = doc(db, "deposits", id);
      await updateDoc(depositRef, {
        keterangan: newKeterangan,
      });
      alert(`Keterangan berhasil diperbarui menjadi: ${newKeterangan}`);
      // Optional: refresh the deposits list
      setDeposits((prevDeposits) =>
        prevDeposits.map((deposit) =>
          deposit.id === id
            ? { ...deposit, keterangan: newKeterangan }
            : deposit
        )
      );
    } catch (error) {
      console.error("Error updating keterangan:", error);
      alert("Terjadi kesalahan saat memperbarui keterangan.");
    }
  };

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
            <th class="border border-gray-300 px-4 py-2">Aksi</th>
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
              <td class="border border-gray-300 px-4 py-2">
                <button
                  class="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                  onClick={() => updateKeterangan(deposit.id, "Diterima")}
                >
                  Diterima
                </button>
                <button
                  class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => updateKeterangan(deposit.id, "Ditolak")}
                >
                  Ditolak
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormDaftarDepositoAdmin;

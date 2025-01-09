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
      <h2>Daftar Pengajuan Deposito</h2>
      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Nomor KTP</th>
            <th>Jumlah Deposito</th>
            <th>Jangka Waktu</th>
            <th>Bunga</th>
            <th>Status Perkawinan</th>
            <th>Tanggal Lahir</th>
            <th>Keterangan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {deposits.map((deposit, index) => (
            <tr key={index}>
              <td>{deposit.nama}</td>
              <td>{deposit.ktp}</td>
              <td>{deposit.jumlah}</td>
              <td>{deposit.jangkaWaktu}</td>
              <td>{deposit.bunga}%</td>
              <td>{deposit.status}</td>
              <td>{deposit.tglLahir}</td>
              <td>{deposit.keterangan}</td>
              <td>
                <button
                  onClick={() => updateKeterangan(deposit.id, "Diterima")}
                >
                  Diterima
                </button>
                <button onClick={() => updateKeterangan(deposit.id, "Ditolak")}>
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

// FormRestrukturisasi.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FormRestrukturisasi = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [existingCredits, setExistingCredits] = useState([]);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    kreditId: '',
    jumlahPinjamanTersisa: 0,
    angsuranBulanan: 0,
    jumlahPengajuan: 0,
    jangkaWaktuBaru: 12
  });

  // Fetch user's existing credits
  useEffect(() => {
    const fetchExistingCredits = async () => {
      try {
        const response = await axios.get('http://localhost:5000/kredit/user', {
          withCredentials: true
        });
        setExistingCredits(response.data);
      } catch (err) {
        setError('Gagal mengambil data kredit: ' + err.message);
      }
    };

    fetchExistingCredits();
  }, []);

  // Handle credit selection
  const handleCreditSelection = (creditId) => {
    const selected = existingCredits.find(credit => credit.id === parseInt(creditId));
    setSelectedCredit(selected);
    setFormData(prev => ({
      ...prev,
      kreditId: creditId,
      jumlahPinjamanTersisa: selected.jumlahPinjaman,
      angsuranBulanan: selected.angsuranBulanan
    }));
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'jangkaWaktuBaru' ? parseInt(value) : parseFloat(value)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await axios.post('http://localhost:5000/restrukturisasi', formData, {
        withCredentials: true
      });
      navigate('/daftar-kredit');
    } catch (err) {
      setError('Gagal mengajukan restrukturisasi: ' + err.response?.data?.msg || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Pengajuan Restrukturisasi Kredit</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {/* Credit Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Kredit yang Akan Direstrukturisasi
          </label>
          <select
            name="kreditId"
            value={formData.kreditId}
            onChange={(e) => handleCreditSelection(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          >
            <option value="">Pilih Kredit</option>
            {existingCredits.map(credit => (
              <option key={credit.id} value={credit.id}>
                {credit.nomorKredit} - Rp {credit.jumlahPinjaman.toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        {selectedCredit && (
          <>
            {/* Current Loan Details */}
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Informasi Kredit Saat Ini
              </h3>
              <p className="text-sm text-gray-600">
                Sisa Pinjaman: Rp {formData.jumlahPinjamanTersisa.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Angsuran per Bulan: Rp {formData.angsuranBulanan.toLocaleString()}
              </p>
            </div>

            {/* New Loan Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Pengajuan Baru
              </label>
              <input
                type="number"
                name="jumlahPengajuan"
                value={formData.jumlahPengajuan}
                onChange={handleChange}
                min={0}
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* New Loan Term */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jangka Waktu Baru (Bulan)
              </label>
              <select
                name="jangkaWaktuBaru"
                value={formData.jangkaWaktuBaru}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              >
                <option value={12}>12 Bulan</option>
                <option value={24}>24 Bulan</option>
                <option value={36}>36 Bulan</option>
                <option value={48}>48 Bulan</option>
                <option value={60}>60 Bulan</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isLoading ? 'Memproses...' : 'Ajukan Restrukturisasi'}
              </button>
            </div>
          </>
        )}
      </form>

      <div className="mt-6 text-center text-xs text-gray-600">
        <p>Catatan: Pengajuan restrukturisasi akan diproses dalam 3-5 hari kerja.</p>
        <p>Pastikan data yang dimasukkan sudah benar sebelum mengajukan.</p>
      </div>
    </div>
  );
};

export default FormRestrukturisasi;
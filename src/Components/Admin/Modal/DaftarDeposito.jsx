import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const DaftarDepositoAdmin = () => {
  const [depositoData, setDepositoData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  // Fetch deposits on component mount
  useEffect(() => {
    fetchDeposits();
  }, [user]);

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID');
  };

  // Fetch deposits based on user role
  const fetchDeposits = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = user?.role === 'admin' ? '/deposito' : '/deposito/user';
      const response = await axios.get(`http://localhost:5000${endpoint}`, {
        withCredentials: true
      });
      setDepositoData(response.data);
    } catch (err) {
      setError('Gagal mengambil data deposito: ' + (err.response?.data?.msg || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deposit approval/rejection (admin only)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/deposito/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchDeposits(); // Refresh data after update
    } catch (err) {
      setError('Gagal mengubah status: ' + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
        Daftar Deposito {user?.role === 'admin' ? 'Nasabah' : 'Saya'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4">Memuat data...</div>
      ) : (
        <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">No</th>
                {user?.role === 'admin' && (
                  <th className="py-3 px-6 text-left">Nasabah</th>
                )}
                <th className="py-3 px-6 text-left">Jenis Deposito</th>
                <th className="py-3 px-6 text-left">Nominal</th>
                <th className="py-3 px-6 text-left">Jangka Waktu</th>
                <th className="py-3 px-6 text-left">Suku Bunga</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Tanggal Pengajuan</th>
                {user?.role === 'admin' && (
                  <th className="py-3 px-6 text-left">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {depositoData.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{index + 1}</td>
                  {user?.role === 'admin' && (
                    <td className="py-3 px-6 text-left">{item.User?.username}</td>
                  )}
                  <td className="py-3 px-6 text-left">{item.jenisDeposito}</td>
                  <td className="py-3 px-6 text-left">{`Rp ${Number(item.nominal).toLocaleString()}`}</td>
                  <td className="py-3 px-6 text-left">{item.jangkaWaktu} Bulan</td>
                  <td className="py-3 px-6 text-left">{item.sukuBunga}%</td>
                  <td className="py-3 px-6 text-left">
                    <span className={`px-2 py-1 rounded-full text-white ${
                      item.status === 'Disetujui' 
                        ? 'bg-green-500' 
                        : item.status === 'Ditolak'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-left">{formatDate(item.tanggalPengajuan)}</td>
                  {user?.role === 'admin' && (
                    <td className="py-3 px-6 text-left">
                      {item.status === 'Menunggu Persetujuan' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'Disetujui')}
                            className="text-green-500 hover:text-green-700"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'Ditolak')}
                            className="text-red-500 hover:text-red-700"
                          >
                            Tolak
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DaftarDepositoAdmin;
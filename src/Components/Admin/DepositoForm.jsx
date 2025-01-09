import React, { useState, useEffect } from 'react';

const DepositoForm = () => {
    const [pengajuanList, setPengajuanList] = useState([]);

    const fetchPengajuan = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/pengajuan');
            const data = await response.json();
            setPengajuanList(data);
        } catch (error) {
            console.error('Error fetching pengajuan:', error);
        }
    };

    useEffect(() => {
        fetchPengajuan();  
    }, []);

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
                        <th>Tanda Tangan</th>
                    </tr>
                </thead>
                <tbody>
                    {pengajuanList.map((pengajuan, index) => (
                        <tr key={index}>
                            <td>{pengajuan.nama}</td>
                            <td>{pengajuan.ktp}</td>
                            <td>{pengajuan.jumlah}</td>
                            <td>{pengajuan.jangkaWaktu}</td>
                            <td>{pengajuan.bunga}%</td>
                            <td>{pengajuan.status}</td>
                            <td>{pengajuan.tglLahir}</td>
                            <td>
                                {pengajuan.tandaTangan ? (
                                    <img
                                        src={pengajuan.tandaTangan}
                                        alt="Tanda Tangan"
                                        style={{ maxWidth: '100px' }}
                                    />
                                ) : (
                                    'Tidak ada tanda tangan'
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DepositoForm;

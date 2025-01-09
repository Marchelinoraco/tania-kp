import React, { useState, useEffect } from 'react';

const TabelKredit = () => {
  // State variables to store selected values
  const [jenisKredit, setJenisKredit] = useState('');
  const [plafon, setPlafon] = useState('');
  const [jangkaWaktu, setJangkaWaktu] = useState('');
  const [sukuBunga, setSukuBunga] = useState('');
  const [jenisSukuBunga, setJenisSukuBunga] = useState('');
  const [hasilSimulasi, setHasilSimulasi] = useState(null);
  const [angsuranBulanan, setAngsuranBulanan] = useState(null);

  // Predefined data for Jenis Kredit and corresponding Plafon, Jangka Waktu, and Suku Bunga
  const kreditOptions = [
    {
      jenis: 'Modal Kerja Konsumtif Investasi',
      plafon: [
        { range: '5.000.000 - < 25.000.000', sukuBunga: '24%', jenisSukuBunga: 'flat to anuitas' },
        { range: '25.000.000 - < 50.000.000', sukuBunga: '14%', jenisSukuBunga: 'flat to anuitas' },
        { range: '50.000.000 - < 100.000.000', sukuBunga: '12%', jenisSukuBunga: 'flat to anuitas' },
        { range: '100.000.000 - < 200.000.000', sukuBunga: '12%', jenisSukuBunga: 'flat to anuitas' },
        { range: '200.000.000 - < 500.000.000', sukuBunga: '12%', jenisSukuBunga: 'anuitas' },
        { range: '> 500.000.000', sukuBunga: '12%', jenisSukuBunga: 'anuitas' },
      ],
      jangkaWaktu: ['6', '12', '24', '36', '48', '60'],
    },
    {
      jenis: 'Modal Kerja (Bridging Loan)',
      plafon: [{ range: 's.d maks. BMPK', sukuBunga: '24%', jenisSukuBunga: 'flat to anuitas' }],
      jangkaWaktu: ['6', '12'],
    },
    {
      jenis: 'Kredit Internal ANP',
      plafon: [
        { range: '5.000.000 - 100.000.000', sukuBunga: 'Sesuai LPS', jenisSukuBunga: 'anuitas' },
        { range: '> 100.000.000 s.d maks. BMPK', sukuBunga: 'Sesuai LPS', jenisSukuBunga: 'anuitas' },
      ],
      jangkaWaktu: ['6', '12', '24', '36', '48', '60'],
    },
  ];

  // Handle change in Jenis Kredit selection
  const handleJenisKreditChange = (e) => {
    setJenisKredit(e.target.value);
    setPlafon(''); // Reset Plafon when Jenis Kredit changes
    setSukuBunga('');
    setJenisSukuBunga('');
    setAngsuranBulanan(null);
  };

  // Handle change in Plafon selection
  const handlePlafonChange = (e) => {
    setPlafon(e.target.value);
    const selectedPlafon = kreditOptions.find(kredit => kredit.jenis === jenisKredit).plafon.find(plafon => plafon.range === e.target.value);
    setSukuBunga(selectedPlafon.sukuBunga);
    setJenisSukuBunga(selectedPlafon.jenisSukuBunga);
    setAngsuranBulanan(null); // Reset Angsuran Bulanan when Plafon changes
  };

  // Handle change in Jangka Waktu
  const handleJangkaWaktuChange = (e) => {
    setJangkaWaktu(e.target.value);
    setAngsuranBulanan(null); // Reset Angsuran Bulanan when Jangka Waktu changes
  };

  // Calculate Simulasi and Angsuran Bulanan
  const calculateSimulasi = () => {
    // Calculate the monthly interest rate (annual rate divided by 12)
    const annualRate = parseFloat(sukuBunga.replace('%', '').trim()) / 100;
    const monthlyRate = annualRate / 12;

    // Convert Plafon to a number
    const plafonNumber = parseFloat(plafon.replace(/[^\d.-]/g, '').trim());

    // Number of months (Jangka Waktu)
    const months = parseInt(jangkaWaktu);

    // Calculate the monthly installment (Angsuran Bulanan) using the formula for Anuitas
    const angsuran = (plafonNumber * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    
    setHasilSimulasi(`Jenis Kredit: ${jenisKredit}, Plafon: ${plafon}, Jangka Waktu: ${jangkaWaktu} bulan, Suku Bunga: ${sukuBunga}, Jenis Suku Bunga: ${jenisSukuBunga}`);
    setAngsuranBulanan(angsuran.toFixed(2)); // Set Angsuran Bulanan with 2 decimal places
  };

  return (
    <div>
      <section id="contact" className="px-6 my-15">
        <div className="contact">
          <h2 className="text-base my-18 text-center font-bold">Simulasi Kredit</h2>
          <form onSubmit={(e) => { e.preventDefault(); calculateSimulasi(); }}>

            <div className="mb-4">
              <label htmlFor="jenisKredit" className="block text-sm font-medium">Jenis Kredit</label>
              <select
                id="jenisKredit"
                value={jenisKredit}
                onChange={handleJenisKreditChange}
                className="w-full p-2 border border-gray-300"
              >
                <option value="">Pilih Jenis Kredit</option>
                {kreditOptions.map((option, index) => (
                  <option key={index} value={option.jenis}>{option.jenis}</option>
                ))}
              </select>
            </div>

            {jenisKredit && (
              <>
                <div className="mb-4">
                  <label htmlFor="plafon" className="block text-sm font-medium">Plafon</label>
                  <select
                    id="plafon"
                    value={plafon}
                    onChange={handlePlafonChange}
                    className="w-full p-2 border border-gray-300"
                  >
                    <option value="">Pilih Plafon</option>
                    {kreditOptions.find(kredit => kredit.jenis === jenisKredit).plafon.map((option, index) => (
                      <option key={index} value={option.range}>{option.range}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="jangkaWaktu" className="block text-sm font-medium">Jangka Waktu (Bulan)</label>
                  <select
                    id="jangkaWaktu"
                    value={jangkaWaktu}
                    onChange={handleJangkaWaktuChange}
                    className="w-full p-2 border border-gray-300"
                  >
                    <option value="">Pilih Jangka Waktu</option>
                    {kreditOptions.find(kredit => kredit.jenis === jenisKredit).jangkaWaktu.map((option, index) => (
                      <option key={index} value={option}>{option} bulan</option>
                    ))}
                  </select>
                </div>

                {plafon && jangkaWaktu && (
                  <>
                    <div className="mb-4">
                      <label htmlFor="sukuBunga" className="block text-sm font-medium">Suku Bunga (p.a)</label>
                      <input
                        id="sukuBunga"
                        type="text"
                        value={sukuBunga}
                        readOnly
                        className="w-full p-2 border border-gray-300"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="jenisSukuBunga" className="block text-sm font-medium">Jenis Suku Bunga</label>
                      <input
                        id="jenisSukuBunga"
                        type="text"
                        value={jenisSukuBunga}
                        readOnly
                        className="w-full p-2 border border-gray-300"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="angsuranBulanan" className="block text-sm font-medium">Angsuran Bulanan</label>
                      <input
                        id="angsuranBulanan"
                        type="text"
                        value={angsuranBulanan ? `Rp ${angsuranBulanan}` : ''}
                        readOnly
                        className="w-full p-2 border border-gray-300"
                      />
                    </div>

                    <button type="submit" className="bg-blue-500 text-white p-2 mt-4">Hitung Simulasi</button>
                  </>
                )}
              </>
            )}
          </form>

          {hasilSimulasi && (
            <div className="mt-6">
              <h3 className="font-bold">Hasil Simulasi</h3>
              <p>{hasilSimulasi}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TabelKredit;

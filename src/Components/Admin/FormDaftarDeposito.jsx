import React, { useState } from 'react';
import './FormDaftarDeposito.css'; // Ensure you add appropriate CSS for styling

const FormDaftarDeposito = () => {
  const [formData, setFormData] = useState({
    nama: '',
    ktp: '',
    tglLahir: '',
    jenisKelamin: 'L',
    alamat: '',
    telepon: '',
    email: '',
    pekerjaan: '',
    status: 'single',
    noRekening: '',
    bank: '',
    jumlah: '',
    jangkaWaktu: '1_bulan',
    bunga: 4.5,
    mataUang: 'idr',
    persetujuan: false,
    tandaTangan: null,
  });

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

    if (name === 'jumlah') {
      const jumlah = Number(value);
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
        bunga: calculateBunga(jumlah),
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleTandaTanganChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prevState) => ({
        ...prevState,
        tandaTangan: reader.result,
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Data Form:', formData);
    alert('Pengajuan deposito berhasil!');
  };

  return (
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
          <br /><br />

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
          <br /><br />

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
          <br /><br />

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
          <br /><br />

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
          <br /><br />

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
          <br /><br />

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
          <br /><br />

          <label>
            Pekerjaan:
            <input
              type="text"
              name="pekerjaan"
              value={formData.pekerjaan}
              onChange={handleChange}
            />
          </label>
          <br /><br />

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
          <br /><br />

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
          <br /><br />
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
          <br /><br />

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
          <br /><br />

          <label>
            Bunga Deposito: {formData.bunga}%
          </label>
          <br /><br />

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
              <span className="bold">Saya setuju dengan syarat dan ketentuan deposito.</span>
            </label>
            <br />
            <label>
              Tanda Tangan (unggah gambar):
              <input
                type="file"
                name="tandaTangan"
                accept="image/*"
                onChange={handleTandaTanganChange}
                required
              />
            </label>
            {formData.tandaTangan && (
              <div>
                <p>Tanda tangan Anda:</p>
                <img
                  src={formData.tandaTangan}
                  alt="Tanda Tangan"
                  style={{ maxWidth: '200px' }}
                />
              </div>
            )}
          </div>
        </fieldset>

        {/* Tombol Daftar Deposito */}
        <button className="submit-btn" type="submit">Daftar Deposito</button>
      </form>
    </div>
  );
};

export default FormDaftarDeposito;

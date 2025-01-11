import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import DasboardPage from "./Pages/DasboardPage";
import DepositoSimulasiPage from "./Pages/DepositoSimulasiPage";
import KreditSimulasiPage from "./Pages/KreditSimulasiPage";
import AdminPengaduanPage from "./Pages/Admin/PengaduanPage";
import KontakAoPage from "./Pages/KontakAoNasabahPage";
import KontakAoPageAdmin from "./Pages/KontakAoAdminPage";
import ChatAoPage from "./Pages/ChatAoPage";
import AjukanRekPage from "./Pages/Admin/AjukanRekPage";
import DaftarPage from "./Pages/DaftarPage";
import TabelDepositoPage from "./Pages/TabelDepositoPage";
import TabelKreditPage from "./Pages/Admin/TabelKreditPage";

import DaftarKreditPage from "./Pages/Admin/DaftarKreditPage";
import AjukanTopUpPage from "./Pages/Admin/AjukanTopUpPage";
import AjukanTopUpNasabahPage from "./Pages/AjukanTopUpNasabah";
import AjukanRekNasabahPage from "./Pages/AjukanRekNasabahPage";
import PengaduanNasabahPage from "./Pages/PengaduanNasabahPage";
import DaftarKreditNasabahPage from "./Pages/DaftarKreditNasabahPage";
import FormDaftarDepositoAdmin from "./Pages/FormDaftarDepositoAdminPage";
import FormDaftarDepositoUser from "./Pages/FormDaftarDepositoNasabahPage";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/daftar" element={<DaftarPage />} />
          <Route path="/dasbor" element={<DasboardPage />} />

          {/* Protected Routes - Both Admin & User */}
          <Route path="/deposito/simulasi" element={<DepositoSimulasiPage />} />

          {/* Protected Routes - Admin Only */}
          <Route path="/tabel-deposito" element={<TabelDepositoPage />} />

          {/* Protected Routes - User Only */}
          <Route
            path="/form-daftar-deposito"
            element={<FormDaftarDepositoAdmin />}
          />
          <Route
            path="/form-daftar-deposito-nasabah"
            element={<FormDaftarDepositoUser />}
          />

          {/* //Admin */}
          <Route path="/deposito/simulasi" element={<DepositoSimulasiPage />} />
          <Route path="/tabel-deposito" element={<TabelDepositoPage />} />
          <Route path="/tabel-kredit" element={<TabelKreditPage />} />
          <Route path="/kredit/simulasi" element={<KreditSimulasiPage />} />
          <Route path="/daftar-kredit" element={<DaftarKreditNasabahPage />} />
          <Route path="/pengaduan" element={<AdminPengaduanPage />} />
          <Route path="/pengaduan-nasabah" element={<PengaduanNasabahPage />} />
          <Route path="/kontak-ao" element={<KontakAoPage />} />
          <Route path="/kontak-ao-admin" element={<KontakAoPageAdmin />} />
          {/* Chat AO */}
          <Route path="/chat-ao" element={<ChatAoPage />} />
          {/* ajukan rek */}
          <Route path="/ajukan-rek" element={<AjukanRekPage />} />
          <Route
            path="/ajukan-rek-nasabah"
            element={<AjukanRekNasabahPage />}
          />
          <Route path="/admin-daftar-kredit" element={<DaftarKreditPage />} />
          <Route
            path="/nasabah-daftar-kredit"
            element={<DaftarKreditNasabahPage />}
          />
          <Route path="/ajukan-topup" element={<AjukanTopUpPage />} />
          <Route
            path="/ajukan-topup-nasabah"
            element={<AjukanTopUpNasabahPage />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

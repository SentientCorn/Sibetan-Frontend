import React, { useState } from 'react';
import { MapPin, Sparkles, Package, Image as ImageIcon, AlertCircle, CheckCircle2, Phone, BookOpen } from 'lucide-react';
import { API_BASE, SERVER_ORIGIN } from '../../services/api';
import AdminLogin from '../../components/admin/auth/AdminLogin';
import AdminHeader from '../../components/admin/layout/AdminHeader';
import AdminTabs from '../../components/admin/layout/AdminTabs';
import DestinationsManager from '../../components/admin/destinations/DestinationsManager';
import CulturesManager from '../../components/admin/cultures/CulturesManager';
import PackagesManager from '../../components/admin/packages/PackagesManager';
import HeroesManager from '../../components/admin/heroes/HeroesManager';
import ContactManager from '../../components/admin/contact/ContactManager';
import KknWorksManager from '../../components/admin/kkn/KknWorksManager';
import Toast from '../../components/ui/Toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('destinations');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Auth state
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '');
  const [username, setUsername] = useState(() => localStorage.getItem('admin_username') || '');
  const [message, setMessage] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const showMessage = (type, text) => {
    setMessage({ type, text, id: Date.now() });
  };

  const handleUnauthorized = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    setToken('');
    setUsername('');
    showMessage('error', 'Sesi Anda telah berakhir atau tidak valid. Silakan login kembali.');
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    showMessage('success', 'Memproses logout...');
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (err) {}
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    setToken('');
    setUsername('');
    setLogoutLoading(false);
    showMessage('success', 'Logout berhasil');
  };

  const tabs = [
    { id: 'destinations', label: 'Destinasi Wisata', icon: MapPin },
    { id: 'cultures', label: 'Kesenian & Adat', icon: Sparkles },
    { id: 'packages', label: 'Paket Wisata & Akomodasi', icon: Package },
    { id: 'heroes', label: 'Gambar Laman Utama', icon: ImageIcon },
    { id: 'kkn-works', label: 'Karya KKN UGM (Peta & Modul)', icon: BookOpen },
    { id: 'contact', label: 'Pengaturan Kontak', icon: Phone },
  ];

  if (!token) {
    return (
      <div className="relative">
        <Toast message={message} onClose={() => setMessage(null)} />
        <AdminLogin 
          API_BASE={API_BASE} 
          onLoginSuccess={(newToken, newUsername) => {
            setToken(newToken);
            setUsername(newUsername);
            showMessage('success', 'Login berhasil! Anda dapat memodifikasi data.');
          }} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-jakarta text-slate-800 pb-12">
      <AdminHeader 
        username={username} 
        API_BASE={API_BASE} 
        onLogout={handleLogout} 
        logoutLoading={logoutLoading}
      />

      <main className="max-w-6xl mx-auto px-6 mt-6">
        <Toast message={message} onClose={() => setMessage(null)} />

        <AdminTabs 
          tabs={tabs} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onRefresh={() => setRefreshKey(k => k + 1)} 
        />

        <div className={activeTab === 'destinations' ? 'block' : 'hidden'}>
          <DestinationsManager 
            key={`destinations-${refreshKey}`}
            token={token}
            API_BASE={API_BASE}
            SERVER_ORIGIN={SERVER_ORIGIN}
            showMessage={showMessage}
            onUnauthorized={handleUnauthorized}
          />
        </div>

        <div className={activeTab === 'cultures' ? 'block' : 'hidden'}>
          <CulturesManager 
            key={`cultures-${refreshKey}`}
            token={token}
            API_BASE={API_BASE}
            SERVER_ORIGIN={SERVER_ORIGIN}
            showMessage={showMessage}
            onUnauthorized={handleUnauthorized}
          />
        </div>

        <div className={activeTab === 'packages' ? 'block' : 'hidden'}>
          <PackagesManager 
            key={`packages-${refreshKey}`}
            token={token}
            API_BASE={API_BASE}
            SERVER_ORIGIN={SERVER_ORIGIN}
            showMessage={showMessage}
            onUnauthorized={handleUnauthorized}
          />
        </div>

        <div className={activeTab === 'heroes' ? 'block' : 'hidden'}>
          <HeroesManager 
            key={`heroes-${refreshKey}`}
            token={token}
            API_BASE={API_BASE}
            SERVER_ORIGIN={SERVER_ORIGIN}
            showMessage={showMessage}
            onUnauthorized={handleUnauthorized}
          />
        </div>

        <div className={activeTab === 'kkn-works' ? 'block' : 'hidden'}>
          <KknWorksManager 
            key={`kkn-works-${refreshKey}`}
            token={token}
            API_BASE={API_BASE}
            SERVER_ORIGIN={SERVER_ORIGIN}
            showMessage={showMessage}
            onUnauthorized={handleUnauthorized}
          />
        </div>

        <div className={activeTab === 'contact' ? 'block' : 'hidden'}>
          <ContactManager 
            key={`contact-${refreshKey}`}
            token={token}
            API_BASE={API_BASE}
            SERVER_ORIGIN={SERVER_ORIGIN}
            showMessage={showMessage}
            onUnauthorized={handleUnauthorized}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;


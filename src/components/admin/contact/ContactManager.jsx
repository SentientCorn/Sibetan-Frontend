import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, MapPin } from 'lucide-react';
import { useContact } from '../../../hooks/useContact';
import MapPicker from './MapPicker';

const ContactManager = ({ token, API_BASE, showMessage, onUnauthorized }) => {
  const { contact, loading, refetch: fetchData } = useContact();
  const [actionLoading, setActionLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', address: '', phone: '', website: '', mapEmbedUrl: '', mapLink: '', copyright: ''
  });

  // Load existing data into form
  useEffect(() => {
    if (contact) {
      setForm({
        title: contact.title || '',
        description: contact.description || '',
        address: contact.address || '',
        phone: contact.phone || '',
        website: contact.website || '',
        mapEmbedUrl: contact.mapEmbedUrl || '',
        mapLink: contact.mapLink || '',
        copyright: contact.copyright || ''
      });
    }
  }, [contact]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      showMessage('error', 'Silakan login terlebih dahulu untuk menyimpan pengaturan');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'PUT', // or PATCH
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(form)
      });
      
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json();
      if (res.ok) {
        showMessage('success', data.message || 'Pengaturan kontak berhasil disimpan');
        fetchData();
      } else {
        showMessage('error', data.error || 'Gagal menyimpan pengaturan kontak');
      }
    } catch (err) {
      showMessage('error', 'Terjadi kesalahan jaringan saat menyimpan data. Pastikan backend sudah siap.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Memuat data kontak...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1B3461]">Pengaturan Kontak & Umum</h2>
          <p className="text-sm text-slate-500 mt-1">Ubah informasi kontak yang ditampilkan di laman utama, navbar, dan footer.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-sm text-slate-700 mb-1.5">Judul Kontak <span className="text-rose-500">*</span></label>
            <input 
              type="text" 
              required 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})} 
              className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:border-[#1B3461]" 
              placeholder="Contoh: Hubungi Kami"
            />
          </div>
          <div>
            <label className="block font-bold text-sm text-slate-700 mb-1.5">Telepon / WhatsApp <span className="text-rose-500">*</span></label>
            <input 
              type="text" 
              required 
              value={form.phone} 
              onChange={e => setForm({...form, phone: e.target.value})} 
              className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:border-[#1B3461]" 
              placeholder="Contoh: +62 812-3456-7890"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-sm text-slate-700 mb-1.5">Deskripsi Singkat <span className="text-rose-500">*</span></label>
            <textarea 
              required 
              rows={2}
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:border-[#1B3461]" 
              placeholder="Contoh: Silakan hubungi kami untuk informasi mengenai paket wisata, pemesanan akomodasi, atau reservasi pemandu lokal di Desa Wisata Sibetan."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-sm text-slate-700 mb-1.5">Alamat Lengkap <span className="text-rose-500">*</span></label>
            <textarea 
              required 
              rows={2}
              value={form.address} 
              onChange={e => setForm({...form, address: e.target.value})} 
              className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:border-[#1B3461]" 
              placeholder="Contoh: Jl. Raya Sibetan, Banjar Telaga, Kecamatan Bebandem, Kabupaten Karangasem, Bali 80861"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block font-bold text-sm text-slate-700 mb-1.5">Website (URL) <span className="text-rose-500">*</span></label>
            <input 
              type="text" 
              required 
              value={form.website} 
              onChange={e => setForm({...form, website: e.target.value})} 
              className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:border-[#1B3461]" 
              placeholder="Contoh: sibetan.desa.id"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-sm text-slate-700 mb-1.5">Copyright Footer <span className="text-rose-500">*</span></label>
            <input 
              type="text" 
              required 
              value={form.copyright} 
              onChange={e => setForm({...form, copyright: e.target.value})} 
              className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:border-[#1B3461]" 
              placeholder="Contoh: &copy; 2026 Desa Sibetan. Dikembangkan oleh UGM."
            />
            <p className="text-xs text-slate-500 mt-1">Gunakan &amp;copy; untuk menampilkan simbol ©.</p>
          </div>

          <div className="md:col-span-2 mt-4 pt-4 border-t border-slate-100">
            <label className="block font-bold text-sm text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-500" />
              Tentukan Titik Lokasi Peta
            </label>
            <p className="text-xs text-slate-500 mb-3">Geser atau klik pada peta untuk menentukan lokasi persis. Link Google Maps akan dibuat secara otomatis berdasarkan titik yang Anda pilih.</p>
            
            {(() => {
              let initLat = -8.4410;
              let initLng = 115.5390;
              if (form.mapEmbedUrl && form.mapEmbedUrl.includes('q=')) {
                const match = form.mapEmbedUrl.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
                if (match) {
                  initLat = match[1];
                  initLng = match[2];
                }
              }
              return (
                <MapPicker 
                  initialLat={initLat}
                  initialLng={initLng}
                  onChange={(lat, lng) => {
                    setForm(prev => ({
                      ...prev,
                      mapEmbedUrl: `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
                      mapLink: `https://www.google.com/maps/place/${lat},${lng}`
                    }));
                  }}
                />
              );
            })()}

            {/* Hidden fields just to ensure they submit, or we can just leave them out of UI since they are in state */}
            <input type="hidden" value={form.mapEmbedUrl} />
            <input type="hidden" value={form.mapLink} />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1">
             <AlertCircle className="w-3.5 h-3.5" />
             Perubahan akan langsung diterapkan ke website.
          </div>
          <button 
            type="submit" 
            disabled={actionLoading}
            className="bg-[#1B3461] hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {actionLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactManager;

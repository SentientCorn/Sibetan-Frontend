import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Image as ImageIcon, Eye } from 'lucide-react';
import Modal from '../../ui/Modal';
import DestinationModalContent from '../../landing-page/destinations/DestinationModalContent';
import ImageUploader from '../../ui/ImageUploader';
import AdminActionBar from '../../ui/AdminActionBar';
import AdminFormCard from '../../ui/AdminFormCard';
import AdminTable from '../../ui/AdminTable';
import { useDestinations, isValidGoogleMapsLink, getGoogleMapsEmbedUrl, getGoogleMapsLink } from '../../../hooks/useDestinations';

const DestinationsManager = ({ token, API_BASE, SERVER_ORIGIN, showMessage, onUnauthorized }) => {
  const { destinations, loading, refetch: fetchData } = useDestinations({ onUnauthorized });
  const [actionLoading, setActionLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [form, setForm] = useState({
    title: '', address: '', mapsSource: '', openHours: '', description: '', tips: '',
    contactName: '', contactPhone: '', contactNote: ''
  });

  const resetForm = () => {
    setForm({ title: '', address: '', mapsSource: '', openHours: '', description: '', tips: '', contactName: '', contactPhone: '', contactNote: '' });
    setExistingImages([]);
    setSelectedFiles([]);
    setEditId(null);
    setShowAddForm(false);
  };

  const handleEditClick = (item) => {
    setForm({
      title: item.title || '',
      address: item.address || '',
      mapsSource: item.mapsSource || '',
      openHours: item.openHours || '',
      description: item.description || '',
      tips: item.tips || '',
      contactName: item.contact?.name || '',
      contactPhone: item.contact?.phone || '',
      contactNote: item.contact?.note || ''
    });
    setExistingImages(item.originalImages || []);
    setSelectedFiles([]);
    setEditId(item.id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveOldImage = async (imageId) => {
    if (!token) {
      showMessage('error', 'Silakan login terlebih dahulu');
      return;
    }
    if (!window.confirm('Yakin ingin menghapus foto lama ini dari database?')) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/destinations/images/${imageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json();
      if (res.ok) {
        showMessage('success', data.message || 'Foto berhasil dihapus');
        setExistingImages(prev => prev.filter(img => img.id !== imageId));
        fetchData(true);
      } else {
        showMessage('error', data.error || 'Gagal menghapus foto');
      }
    } catch (err) {
      showMessage('error', 'Terjadi kesalahan jaringan saat menghapus foto');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!token) {
      showMessage('error', 'Silakan login terlebih dahulu untuk menghapus data');
      return;
    }
    if (!window.confirm('Yakin ingin menghapus data ini dari database?')) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/destinations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json();
      if (res.ok) {
        showMessage('success', data.message || 'Data berhasil dihapus');
        if (editId === id) resetForm();
        fetchData(true);
      } else {
        showMessage('error', data.error || 'Gagal menghapus data');
      }
    } catch (err) {
      showMessage('error', 'Terjadi kesalahan jaringan saat menghapus data');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      showMessage('error', `Silakan login terlebih dahulu untuk ${editId ? 'memperbarui' : 'menambah'} data`);
      return;
    }

    const payload = new FormData();
    Object.keys(form).forEach(key => {
      payload.append(key, form[key] !== null && form[key] !== undefined ? form[key] : '');
    });
    selectedFiles.forEach(file => {
      payload.append('images', file);
    });

    const url = editId ? `${API_BASE}/destinations/${editId}` : `${API_BASE}/destinations`;
    const method = editId ? 'PUT' : 'POST';

    setActionLoading(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
        body: payload
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json();
      if (res.ok) {
        showMessage('success', data.message || `Data berhasil ${editId ? 'diperbarui' : 'ditambahkan'}`);
        resetForm();
        fetchData(true);
      } else {
        let errMsg = data.error || `Gagal ${editId ? 'memperbarui' : 'menambahkan'} data`;
        if (data.details && Array.isArray(data.details) && data.details.length > 0) {
          errMsg += ': ' + data.details.map(d => `${d.path} - ${d.message}`).join(', ');
        }
        showMessage('error', errMsg);
      }
    } catch (err) {
      showMessage('error', 'Terjadi kesalahan jaringan saat mengirim data');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    { header: 'ID', key: 'id', className: 'font-mono font-bold text-slate-700' },
    { header: 'Judul', key: 'title', className: 'font-bold text-slate-900' },
    { header: 'Alamat', key: 'address', className: 'text-slate-600' },
    { header: 'Jam Buka', key: 'openHours', className: 'text-slate-600' },
    {
      header: 'Koordinat',
      key: 'coords',
      className: 'text-slate-600 font-mono text-xs',
      render: (d) => (d.latitude && d.longitude) ? `${Number(d.latitude).toFixed(4)}, ${Number(d.longitude).toFixed(4)}` : '-'
    },
    { header: 'Gambar', key: 'images', className: 'text-slate-600', render: (d) => `${d.originalImages?.length || 0} foto` },
    {
      header: 'Aksi', key: 'action', headerClassName: 'text-right', className: 'text-right space-x-2', render: (d) => (
        <>
          <button
            type="button"
            onClick={() => setPreviewItem(d)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            type="button"
            onClick={() => handleEditClick(d)}
            className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-2.5 py-1 rounded font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => handleDelete(d.id)}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1 rounded font-bold inline-flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Hapus
          </button>
        </>
      )
    }
  ];

  return (
    <div>
      <AdminActionBar
        title="Destinasi Wisata"
        isAddMode={showAddForm && !editId}
        onAddClick={() => {
          if (showAddForm && !editId) {
            resetForm();
          } else {
            setEditId(null);
            setForm({ title: '', address: '', mapsSource: '', openHours: '', description: '', tips: '', latitude: '', longitude: '', contactName: '', contactPhone: '', contactNote: '' });
            setExistingImages([]);
            setSelectedFiles([]);
            setShowAddForm(true);
          }
        }}
      />

      <AdminFormCard
        isOpen={showAddForm}
        title="Destinasi Wisata"
        editId={editId}
        actionLoading={actionLoading}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        submitTextAdd="Simpan Destinasi"
        submitTextEdit="Simpan Perubahan"
        gridCols="md:grid-cols-2"
      >
        <div>
          <label className="block font-bold mb-1">Nama Wisata <span className="text-rose-500">*</span></label>
          <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border p-2 rounded" placeholder="Contoh: Agrowisata Salak Sibetan" />
        </div>
        <div>
          <label className="block font-bold mb-1">Alamat <span className="text-rose-500">*</span></label>
          <input type="text" required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full border p-2 rounded" placeholder="Contoh: Banjar Telaga, Desa Sibetan, Bebandem, Karangasem" />
        </div>
        <div>
          <label className="block font-bold mb-1">Jam Buka <span className="text-xs font-normal text-slate-500">(Opsional)</span></label>
          <input type="text" value={form.openHours} onChange={e => setForm({ ...form, openHours: e.target.value })} className="w-full border p-2 rounded" placeholder="Contoh: Setiap Hari, 08:00 - 17:00 WITA" />
        </div>

        <div>
          <label className="block font-bold mb-1">Link Google Maps <span className="text-xs font-normal text-slate-500">(Opsional)</span></label>
          <input
            type="text"
            value={form.mapsSource}
            onChange={e => setForm({ ...form, mapsSource: e.target.value })}
            className="w-full border p-2 rounded"
            placeholder="Contoh: https://maps.app.goo.gl/... atau <iframe src='...'></iframe>"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block font-bold mb-1">Deskripsi Lengkap <span className="text-rose-500">*</span></label>
          <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border p-2 rounded" placeholder="Contoh: Agrowisata Salak Sibetan menawarkan pengalaman memetik buah salak bali langsung dari pohonnya, serta menikmati keindahan kebun salak organik yang rindang..." />
        </div>
        <div className="md:col-span-2">
          <label className="block font-bold mb-1">Tips Wisatawan <span className="text-xs font-normal text-slate-500">(Opsional)</span></label>
          <textarea rows={2} value={form.tips} onChange={e => setForm({ ...form, tips: e.target.value })} className="w-full border p-2 rounded" placeholder="Contoh: Gunakan pakaian dan alas kaki yang nyaman untuk trekking di kebun..." />
        </div>
        
        <div className="md:col-span-2 border-t mt-2 pt-4">
          <h3 className="font-bold text-lg mb-3 text-slate-800">Kontak Pengelola Destinasi</h3>
        </div>
        <div>
          <label className="block font-bold mb-1">Nama Kontak <span className="text-xs font-normal text-slate-500">(Opsional)</span></label>
          <input type="text" value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} className="w-full border p-2 rounded" placeholder="Contoh: Pak Wayan" />
        </div>
        <div>
          <label className="block font-bold mb-1">Nomor WhatsApp/Telepon <span className="text-xs font-normal text-slate-500">(Opsional)</span></label>
          <input type="text" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} className="w-full border p-2 rounded" placeholder="Contoh: 6281234567890" />
        </div>
        <div className="md:col-span-2">
          <label className="block font-bold mb-1">Catatan Kontak <span className="text-xs font-normal text-slate-500">(Opsional)</span></label>
          <textarea rows={2} value={form.contactNote} onChange={e => setForm({ ...form, contactNote: e.target.value })} className="w-full border p-2 rounded" placeholder="Contoh: Hubungi untuk reservasi grup atau paket wisata khusus..." />
        </div>

        {editId && existingImages.length > 0 && (
          <div className="md:col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2">
            <label className="block font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-amber-600" />
              <span>Daftar Gambar Saat Ini di Database ({existingImages.length} foto):</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {existingImages.map((img) => (
                <div key={img.id} className="relative bg-white rounded-lg border border-slate-200 p-1.5 shadow-2xs flex flex-col items-center">
                  <img src={img.imageUrl} alt="existing" className="w-full h-24 object-cover rounded mb-1.5" />
                  <button type="button" disabled={actionLoading} onClick={() => handleRemoveOldImage(img.id)} className="w-full bg-rose-100 hover:bg-rose-200 text-rose-700 py-1 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                    <Trash2 className="w-3 h-3" />
                    <span>Hapus Foto Ini</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="md:col-span-2 mt-2">
          <ImageUploader
            editMode={!!editId}
            label={editId ? 'Tambah Foto Baru (Akan ditambahkan ke daftar gambar di atas):' : 'Upload Foto Destinasi (Multiple) *'}
            onFilesSelected={(newFiles) => setSelectedFiles(prev => [...prev, ...newFiles])}
          />
          {selectedFiles.length > 0 && (
            <div className="mt-3 bg-blue-50/50 p-3 rounded-xl border border-blue-200">
              <label className="block font-bold text-blue-900 mb-2 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>Daftar Foto Baru yang Dipilih ({selectedFiles.length} file siap diunggah):</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="relative bg-white rounded-lg border border-blue-200 p-1.5 shadow-2xs flex flex-col items-center">
                    <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-24 object-cover rounded mb-1.5" />
                    <div className="w-full flex items-center justify-between gap-1 px-1 mb-1">
                      <span className="truncate text-[10px] text-slate-600 font-medium" title={file.name}>{file.name}</span>
                    </div>
                    <button type="button" onClick={() => handleRemoveSelectedFile(idx)} className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 py-1 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
                      <Trash2 className="w-3 h-3" />
                      <span>Batal Unggah</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AdminFormCard>

      <AdminTable
        loading={loading}
        data={destinations}
        columns={columns}
        emptyMessage="Belum ada data destinasi di database backend."
        editId={editId}
      />

      {/* Detail Modal Preview */}
      <Modal isOpen={!!previewItem} onClose={() => setPreviewItem(null)}>
        {previewItem && (
          <DestinationModalContent
            destination={{
              ...previewItem,
              title: previewItem.title,
              location: previewItem.address || previewItem.location || '-',
              time: previewItem.openHours || previewItem.time || '-',
              description: previewItem.description || '-',
              fullDescription: previewItem.description || '-',
              tips: previewItem.tips || '',
              mapEmbedUrl: getGoogleMapsEmbedUrl(previewItem),
              mapLink: getGoogleMapsLink(previewItem),
              latitude: previewItem.latitude || null,
              longitude: previewItem.longitude || null,
              contact: previewItem.contact || null
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default DestinationsManager;

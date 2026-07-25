import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Image as ImageIcon, Eye } from 'lucide-react';
import Modal from '../../ui/Modal';
import PackageModalContent from '../../landing-page/packages/PackageModalContent';
import ImageUploader from '../../ui/ImageUploader';
import AdminActionBar from '../../ui/AdminActionBar';
import AdminFormCard from '../../ui/AdminFormCard';
import AdminTable from '../../ui/AdminTable';
import TagInput from '../../ui/TagInput';
import { usePackages } from '../../../hooks/usePackages';

const PackagesManager = ({ token, API_BASE, SERVER_ORIGIN, showMessage, onUnauthorized }) => {
  const { packages: tourPackages, loading, refetch: fetchData } = usePackages({ onUnauthorized });
  const [actionLoading, setActionLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [form, setForm] = useState({
    title: '', type: 'WISATA', price: '', duration: '', description: '', facilities: '', capacity: '', contactName: '', contactPhone: '', contactNote: ''
  });

  const resetForm = () => {
    setForm({ title: '', type: 'WISATA', price: '', duration: '', description: '', facilities: '', capacity: '', contactName: '', contactPhone: '', contactNote: '' });
    setExistingImages([]);
    setSelectedFiles([]);
    setEditId(null);
    setShowAddForm(false);
  };

  const handleEditClick = (item) => {
    const rawPriceVal = item.rawPrice !== undefined ? item.rawPrice : item.price;
    const cleanPrice = String(rawPriceVal || '').replace(/[^0-9.]/g, '');

    setForm({
      title: item.title || '',
      type: item.type || 'WISATA',
      price: cleanPrice,
      duration: item.duration || item.durationOrType || '',
      description: item.description || '',
      facilities: Array.isArray(item.facilities) ? item.facilities.join('\n') : (item.facilities || ''),
      capacity: item.capacity || item.maxPax || '',
      contactName: item.contactName || item.contact?.name || item.contact?.contactName || '',
      contactPhone: item.contactPhone || item.contact?.phone || item.contact?.contactPhone || '',
      contactNote: item.contactNote || item.contact?.note || item.contact?.contactNote || ''
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
      const res = await fetch(`${API_BASE}/tour-packages/images/${imageId}`, {
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
        fetchData();
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
    if (!window.confirm('Yakin ingin menghapus paket wisata ini?')) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tour-packages/${id}`, {
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
        fetchData();
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
      if (form[key] !== null && form[key] !== '') {
        payload.append(key, form[key]);
      }
    });
    selectedFiles.forEach(file => {
      payload.append('images', file);
    });

    const url = editId ? `${API_BASE}/tour-packages/${editId}` : `${API_BASE}/tour-packages`;
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
        fetchData();
      } else {
        showMessage('error', data.error || `Gagal ${editId ? 'memperbarui' : 'menambahkan'} data`);
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
    { header: 'Kategori', key: 'type', className: 'font-bold text-blue-600', render: (p) => p.type === 'AKOMODASI' ? 'Akomodasi' : p.type === 'WISATA_AKOMODASI' ? 'Wisata & Akomodasi' : 'Wisata' },
    { header: 'Harga', key: 'price', className: 'text-emerald-600 font-bold', render: (p) => {
        const num = Number(p.rawPrice !== undefined ? p.rawPrice : String(p.price || '').replace(/[^0-9.]/g, ''));
        return isNaN(num) || !num ? (p.price || 'Rp 0') : `Rp ${num.toLocaleString('id-ID')}`;
      }
    },
    { header: 'Durasi', key: 'duration', className: 'text-slate-600' },
    { header: 'Fasilitas', key: 'facilities', className: 'text-slate-600 max-w-xs truncate' },
    { header: 'Aksi', key: 'action', headerClassName: 'text-right', className: 'text-right space-x-2', render: (p) => (
      <>
        <button
          type="button"
          onClick={() => setPreviewItem(p)}
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>
        <button
          type="button"
          onClick={() => handleEditClick(p)}
          className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-2.5 py-1 rounded font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Edit className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          type="button"
          disabled={actionLoading}
          onClick={() => handleDelete(p.id)}
          className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1 rounded font-bold inline-flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Hapus
        </button>
      </>
    )}
  ];

  return (
    <div>
      <AdminActionBar 
        title="Paket Wisata & Akomodasi" 
        isAddMode={showAddForm && !editId} 
        onAddClick={() => {
          if (showAddForm && !editId) {
            resetForm();
          } else {
            setEditId(null);
            setForm({ title: '', type: 'WISATA', price: '', duration: '', description: '', facilities: '', capacity: '', contactName: '', contactPhone: '', contactNote: '' });
            setExistingImages([]);
            setSelectedFiles([]);
            setShowAddForm(true);
          }
        }} 
      />

      <AdminFormCard
        isOpen={showAddForm}
        title="Paket Wisata"
        editId={editId}
        actionLoading={actionLoading}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        submitTextAdd="Simpan Paket"
        submitTextEdit="Simpan Perubahan"
        gridCols="md:grid-cols-3"
      >
        <div>
          <label className="block font-bold mb-1">Nama Paket <span className="text-rose-500">*</span></label>
          <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border p-2 rounded" placeholder="Contoh: Paket Trekking Salak & Homestay" />
        </div>
        <div>
          <label className="block font-bold mb-1">Kategori <span className="text-rose-500">*</span></label>
          <select required value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full border p-2 rounded bg-white">
            <option value="WISATA">Wisata Saja</option>
            <option value="AKOMODASI">Akomodasi Saja</option>
            <option value="WISATA_AKOMODASI">Wisata & Akomodasi</option>
          </select>
        </div>
        <div>
          <label className="block font-bold mb-1">Harga (Angka saja) <span className="text-rose-500">*</span></label>
          <input type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border p-2 rounded" placeholder="Contoh: 250000" />
        </div>
        <div>
          <label className="block font-bold mb-1">Durasi <span className="text-rose-500">*</span></label>
          <input type="text" required value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="w-full border p-2 rounded" placeholder="Contoh: 1 Hari (09.00 - 16.00) atau 2D1N" />
        </div>
        <div className="md:col-span-3">
          <label className="block font-bold mb-1">Deskripsi <span className="text-rose-500">*</span></label>
          <textarea required rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border p-2 rounded" placeholder="Contoh: Paket wisata edukasi petik salak lengkap dengan pemandu lokal, makan siang tradisional khas Sibetan, serta fasilitas penginapan yang asri..." />
        </div>
        <div className="md:col-span-2">
          <label className="block font-bold mb-1">Fasilitas <span className="text-rose-500">*</span></label>
          <TagInput 
            value={form.facilities} 
            onChange={(val) => setForm({...form, facilities: val})} 
            placeholder="Ketik fasilitas lalu tekan Enter (mis: Makan Siang, Pemandu Lokal, WiFi, AC)"
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Kapasitas <span className="text-xs font-normal text-slate-500">(Opsional)</span></label>
          <input type="text" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} className="w-full border p-2 rounded" placeholder="Contoh: Min 2 - Maks 10 Orang" />
        </div>
        <div>
          <label className="block font-bold mb-1">Nama Kontak <span className="text-xs font-normal text-slate-500">(Opsional)</span></label>
          <input type="text" value={form.contactName} onChange={e => setForm({...form, contactName: e.target.value})} className="w-full border p-2 rounded" placeholder="Contoh: Pak Suwena (Pengelola Pokdarwis)" />
        </div>
        <div>
          <label className="block font-bold mb-1">No. WhatsApp Kontak <span className="text-xs font-normal text-slate-500">(Opsional)</span></label>
          <input type="text" value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} className="w-full border p-2 rounded" placeholder="Contoh: 081234567890" />
        </div>
        <div>
          <label className="block font-bold mb-1">Catatan Kontak <span className="text-xs font-normal text-slate-500">(Opsional)</span></label>
          <input type="text" value={form.contactNote} onChange={e => setForm({...form, contactNote: e.target.value})} className="w-full border p-2 rounded" placeholder="Contoh: Harap reservasikan H-2 sebelum kedatangan" />
        </div>

        {editId && existingImages.length > 0 && (
          <div className="md:col-span-3 bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2">
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

        <div className="md:col-span-3 mt-2">
          <ImageUploader 
            editMode={!!editId}
            label={editId ? 'Tambah Foto Baru (Akan ditambahkan ke daftar gambar di atas):' : 'Upload Foto Paket (Multiple)*'}
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
        data={tourPackages}
        columns={columns}
        emptyMessage="Belum ada data paket wisata di database backend."
        editId={editId}
      />

      {/* Detail Modal Preview */}
      <Modal isOpen={!!previewItem} onClose={() => setPreviewItem(null)}>
        {previewItem && (
          <PackageModalContent
            pkg={{
              ...previewItem,
              title: previewItem.title,
              price: typeof previewItem.price === 'number' || !isNaN(previewItem.price) ? `Rp ${Number(previewItem.price).toLocaleString('id-ID')}` : previewItem.price,
              durationOrType: previewItem.duration || '-',
              maxPax: previewItem.capacity || '',
              description: previewItem.description || '-',
              fullDescription: previewItem.description || '-',
              facilities: Array.isArray(previewItem.facilities) ? previewItem.facilities : typeof previewItem.facilities === 'string' ? previewItem.facilities.split(',').map(s => s.trim()).filter(Boolean) : [],
              contactPerson: previewItem.contactName || previewItem.contact?.contactName || 'Admin Wisata',
              whatsapp: previewItem.contactPhone || previewItem.contact?.contactPhone || '6281234567890',
              contactNote: previewItem.contactNote || previewItem.contact?.contactNote || ''
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default PackagesManager;

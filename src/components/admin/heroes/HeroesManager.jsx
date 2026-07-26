import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Image as ImageIcon, Eye, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import Modal from '../../ui/Modal';
import ImageUploader from '../../ui/ImageUploader';
import AdminActionBar from '../../ui/AdminActionBar';
import AdminFormCard from '../../ui/AdminFormCard';
import AdminTable from '../../ui/AdminTable';
import { useHeroes } from '../../../hooks/useHeroes';

const HeroesManager = ({ token, API_BASE, SERVER_ORIGIN, showMessage, onUnauthorized }) => {
  const { heroes, loading, refetch: fetchData } = useHeroes({ onUnauthorized });
  const [items, setItems] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [form, setForm] = useState({
    title: '', description: ''
  });

  // Drag and drop states
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Sync internal items state when heroes data from hook updates
  useEffect(() => {
    if (heroes) {
      setItems(heroes);
    }
  }, [heroes]);

  const resetForm = () => {
    setForm({ title: '', description: '' });
    setExistingImageUrl(null);
    setSelectedFiles([]);
    setEditId(null);
    setShowAddForm(false);
  };

  const handleEditClick = (item) => {
    setForm({
      title: item.title || '',
      description: item.description || ''
    });
    setExistingImageUrl(item.imageUrl || null);
    setSelectedFiles([]);
    setEditId(item.id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDelete = async (id) => {
    if (!token) {
      showMessage('error', 'Silakan login terlebih dahulu untuk menghapus data');
      return;
    }
    if (!window.confirm('Yakin ingin menghapus data ini dari database?')) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/heroes/${id}`, {
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

    const url = editId ? `${API_BASE}/heroes/${editId}` : `${API_BASE}/heroes`;
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

  // Persist updated list order to backend API
  const saveNewOrder = async (newItems) => {
    setItems(newItems);
    if (!token) return;

    try {
      const payloadItems = newItems.map((item, idx) => ({
        id: item.id,
        order: idx
      }));

      const res = await fetch(`${API_BASE}/heroes/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ items: payloadItems })
      });

      if (res.status === 401) {
        onUnauthorized();
        return;
      }

      if (res.ok) {
        showMessage('success', 'Urutan gambar hero berhasil diperbarui');
        fetchData();
      } else {
        const data = await res.json();
        showMessage('error', data.error || 'Gagal memperbarui urutan gambar');
      }
    } catch (err) {
      showMessage('error', 'Terjadi kesalahan jaringan saat memperbarui urutan');
    }
  };

  // Move item up or down
  const handleMoveIndex = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    saveNewOrder(newItems);
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);

    setDraggedIndex(null);
    setDragOverIndex(null);

    saveNewOrder(newItems);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const columns = [
    {
      header: 'Urutan & Reorder',
      key: 'reorder',
      className: 'w-48',
      render: (h, idx) => (
        <div className="flex items-center gap-2">
          {/* Drag Handle Icon */}
          <div
            className="p-1 text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing hover:bg-slate-200 rounded transition-colors"
            title="Tarik & Lepas untuk mengubah urutan"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Move Up / Move Down Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={idx === 0}
              onClick={() => handleMoveIndex(idx, -1)}
              className="p-1 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Geser ke Atas"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={idx === items.length - 1}
              onClick={() => handleMoveIndex(idx, 1)}
              className="p-1 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Geser ke Bawah"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Badge position */}
          <span className="font-bold text-xs bg-brand/10 text-brand px-2 py-0.5 rounded-full font-mono">
            Slide #{idx + 1}
          </span>
        </div>
      )
    },
    {
      header: 'Preview',
      key: 'preview',
      render: (h) => (
        h.imageUrl ? (
          <img src={h.imageUrl} alt={h.title || 'hero'} className="w-16 h-10 object-cover rounded shadow-xs" />
        ) : (
          <span className="text-slate-400">No Image</span>
        )
      )
    },
    { header: 'Judul', key: 'title', className: 'font-bold text-slate-900', render: (h) => h.title || '-' },
    { header: 'Deskripsi', key: 'description', className: 'text-slate-600', render: (h) => h.description ? (h.description.length > 50 ? h.description.substring(0, 50) + '...' : h.description) : '-' },
    {
      header: 'Aksi',
      key: 'action',
      headerClassName: 'text-right',
      className: 'text-right space-x-2',
      render: (h) => (
        <>
          <button
            type="button"
            onClick={() => setPreviewItem(h)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            type="button"
            onClick={() => handleEditClick(h)}
            className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-2.5 py-1 rounded font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => handleDelete(h.id)}
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
        title="Gambar Laman Utama" 
        isAddMode={showAddForm && !editId} 
        onAddClick={() => {
          if (showAddForm && !editId) {
            resetForm();
          } else {
            setEditId(null);
            setForm({ title: '', description: '' });
            setExistingImageUrl(null);
            setSelectedFiles([]);
            setShowAddForm(true);
          }
        }} 
      />

      <AdminFormCard
        isOpen={showAddForm}
        title="Gambar Laman Utama"
        editId={editId}
        actionLoading={actionLoading}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        submitTextAdd="Simpan Hero Banner"
        submitTextEdit="Simpan Perubahan"
        gridCols="md:grid-cols-2"
      >
        <div>
          <label className="block font-bold mb-1">Judul Banner <span className="text-xs font-normal text-slate-500">(Opsional)</span></label>
          <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border p-2 rounded" placeholder="Contoh: Selamat Datang Di Desa Sibetan" />
        </div>
        <div>
          <label className="block font-bold mb-1">Deskripsi Banner <span className="text-xs font-normal text-slate-500">(Opsional)</span></label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border p-2 rounded" placeholder="Contoh: Desa penghasil salak terbaik di Bali, kaya akan tradisi Hindu, alam yang asri, dan keramahan warga yang tulus." rows="3"></textarea>
        </div>

        {editId && existingImageUrl && (
          <div className="md:col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2">
            <label className="block font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-amber-600" />
              <span>Gambar Saat Ini di Database (Akan diganti jika Anda memilih foto baru di bawah):</span>
            </label>
            <div className="max-w-xs bg-white rounded-lg border border-slate-200 p-1.5 shadow-2xs">
              <img src={existingImageUrl} alt="existing hero" className="w-full h-32 object-cover rounded" />
            </div>
          </div>
        )}

        <div className="md:col-span-2 mt-2">
          <ImageUploader 
            editMode={!!editId}
            label={editId ? 'Upload Foto Baru (Opsional, untuk mengganti gambar hero di atas):' : 'Upload Foto Hero Banner *'}
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

      {/* Info Header Banner */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 mb-4 text-xs text-amber-900 flex items-center gap-2">
        <GripVertical className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Petunjuk Pengaturan Urutan:</strong> Tarik & lepas (*drag and drop*) ikon pegangan di sebelah kiri baris atau gunakan tombol panah <strong>⬆ / ⬇</strong> untuk mengubah urutan slide Hero Banner secara langsung.
        </span>
      </div>

      <AdminTable 
        loading={loading}
        data={items}
        columns={columns}
        emptyMessage="Belum ada data hero banner di database backend."
        editId={editId}
        getRowProps={(item, idx) => ({
          draggable: true,
          onDragStart: (e) => handleDragStart(e, idx),
          onDragOver: (e) => handleDragOver(e, idx),
          onDrop: (e) => handleDrop(e, idx),
          onDragEnd: handleDragEnd,
          className: `transition-all duration-200 ${
            draggedIndex === idx 
              ? 'animate-wiggle bg-blue-100/70 border-2 border-blue-400 opacity-70 shadow-md' 
              : dragOverIndex === idx 
              ? 'border-t-2 border-blue-500 bg-blue-50/60' 
              : draggedIndex !== null 
              ? 'animate-wiggle' 
              : ''
          }`
        })}
      />

      {/* Detail Modal Preview */}
      <Modal isOpen={!!previewItem} onClose={() => setPreviewItem(null)}>
        {previewItem && (
          <div className="relative w-full h-[450px] sm:h-[550px] flex items-center px-6 sm:px-12 overflow-hidden rounded-xl">
            <img
              src={previewItem.imageUrl}
              alt={previewItem.title || 'Desa Sibetan'}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1B3461] via-[#1B3461]/70 to-transparent z-0"></div>

            <div className="relative z-10 max-w-2xl">
              <p className="font-jakarta text-xs sm:text-sm font-semibold tracking-wider text-gray-300 mb-2 uppercase">
                Selamat Datang Di
              </p>
              <h1 className="font-poppins text-4xl sm:text-5xl font-bold text-white leading-tight mb-2">
                {previewItem.title || 'Desa Sibetan'}
              </h1>
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-white/90 mb-4">
                Karangasem, Bali
              </h2>
              <p className="font-jakarta text-sm sm:text-base text-gray-300 leading-relaxed mb-6 max-w-xl">
                {previewItem.description || 'Desa penghasil salak terbaik di Bali, kaya akan tradisi Hindu, alam yang asri, dan keramahan warga yang tulus.'}
              </p>
              <div className="flex gap-3">
                <span className="bg-white text-[#1B3461] font-bold px-6 py-2.5 rounded-lg text-xs shadow-md">
                  Jelajahi Wisata
                </span>
                <span className="bg-white/10 border border-white/40 text-white font-bold px-6 py-2.5 rounded-lg text-xs backdrop-blur-sm">
                  Paket & Akomodasi
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HeroesManager;

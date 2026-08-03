import React, { useState, useEffect } from 'react';
import { 
  GripVertical, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  FileText, 
  Image as ImageIcon,
  FileCheck,
  UploadCloud
} from 'lucide-react';
import { useKknWorks } from '../../../hooks/useKknWorks';
import AdminActionBar from '../../ui/AdminActionBar';
import AdminFormCard from '../../ui/AdminFormCard';
import AdminTable from '../../ui/AdminTable';
import Modal from '../../ui/Modal';
import ImageUploader from '../../ui/ImageUploader';

const KknWorksManager = ({ token, API_BASE, showMessage, onUnauthorized }) => {
  const { kknWorks, loading, refetch: fetchData } = useKknWorks({ onUnauthorized });

  const [items, setItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingWebpUrl, setExistingWebpUrl] = useState(null);
  const [existingOriginalUrl, setExistingOriginalUrl] = useState(null);
  const [existingFileType, setExistingFileType] = useState(null);

  // Drag state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Modal Preview State
  const [previewItem, setPreviewItem] = useState(null);

  useEffect(() => {
    if (kknWorks) {
      setItems(kknWorks);
    }
  }, [kknWorks]);

  const resetForm = () => {
    setForm({ title: '', description: '' });
    setSelectedFile(null);
    setExistingWebpUrl(null);
    setExistingOriginalUrl(null);
    setExistingFileType(null);
    setEditId(null);
    setShowAddForm(false);
  };

  const handleEditClick = (item) => {
    setEditId(item.id);
    setForm({
      title: item.title || '',
      description: item.description || '',
    });
    setExistingWebpUrl(item.webpUrl);
    setExistingOriginalUrl(item.downloadUrl || item.originalUrl);
    setExistingFileType(item.fileType);
    setSelectedFile(null);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data karya ini? File fisik di server juga akan terhapus.')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/kkn-works/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 401 && onUnauthorized) {
        onUnauthorized();
        return;
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Gagal menghapus data karya');
      }

      showMessage('success', 'Data karya KKN berhasil dihapus!');
      fetchData(true);
    } catch (err) {
      showMessage('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showMessage('error', 'Judul Tab / Karya wajib diisi!');
      return;
    }

    if (!editId && !selectedFile) {
      showMessage('error', 'Wajib memilih 1 berkas (PDF / Gambar) untuk diunggah!');
      return;
    }

    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('description', form.description.trim());
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const url = editId ? `${API_BASE}/kkn-works/${editId}` : `${API_BASE}/kkn-works`;
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.status === 401 && onUnauthorized) {
        onUnauthorized();
        return;
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Gagal menyimpan karya');
      }

      showMessage('success', editId ? 'Karya KKN berhasil diperbarui!' : 'Karya KKN berhasil ditambahkan!');
      resetForm();
      fetchData(true);
    } catch (err) {
      showMessage('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Move up/down order
  const handleMoveIndex = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setItems(newItems);
    saveNewOrder(newItems);
  };

  const saveNewOrder = async (newOrderItems) => {
    setActionLoading(true);
    try {
      const payload = {
        items: newOrderItems.map((item, idx) => ({ id: item.id, order: idx }))
      };

      const res = await fetch(`${API_BASE}/kkn-works/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401 && onUnauthorized) {
        onUnauthorized();
        return;
      }

      if (!res.ok) {
        throw new Error('Gagal memperbarui urutan');
      }

      showMessage('success', 'Urutan tab karya berhasil diperbarui!');
      fetchData(true);
    } catch (err) {
      showMessage('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Drag & drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== index) {
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

  const columns = [
    {
      header: 'Urutan Tab',
      key: 'reorder',
      className: 'w-48',
      render: (item, idx) => (
        <div className="flex items-center gap-2">
          <div
            className="p-1 text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing hover:bg-slate-200 rounded transition-colors"
            title="Tarik & Lepas untuk mengubah urutan"
          >
            <GripVertical className="w-4 h-4" />
          </div>

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

          <span className="font-bold text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-mono border border-emerald-200">
            Tab #{idx + 1}
          </span>
        </div>
      )
    },
    {
      header: 'Preview WebP',
      key: 'preview',
      render: (item) => (
        item.webpUrl ? (
          <div className="relative group w-16 h-12 bg-slate-100 rounded border border-slate-200 overflow-hidden flex items-center justify-center">
            {item.webpUrl.toLowerCase().endsWith('.pdf') ? (
              <div className="flex flex-col items-center justify-center text-red-600 font-bold text-[10px]">
                <FileText className="w-5 h-5 text-red-500" />
                <span>PDF</span>
              </div>
            ) : (
              <img src={item.webpUrl} alt={item.title} className="w-full h-full object-cover" />
            )}
            {item.fileType === 'pdf' && !item.webpUrl.toLowerCase().endsWith('.pdf') && (
              <span className="absolute bottom-0 right-0 bg-red-600 text-white text-[9px] font-bold px-1 rounded-tl">PDF</span>
            )}
          </div>
        ) : (
          <span className="text-slate-400 text-xs">No Preview</span>
        )
      )
    },
    { 
      header: 'Judul Tab', 
      key: 'title', 
      className: 'font-bold text-slate-900', 
      render: (item) => (
        <div>
          <span className="text-slate-900 block">{item.title}</span>
          <span className="text-[11px] text-slate-500 font-mono">Tipe File: {item.fileType?.toUpperCase()}</span>
        </div>
      ) 
    },
    { 
      header: 'Deskripsi', 
      key: 'description', 
      className: 'text-slate-600 max-w-xs text-xs', 
      render: (item) => item.description ? (item.description.length > 60 ? item.description.substring(0, 60) + '...' : item.description) : '-' 
    },
    {
      header: 'Aksi',
      key: 'action',
      headerClassName: 'text-right',
      className: 'text-right space-x-2',
      render: (item) => (
        <>
          <button
            type="button"
            onClick={() => setPreviewItem(item)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded font-bold inline-flex items-center gap-1 transition-colors cursor-pointer text-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            type="button"
            onClick={() => handleEditClick(item)}
            className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-2.5 py-1 rounded font-bold inline-flex items-center gap-1 transition-colors cursor-pointer text-xs"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => handleDelete(item.id)}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1 rounded font-bold inline-flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs"
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
        title="Karya KKN UGM (Peta & Modul)" 
        isAddMode={showAddForm && !editId} 
        onAddClick={() => {
          if (showAddForm && !editId) {
            resetForm();
          } else {
            resetForm();
            setShowAddForm(true);
          }
        }} 
      />

      <AdminFormCard
        isOpen={showAddForm}
        title="Karya KKN-PPM UGM"
        editId={editId}
        actionLoading={actionLoading}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        submitTextAdd="Simpan Karya KKN"
        submitTextEdit="Simpan Perubahan"
        gridCols="md:grid-cols-2"
      >
        <div>
          <label className="block font-bold text-slate-800 text-sm mb-1">
            Judul Tab / Nama Karya *
          </label>
          <input 
            type="text" 
            value={form.title} 
            onChange={e => setForm({...form, title: e.target.value})} 
            className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none text-sm" 
            placeholder="Contoh: Peta Desa Wisata, Brosur Panduan, Peta Tematik" 
            required 
          />
        </div>

        <div>
          <label className="block font-bold text-slate-800 text-sm mb-1">
            Deskripsi Karya <span className="text-xs font-normal text-slate-500">(Opsional)</span>
          </label>
          <textarea 
            value={form.description} 
            onChange={e => setForm({...form, description: e.target.value})} 
            className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none text-sm" 
            placeholder="Penjelasan singkat mengenai karya KKN ini..." 
            rows={3}
          />
        </div>

        {/* Existing file preview if editing */}
        {editId && existingWebpUrl && (
          <div className="md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 mt-1">
            <label className="block font-bold text-slate-700 text-xs mb-2 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Berkas Saat Ini di Server:</span>
            </label>
            <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200">
              <img src={existingWebpUrl} alt="Existing Preview" className="w-24 h-16 object-cover rounded border" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-slate-800">Tampilan Web (WebP Format)</p>
                <p className="text-slate-500">Tipe: <span className="uppercase font-semibold">{existingFileType}</span></p>
                <a 
                  href={existingOriginalUrl} 
                  download
                  target="_blank" 
                  rel="noreferrer"
                  className="text-brand hover:underline font-semibold inline-flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh Berkas Asli
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Custom File Upload Box (Supports PDF & Images) */}
        <div className="md:col-span-2 mt-2">
          <label className="block font-bold text-slate-800 text-sm mb-1.5">
            {editId ? 'Upload Berkas Baru (Opsional, mengganti berkas saat ini):' : 'Upload Berkas Karya (PDF / JPG / PNG / WEBP) *'}
          </label>
          <div className="border-2 border-dashed border-slate-300 hover:border-brand rounded-xl p-5 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <input 
              type="file" 
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
              className="hidden" 
              id="kkn-file-upload"
            />
            <label htmlFor="kkn-file-upload" className="cursor-pointer flex flex-col items-center justify-center">
              <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
              <span className="text-sm font-semibold text-slate-700 mb-1">
                {selectedFile ? selectedFile.name : 'Klik untuk memilih file dari perangkat Anda'}
              </span>
              <span className="text-xs text-slate-500">
                Mendukung format gambar (JPG, PNG, WEBP) atau Dokumen PDF (Maks. 25MB). System otomatis membuat versi WebP untuk tampilan web.
              </span>
            </label>
          </div>

          {selectedFile && (
            <div className="mt-3 bg-emerald-50 p-3 rounded-lg border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-900">{selectedFile.name}</span>
                <span className="text-[11px] text-emerald-700">({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedFile(null)}
                className="text-rose-600 hover:text-rose-800 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
            </div>
          )}
        </div>
      </AdminFormCard>

      <div className="bg-amber-50/80 border border-amber-200/80 text-amber-900 p-3.5 rounded-xl text-xs mb-4">
        <strong>Petunjuk Pengaturan Tab:</strong> Urutan tab di atas menentukan urutan tombol yang akan muncul di samping kiri section Peta / Karya KKN pada Landing Page. Gunakan ikon pegangan atau tombol panah untuk mengubah urutannya.
      </div>

      <AdminTable
        columns={columns}
        data={items}
        loading={loading}
        draggedIndex={draggedIndex}
        dragOverIndex={dragOverIndex}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        emptyMessage="Belum ada karya KKN-PPM UGM yang diunggah."
      />

      {/* Modal Preview */}
      {previewItem && (
        <Modal isOpen={!!previewItem} onClose={() => setPreviewItem(null)} title={`Preview: ${previewItem.title}`}>
          <div className="space-y-4">
            <div className="bg-slate-900 p-2 rounded-xl border overflow-hidden flex items-center justify-center">
              {previewItem.webpUrl?.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={`${previewItem.downloadUrl || previewItem.originalUrl}#toolbar=0`}
                  title={previewItem.title}
                  className="w-full h-96 rounded-lg border-0 bg-white"
                />
              ) : (
                <img src={previewItem.webpUrl} alt={previewItem.title} className="max-h-96 object-contain rounded-lg" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{previewItem.title}</h3>
              {previewItem.description && (
                <p className="text-slate-600 text-sm mt-1 leading-relaxed">{previewItem.description}</p>
              )}
            </div>
            <div className="flex justify-end pt-2 border-t">
              <a
                href={previewItem.downloadUrl || previewItem.originalUrl}
                download
                className="bg-brand hover:bg-brand-dark text-white font-bold text-xs px-4 py-2 rounded-lg inline-flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                Unduh Berkas Format Asli ({previewItem.fileType?.toUpperCase()})
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default KknWorksManager;

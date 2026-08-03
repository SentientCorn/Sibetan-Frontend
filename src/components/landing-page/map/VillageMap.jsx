import React, { useState, useEffect } from 'react';
import { Download, FileText, Map, Layers, Maximize2 } from 'lucide-react';
import SectionHeader from '../../ui/SectionHeader';
import Modal from '../../ui/Modal';
import { useKknWorks } from '../../../hooks/useKknWorks';
import mapDesaImgFallback from '../../../assets/MapDesa.webp';

const VillageMap = () => {
  const { kknWorks, loading } = useKknWorks();
  const [activeTabId, setActiveTabId] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // Fallback item if database has no data yet
  const fallbackList = [
    {
      id: 'fallback-map',
      title: 'Peta Desa Wisata',
      description: 'Peta visual tata guna lahan dan batas wilayah Desa Wisata Sibetan.',
      webpUrl: mapDesaImgFallback,
      originalUrl: mapDesaImgFallback,
      downloadUrl: mapDesaImgFallback,
      fileType: 'image',
    }
  ];

  const displayWorks = (kknWorks && kknWorks.length > 0) ? kknWorks : fallbackList;

  // Set default active tab when data changes
  useEffect(() => {
    if (displayWorks.length > 0 && (!activeTabId || !displayWorks.some(w => w.id === activeTabId))) {
      setActiveTabId(displayWorks[0].id);
    }
  }, [displayWorks, activeTabId]);

  const activeWork = displayWorks.find(w => w.id === activeTabId) || displayWorks[0];

  return (
    <section id="village-map" className="py-12 md:py-16 px-6 md:px-12 lg:px-16 xl:px-24 bg-slate-50/70 border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <SectionHeader 
          pillText="KARYA KKN-PPM UGM"
          title="Peta & Modul Informasi Desa Wisata"
          description="Eksplorasi peta wilayah, peta tematik, serta modul publikasi hasil karya KKN-PPM UGM Arunika Karangasem."
        />

        {/* Tab & Content Grid Layout */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Tab Navigation */}
          <div className="lg:col-span-4 flex lg:flex-col gap-2.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <span className="hidden lg:block text-xs font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
              Daftar Karya & Peta
            </span>
            
            {displayWorks.map((work) => {
              const isActive = work.id === activeWork.id;
              return (
                <button
                  key={work.id}
                  onClick={() => setActiveTabId(work.id)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-jakarta text-sm font-semibold transition-all duration-200 text-left shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-brand text-white shadow-md shadow-brand/20 translate-x-0 lg:translate-x-1'
                      : 'bg-white text-slate-700 hover:bg-slate-100/80 border border-slate-200/80 shadow-2xs'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {work.fileType === 'pdf' ? <FileText className="w-4 h-4" /> : <Map className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block truncate">{work.title}</span>
                    <span className={`text-[11px] block font-normal capitalize ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                      {work.fileType === 'pdf' ? 'Dokumen PDF' : 'Gambar Peta'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Main Content Box */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 md:p-6 relative overflow-hidden transition-all duration-300">
              
              {/* Header inside Content Box: Title & Download Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="font-poppins text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                    {activeWork?.title}
                  </h3>
                  {activeWork?.description && (
                    <p className="font-jakarta text-xs md:text-sm text-slate-500 mt-1">
                      {activeWork.description}
                    </p>
                  )}
                </div>

                {/* Top-Right Download Button */}
                {activeWork?.downloadUrl && (
                  <a
                    href={activeWork.downloadUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white font-jakarta text-xs md:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all duration-200 shrink-0 cursor-pointer hover:shadow-md"
                    title="Unduh berkas dalam format asli"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Berkas ({activeWork.fileType?.toUpperCase() || 'FILE'})</span>
                  </a>
                )}
              </div>

              {/* Main Preview Container (WebP Image or PDF iframe) */}
              <div className="relative group bg-slate-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center min-h-[300px] md:min-h-[420px]">
                {activeWork?.webpUrl?.toLowerCase().endsWith('.pdf') ? (
                  <iframe
                    src={`${activeWork?.originalUrl || activeWork?.downloadUrl}#toolbar=0`}
                    title={activeWork?.title || 'PDF Preview'}
                    className="w-full h-[450px] md:h-[550px] rounded-lg border-0 bg-white"
                  />
                ) : (
                  <img
                    src={activeWork?.webpUrl || mapDesaImgFallback}
                    alt={activeWork?.title || 'Peta Sibetan'}
                    className="w-full h-auto max-h-[600px] object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
                    loading="lazy"
                  />
                )}
                
                {/* Fullscreen view trigger button overlay */}
                {!activeWork?.webpUrl?.toLowerCase().endsWith('.pdf') && (
                  <button
                    onClick={() => setFullscreenImage(activeWork)}
                    className="absolute bottom-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Perbesar</span>
                  </button>
                )}
              </div>

              {/* Footer Attribution */}
              <p className="mt-4 text-xs text-slate-400 font-jakarta text-center italic">
                Dibuat oleh KKN PPM UGM Arunika Karangasem Periode II 2026
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox / Fullscreen Modal */}
      {fullscreenImage && (
        <Modal
          isOpen={!!fullscreenImage}
          onClose={() => setFullscreenImage(null)}
          title={fullscreenImage.title}
        >
          <div className="space-y-4">
            <div className="bg-slate-950 p-2 rounded-xl flex items-center justify-center max-h-[75vh] overflow-auto">
              {fullscreenImage.webpUrl?.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={`${fullscreenImage.originalUrl || fullscreenImage.downloadUrl}#toolbar=0`}
                  title={fullscreenImage.title}
                  className="w-full h-[65vh] rounded-lg border-0 bg-white"
                />
              ) : (
                <img
                  src={fullscreenImage.webpUrl}
                  alt={fullscreenImage.title}
                  className="max-w-full h-auto object-contain rounded"
                />
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <p className="text-xs text-slate-500">
                {fullscreenImage.description || 'Peta/Modul Karya KKN-PPM UGM'}
              </p>
              <a
                href={fullscreenImage.downloadUrl || fullscreenImage.originalUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="bg-brand hover:bg-brand-dark text-white font-bold text-xs px-4 py-2 rounded-lg inline-flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                Unduh Format Asli ({fullscreenImage.fileType?.toUpperCase()})
              </a>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default VillageMap;

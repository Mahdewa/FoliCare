import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
// Import Icon Lengkap
import { FaLeaf, FaCloudUploadAlt, FaCheck, FaBug, FaFirstAid, FaShieldAlt, FaSearch, FaTimes, FaCamera, FaArrowRight, FaChartLine, FaDatabase, FaMicrochip } from 'react-icons/fa';
import { BiLoaderAlt, BiScan } from 'react-icons/bi';
import './App.css';

// === DATABASE PENYAKIT ===
const DATABASE_PENYAKIT = {
  'Grape___healthy': {
    name: 'Healthy',
    latin: 'Vitis vinifera',
    description: 'Tanaman dalam kondisi prima. Daun berwarna hijau segar tanpa bercak.',
    symptoms: 'Tidak ada gejala penyakit. Struktur daun utuh dan fotosintesis berjalan optimal.',
    treatment: 'Pertahankan jadwal penyiraman dan pemupukan. Lakukan pruning (pemangkasan) rutin.',
    color: 'healthy'
  },
  'Grape___Black_rot': {
    name: 'Black Rot Disease',
    latin: 'Guignardia bidwellii',
    description: 'Penyakit jamur yang menyerang daun dan buah, menyebabkan kerugian panen signifikan.',
    symptoms: 'Muncul bercak coklat kemerahan dengan pinggiran gelap. Bercak membesar dan mengering.',
    treatment: 'Pangkas daun terinfeksi dan bakar. Semprotkan fungisida berbahan aktif Mankozeb.',
    color: 'danger'
  },
  'Grape___Esca_(Black_Measles)': {
    name: 'Esca Disease (Black Measles)',
    latin: 'Phaeoacremonium aleophilum',
    description: 'Penyakit kompleks pada batang kayu anggur tua yang menghambat aliran air.',
    symptoms: 'Daun mengering di sela-sela tulang daun (seperti kulit harimau).',
    treatment: 'Belum ada obat kimia efektif. Lakukan pembedahan batang sakit atau ganti tanaman.',
    color: 'danger'
  },
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': {
    name: 'Leaf Blight Disease',
    latin: 'Pseudocercospora vitis',
    description: 'Infeksi jamur yang sering terjadi saat musim hujan atau kelembaban tinggi.',
    symptoms: 'Bercak hitam tidak beraturan dengan halo (lingkaran) kuning.',
    treatment: 'Kurangi kelembaban area daun. Gunakan fungisida tembaga (Copper) atau Sulfur.',
    color: 'danger'
  }
};

// --- HALAMAN 1: LANDING PAGE ---
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-layout animate-fade-in">
      <div className="landing-content">
        <div className="landing-header">
          <div className="brand-pill"><FaLeaf /> FoliCare</div>
          {/* Judul Pilihan No. 1 (Simpel & Jelas) */}
          <h1 className="display-title">
            DETEKSI DINI PENYAKIT<br/>
            PADA <span className="text-gradient">DAUN ANGGUR</span>
          </h1>
          <p className="lead-text">
            Platform diagnosa cerdas untuk memantau kesehatan kebun anggur secara real-time dengan akurasi tinggi berbasis AI.
          </p>
          
          <div className="btn-group">
            <button className="cta-btn primary-cta" onClick={() => navigate('/scan')}>
              Mulai Diagnosa <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Statistik */}
        <div className="stats-row">
          <div className="stat-card glass-morphism">
            <FaChartLine className="stat-icon"/>
            <div>
               <h3>98.5%</h3>
               <p>Akurasi Model</p>
            </div>
          </div>
          <div className="stat-card glass-morphism">
            <FaDatabase className="stat-icon"/>
            <div>
               <h3>4K+</h3>
               <p>Dataset Citra</p>
            </div>
          </div>
          <div className="stat-card glass-morphism">
            <FaMicrochip className="stat-icon"/>
            <div>
               <h3>CNN</h3>
               <p>Arsitektur AI</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- HALAMAN 2: SCANNER (Desain Lama - Kartu Kaca) ---
const ScannerPage = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Logic Scanner
  const processFile = (file) => {
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); setResult(null); }
  };
  const handleImageChange = (e) => processFile(e.target.files[0]);
  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };
  const resetApp = () => { setImage(null); setPreview(null); setResult(null); };

  const handleSubmit = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append('file', image);
    setLoading(true);

    try {
      const response = await axios.post('https://mahdewa-grape-leaf-disease-classify.hf.space/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTimeout(() => { setResult(response.data); setLoading(false); }, 1500);
    } catch (err) { console.error(err); alert("Gagal koneksi server."); setLoading(false); }
  };

  const getDiseaseInfo = (className) => DATABASE_PENYAKIT[className] || { name: 'Tidak Dikenali', latin: '-', description: '-', symptoms: '-', treatment: '-', color: 'danger' };

  return (
    // Menggunakan Layout Center untuk Kartu
    <div className="scanner-layout animate-slide-up">
      <div className="glass-panel">
        
        {/* KIRI: UPLOAD */}
        <section className="left-section">
          <button className="back-link" onClick={() => navigate('/')}>&larr; Kembali ke Home</button>
          
          <div className="brand">
            <div className="brand-icon"><FaLeaf /></div>
            <span>FoliCare</span>
          </div>

          <div className="hero-text">
            <h2>Cek Kesehatan<br/>Daunmu.</h2>
            <p>Upload foto daun untuk mendapatkan diagnosa instan.</p>
          </div>

          <div className={`upload-box ${dragActive ? 'active' : ''} ${preview ? 'has-content' : ''}`}
             onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
            {preview ? (
              <div className="preview-wrapper">
                <img src={preview} alt="Preview" />
                {!loading && <button className="close-btn" onClick={resetApp}><FaTimes/></button>}
                {loading && <div className="scan-overlay"><div className="scan-line"></div><BiScan className="scan-icon-center"/></div>}
              </div>
            ) : (
              <>
                <input type="file" id="file" onChange={handleImageChange} accept="image/*" hidden />
                <label htmlFor="file" className="upload-label">
                  <div className="icon-bg"><FaCloudUploadAlt /></div>
                  <span className="main-text">Upload Gambar</span>
                  <span className="sub-text">Format JPG, PNG</span>
                </label>
              </>
            )}
          </div>

          {preview && !loading && !result && (
            <button className="analyze-btn" onClick={handleSubmit}><FaCamera /> Analisis Sekarang</button>
          )}
          {loading && <div className="loading-status"><BiLoaderAlt className="spinner"/><span>Menganalisis Citra...</span></div>}
        </section>

        {/* KANAN: HASIL */}
        {result ? (
          <section className="right-section">
              {(() => {
                const info = getDiseaseInfo(result.class);
                return (
                  <>
                    <div className="result-header">
                      <span className="badge-confidence">Akurasi: {result.confidence}%</span>
                      <button className="mini-reset" onClick={resetApp}>Remove</button>
                    </div>
                    <div className={`diagnosis-card ${info.color === 'healthy' ? 'healthy-bg' : 'danger-bg'}`}>
                      <div className="icon-wrapper">{info.color === 'healthy' ? <FaCheck /> : <FaBug />}</div>
                      <div className="diagnosis-info"><span className="latin-name">{info.latin}</span><h3>{info.name}</h3></div>
                    </div>
                    <div className="info-scroll-area">
                      <div className="detail-item"><div className="detail-icon"><FaSearch /></div><div><h4>Gejala Visual</h4><p>{info.symptoms}</p></div></div>
                      <div className="detail-item"><div className="detail-icon"><FaFirstAid /></div><div><h4>Rekomendasi</h4><p>{info.treatment}</p></div></div>
                      <div className="detail-item"><div className="detail-icon"><FaShieldAlt /></div><div><h4>Deskripsi</h4><p>{info.description}</p></div></div>
                    </div>
                  </>
                );
              })()}
          </section>
        ) : (
          <section className="right-section placeholder-mode">
             <div className="placeholder-art"><FaLeaf /></div>
             <h3>Menunggu Input</h3>
             <p>Silakan upload foto daun untuk melihat detail diagnosa, gejala, dan cara penanganannya.</p>
          </section>
        )}
      </div>
    </div>
  );
};

// --- APP WRAPPER ---
function App() {
  return (
    <Router>
      <div className="main-container">
        {/* Background Blobs Global */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/scan" element={<ScannerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
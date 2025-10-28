import React, { useState } from 'react';
import { Lock, TrendingUp, Lightbulb, ShoppingBag, BookOpen, User, Home, CheckCircle, XCircle, ArrowLeft, Zap, GraduationCap, Sparkles, MessageSquare, TrendingDown, Search, Filter } from 'lucide-react';

export default function MarketCreatorApp() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nicheInput, setNicheInput] = useState('');
  const [answers, setAnswers] = useState([]); // Untuk Sweet Spot Lama
  const [showResult, setShowResult] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0); // State kuis Market Segment

  // NEW STATE UNTUK KUIS KONSULTASI INTERAKTIF (isian bebas)
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [consultationAnswers, setConsultationAnswers] = useState([]); // Menyimpan jawaban teks
  const [currentConsultationQuestion, setCurrentConsultationQuestion] = useState(0); // Mengganti currentQuestion untuk konsultasi
  const [currentInput, setCurrentInput] = useState(''); // Input sementara untuk jawaban isian
  const [isLoading, setIsLoading] = useState(false);
  const [geminiResult, setGeminiResult] = useState(null); // Menyimpan hasil rekomendasi dari Gemini
  
  // STATE UNTUK NAVIGASI HOOK DETAIL
  const [selectedHookCategory, setSelectedHookCategory] = useState(null);

  // STATE BARU UNTUK INPUT SEMENTARA NICHE
  const [tempNicheInput, setTempNicheInput] = useState(''); 
  
  // === STATE BARU UNTUK HALAMAN TREND ===
  const trendCategories = ['All', 'Personal Branding', 'Brand'];
  const [selectedTrendCategory, setSelectedTrendCategory] = useState('All');

  // === STATE BARU UNTUK HALAMAN PEMBELIAN ===
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  // Data Artikel Trend Sementara
  const trendArticles = [
    { id: 1, title: "AI Content Generator: Apakah Masih Relevan?", category: "Personal Branding", type: "Artikel", date: "23 Okt 2025", time: "5 min read", image: "https://via.placeholder.com/300x200?text=AI+Trend" },
    { id: 2, title: "Strategi Konten Video Vertikal (Reels/TikTok)", category: "Brand", type: "Panduan", date: "21 Okt 2025", time: "10 min read", image: "https://via.placeholder.com/300x200?text=Short+Video+Strategy" },
    { id: 3, title: "Membangun Otoritas dengan Content Pillar", category: "Personal Branding", type: "Studi Kasus", date: "19 Okt 2025", time: "7 min read", image: "https://via.placeholder.com/300x200?text=Content+Pillar" },
    { id: 4, title: "Cara Berinteraksi dengan Audience di Instagram", category: "Brand", type: "Tips", date: "18 Okt 2025", time: "4 min read", image: "https://via.placeholder.com/300x200?text=IG+Engagement" },
    { id: 5, title: "Podcast: Format Konten yang Mulai Menurun?", category: "Brand", type: "Analisis", date: "15 Okt 2025", time: "6 min read", image: "https://via.placeholder.com/300x200?text=Podcast+Trend" },
  ];

  // Filter Artikel berdasarkan Kategori
  const filteredTrendArticles = trendArticles.filter(article => 
    selectedTrendCategory === 'All' || article.category === selectedTrendCategory
  );
  // ======================================


  // DATA HOOK LENGKAP
  const hookData = [
    {
      key: "viral",
      title: "Hook Viral",
      icon: Zap,
      color: "text-purple-400",
      description: "Rekomendasi kalimat pembuka yang cenderung menghasilkan visibilitas tinggi dan viral.",
      items: [
        { hook: "Hari Pertama X untuk Y", link: "https://vt.tiktok.com/ZSyJMGSUN/" },
        { hook: "Aku ga nyangka X untuk Y", link: "https://vt.tiktok.com/ZSyJMCeto/" },
        { hook: "Gimana kalo kita X", link: "https://vt.tiktok.com/ZSyJMXPbv/" },
      ]
    },
    {
      key: "cerita",
      title: "Hook Cerita",
      icon: MessageSquare,
      color: "text-yellow-400",
      description: "Rekomendasi Hook untuk memulai konten dengan Storytelling yang kuat.",
      items: [
        { hook: "Gimana jadinya kalo X", link: "https://vt.tiktok.com/ZSyJr8Bha/" },
        { hook: "Gue ingetin ya, jangan X karna Y", link: "https://vt.tiktok.com/ZSyJMwMtk/" },
      ]
    },
    {
      key: "jualan",
      title: "Hook Jualan",
      icon: ShoppingBag,
      color: "text-green-400",
      description: "Rekomendasi kalimat pembuka yang langsung mengarah pada konversi penjualan.",
      items: [
        { hook: "Fix ini jadi X yang aku rekomenin sekarang", link: "https://vt.tiktok.com/ZSyJrQtHB/", usage: "X adalah produk/solusi. Gunakan untuk menonjolkan rekomendasi tulus dari pengalaman pribadi." },
      ]
    },
  ];


  // FUNGSI SIMULASI API GEMINI (Tidak berubah)
  const analyzeNicheWithGemini = async (allAnswers) => {
    setIsLoading(true);

    const combinedAnswers = allAnswers.map((a, index) => `Jawaban P${index + 1}: ${a}`).join('\n\n');
    const systemPrompt = "Anda adalah Content Marketer Coach dan pakar personal branding (Niche Expert). Tugas Anda adalah menganalisis jawaban pengguna (berdasarkan 4 pilar: Suka, Jago, Dunia Butuh, Cuan) dan memberikan 3 rekomendasi Personal Brand/Niche yang paling cocok (Sweet Spot). Rekomendasi harus berupa array JSON dengan struktur [{nama: 'Niche 1', deskripsi: 'Alasan singkat'}, ...]";
    
    console.log("Mengirim ke Gemini dengan data:", combinedAnswers);

    // TODO: GANTI DENGAN FETCH/AXIOS PANGGILAN GEMINI API ASLI
    
    // --- SIMULASI HASIL (JANGAN HAPUS) ---
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulasi loading 3 detik
    const simulatedResult = [
        { nama: "Creative Productivity Coach", deskripsi: "Menggabungkan passion pada desain/seni dengan skill manajemen proyek. Niche ini dibutuhkan pekerja kreatif yang ingin efisien." },
        { nama: "Fintech Educator untuk Gen Z", deskripsi: "Fokus pada edukasi keuangan/investasi yang sederhana. Cuan terdefinisi dari penjualan e-book atau kelas investasi dasar." },
        { nama: "Visual Storyteller Properti", deskripsi: "Menggunakan skill fotografi/video (Jago) untuk membuat konten properti yang menarik (Dunia Butuh), dengan potensi cuan dari jasa visual/afiliasi agen properti." }
    ];
    setGeminiResult(simulatedResult);
    // --- AKHIR SIMULASI ---

    setIsLoading(false);
    setCurrentPage('konsultasi-result');
  };
  
  // PERTANYAAN KONSULTASI (8 PERTANYAN)
  const consultationQuestions = [
    { id: 1, text: "Ceritakan hal-hal yang benar-benar kamu nikmati dan bisa kamu lakukan selama berjam-jam tanpa merasa bosan. (Apa hobimu, topik yang kamu ikuti, atau aktivitas yang memberimu energi?)" },
    { id: 2, text: "Topik atau masalah spesifik apa yang membuatmu sangat tertarik hingga kamu rela menghabiskan waktu luangmu untuk mempelajarinya? (Contoh: Sejarah, pola hidup minimalis, atau teknologi terbaru?)" },
    { id: 3, text: "Apa keahlian/skill teknis yang kamu miliki, atau bidang di mana orang lain sering meminta bantuan/saran darimu? (Contoh: Analisis data, desain, menulis persuasif, manajemen proyek.)" },
    { id: 4, text: "Di lingkungan profesional atau akademik, area mana yang kamu kuasai lebih cepat daripada orang lain? (Contoh: Mengoperasikan software baru, memecahkan masalah logis, atau membangun hubungan/networking?)" },
    { id: 5, text: "Masalah nyata apa yang sedang dihadapi oleh kelompok audiens tertentu yang kamu lihat di sekitarmu? (Contoh: Kesulitan mencari pekerjaan, stress kerja, kesulitan jualan online bagi UMKM.)" },
    { id: 6, text: "Tren atau perubahan besar apa yang menurutmu akan mendominasi 1-5 tahun ke depan? (Contoh: AI, keberlanjutan lingkungan, kesehatan mental, atau *remote working*?)" },
    { id: 7, text: "Jika kamu menjual solusi, model bisnis apa yang menurutmu paling mudah diwujudkan dan memiliki margin keuntungan yang jelas? (Contoh: Jual produk digital, jasa konsultasi high-ticket, afiliasi, atau membership?)" },
    { id: 8, text: "Berapa nilai (harga) yang rela dibayar orang untuk solusi yang kamu tawarkan di bidang ini? (Apakah ini masalah yang orang bayar murah/banyak, sekali bayar/berlangganan?)" },
  ];

  const handleConsultationNext = () => {
    if (currentInput.trim() === '') return;

    const newAnswers = [...consultationAnswers, currentInput.trim()];
    setConsultationAnswers(newAnswers);
    setCurrentInput('');
    
    if (newAnswers.length === consultationQuestions.length) {
      analyzeNicheWithGemini(newAnswers);
    } else {
      setCurrentConsultationQuestion(currentConsultationQuestion + 1);
    }
  };


  // --- Logic untuk Kuis Sweet Spot Lama (Market Segment) ---
  const handleMarketSegmentAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (newAnswers.length === 4) {
      setShowResult(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const resetNiche = () => {
    setNicheInput('');
    setTempNicheInput(''); // Reset temp input juga
    setCurrentQuestion(0); // Reset juga currentQuestion
    setAnswers([]);
    setShowResult(false);
  };

  // Mendefinisikan array di dalam komponen agar nicheInput selalu terupdate
  const marketSegmentQuestions = [
    `Apa kamu suka ${nicheInput}? (Passion)`,
    `Kamu jago ${nicheInput} gak? (Skill)`,
    `Marketnya gede gak? (Market Size)`,
    `Ada uangnya gak? (Monetization)`
  ];

  // Fungsi untuk kembali ke Dashboard (Reset semua state)
  const goToDashboard = () => {
    setCurrentPage('dashboard');
    setIsQuizStarted(false); 
    setConsultationAnswers([]);
    setCurrentConsultationQuestion(0);
    setCurrentInput('');
    setGeminiResult(null);
    setIsLoading(false);
    setSelectedHookCategory(null);
    setNicheInput(''); // Reset niche input
    setTempNicheInput(''); // Reset temp input
    setAnswers([]); // Reset answers
    setShowResult(false); // Reset showResult
    setCurrentQuestion(0); // Reset currentQuestion
    setSelectedTrendCategory('All'); // Reset trend category
  }
  
  // Fungsi untuk navigasi ke Hook Detail
  const goToHookDetail = (key) => {
      const category = hookData.find(d => d.key === key);
      setSelectedHookCategory(category);
      setCurrentPage('hook-detail');
  }
  
  // Fungsi untuk navigasi ke Halaman Pembelian
  const goToPurchasePage = () => {
    setCurrentPage('purchase');
    setSelectedPlan('monthly'); // Set default plan
  };

  // Komponen NavItem untuk Desktop (Memudahkan penggunaan)
  const NavItem = ({ page, label, icon: Icon, currentPage, setCurrentPage }) => {
    const isActive = currentPage === page;
    return (
      <button 
        onClick={() => setCurrentPage(page)}
        // Ukuran NavItem diperbesar
        className={`flex items-center px-4 py-2 rounded-lg transition text-lg font-semibold ${
          isActive ? 'text-blue-400 bg-slate-700' : 'text-gray-300 hover:text-white hover:bg-slate-700'
        }`}
      >
        <Icon className="w-5 h-5 mr-2" />
        <span>{label}</span>
      </button>
    );
  };
  

  // Halaman Publik (Landing, Login, Register, Purchase)
  if (!isLoggedIn) {
    if (currentPage === 'landing') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
          
          {/* HEADER LANDING: Hanya Nama Aplikasi dan Tombol Masuk */}
          <nav className="p-4 md:p-8 flex justify-between items-center">
            <h1 className="text-xl md:text-4xl font-bold">MarketCreator.id</h1>
            <button 
              onClick={() => setCurrentPage('login')}
              className="bg-blue-600 hover:bg-blue-700 px-4 md:px-8 py-2 md:py-3 rounded-lg transition text-sm md:text-lg"
            >
              Masuk
            </button>
          </nav>
          
          <div className="container mx-auto px-4 md:px-12 py-10 md:py-24 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 md:mb-8">Buat Konten Social Media yang Menarik</h2>
            <p className="text-lg md:text-xl mb-6 md:mb-10 text-gray-300 max-w-3xl mx-auto">Platform lengkap untuk membantu Anda menemukan niche dan membuat konten marketing yang efektif</p>
            
            <div className='flex flex-col sm:flex-row justify-center gap-4'>
              <button 
                onClick={goToPurchasePage}
                className="bg-green-500 text-white px-6 md:px-10 py-3 md:py-5 rounded-lg text-lg md:text-xl font-semibold hover:bg-green-600 transition shadow-xl order-1 sm:order-2"
              >
                Beli Sekarang
              </button>
              <button 
                onClick={() => setCurrentPage('register')}
                className="bg-white text-blue-900 px-6 md:px-10 py-3 md:py-5 rounded-lg text-lg md:text-xl font-semibold hover:bg-gray-100 transition shadow-xl order-2 sm:order-1"
              >
                Mulai Gratis
              </button>
            </div>
          </div>

          <div className="container mx-auto px-4 md:px-12 py-8 md:py-16 grid md:grid-cols-3 gap-6 md:gap-10">
            <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-xl">
              <TrendingUp className="w-10 h-10 md:w-14 md:h-14 mb-3 text-blue-400" />
              <h3 className="text-xl md:text-2xl font-bold mb-2">Temukan Niche Anda</h3>
              <p className="text-gray-300 text-sm md:text-base">Sistem panduan untuk menemukan niche market yang tepat</p>
            </div>
            <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-xl">
              <Lightbulb className="w-10 h-10 md:w-14 md:h-14 mb-3 text-blue-400" />
              <h3 className="text-xl md:text-2xl font-bold mb-2">HOOK Menarik</h3>
              <p className="text-gray-300 text-sm md:text-base">Template hook untuk edukasi dan jualan</p>
            </div>
            <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-xl">
              <BookOpen className="w-10 h-10 md:w-14 md:h-14 mb-3 text-blue-400" />
              <h3 className="text-xl md:text-2xl font-bold mb-2">Edukasi Marketing</h3>
              <p className="text-gray-300 text-sm md:text-base">Video pembelajaran lengkap tentang marketing</p>
            </div>
          </div>
        </div>
      );
    }

    if (currentPage === 'login' || currentPage === 'register') {
        const isLogin = currentPage === 'login';
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex flex-col">
                {/* HEADER LOGIN/REGISTER: Nama Aplikasi dan Tombol Kembali */}
                <nav className="p-4 md:p-8 flex items-center">
                    <button 
                        onClick={() => setCurrentPage('landing')}
                        className="text-white hover:text-blue-400 mr-4 transition p-1"
                        aria-label="Kembali ke Halaman Utama"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl md:text-4xl font-bold">MarketCreator.id</h1>
                </nav>
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="bg-slate-800 p-8 md:p-10 rounded-xl w-full max-w-md shadow-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">{isLogin ? 'Masuk' : 'Daftar'}</h2>
                        {!isLogin && (
                            <input 
                                type="text" 
                                placeholder="Username" 
                                className="w-full p-3 md:p-4 mb-4 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring focus:ring-blue-500"
                            />
                        )}
                        <input 
                            type="email" 
                            placeholder="Email" 
                            className="w-full p-3 md:p-4 mb-4 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring focus:ring-blue-500"
                        />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="w-full p-3 md:p-4 mb-6 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring focus:ring-blue-500"
                        />
                        <button 
                            onClick={() => {
                                setIsLoggedIn(true);
                                setCurrentPage('dashboard');
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700 py-3 md:py-4 rounded-lg font-semibold transition shadow-md md:text-lg"
                        >
                            {isLogin ? 'Masuk' : 'Daftar'}
                        </button>
                        <p className="text-center mt-4 text-gray-400 md:text-base">
                            {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
                            <button 
                                onClick={() => setCurrentPage(isLogin ? 'register' : 'login')}
                                className="text-blue-400 hover:text-blue-300 ml-2 font-semibold"
                            >
                                {isLogin ? 'Daftar' : 'Masuk'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Halaman Pembelian
    if (currentPage === 'purchase') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex flex-col">
            {/* HEADER PEMBELIAN: Nama Aplikasi dan Tombol Kembali */}
            <nav className="p-4 md:p-8 flex items-center">
                <button 
                    onClick={() => setCurrentPage('landing')}
                    className="text-white hover:text-blue-400 mr-4 transition p-1"
                    aria-label="Kembali ke Halaman Utama"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl md:text-4xl font-bold">MarketCreator.id</h1>
            </nav>
            
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-slate-800 p-8 md:p-12 rounded-xl w-full max-w-xl shadow-2xl text-center">
                    <ShoppingBag className='w-12 h-12 md:w-16 md:h-16 text-yellow-400 mx-auto mb-4'/>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">Pilih Paket Berlangganan</h2>
                    <p className="text-gray-300 mb-8 md:text-lg">Akses semua fitur premium MarketCreator.id!</p>

                    {/* KARTU PILIHAN PAKET (HANYA 1 PILIHAN) */}
                    <div 
                        className="bg-blue-900 border-4 border-blue-500 p-6 md:p-8 rounded-xl relative shadow-2xl"
                    >
                        <p className='text-sm font-semibold mb-2 text-yellow-300'>PAKET REKOMENDASI</p>
                        <h3 className='text-3xl md:text-5xl font-extrabold mb-1 text-white'>
                            Rp20.000
                            <span className='text-xl md:text-2xl font-semibold text-gray-300'>/ bulan</span>
                        </h3>
                        <p className='text-gray-300 mb-6 md:text-lg'>Berlangganan bulanan</p>

                        <div className='space-y-3 mb-8 text-left'>
                            <div className='flex items-center text-lg'>
                                <CheckCircle className='w-5 h-5 mr-3 text-green-400 flex-shrink-0' />
                                <span className='text-white'>Akses penuh ke Konsultasi Niche (Gemini)</span>
                            </div>
                            <div className='flex items-center text-lg'>
                                <CheckCircle className='w-5 h-5 mr-3 text-green-400 flex-shrink-0' />
                                <span className='text-white'>Rekomendasi HOOK premium</span>
                            </div>
                            <div className='flex items-center text-lg'>
                                <CheckCircle className='w-5 h-5 mr-3 text-green-400 flex-shrink-0' />
                                <span className='text-white'>Semua Course Marketing</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => setCurrentPage('login')} // Arahkan ke Login untuk melanjutkan pembayaran
                            className="w-full bg-green-500 hover:bg-green-600 py-3 md:py-4 rounded-lg font-semibold transition shadow-md md:text-lg"
                        >
                            Lanjutkan ke Pembayaran
                        </button>
                    </div>
                </div>
            </div>
        </div>
      );
    }
  }

  // Halaman Logged In (Semua Halaman Aplikasi)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col text-white">
        
      {/* Desktop Top Navigation Bar (Visible on md and up) */}
      <nav className="hidden md:flex justify-between items-center p-4 md:px-10 bg-slate-800 border-b border-slate-700 shadow-xl sticky top-0 z-20">
          <h1 className="text-3xl font-bold text-white">MarketCreator.id</h1>
          <div className="flex space-x-6 items-center">
              <NavItem page="dashboard" label="Dashboard" icon={Home} currentPage={currentPage} setCurrentPage={setCurrentPage} />
              <NavItem page="trend" label="Trend" icon={TrendingUp} currentPage={currentPage} setCurrentPage={setCurrentPage} />
              <NavItem page="course" label="Course" icon={BookOpen} currentPage={currentPage} setCurrentPage={setCurrentPage} />
              <NavItem page="profile" label="Profile" icon={User} currentPage={currentPage} setCurrentPage={setCurrentPage} />
              
              <button 
                  onClick={() => {
                      setIsLoggedIn(false);
                      setCurrentPage('landing');
                  }}
                  // Tombol Logout diperbesar untuk Desktop
                  className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg transition text-white text-lg font-semibold"
              >
                  Logout
              </button>
          </div>
      </nav>
        
      {/* Main Content Area */}
      {/* Di desktop, padding disesuaikan agar tidak terlalu lebar di samping */}
      <div className="flex-1 overflow-auto pb-20 md:pb-0">
        
        {/* Halaman Dashboard */}
        {currentPage === 'dashboard' && (
            <div className="p-4 md:p-10 max-w-7xl mx-auto">
                
                {/* HEADER DASHBOARD: Judul dan Tombol Logout (Tombol Logout HANYA muncul di Mobile) */}
                <div className="flex justify-between items-center mb-6 md:mb-10">
                    <h1 className="text-3xl md:text-5xl font-bold text-white">Dashboard</h1>
                    <button 
                        onClick={() => {
                            setIsLoggedIn(false);
                            setCurrentPage('landing');
                        }}
                        className="md:hidden text-blue-400 hover:text-red-400 px-3 py-1 rounded-lg transition text-sm font-semibold"
                    >
                        Logout
                    </button>
                </div>
                
                {/* 1. KOTAK HIGHLIGHT TREND TERBARU */}
                <div 
                    onClick={() => setCurrentPage('trend')}
                    className="bg-purple-900 border border-purple-700 p-4 md:p-6 rounded-xl mb-6 md:mb-10 cursor-pointer hover:bg-purple-800 transition shadow-lg"
                >
                    <div className="flex items-center justify-between">
                        <div className='flex items-center'>
                             <Zap className="w-6 h-6 md:w-8 md:h-8 mr-3 text-yellow-300" />
                            <div>
                                <p className="text-xs md:text-sm text-yellow-300 font-semibold uppercase">🔥 TREND ALERT</p>
                                <h3 className="text-base md:text-xl font-bold text-white">AI Content Generator: Apakah Masih Relevan?</h3>
                            </div>
                        </div>
                        <ArrowLeft className='w-4 h-4 md:w-6 md:h-6 transform rotate-180 text-white'/>
                    </div>
                    <p className="text-gray-300 text-xs md:text-sm mt-2">Klik untuk melihat analisis lengkap di halaman Trend.</p>
                </div>
                
                {/* 2. COURSE CTA BANNER BARU */}
                <div 
                    onClick={() => setCurrentPage('course')}
                    className="bg-green-700 p-4 md:p-6 rounded-xl mb-8 md:mb-12 cursor-pointer hover:bg-green-600 transition shadow-lg"
                >
                    <div className="flex items-center justify-between">
                        <div className='flex items-center'>
                             <GraduationCap className="w-8 h-8 md:w-10 md:h-10 mr-3 text-white" />
                            <div>
                                <p className="text-sm md:text-base font-semibold text-white">Siap Naik Level?</p>
                                <h3 className="text-lg md:text-2xl font-bold text-white">Pelajari Strategi Marketing Terbaru!</h3>
                            </div>
                        </div>
                        <ArrowLeft className='w-5 h-5 md:w-6 md:h-6 transform rotate-180 text-white'/>
                    </div>
                </div>
                
                {/* 3. GRID 4 CARD UTAMA */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {/* Market Segment */}
                    <div 
                        onClick={() => setCurrentPage('market-segment')}
                        className="bg-slate-800 p-4 md:p-6 rounded-xl hover:bg-slate-700 cursor-pointer transition shadow-lg h-40 md:h-52 flex flex-col justify-between"
                    >
                        <div>
                            <TrendingUp className="w-8 h-8 md:w-10 md:h-10 mb-2 text-blue-400" />
                            <h3 className="text-base md:text-xl font-bold text-white">Market Segment</h3>
                        </div>
                        <p className="text-gray-400 text-xs md:text-base">Temukan niche market</p>
                    </div>

                    {/* HOOK */}
                    <div 
                        onClick={() => setCurrentPage('hook')}
                        className="bg-slate-800 p-4 md:p-6 rounded-xl hover:bg-slate-700 cursor-pointer transition shadow-lg h-40 md:h-52 flex flex-col justify-between"
                    >
                        <div>
                            <Lightbulb className="w-8 h-8 md:w-10 md:h-10 mb-2 text-blue-400" />
                            <h3 className="text-base md:text-xl font-bold text-white">HOOK</h3>
                        </div>
                        <p className="text-gray-400 text-xs md:text-base">Rekomendasi konten</p>
                    </div>

                    {/* Konsultasi */}
                    <div 
                        onClick={() => setCurrentPage('konsultasi')}
                        className="bg-slate-800 p-4 md:p-6 rounded-xl hover:bg-slate-700 cursor-pointer transition shadow-lg h-40 md:h-52 flex flex-col justify-between"
                    >
                        <div>
                            <User className="w-8 h-8 md:w-10 md:h-10 mb-2 text-blue-400" />
                            <h3 className="text-base md:text-xl font-bold text-white">Konsultasi</h3>
                        </div>
                        <p className="text-gray-400 text-xs md:text-base">Bantuan expert</p>
                    </div>

                    {/* Produk (Coming Soon) */}
                    <div 
                        className="bg-slate-800 p-4 md:p-6 rounded-xl relative opacity-60 shadow-lg h-40 md:h-52 flex flex-col justify-between"
                        aria-disabled="true" 
                    >
                                    <div>
                            <Lock className="w-8 h-8 md:w-10 md:h-10 mb-2 text-gray-500" />
                            <h3 className="text-base md:text-xl font-bold text-white">Produk</h3>
                                </div>
                        <p className="text-gray-400 text-xs md:text-base">Coming Soon</p>
                        <div className="absolute top-4 right-4">
                            <Lock className="w-4 h-4 text-gray-500" />
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Halaman HOOK UTAMA (Menu Kategori Hook) */}
        {currentPage === 'hook' && (
            // PERUBAHAN: Menambah flex-col items-center justify-center untuk centering vertikal
            <div className="p-4 md:p-10 max-w-7xl mx-auto flex flex-col flex-1">
                <div className="flex items-center mb-6 md:mb-10 text-white">
                    <button 
                        onClick={goToDashboard}
                        className="text-white hover:text-blue-400 mr-4 transition p-1"
                        aria-label="Kembali ke Dashboard"
                    >
                        <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                    {/* PERUBAHAN: Mengganti Template menjadi Rekomendasi */}
                    <h1 className="text-2xl md:text-4xl font-bold">
                        Rekomendasi HOOK
                    </h1>
                </div>

                {/* PERUBAHAN: Menambah flex-1 dan margin-auto untuk centering di sisa ruang */}
                <div className="space-y-6 md:grid md:grid-cols-3 md:gap-10 md:space-y-0 md:flex-1 md:my-auto">
                    {hookData.map((category, catIndex) => (
                        <div 
                            key={catIndex} 
                            onClick={() => goToHookDetail(category.key)}
                            // Peningkatan ukuran padding dan card height untuk desktop
                            className="bg-slate-800 p-6 md:p-10 rounded-xl hover:bg-slate-700 cursor-pointer transition shadow-lg flex flex-col justify-between h-48 md:h-64"
                        >
                            <div className='flex items-start'>
                                {/* Icon size ditingkatkan untuk Desktop */}
                                {React.createElement(category.icon, { className: `w-12 h-12 md:w-16 md:h-16 mr-4 ${category.color} flex-shrink-0` })}
                                <div>
                                    {/* Judul ditingkatkan untuk Desktop */}
                                    <h3 className="text-xl md:text-3xl font-bold mb-1 text-white">{category.title}</h3>
                                    {/* Deskripsi ditingkatkan untuk Desktop */}
                                    <p className="text-gray-400 text-sm md:text-lg">{category.description}</p>
                                </div>
                            </div>
                            <ArrowLeft className='w-5 h-5 md:w-8 md:h-8 transform rotate-180 text-blue-400 self-end'/>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        {/* Halaman HOOK DETAIL (Daftar Hook & Tombol Penggunaan) */}
        {currentPage === 'hook-detail' && selectedHookCategory && (
            <div className="p-4 md:p-10 max-w-7xl mx-auto flex flex-col flex-1">
                {/* HEADER DETAIL */}
                <div className="flex items-center mb-6 md:mb-10 text-white">
                    <button 
                        onClick={() => setCurrentPage('hook')}
                        className="text-white hover:text-blue-400 mr-4 transition p-1"
                        aria-label="Kembali ke Menu HOOK"
                    >
                        <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                    {/* PERUBAHAN: Mengganti Template menjadi Rekomendasi */}
                    <h1 className="text-2xl md:text-4xl font-bold">
                        Rekomendasi {selectedHookCategory.title}
                    </h1>
                </div>

                {/* Konten Hook Detail */}
                <div className="space-y-4 md:my-auto md:max-w-4xl md:mx-auto w-full">
                    <div className="bg-slate-800 p-6 md:p-10 rounded-xl shadow-xl">
                         {React.createElement(selectedHookCategory.icon, { className: `w-12 h-12 md:w-16 md:h-16 text-center mx-auto mb-4 ${selectedHookCategory.color}` })}
                        {/* Deskripsi ditingkatkan untuk Desktop */}
                        <p className="text-gray-300 mb-6 text-base md:text-lg text-center">{selectedHookCategory.description}</p>
                        
                        <div className="space-y-6 pt-2">
                            {selectedHookCategory.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="bg-slate-700 p-5 md:p-8 rounded-lg border-l-4 border-blue-500 flex flex-col justify-between items-start">
                                    
                                    <div className='flex-1 mb-4 w-full'>
                                        {/* Tautan pada Hook itu sendiri */}
                                        <a
                                            href={item.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-white font-bold mb-2 text-xl md:text-2xl hover:text-blue-300 transition block w-fit"
                                        >
                                            {item.hook}
                                        </a>
                                    </div>

                                    {/* Tombol yang sekarang langsung redirect ke video */}
                                    <a
                                        href={item.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className='bg-purple-600 hover:bg-purple-700 text-white py-3 md:py-4 px-6 md:px-8 rounded-lg text-base md:text-lg font-semibold transition w-full text-center'
                                    >
                                        Lihat Contoh Video
                                        <TrendingUp className="w-5 h-5 ml-2 inline-block" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
        
        {/* Halaman Konsultasi - Quiz Flow START */}
        {currentPage === 'konsultasi' && (
          <div className="p-4 md:p-10 max-w-5xl mx-auto">
            {/* HEADER DETAIL */}
            <div className="flex items-center mb-6 md:mb-10 text-white">
                <button 
                    onClick={goToDashboard}
                    className="text-white hover:text-blue-400 mr-4 transition p-1"
                    aria-label="Kembali ke Dashboard"
                >
                    <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
                </button>
                <h1 className="text-2xl md:text-4xl font-bold">
                    Konsultasi Expert
                </h1>
            </div>

            {/* LANDING PAGE KUIS */}
            {!isQuizStarted && (
                <div className="bg-slate-800 p-12 md:p-24 rounded-xl text-center shadow-xl min-h-[60vh] flex flex-col items-center justify-center">
                    <h2 className="text-2xl md:text-4xl font-bold mb-3 text-white">
                        Kami bantu carikan <span className='text-blue-400'>Niche</span> yang cocok untuk kamu
                    </h2>
                    <p className="text-lg md:text-xl mb-8 md:mb-10 text-gray-300 max-w-lg">
                        Ayo jawab pertanyaan berikut agar kami bisa carikan Niche yang cocok untukmu!
                    </p>
                    <button 
                        onClick={() => {
                            setIsQuizStarted(true);
                            setCurrentConsultationQuestion(0);
                            setConsultationAnswers([]);
                            setCurrentInput('');
                        }}
                        className="bg-blue-600 hover:bg-blue-700 py-3 md:py-4 px-8 md:px-10 rounded-lg font-semibold transition text-white shadow-md md:text-lg"
                    >
                        Mulai Sekarang
                    </button>
                </div>
            )}

            {/* KUIS BERJALAN */}
            {isQuizStarted && currentConsultationQuestion < consultationQuestions.length && (
                <div className="bg-slate-800 p-6 md:p-10 rounded-xl shadow-xl">
                    <div className="mb-6">
                        {/* Progress Bar */}
                        <div className="flex gap-2 mb-4">
                            {[...Array(consultationQuestions.length)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`h-2 flex-1 rounded-full ${i < currentConsultationQuestion ? 'bg-green-600' : i === currentConsultationQuestion ? 'bg-blue-400 animate-pulse' : 'bg-slate-600'}`}
                                />
                            ))}
                        </div>
                        <p className='text-sm text-gray-400 mb-4 md:text-base'>Pertanyaan {currentConsultationQuestion + 1} dari {consultationQuestions.length}</p>
                        
                        {/* Pertanyaan */}
                        <h3 className="text-lg md:text-2xl font-bold mb-6 text-white">
                            {consultationQuestions[currentConsultationQuestion].text}
                        </h3>

                        {/* Input Jawaban */}
                        <textarea
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            placeholder="Tuliskan jawaban Anda di sini..."
                            rows="7" // Menambah tinggi input di desktop
                            className="w-full p-3 md:p-4 mb-4 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring focus:ring-blue-500 md:text-lg"
                        />
                        
                        {/* Tombol Lanjut/Selesai */}
                        <button 
                            onClick={handleConsultationNext}
                            disabled={currentInput.trim() === '' || isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 py-3 md:py-4 rounded-lg font-semibold transition text-white shadow-md disabled:bg-slate-600 flex items-center justify-center md:text-lg"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                currentConsultationQuestion === consultationQuestions.length - 1 ? 'Selesaikan dan Analisis' : 'Lanjut'
                            )}
                        </button>
                    </div>
                </div>
            )}
          </div>
        )}

        {/* HASIL KUIS GEMINI (NEW PAGE) */}
        {currentPage === 'konsultasi-result' && (
            <div className="p-4 md:p-10 max-w-5xl mx-auto">
                {/* HEADER DETAIL */}
                <div className="flex items-center mb-6 md:mb-10 text-white">
                    <button 
                        onClick={goToDashboard}
                        className="text-white hover:text-blue-400 mr-4 transition p-1"
                        aria-label="Kembali ke Dashboard"
                    >
                        <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                    <h1 className="text-2xl md:text-4xl font-bold">
                        Hasil Analisis Niche
                    </h1>
                </div>

                <div className="bg-slate-800 p-6 md:p-10 rounded-xl shadow-xl">
                    <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-yellow-400 mx-auto mb-4" />
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center">3 Rekomendasi Personal Brand</h2>
                    <p className="text-center mb-6 text-gray-300 md:text-lg">
                        Berdasarkan jawaban Anda, berikut 3 Niche yang paling cocok:
                    </p>

                    <div className="space-y-4">
                        {geminiResult && geminiResult.map((reco, index) => (
                            <div key={index} className="bg-slate-700 p-4 md:p-6 rounded-lg border-l-4 border-blue-500">
                                <h3 className="text-xl font-bold mb-1 text-white">{index + 1}. {reco.nama}</h3>
                                <p className="text-gray-300 text-sm md:text-base">{reco.deskripsi}</p>
                            </div>
                        ))}
                        
                        {!geminiResult && (
                            <div className="text-center p-6 text-gray-400 md:text-lg">
                                Gagal memuat hasil. Silakan coba lagi.
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={goToDashboard}
                        className="w-full bg-blue-600 hover:bg-blue-700 py-3 md:py-4 rounded-lg font-semibold transition shadow-md mt-6 md:text-lg"
                    >
                        Selesai & Ke Dashboard
                    </button>
                </div>
            </div>
        )}
        {/* Halaman Konsultasi - Quiz Flow END */}


        {/* Halaman Market Segment (Sweet Spot Lama) */}
        {currentPage === 'market-segment' && (
          <div className="p-4 md:p-10 max-w-5xl mx-auto">
            
            {/* HEADER DETAIL */}
            <div className="flex items-center mb-6 md:mb-10 text-white">
                <button 
                    onClick={goToDashboard}
                    className="text-white hover:text-blue-400 mr-4 transition p-1"
                    aria-label="Kembali ke Dashboard"
                >
                    <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
                </button>
                <h1 className="text-2xl md:text-4xl font-bold">
                    Market Segment
                </h1>
            </div>
            
            <div className="flex justify-end items-center mb-6">
                {nicheInput && (
                    <button
                        onClick={resetNiche}
                        className="bg-slate-700 hover:bg-slate-600 text-gray-300 px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm md:text-base font-semibold"
                    >
                        <XCircle className="w-4 h-4" /> Reset
                    </button>
                )}
            </div>
            
            {!nicheInput && (
              // Logic disesuaikan menggunakan tempNicheInput
              <div className="bg-slate-800 p-6 md:p-10 rounded-xl shadow-xl">
                <h2 className="text-xl md:text-2xl font-bold mb-3 text-white">Pernyataan Sweet Spot</h2>
                <p className="text-gray-300 mb-4 text-sm md:text-base">Masukkan niche yang ingin Anda dalami</p>
                <input 
                  type="text"
                  placeholder="Contoh: Digital Marketing, Fashion..."
                  className="w-full p-3 md:p-4 mb-4 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring focus:ring-blue-500 md:text-lg"
                  onChange={(e) => setTempNicheInput(e.target.value)}
                  value={tempNicheInput} 
                  onKeyPress={(e) => {
                    // Hanya lanjutkan jika ENTER ditekan DAN panjang input >= 3
                    if (e.key === 'Enter' && tempNicheInput.trim().length >= 3) {
                      setNicheInput(tempNicheInput.trim()); 
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    // Pastikan hanya tombol yang memicu aksi
                    if (tempNicheInput.trim().length >= 3) {
                      setNicheInput(tempNicheInput.trim()); 
                    }
                  }}
                  // Tombol disabled jika kurang dari 3 karakter
                  disabled={tempNicheInput.trim().length < 3}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 md:py-4 rounded-lg font-semibold transition disabled:bg-slate-600 md:text-lg"
                >
                  Lanjutkan
                </button>
              </div>
            )}

            {nicheInput && !showResult && (
              <div className="bg-slate-800 p-6 md:p-10 rounded-xl shadow-xl">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">Test Sweet Spot</h2>
                <p className="text-lg md:text-xl mb-6 text-gray-300">
    1.  Niche: <span className="text-blue-400 font-semibold">{nicheInput}</span>
                </p>
                
                <div className="mb-6">
                  <div className="flex gap-2 mb-6">
                    {[0, 1, 2, 3].map((i) => (
                      <div 
                        key={i} 
                        className={`h-2 flex-1 rounded-full ${i < currentQuestion ? 'bg-green-600' : i === currentQuestion ? 'bg-blue-400 animate-pulse' : 'bg-slate-600'}`}
                      />
                    ))}
                  </div>
                  
                  {currentQuestion < marketSegmentQuestions.length && (
                    <p className="text-base md:text-lg mb-6 text-white font-medium">{marketSegmentQuestions[currentQuestion]}</p>
                  )}
                  <div className="flex flex-col md:flex-row gap-3">
                    <button 
                      onClick={() => handleMarketSegmentAnswer(true)}
                      className="flex-1 bg-green-600 hover:bg-green-700 py-3 md:py-4 rounded-lg font-semibold transition text-white shadow-md md:text-lg"
                    >
                      Ya
                    </button>
                    <button 
                      onClick={() => handleMarketSegmentAnswer(false)}
                      className="flex-1 bg-red-600 hover:bg-red-700 py-3 md:py-4 rounded-lg font-semibold transition text-white shadow-md md:text-lg"
                    >
                      Tidak
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showResult && answers.every(a => a === true) && (
              <div className="bg-green-900 border-2 border-green-500 p-6 md:p-10 rounded-xl text-white shadow-2xl">
                <CheckCircle className="w-14 h-14 md:w-16 md:h-16 text-green-400 mx-auto mb-3" />
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center">Selamat! Niche Ditemukan!</h2>
                <p className="text-lg md:text-xl text-center mb-5 text-gray-200">
                  Niche Anda: <span className="text-green-400 font-bold">{nicheInput}</span>
                </p>
                <div className="flex flex-col md:flex-row gap-3 mb-3">
                  <button 
                    onClick={() => setCurrentPage('course')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 md:py-4 rounded-lg font-semibold transition shadow-md md:text-lg"
                  >
                    Lihat Course
                  </button>
                  <button 
                    onClick={() => setCurrentPage('hook')}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 md:py-4 rounded-lg font-semibold transition shadow-md md:text-lg"
                  >
                    Ke HOOK
                  </button>
                </div>
                <button 
                  onClick={resetNiche}
                  className="w-full bg-slate-600 hover:bg-slate-500 py-2 md:py-3 rounded-lg transition text-sm md:text-base mt-2"
                >
                  Cari Niche Lain
                </button>
              </div>
            )}

            {showResult && answers.some(a => a === false) && (
              <div className="bg-red-900 border-2 border-red-500 p-6 md:p-10 rounded-xl text-white shadow-2xl">
                <XCircle className="w-14 h-14 md:w-16 md:h-16 text-red-400 mx-auto mb-3" />
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center">Oops! Niche Kurang Tepat</h2>
                <p className="text-lg md:text-xl text-center mb-4 text-gray-200">
                  Niche <span className="font-bold">{nicheInput}</span> belum memenuhi semua kriteria Sweet Spot.
                </p>
                <p className="text-center mb-5 text-gray-300 text-sm md:text-base">
                  Coba temukan kombinasi yang memenuhi **Passion, Skill, Market, dan Money**.
                </p>
                <button 
                  onClick={() => setCurrentPage('konsultasi')}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 md:py-4 rounded-lg font-semibold transition mb-3 shadow-md md:text-lg"
                >
                  Konsultasi Sekarang
                </button>
                <button 
                  onClick={resetNiche}
                  className="w-full bg-slate-600 hover:bg-slate-500 py-2 md:py-3 rounded-lg transition text-sm md:text-base"
                >
                  Coba Niche Lain
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Halaman Detail Lainnya */}
        {['trend', 'course', 'profile'].includes(currentPage) && (
            <div className="p-4 md:p-10 max-w-7xl mx-auto">
                
                {/* HEADER DETAIL */}
                <div className="flex items-center mb-6 md:mb-10 text-white">
                    <button 
                        onClick={goToDashboard}
                        className="text-white hover:text-blue-400 mr-4 transition p-1"
                        aria-label="Kembali ke Dashboard"
                    >
                        <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                    <h1 className="text-2xl md:text-4xl font-bold">
                        {currentPage === 'trend' && 'Trend Konten'}
                        {currentPage === 'course' && 'Course Marketing'}
                        {currentPage === 'profile' && 'Profile Saya'}
                    </h1>
                </div>

                {currentPage === 'trend' && (
                    <>
                        {/* Search Bar and Filter (Mobile Only) - Sekarang hanya placeholder input biasa */}
                        <div className="md:hidden flex items-center justify-between bg-slate-800 p-3 rounded-xl mb-4">
                            <div className="relative flex-1 mr-3">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Cari berita atau topik..." 
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring focus:ring-blue-500 text-sm"
                                />
                            </div>
                            <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition">
                                <Filter className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        
                        {/* Kategori Trend */}
                        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                            {trendCategories.map(category => (
                                <button 
                                    key={category}
                                    onClick={() => setSelectedTrendCategory(category)}
                                    className={`px-4 py-2 rounded-lg font-semibold text-white text-sm md:text-base whitespace-nowrap shadow-md 
                                        ${selectedTrendCategory === category ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        
                        {/* Daftar Artikel Trend */}
                        <div className="space-y-6">
                            {filteredTrendArticles.map(article => (
                                <div key={article.id} className="bg-slate-800 p-4 rounded-xl shadow-lg flex flex-col md:flex-row items-start md:items-center">
                                    <div className="relative w-full h-40 md:w-60 md:h-36 flex-shrink-0 rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-6">
                                        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                                        <span className="absolute top-2 right-2 bg-slate-900/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                                            <BookOpen className="w-3 h-3 mr-1" /> {article.type}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-400 uppercase font-semibold mb-1">{article.category}</p>
                                        <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">{article.title}</h3>
                                        <p className="text-gray-500 text-xs md:text-sm">{article.date} | {article.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredTrendArticles.length === 0 && (
                            <div className="bg-slate-800 p-12 md:p-20 rounded-xl text-center shadow-xl mt-6">
                                <TrendingDown className="w-14 h-14 md:w-20 md:h-20 mx-auto mb-3 text-gray-500" />
                                <p className="text-lg md:text-xl text-gray-400">Tidak ada artikel untuk kategori ini.</p>
                                <p className="text-gray-500 mt-2 text-sm md:text-base">Coba kategori lain.</p>
                            </div>
                        )}
                    </>
                )}

                {currentPage === 'course' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                      {['Dasar Marketing', 'Content Strategy', 'Social Media Marketing', 'Copywriting', 'Personal Branding', 'Paid Advertising'].map((course, idx) => (
                        <div key={idx} className="bg-slate-800 p-4 md:p-6 rounded-xl hover:bg-slate-700 transition shadow-lg">
                          <div className="bg-slate-700 h-24 md:h-32 rounded-lg mb-3 flex items-center justify-center">
                            <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-gray-500" />
                          </div>
                          <h3 className="text-base md:text-xl font-bold mb-1 text-white">{course}</h3>
                          <p className="text-gray-400 mb-3 text-xs md:text-sm">Video pembelajaran {course.toLowerCase()}</p>
                          <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 md:py-3 rounded-lg transition text-sm md:text-base font-medium shadow-md">
                            Tonton
                          </button>
                        </div>
                      ))}
                    </div>
                )}

                {currentPage === 'profile' && (
                    <div className="bg-slate-800 p-6 md:p-10 rounded-xl shadow-xl">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-700 rounded-full flex items-center justify-center mr-4">
                          <User className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                        </div>
                        <div>
                          <h2 className="text-xl md:text-2xl font-bold text-white mb-1">User Name</h2>
                          <p className="text-gray-400 text-sm md:text-base">user@email.com</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-gray-300 mb-2 text-sm md:text-base">Nama Lengkap</label>
                          <input 
                            type="text"
                            defaultValue="User Name"
                            className="w-full p-3 md:p-4 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring focus:ring-blue-500 md:text-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2 text-sm md:text-base">Email</label>
                          <input 
                            type="email"
                            defaultValue="user@email.com"
                            className="w-full p-3 md:p-4 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring focus:ring-blue-500 md:text-lg"
                          />
                        </div>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 md:py-4 rounded-lg font-semibold transition mt-4 md:text-lg shadow-md">
                          Simpan Perubahan
                        </button>
                      </div>
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Bottom Navigation (HANYA untuk Mobile) */}
      {isLoggedIn && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 px-4 py-3 shadow-2xl z-10 md:hidden"> {/* Sembunyikan di desktop */}
            <div className="flex justify-around items-center max-w-lg mx-auto">
                <button 
                    onClick={() => setCurrentPage('dashboard')}
                    className={`flex flex-col items-center p-2 rounded-lg transition ${currentPage === 'dashboard' ? 'text-blue-400 bg-slate-700' : 'text-gray-400 hover:text-white'}`}
                >
                    <Home className="w-5 h-5 mb-1" />
                    <span className="text-xs">Dashboard</span>
                </button>
                <button 
                    onClick={() => setCurrentPage('trend')}
                    className={`flex flex-col items-center p-2 rounded-lg transition ${currentPage === 'trend' ? 'text-blue-400 bg-slate-700' : 'text-gray-400 hover:text-white'}`}
                >
                    <TrendingUp className="w-5 h-5 mb-1" />
                    <span className="text-xs">Trend</span>
                </button>
                <button 
                    onClick={() => setCurrentPage('course')}
                    className={`flex flex-col items-center p-2 rounded-lg transition ${currentPage === 'course' ? 'text-blue-400 bg-slate-700' : 'text-gray-400 hover:text-white'}`}
                >
                    <BookOpen className="w-5 h-5 mb-1" />
                    <span className="text-xs">Course</span>
                </button>
                <button 
                    onClick={() => setCurrentPage('profile')}
                    className={`flex flex-col items-center p-2 rounded-lg transition ${currentPage === 'profile' ? 'text-blue-400 bg-slate-700' : 'text-gray-400 hover:text-white'}`}
                >
                    <User className="w-5 h-5 mb-1" />
                    <span className="text-xs">Profile</span>
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
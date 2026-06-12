<?php
$title = 'Health Records - GramSehat';
$page = 'health-records';
require 'includes/header.php';
?>

<section class="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-rose-900 via-rose-800 to-pink-900">
  <div class="hero-glow hero-glow-1"></div>
  <div class="hero-glow hero-glow-2"></div>

  <div class="max-w-6xl mx-auto px-4 py-32 relative z-10 w-full">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="space-y-8">
        <div class="hero-badge inline-flex items-center gap-3 bg-white/10 text-white/90 px-5 py-2 rounded-full text-sm border border-white/10 backdrop-blur-sm">
          <span class="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></span>
          <span>Your medical records, always accessible</span>
        </div>
        <h1 class="hero-title">
          <span class="text-4xl md:text-6xl font-bold block reveal-text"><span class="reveal-inner bg-gradient-to-r from-rose-300 via-pink-300 to-rose-200 bg-clip-text text-transparent">Digital Health Records</span></span>
          <span class="text-xl md:text-2xl font-medium block mt-4 text-rose-100/80 reveal-text"><span class="reveal-inner">आपके स्वास्थ्य रिकॉर्ड, हमेशा आपके पास</span></span>
        </h1>
        <p class="hero-desc text-lg md:text-xl text-rose-100/80 leading-relaxed max-w-lg" style="opacity:0">Store, manage, and access all your medical records digitally. Secure, private, and available anytime — even offline.</p>
        <div class="hero-cta flex flex-wrap gap-4 pt-4">
          <a href="#" class="group bg-white text-rose-800 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-rose-500/30 transition-all duration-300 flex items-center gap-3 btn-shimmer"><i class="ri-file-add-line group-hover:animate-bounce"></i><span>Add Record</span><i class="ri-arrow-right-line text-sm opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all"></i></a>
          <a href="#" class="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-3"><i class="ri-play-circle-line"></i><span>Watch Demo</span></a>
        </div>
      </div>
      <div class="hidden lg:flex justify-center hero-svg">
        <div class="relative float-anim">
          <svg width="320" height="320" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-2xl">
            <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(251,113,133,.3)" stroke-width="2" class="pulse-ring"/>
            <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(251,113,133,.2)" stroke-width="1.5"/>
            <g class="svg-animate" fill="none" stroke="#fda4af" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M50,60 L50,160 L150,160 L150,100 L110,100 L110,60Z"/>
              <path d="M110,60 L150,100"/>
              <line x1="65" y1="120" x2="135" y2="120"/>
              <line x1="65" y1="130" x2="120" y2="130"/>
              <line x1="65" y1="140" x2="110" y2="140"/>
              <rect x="70" y="40" width="16" height="20" rx="3"/>
              <line x1="78" y1="40" x2="78" y2="60"/>
              <circle cx="78" cy="52" r="3" fill="#fda4af" stroke="none"/>
            </g>
            <g fill="rgba(251,113,133,.3)">
              <circle cx="40" cy="40" r="3"/><circle cx="160" cy="30" r="3"/>
              <circle cx="170" cy="140" r="3"/><circle cx="30" cy="150" r="3"/>
              <circle cx="45" cy="180" r="2.5"/><circle cx="155" cy="180" r="2.5"/>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
  <div class="absolute bottom-0 left-0 right-0">
    <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg"><path d="M0 120L60 110C120 100 240 80 360 70 480 60 600 60 720 65 840 70 960 80 1080 85 1200 90 1320 90 1380 90L1440 90V120H0Z" fill="white"/></svg>
  </div>
</section>

<section class="py-24 bg-white">
  <div class="max-w-6xl mx-auto px-4">
    <div class="text-center mb-16 stagger-fade">
      <span class="text-rose-600 font-semibold text-sm uppercase tracking-[.2em]">How It Works</span>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Three Simple Steps</h2>
      <p class="text-gray-500 mt-4 max-w-2xl mx-auto">From uploading to accessing — your records in seconds</p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      <?php $steps=[
        ['ri-file-add-line','from-rose-500 to-pink-600','Add Record','Upload prescriptions, lab reports, and scans using camera or file upload. OCR auto-extracts details.'],
        ['ri-shield-keyhole-line','from-indigo-500 to-violet-600','Store Securely','End-to-end encryption keeps your data private. Only you and authorized caregivers can access.'],
        ['ri-cloud-line','from-blue-500 to-cyan-600','Access Anytime','All records sync to the cloud. View them anytime, anywhere — even offline on your device.'],
      ]; foreach($steps as $i=>$s): ?>
      <div class="card-3d stagger-fade">
        <div class="card-3d-inner bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br <?=$s[1]?> flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-md"> <i class="<?=$s[0]?>"></i> </div>
          <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm mx-auto mb-4">0<?=$i+1?></div>
          <h3 class="text-xl font-bold text-gray-900 mb-3"><?=$s[2]?></h3>
          <p class="text-gray-500 leading-relaxed"><?=$s[3]?></p>
        </div>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="py-24 bg-rose-50">
  <div class="max-w-6xl mx-auto px-4">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="stagger-fade">
        <img src="https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80" alt="Medical records" class="rounded-2xl shadow-2xl w-full h-auto" loading="lazy">
      </div>
      <div class="space-y-6">
        <span class="text-rose-600 font-semibold text-sm uppercase tracking-[.2em]">Digital Records</span>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 reveal-text"><span class="reveal-inner">All Your Medical Records <br>in One Secure Place</span></h2>
        <p class="text-gray-600 leading-relaxed">Say goodbye to paper prescriptions and lost reports. Digitize your entire medical history and access it with a tap.</p>
        <ul class="space-y-4 pt-4">
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">Unlimited records</strong> per user account</span></li>
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">End-to-end encryption</strong> for complete privacy</span></li>
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">Offline access</strong> to downloaded records</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="py-24 bg-white">
  <div class="max-w-6xl mx-auto px-4">
    <div class="text-center mb-16 stagger-fade">
      <span class="text-rose-600 font-semibold text-sm uppercase tracking-[.2em]">Why Use It</span>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Benefits</h2>
    </div>
    <div class="grid md:grid-cols-4 gap-6">
      <?php $benefits=[
        ['ri-medicine-bottle-line','from-rose-500 to-pink-600','Prescriptions','Store and organize all prescriptions. Get refill reminders and share with pharmacies instantly.'],
        ['ri-flask-line','from-purple-500 to-indigo-600','Lab Reports','Upload lab reports with automatic OCR data extraction. Track results over time.'],
        ['ri-syringe-line','from-blue-500 to-cyan-600','Vaccination History','Keep track of vaccination schedules for the whole family. Get timely reminders.'],
        ['ri-wifi-off-line','from-slate-500 to-gray-600','Offline Access','All downloaded records available offline. Perfect for areas with limited connectivity.'],
      ]; foreach($benefits as $b): ?>
      <div class="card-3d stagger-fade">
        <div class="card-3d-inner bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br <?=$b[1]?> flex items-center justify-center text-white text-xl mx-auto mb-4 shadow"><i class="<?=$b[0]?>"></i></div>
          <h3 class="font-bold text-gray-900 mb-2"><?=$b[2]?></h3>
          <p class="text-gray-500 text-sm leading-relaxed"><?=$b[3]?></p>
        </div>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="py-20 bg-gradient-to-r from-rose-600 to-pink-700 relative overflow-hidden">
  <div class="hero-glow hero-glow-1" style="background:#e11d48;opacity:.15"></div>
  <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
    <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 reveal-text"><span class="reveal-inner">Digitize Your Health Records Today</span></h2>
    <p class="text-rose-100/80 text-lg mb-8 max-w-2xl mx-auto">Never lose another medical record. Safe, secure, and always with you.</p>
    <div class="flex flex-wrap justify-center gap-4">
      <a href="#" class="bg-white text-rose-700 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 btn-shimmer flex items-center gap-3"><i class="ri-file-add-line"></i> Add Your First Record</a>
      <a href="#" class="border-2 border-white/40 text-white px-10 py-4 rounded-full font-semibold hover:bg-white/10 transition flex items-center gap-3"><i class="ri-download-line"></i> Download App</a>
    </div>
  </div>
</section>

<script>
  gsap.from('.hero-badge', { opacity: 0, y: 30, duration: 0.8, delay: 0.2 });
  gsap.to('.reveal-inner', { y: 0, duration: 1, stagger: 0.2, ease: 'power4.out', delay: 0.5 });
  gsap.from('.hero-desc', { opacity: 0, y: 30, duration: 0.8, delay: 0.9 });
  gsap.from('.hero-cta > *', { opacity: 0, y: 30, duration: 0.6, stagger: 0.15, delay: 1.1 });
  gsap.from('.hero-svg', { opacity: 0, scale: 0.8, duration: 1, delay: 0.6, ease: 'back.out(1.7)' });
</script>

<?php require 'includes/footer.php'; ?>

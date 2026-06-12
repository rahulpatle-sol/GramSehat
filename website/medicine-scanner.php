<?php
$title = 'Medicine Scanner - GramSehat';
$page = 'medicine-scanner';
require 'includes/header.php';
?>

<section class="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
  <div class="hero-glow hero-glow-1" style="background:#3b82f6;top:-200px;right:-200px"></div>
  <div class="hero-glow hero-glow-2" style="background:#6366f1;bottom:-200px;left:-200px"></div>

  <div class="max-w-6xl mx-auto px-4 py-32 relative z-10 w-full">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="space-y-8">
        <div class="hero-badge inline-flex items-center gap-3 bg-white/10 text-white/90 px-5 py-2 rounded-full text-sm border border-white/10 backdrop-blur-sm">
          <span class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
          <span>Verify medicines in seconds</span>
        </div>
        <h1 class="hero-title">
          <span class="text-4xl md:text-6xl font-bold block reveal-text"><span class="reveal-inner bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-200 bg-clip-text text-transparent">Medicine Barcode Scanner</span></span>
          <span class="text-xl md:text-2xl font-medium block mt-4 text-blue-100/80 reveal-text"><span class="reveal-inner">दवाई की प्रामाणिकता जांचें</span></span>
        </h1>
        <p class="hero-desc text-lg md:text-xl text-blue-100/80 leading-relaxed max-w-lg" style="opacity:0">Scan medicine barcodes to verify authenticity, check expiry dates, dosage information, and avoid counterfeit drugs.</p>
        <div class="hero-cta flex flex-wrap gap-4 pt-4">
          <a href="#" class="group bg-white text-blue-800 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-3 btn-shimmer"><i class="ri-camera-line group-hover:animate-bounce"></i><span>Scan Now</span><i class="ri-arrow-right-line text-sm opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all"></i></a>
          <a href="#" class="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-3"><i class="ri-video-line"></i><span>How to Scan</span></a>
        </div>
      </div>
      <div class="hidden lg:flex justify-center hero-svg">
        <div class="relative float-anim">
          <svg width="320" height="320" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-2xl">
            <rect x="15" y="40" width="170" height="120" rx="12" fill="none" stroke="rgba(147,197,253,.4)" stroke-width="2"/>
            <rect x="25" y="50" width="150" height="100" rx="6" fill="none" stroke="rgba(147,197,253,.2)" stroke-width="1.5"/>
            <g class="svg-animate">
              <line x1="35" y1="80" x2="165" y2="80" stroke="#93c5fd" stroke-width="4" stroke-linecap="round"/>
              <line x1="35" y1="100" x2="165" y2="100" stroke="#93c5fd" stroke-width="4" stroke-linecap="round"/>
              <line x1="35" y1="120" x2="165" y2="120" stroke="#93c5fd" stroke-width="4" stroke-linecap="round"/>
              <line x1="35" y1="140" x2="120" y2="140" stroke="#93c5fd" stroke-width="4" stroke-linecap="round"/>
            </g>
            <line x1="100" y1="15" x2="100" y2="185" stroke="rgba(147,197,253,.15)" stroke-width="1" stroke-dasharray="4 4"/>
            <line x1="15" y1="100" x2="185" y2="100" stroke="rgba(147,197,253,.15)" stroke-width="1" stroke-dasharray="4 4"/>
            <circle cx="100" cy="100" r="3" fill="#60a5fa" opacity=".8"/>
            <g fill="#60a5fa" opacity=".4">
              <circle cx="40" cy="40" r="3"/><circle cx="160" cy="40" r="3"/>
              <circle cx="40" cy="160" r="3"/><circle cx="160" cy="160" r="3"/>
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
      <span class="text-blue-600 font-semibold text-sm uppercase tracking-[.2em]">How It Works</span>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Three Simple Steps</h2>
      <p class="text-gray-500 mt-4 max-w-2xl mx-auto">Scan, verify, and stay safe from counterfeit medicines</p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      <?php $steps=[
        ['ri-camera-line','from-blue-500 to-cyan-600','Scan Barcode','Point your camera at the medicine barcode. Our scanner auto-detects and reads the code in real time.'],
        ['ri-shield-check-line','from-emerald-500 to-green-600','Verify Authenticity','Cross-check with government databases to confirm the medicine is genuine and not counterfeit.'],
        ['ri-file-info-line','from-violet-500 to-purple-600','Check Details','View expiry date, dosage, manufacturer info, and possible side effects — all in one place.'],
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

<section class="py-24 bg-blue-50">
  <div class="max-w-6xl mx-auto px-4">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="stagger-fade order-2 lg:order-1">
        <span class="text-blue-600 font-semibold text-sm uppercase tracking-[.2em]">Counterfeit Protection</span>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mt-3 reveal-text"><span class="reveal-inner">Never Take Fake <br>Medicines Again</span></h2>
        <p class="text-gray-600 leading-relaxed mt-6">India faces a massive counterfeit drug problem. Our medicine scanner connects to official drug registries to verify every barcode. If a medicine isn't registered, we alert you immediately.</p>
        <ul class="space-y-4 pt-4">
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">Government database</strong> cross-verification</span></li>
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">Expiry &amp; batch</strong> tracking</span></li>
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">Hindi medicine names</strong> with Hindi labels</span></li>
        </ul>
      </div>
      <div class="stagger-fade order-1 lg:order-2">
        <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80" alt="Medicine bottles and pills" class="rounded-2xl shadow-2xl w-full h-auto" loading="lazy">
      </div>
    </div>
  </div>
</section>

<section class="py-24 bg-white">
  <div class="max-w-6xl mx-auto px-4">
    <div class="text-center mb-16 stagger-fade">
      <span class="text-blue-600 font-semibold text-sm uppercase tracking-[.2em]">Why Use It</span>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Benefits</h2>
    </div>
    <div class="grid md:grid-cols-4 gap-6">
      <?php $benefits=[
        ['ri-shield-keyhole-line','from-red-500 to-rose-600','Fake Drug Detection','Instantly identifies counterfeit medicines by cross-referencing with official pharma databases.'],
        ['ri-calendar-check-line','from-amber-500 to-orange-600','Expiry Tracking','Scan to see expiry dates. Set reminders for medicines about to expire.'],
        ['ri-information-line','from-cyan-500 to-blue-600','Dosage Info','View recommended dosage, active ingredients, and possible side effects for every medicine.'],
        ['ri-translate-2','from-indigo-500 to-violet-600','Hindi Labels','Medicine details shown in Hindi. Works for both English and Devanagari barcode labels.'],
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

<section class="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
  <div class="hero-glow hero-glow-1" style="background:#3b82f6;opacity:.15"></div>
  <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
    <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 reveal-text"><span class="reveal-inner">Start Scanning Medicines</span></h2>
    <p class="text-blue-100/80 text-lg mb-8 max-w-2xl mx-auto">Protect your family from counterfeit drugs. Verify every medicine before use.</p>
    <div class="flex flex-wrap justify-center gap-4">
      <a href="#" class="bg-white text-blue-700 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 btn-shimmer flex items-center gap-3"><i class="ri-camera-line"></i> Scan Medicine</a>
      <a href="#" class="border-2 border-white/40 text-white px-10 py-4 rounded-full font-semibold hover:bg-white/10 transition flex items-center gap-3"><i class="ri-download-line"></i> Download App</a>
    </div>
  </div>
</section>

<script>
  gsap.from('.hero-badge', { opacity: 0, y: 30, duration: 0.8, delay: 0.2 });
  gsap.to('.hero-title .reveal-inner', { y: 0, duration: 1, stagger: 0.3, ease: 'power4.out', delay: 0.5 });
  gsap.to('.hero-desc', { opacity: 1, y: 0, duration: 0.8, delay: 0.9 });
  gsap.from('.hero-cta > *', { opacity: 0, y: 30, duration: 0.6, stagger: 0.15, delay: 1.1 });
  gsap.from('.hero-svg', { opacity: 0, scale: 0.6, duration: 1, delay: 0.6, ease: 'back.out(1.7)' });
</script>

<?php require 'includes/footer.php'; ?>

<?php
$title = 'Offline Mode - GramSehat';
$page = 'offline-mode';
require 'includes/header.php';
?>

<section class="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900">
  <div class="hero-glow hero-glow-1" style="background:#64748b;top:-200px;right:-200px"></div>
  <div class="hero-glow hero-glow-2" style="background:#475569;bottom:-200px;left:-200px"></div>

  <div class="max-w-6xl mx-auto px-4 py-32 relative z-10 w-full">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="space-y-8">
        <div class="hero-badge inline-flex items-center gap-3 bg-white/10 text-white/90 px-5 py-2 rounded-full text-sm border border-white/10 backdrop-blur-sm">
          <span class="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
          <span>No internet? No problem</span>
        </div>
        <h1 class="hero-title">
          <span class="text-4xl md:text-6xl font-bold block reveal-text"><span class="reveal-inner bg-gradient-to-r from-slate-300 via-gray-300 to-slate-200 bg-clip-text text-transparent">Works Without Internet</span></span>
          <span class="text-xl md:text-2xl font-medium block mt-4 text-slate-100/80 reveal-text"><span class="reveal-inner">बिना इंटरनेट के भी काम करे</span></span>
        </h1>
        <p class="hero-desc text-lg md:text-xl text-slate-100/80 leading-relaxed max-w-lg" style="opacity:0">Access critical health information even in remote areas with no connectivity. Cache data when online, use it offline, sync when reconnected.</p>
        <div class="hero-cta flex flex-wrap gap-4 pt-4">
          <a href="#" class="group bg-white text-slate-800 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-slate-500/30 transition-all duration-300 flex items-center gap-3 btn-shimmer"><i class="ri-wifi-line group-hover:animate-bounce"></i><span>Cache Now</span><i class="ri-arrow-right-line text-sm opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all"></i></a>
          <a href="#" class="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-3"><i class="ri-information-line"></i><span>How It Works</span></a>
        </div>
      </div>
      <div class="hidden lg:flex justify-center hero-svg">
        <div class="relative float-anim">
          <svg width="320" height="320" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-2xl">
            <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(148,163,184,.25)" stroke-width="1.5" stroke-dasharray="8 4"/>
            <g class="svg-animate">
              <path d="M60 60 Q80 40 100 45 Q120 40 140 60" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M70 80 Q85 65 100 68 Q115 65 130 80" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M80 100 Q90 90 100 92 Q110 90 120 100" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
              <line x1="100" y1="110" x2="100" y2="135" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
              <line x1="85" y1="125" x2="115" y2="125" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
            </g>
            <path d="M25 60 Q20 50 30 45" fill="none" stroke="rgba(239,68,68,.4)" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M175 60 Q180 50 170 45" fill="none" stroke="rgba(239,68,68,.4)" stroke-width="1.5" stroke-linecap="round"/>
            <rect x="70" y="142" width="60" height="25" rx="4" fill="none" stroke="rgba(148,163,184,.35)" stroke-width="1.5"/>
            <rect x="75" y="147" width="50" height="15" rx="2" fill="none" stroke="rgba(148,163,184,.2)" stroke-width="1"/>
            <g fill="#94a3b8" opacity=".35">
              <circle cx="40" cy="40" r="2.5"/><circle cx="160" cy="40" r="2.5"/>
              <circle cx="40" cy="160" r="2.5"/><circle cx="160" cy="160" r="2.5"/>
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
      <span class="text-slate-600 font-semibold text-sm uppercase tracking-[.2em]">How It Works</span>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Connect Once, Use Everywhere</h2>
      <p class="text-gray-500 mt-4 max-w-2xl mx-auto">Cache content when online, access it offline in remote areas</p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      <?php $steps=[
        ['ri-wifi-line','from-emerald-500 to-green-600','Cache on Connect','Browse and save health resources, hospital lists, and medicine info while connected to the internet.'],
        ['ri-wifi-off-line','from-slate-500 to-gray-600','Use Offline','Access all cached content offline. Search hospitals, read health tips, check symptoms — no signal needed.'],
        ['ri-refresh-line','from-blue-500 to-cyan-600','Sync Later','When you reconnect, changes sync automatically. New health bulletins and updates download in the background.'],
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

<section class="py-24 bg-slate-50">
  <div class="max-w-6xl mx-auto px-4">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="stagger-fade order-2 lg:order-1">
        <span class="text-slate-600 font-semibold text-sm uppercase tracking-[.2em]">Offline First</span>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mt-3 reveal-text"><span class="reveal-inner">Built for Rural <br>and Remote Areas</span></h2>
        <p class="text-gray-600 leading-relaxed mt-6">India's villages often lack reliable internet. GramSehat's offline mode ensures that everyone — regardless of connectivity — can access essential healthcare information when they need it most.</p>
        <ul class="space-y-4 pt-4">
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">No SIM or data</strong> required after caching</span></li>
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">Works on 2G</strong> and slow networks too</span></li>
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">Smart caching</strong> prioritizes critical data first</span></li>
        </ul>
      </div>
      <div class="stagger-fade order-1 lg:order-2">
        <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80" alt="Network signal" class="rounded-2xl shadow-2xl w-full h-auto" loading="lazy">
      </div>
    </div>
  </div>
</section>

<section class="py-24 bg-white">
  <div class="max-w-6xl mx-auto px-4">
    <div class="text-center mb-16 stagger-fade">
      <span class="text-slate-600 font-semibold text-sm uppercase tracking-[.2em]">Why Use It</span>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Benefits</h2>
    </div>
    <div class="grid md:grid-cols-4 gap-6">
      <?php $benefits=[
        ['ri-map-2-line','from-emerald-500 to-green-600','Offline Maps','Download regional maps and find nearby hospitals, clinics, and health centers without internet.'],
        ['ri-hospital-line','from-slate-500 to-gray-600','Cached Hospitals','Hospital listings, contact numbers, and directions are stored locally for instant offline access.'],
        ['ri-database-2-line','from-blue-500 to-cyan-600','Local Storage','Medicine info, health articles, and symptom guides are cached on your device for offline reading.'],
        ['ri-cloud-line','from-violet-500 to-purple-600','Auto-sync','Changes sync automatically when connectivity returns. No manual updates, no data loss.'],
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

<section class="py-20 bg-gradient-to-r from-slate-700 to-gray-700 relative overflow-hidden">
  <div class="hero-glow hero-glow-1" style="background:#64748b;opacity:.15"></div>
  <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
    <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 reveal-text"><span class="reveal-inner">Healthcare Without Borders</span></h2>
    <p class="text-slate-100/80 text-lg mb-8 max-w-2xl mx-auto">No internet? No barrier. Cache now and access health info anytime, anywhere.</p>
    <div class="flex flex-wrap justify-center gap-4">
      <a href="#" class="bg-white text-slate-800 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 btn-shimmer flex items-center gap-3"><i class="ri-wifi-line"></i> Cache Content</a>
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

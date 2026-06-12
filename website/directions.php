<?php
$title = 'Directions - GramSehat';
$page = 'directions';
require 'includes/header.php';
?>

<section class="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-orange-900 via-orange-800 to-amber-900">
  <div class="hero-glow hero-glow-1"></div>
  <div class="hero-glow hero-glow-2"></div>

  <div class="max-w-6xl mx-auto px-4 py-32 relative z-10 w-full">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="space-y-8">
        <div class="hero-badge inline-flex items-center gap-3 bg-white/10 text-white/90 px-5 py-2 rounded-full text-sm border border-white/10 backdrop-blur-sm">
          <span class="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
          <span>Find your way to care — fast</span>
        </div>
        <h1 class="hero-title">
          <span class="text-4xl md:text-6xl font-bold block reveal-text"><span class="reveal-inner bg-gradient-to-r from-orange-300 via-amber-300 to-orange-200 bg-clip-text text-transparent">Turn-by-Turn Directions</span></span>
          <span class="text-xl md:text-2xl font-medium block mt-4 text-orange-100/80 reveal-text"><span class="reveal-inner">स्वास्थ्य केंद्र तक का सबसे आसान रास्ता</span></span>
        </h1>
        <p class="hero-desc text-lg md:text-xl text-orange-100/80 leading-relaxed max-w-lg" style="opacity:0">Get real-time turn-by-turn navigation to the nearest health center. Works offline with OpenRouteService integration.</p>
        <div class="hero-cta flex flex-wrap gap-4 pt-4">
          <a href="#" class="group bg-white text-orange-800 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center gap-3 btn-shimmer"><i class="ri-navigation-line group-hover:animate-bounce"></i><span>Get Directions</span><i class="ri-arrow-right-line text-sm opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all"></i></a>
          <a href="#" class="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-3"><i class="ri-download-line"></i><span>Download Offline Map</span></a>
        </div>
      </div>
      <div class="hidden lg:flex justify-center hero-svg">
        <div class="relative float-anim">
          <svg width="320" height="320" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-2xl">
            <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(251,146,60,.3)" stroke-width="2" class="pulse-ring"/>
            <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(251,146,60,.2)" stroke-width="1.5"/>
            <g class="svg-animate" fill="none" stroke="#fdba74" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="30,50 60,80 80,40 110,90 140,60 170,110"/>
              <circle cx="30" cy="50" r="4" fill="#fb923c" stroke="none"/>
              <circle cx="170" cy="110" r="5" fill="#fb923c" stroke="none"/>
              <circle cx="170" cy="110" r="8" fill="none" stroke="#fb923c" stroke-width="1.5" class="pulse-ring"/>
            </g>
            <g fill="rgba(251,146,60,.4)">
              <circle cx="50" cy="140" r="2.5"/><circle cx="130" cy="150" r="2"/>
              <circle cx="160" cy="30" r="2"/><circle cx="20" cy="120" r="2.5"/>
              <circle cx="90" cy="180" r="2"/><circle cx="180" cy="80" r="2"/>
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
      <span class="text-orange-600 font-semibold text-sm uppercase tracking-[.2em]">How It Works</span>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Three Simple Steps</h2>
      <p class="text-gray-500 mt-4 max-w-2xl mx-auto">From entering your destination to navigating — in seconds</p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      <?php $steps=[
        ['ri-map-pin-2-line','from-orange-500 to-amber-600','Enter Destination','Type or speak your destination. Choose from saved locations, health centers, or enter a new address.'],
        ['ri-route-line','from-blue-500 to-indigo-600','Get Route','Our AI calculates the best route using OpenRouteService, considering roads, terrain, and traffic.'],
        ['ri-navigation-line','from-green-500 to-emerald-600','Navigate','Follow turn-by-turn voice and visual guidance. Works offline with pre-downloaded maps.'],
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

<section class="py-24 bg-orange-50">
  <div class="max-w-6xl mx-auto px-4">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="stagger-fade">
        <img src="https://images.unsplash.com/photo-1569336415962-a4bd9f609cd5?w=800&q=80" alt="Map navigation" class="rounded-2xl shadow-2xl w-full h-auto" loading="lazy">
      </div>
      <div class="space-y-6">
        <span class="text-orange-600 font-semibold text-sm uppercase tracking-[.2em]">Smart Navigation</span>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 reveal-text"><span class="reveal-inner">Powered by OpenRouteService <br>&amp; Offline Maps</span></h2>
        <p class="text-gray-600 leading-relaxed">Get accurate directions powered by OpenRouteService with support for walking, cycling, and public transport. All maps work offline once downloaded.</p>
        <ul class="space-y-4 pt-4">
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">OpenRouteService</strong> integration for accurate routing</span></li>
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">Offline maps</strong> pre-downloaded for rural areas</span></li>
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">Voice guidance</strong> in Hindi &amp; English</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="py-24 bg-white">
  <div class="max-w-6xl mx-auto px-4">
    <div class="text-center mb-16 stagger-fade">
      <span class="text-orange-600 font-semibold text-sm uppercase tracking-[.2em]">Why Use It</span>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Benefits</h2>
    </div>
    <div class="grid md:grid-cols-4 gap-6">
      <?php $benefits=[
        ['ri-map-2-line','from-orange-500 to-amber-600','OpenRouteService','Accurate routing using open-source OpenRouteService data with multiple transport modes.'],
        ['ri-wifi-off-line','from-slate-500 to-gray-600','Offline Maps','Download maps in advance. Navigate without internet — perfect for remote rural areas.'],
        ['ri-voiceprint-line','from-indigo-500 to-violet-600','Voice Guidance','Hands-free turn-by-turn voice instructions in Hindi and English.'],
        ['ri-landmark-line','from-emerald-500 to-green-600','Landmark-based','Directions use local landmarks like schools, temples, and shops for easy navigation.'],
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

<section class="py-20 bg-gradient-to-r from-orange-600 to-amber-700 relative overflow-hidden">
  <div class="hero-glow hero-glow-1" style="background:#ea580c;opacity:.15"></div>
  <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
    <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 reveal-text"><span class="reveal-inner">Get Directions to Care</span></h2>
    <p class="text-orange-100/80 text-lg mb-8 max-w-2xl mx-auto">Never lose your way to a health center. Navigate with confidence, even offline.</p>
    <div class="flex flex-wrap justify-center gap-4">
      <a href="#" class="bg-white text-orange-700 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 btn-shimmer flex items-center gap-3"><i class="ri-navigation-line"></i> Get Directions</a>
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

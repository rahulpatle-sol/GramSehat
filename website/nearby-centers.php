<?php
$title = 'Nearby Centers - GramSehat';
$page = 'nearby-centers';
require 'includes/header.php';
?>

<section class="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-violet-900">
  <div class="hero-glow hero-glow-1" style="background:#a855f7;top:-200px;right:-200px"></div>
  <div class="hero-glow hero-glow-2" style="background:#8b5cf6;bottom:-200px;left:-200px"></div>

  <div class="max-w-6xl mx-auto px-4 py-32 relative z-10 w-full">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="space-y-8">
        <div class="hero-badge inline-flex items-center gap-3 bg-white/10 text-white/90 px-5 py-2 rounded-full text-sm border border-white/10 backdrop-blur-sm">
          <span class="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
          <span>Find healthcare near you</span>
        </div>
        <h1 class="hero-title">
          <span class="text-4xl md:text-6xl font-bold block reveal-text"><span class="reveal-inner bg-gradient-to-r from-purple-300 via-violet-300 to-purple-200 bg-clip-text text-transparent">Nearby Health Centers</span></span>
          <span class="text-xl md:text-2xl font-medium block mt-4 text-purple-100/80 reveal-text"><span class="reveal-inner">अपने निकटतम स्वास्थ्य केंद्र खोजें</span></span>
        </h1>
        <p class="hero-desc text-lg md:text-xl text-purple-100/80 leading-relaxed max-w-lg" style="opacity:0">Find PHCs, CHCs, hospitals, and clinics near your location. Get distances, ratings, contact info, and turn-by-turn directions.</p>
        <div class="hero-cta flex flex-wrap gap-4 pt-4">
          <a href="directions.php" class="group bg-white text-purple-800 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-3 btn-shimmer"><i class="ri-map-pin-line group-hover:animate-bounce"></i><span>Find Centers</span><i class="ri-arrow-right-line text-sm opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all"></i></a>
          <a href="#" class="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-3"><i class="ri-search-line"></i><span>Search by Pincode</span></a>
        </div>
      </div>
      <div class="hidden lg:flex justify-center hero-svg">
        <div class="relative float-anim">
          <svg width="320" height="320" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-2xl">
            <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(196,181,253,.3)" stroke-width="1.5" stroke-dasharray="8 4"/>
            <ellipse cx="100" cy="110" rx="60" ry="25" fill="none" stroke="rgba(196,181,253,.15)" stroke-width="1"/>
            <g class="svg-animate">
              <path d="M100 20 C100 20 80 55 80 80 C80 100 90 115 100 125 C110 115 120 100 120 80 C120 55 100 20 100 20Z" fill="rgba(196,181,253,.15)" stroke="#c4b5fd" stroke-width="2.5" stroke-linejoin="round"/>
              <circle cx="100" cy="78" r="12" fill="none" stroke="#c4b5fd" stroke-width="2.5"/>
              <circle cx="100" cy="78" r="5" fill="#c4b5fd"/>
            </g>
            <g fill="rgba(196,181,253,.25)">
              <circle cx="40" cy="45" r="3"/><circle cx="160" cy="45" r="3"/>
              <circle cx="30" cy="100" r="2.5"/><circle cx="170" cy="100" r="2.5"/>
              <circle cx="50" cy="155" r="3"/><circle cx="150" cy="155" r="3"/>
            </g>
            <path d="M100 155 L90 175 L110 175 Z" fill="rgba(196,181,253,.2)" stroke="#c4b5fd" stroke-width="1.5" stroke-linejoin="round"/>
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
      <span class="text-purple-600 font-semibold text-sm uppercase tracking-[.2em]">How It Works</span>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Three Simple Steps</h2>
      <p class="text-gray-500 mt-4 max-w-2xl mx-auto">Find the nearest health center in seconds</p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      <?php $steps=[
        ['ri-map-pin-line','from-purple-500 to-violet-600','Find Location','Allow location access or enter your pincode. We pinpoint your location using GPS or OSM.'],
        ['ri-search-line','from-cyan-500 to-teal-600','Search Nearby','Browse PHCs, CHCs, hospitals, and clinics sorted by distance. Filter by type and availability.'],
        ['ri-hospital-line','from-rose-500 to-pink-600','Get Details','View address, phone number, distance, ratings, and get turn-by-turn directions via OpenRouteService.'],
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

<section class="py-24 bg-purple-50">
  <div class="max-w-6xl mx-auto px-4">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="stagger-fade">
        <img src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80" alt="Hospital building" class="rounded-2xl shadow-2xl w-full h-auto" loading="lazy">
      </div>
      <div class="space-y-6">
        <span class="text-purple-600 font-semibold text-sm uppercase tracking-[.2em]">OpenStreetMap Powered</span>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 reveal-text"><span class="reveal-inner">Every Health Center <br>at Your Fingertips</span></h2>
        <p class="text-gray-600 leading-relaxed">We use OpenStreetMap data to list every government and private health facility in your area. PHCs, CHCs, district hospitals, clinics, and even mobile health units — all mapped and updated.</p>
        <ul class="space-y-4 pt-4">
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">50,000+ facilities</strong> mapped across India</span></li>
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">Real-time distance</strong> &amp; estimated travel time</span></li>
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">Works offline</strong> with cached OSM data</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="py-24 bg-white">
  <div class="max-w-6xl mx-auto px-4">
    <div class="text-center mb-16 stagger-fade">
      <span class="text-purple-600 font-semibold text-sm uppercase tracking-[.2em]">Why Use It</span>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Benefits</h2>
    </div>
    <div class="grid md:grid-cols-4 gap-6">
      <?php $benefits=[
        ['ri-building-line','from-emerald-500 to-green-600','PHC/CHC/Hospitals','Find all government health centers — Primary, Community, and District hospitals near you.'],
        ['ri-map-2-line','from-cyan-500 to-blue-600','OSM-powered','Powered by OpenStreetMap — free, open, and always updated with community contributions.'],
        ['ri-ruler-line','from-amber-500 to-orange-600','Distance &amp; Ratings','See exact distance, estimated travel time, and user ratings for each health facility.'],
        ['ri-phone-line','from-rose-500 to-red-600','Contact Info','Direct phone numbers, addresses, and working hours for every listed health center.'],
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

<section class="py-20 bg-gradient-to-r from-purple-600 to-violet-700 relative overflow-hidden">
  <div class="hero-glow hero-glow-1" style="background:#a855f7;opacity:.15"></div>
  <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
    <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 reveal-text"><span class="reveal-inner">Find Your Nearest Health Center</span></h2>
    <p class="text-purple-100/80 text-lg mb-8 max-w-2xl mx-auto">Healthcare is closer than you think. Locate, call, and navigate to the nearest facility.</p>
    <div class="flex flex-wrap justify-center gap-4">
      <a href="directions.php" class="bg-white text-purple-700 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 btn-shimmer flex items-center gap-3"><i class="ri-map-pin-line"></i> Find Nearby</a>
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

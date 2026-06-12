<?php
$title = 'Outbreak Alerts - GramSehat';
$page = 'outbreak-alerts';
require 'includes/header.php';
?>

<section class="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-900">
  <div class="hero-glow hero-glow-1" style="background:#f59e0b;top:-200px;right:-200px"></div>
  <div class="hero-glow hero-glow-2" style="background:#d97706;bottom:-200px;left:-200px"></div>

  <div class="max-w-6xl mx-auto px-4 py-32 relative z-10 w-full">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="space-y-8">
        <div class="hero-badge inline-flex items-center gap-3 bg-white/10 text-white/90 px-5 py-2 rounded-full text-sm border border-white/10 backdrop-blur-sm">
          <span class="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
          <span>Stay informed about disease outbreaks</span>
        </div>
        <h1 class="hero-title">
          <span class="text-4xl md:text-6xl font-bold block reveal-text"><span class="reveal-inner bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-200 bg-clip-text text-transparent">Real-time Outbreak Alerts</span></span>
          <span class="text-xl md:text-2xl font-medium block mt-4 text-amber-100/80 reveal-text"><span class="reveal-inner">प्रकोप सतर्कता — वास्तविक समय में</span></span>
        </h1>
        <p class="hero-desc text-lg md:text-xl text-amber-100/80 leading-relaxed max-w-lg" style="opacity:0">Get instant notifications about disease outbreaks near you. Our AI monitors government health bulletins, news, and community reports 24/7.</p>
        <div class="hero-cta flex flex-wrap gap-4 pt-4">
          <a href="#" class="group bg-white text-amber-800 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 flex items-center gap-3 btn-shimmer"><i class="ri-notification-4-line group-hover:animate-bounce"></i><span>Enable Alerts</span><i class="ri-arrow-right-line text-sm opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all"></i></a>
          <a href="#" class="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-3"><i class="ri-map-pin-line"></i><span>Set Location</span></a>
        </div>
      </div>
      <div class="hidden lg:flex justify-center hero-svg">
        <div class="relative float-anim">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-32 h-32 rounded-full bg-amber-500/20 pulse-ring"></div>
          </div>
          <svg width="320" height="320" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-2xl relative z-10">
            <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(251,191,36,.3)" stroke-width="1.5" stroke-dasharray="8 4"/>
            <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(251,191,36,.2)" stroke-width="1.5" stroke-dasharray="6 4"/>
            <g class="svg-animate">
              <path d="M100 30 L102 55 Q100 58 98 55 L96 38 Z" fill="#fbbf24"/>
              <path d="M100 170 L102 145 Q100 142 98 145 L96 162 Z" fill="#fbbf24"/>
              <path d="M30 100 L55 98 Q58 100 55 102 L38 104 Z" fill="#fbbf24"/>
              <path d="M170 100 L145 98 Q142 100 145 102 L162 104 Z" fill="#fbbf24"/>
            </g>
            <rect x="75" y="45" width="50" height="55" rx="8" fill="none" stroke="#fbbf24" stroke-width="2"/>
            <rect x="80" y="50" width="40" height="40" rx="4" fill="none" stroke="rgba(251,191,36,.4)" stroke-width="1.5"/>
            <circle cx="100" cy="75" r="8" fill="none" stroke="#fbbf24" stroke-width="2"/>
            <path d="M96 92 L100 88 L104 92" stroke="#fbbf24" stroke-width="2" fill="none" stroke-linecap="round"/>
            <path d="M92 112 Q100 120 108 112" stroke="#fbbf24" stroke-width="2" fill="none" stroke-linecap="round"/>
            <line x1="100" y1="55" x2="100" y2="110" stroke="rgba(251,191,36,.15)" stroke-width="1" stroke-dasharray="3 3"/>
            <g fill="#fbbf24" opacity=".4">
              <circle cx="50" cy="50" r="2.5"/><circle cx="150" cy="50" r="2.5"/>
              <circle cx="50" cy="150" r="2.5"/><circle cx="150" cy="150" r="2.5"/>
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
      <span class="text-amber-600 font-semibold text-sm uppercase tracking-[.2em]">How It Works</span>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">From Detection to Notification</h2>
      <p class="text-gray-500 mt-4 max-w-2xl mx-auto">Real-time outbreak monitoring powered by AI and community reports</p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      <?php $steps=[
        ['ri-user-voice-line','from-amber-500 to-orange-600','Community Reports','Nearby users and health workers report suspected outbreaks. Every report is time-stamped and geo-tagged.'],
        ['ri-robot-3-line','from-yellow-500 to-amber-600','AI Analysis','Our AI cross-references reports with government health bulletins and news sources to verify the threat.'],
        ['ri-notification-4-line','from-red-500 to-rose-600','Alert Push','Verified alerts are pushed instantly to users in the affected area with severity levels and safety advice.'],
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

<section class="py-24 bg-amber-50">
  <div class="max-w-6xl mx-auto px-4">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="stagger-fade order-2 lg:order-1">
        <span class="text-amber-600 font-semibold text-sm uppercase tracking-[.2em]">Early Warning System</span>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mt-3 reveal-text"><span class="reveal-inner">Know Before It <br>Reaches You</span></h2>
        <p class="text-gray-600 leading-relaxed mt-6">Outbreaks spread fast, but so do we. GramSehat monitors multiple data sources to provide early warnings for diseases like dengue, malaria, COVID-19, and more in your vicinity.</p>
        <ul class="space-y-4 pt-4">
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">Government &amp; WHO</strong> data integration</span></li>
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">Coverage maps</strong> showing affected zones</span></li>
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">Hindi &amp; English</strong> alert notifications</span></li>
        </ul>
      </div>
      <div class="stagger-fade order-1 lg:order-2">
        <img src="https://images.unsplash.com/photo-1584036561584-b03c19da874c?w=800&q=80" alt="Virus under microscope" class="rounded-2xl shadow-2xl w-full h-auto" loading="lazy">
      </div>
    </div>
  </div>
</section>

<section class="py-24 bg-white">
  <div class="max-w-6xl mx-auto px-4">
    <div class="text-center mb-16 stagger-fade">
      <span class="text-amber-600 font-semibold text-sm uppercase tracking-[.2em]">Why Use It</span>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Benefits</h2>
    </div>
    <div class="grid md:grid-cols-4 gap-6">
      <?php $benefits=[
        ['ri-map-pin-2-line','from-amber-500 to-orange-600','Pincode-based Alerts','Customize alerts for your area using your pincode. Get notified only when an outbreak is reported nearby.'],
        ['ri-time-line','from-yellow-500 to-amber-600','Real-time Updates','Alerts are pushed within minutes of outbreak confirmation — not hours or days later.'],
        ['ri-alert-line','from-red-500 to-rose-600','Severity Levels','Green, Yellow, Orange, and Red levels help you understand the threat at a glance and act accordingly.'],
        ['ri-medicine-bottle-line','from-emerald-500 to-green-600','Prevention Tips','Each alert comes with actionable prevention advice, medicine guidelines, and nearby hospital info.'],
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

<section class="py-20 bg-gradient-to-r from-amber-700 to-yellow-700 relative overflow-hidden">
  <div class="hero-glow hero-glow-1" style="background:#f59e0b;opacity:.15"></div>
  <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
    <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 reveal-text"><span class="reveal-inner">Stay Ahead of Outbreaks</span></h2>
    <p class="text-amber-100/80 text-lg mb-8 max-w-2xl mx-auto">Enable location-based outbreak alerts and protect your community.</p>
    <div class="flex flex-wrap justify-center gap-4">
      <a href="#" class="bg-white text-amber-800 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 btn-shimmer flex items-center gap-3"><i class="ri-notification-4-line"></i> Enable Now</a>
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

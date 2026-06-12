<?php
$title = 'Bilingual Support - GramSehat';
$page = 'bilingual';
require 'includes/header.php';
?>

<section class="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-indigo-900 via-violet-800 to-indigo-900">
  <div class="hero-glow hero-glow-1" style="background:#818cf8;top:-200px;right:-200px"></div>
  <div class="hero-glow hero-glow-2" style="background:#6366f1;bottom:-200px;left:-200px"></div>

  <div class="max-w-6xl mx-auto px-4 py-32 relative z-10 w-full">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="space-y-8">
        <div class="hero-badge inline-flex items-center gap-3 bg-white/10 text-white/90 px-5 py-2 rounded-full text-sm border border-white/10 backdrop-blur-sm">
          <span class="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
          <span>हिंदी और अंग्रेज़ी में पूरा सपोर्ट</span>
        </div>
        <h1 class="hero-title">
          <span class="text-4xl md:text-6xl font-bold block reveal-text"><span class="reveal-inner bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-200 bg-clip-text text-transparent">Full Bilingual Support</span></span>
          <span class="text-xl md:text-2xl font-medium block mt-4 text-indigo-100/80 reveal-text"><span class="reveal-inner">हिंदी और अंग्रेज़ी में पूरा सपोर्ट</span></span>
        </h1>
        <p class="hero-desc text-lg md:text-xl text-indigo-100/80 leading-relaxed max-w-lg" style="opacity:0">GramSehat works fully in both Hindi and English. Switch anytime, anywhere — no restart needed, no features lost.</p>
        <div class="hero-cta flex flex-wrap gap-4 pt-4">
          <a href="#" class="group bg-white text-indigo-800 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 flex items-center gap-3 btn-shimmer"><i class="ri-translate-2 group-hover:animate-bounce"></i><span>Try Hindi Mode</span><i class="ri-arrow-right-line text-sm opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all"></i></a>
          <a href="#" class="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-3"><i class="ri-global-line"></i><span>Switch Language</span></a>
        </div>
      </div>
      <div class="hidden lg:flex justify-center hero-svg">
        <div class="relative float-anim">
          <svg width="320" height="320" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-2xl">
            <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(165,180,252,.3)" stroke-width="1.5" stroke-dasharray="6 4"/>
            <ellipse cx="100" cy="100" rx="60" ry="30" fill="none" stroke="rgba(165,180,252,.2)" stroke-width="1.5"/>
            <path d="M100 15 Q100 50 100 85" fill="none" stroke="rgba(165,180,252,.2)" stroke-width="1.5"/>
            <path d="M30 70 Q60 55 100 60 Q140 55 170 70" fill="none" stroke="rgba(165,180,252,.2)" stroke-width="1.5"/>
            <path d="M30 130 Q60 145 100 140 Q140 145 170 130" fill="none" stroke="rgba(165,180,252,.2)" stroke-width="1.5"/>
            <g class="svg-animate">
              <text x="50" y="95" font-family="sans-serif" font-size="28" font-weight="bold" fill="#a5b4fc">अ</text>
              <text x="115" y="95" font-family="sans-serif" font-size="24" font-weight="bold" fill="#c7d2fe">A</text>
              <text x="75" y="140" font-family="sans-serif" font-size="12" fill="rgba(165,180,252,.5)">हिंदी</text>
              <text x="115" y="140" font-family="sans-serif" font-size="12" fill="rgba(165,180,252,.5)">English</text>
            </g>
            <path d="M90 60 Q100 50 110 60" fill="none" stroke="#a5b4fc" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M90 120 Q100 130 110 120" fill="none" stroke="#a5b4fc" stroke-width="1.5" stroke-linecap="round"/>
            <g fill="#818cf8" opacity=".4">
              <circle cx="35" cy="35" r="3"/><circle cx="165" cy="35" r="3"/>
              <circle cx="35" cy="165" r="3"/><circle cx="165" cy="165" r="3"/>
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
      <span class="text-indigo-600 font-semibold text-sm uppercase tracking-[.2em]">How It Works</span>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Switch Languages Instantly</h2>
      <p class="text-gray-500 mt-4 max-w-2xl mx-auto">No app restart needed. No features hidden. Just seamless switching.</p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      <?php $steps=[
        ['ri-translate-2','from-indigo-500 to-violet-600','Choose Language','Select Hindi or English from the settings. The entire app adapts instantly — menus, labels, voice, and text.'],
        ['ri-hindi-input','from-violet-500 to-purple-600','Use in Hindi','Everything in Devanagari. Symptom names, medicine info, directions — fully localized for Hindi speakers.'],
        ['ri-english-input','from-blue-500 to-cyan-600','Use in English','Switch back to English anytime. Your data, settings, and history remain preserved across both languages.'],
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

<section class="py-24 bg-indigo-50">
  <div class="max-w-6xl mx-auto px-4">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="stagger-fade order-2 lg:order-1">
        <span class="text-indigo-600 font-semibold text-sm uppercase tracking-[.2em]">Side-by-Side Comparison</span>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mt-3 reveal-text"><span class="reveal-inner">Same Features, <br>Two Languages</span></h2>
        <p class="text-gray-600 leading-relaxed mt-6">Every feature in GramSehat is built bilingually from the ground up. Nothing is lost in translation.</p>
        <div class="grid grid-cols-2 gap-4 pt-6">
          <div class="bg-white rounded-xl p-5 shadow-md border border-indigo-100">
            <div class="flex items-center gap-2 mb-3"><span class="w-2 h-2 rounded-full bg-indigo-500"></span><span class="font-bold text-gray-900 text-sm">हिंदी (Hindi)</span></div>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-center gap-2"><i class="ri-check-line text-green-500 text-xs"></i>पूरा हिंदी इंटरफ़ेस</li>
              <li class="flex items-center gap-2"><i class="ri-check-line text-green-500 text-xs"></i>देवनागरी में लक्षण</li>
              <li class="flex items-center gap-2"><i class="ri-check-line text-green-500 text-xs"></i>हिंदी वॉइस इनपुट</li>
              <li class="flex items-center gap-2"><i class="ri-check-line text-green-500 text-xs"></i>स्थानीय भाषा निर्देश</li>
            </ul>
          </div>
          <div class="bg-white rounded-xl p-5 shadow-md border border-indigo-100">
            <div class="flex items-center gap-2 mb-3"><span class="w-2 h-2 rounded-full bg-blue-500"></span><span class="font-bold text-gray-900 text-sm">English</span></div>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-center gap-2"><i class="ri-check-line text-green-500 text-xs"></i>Full English UI</li>
              <li class="flex items-center gap-2"><i class="ri-check-line text-green-500 text-xs"></i>Symptoms in English</li>
              <li class="flex items-center gap-2"><i class="ri-check-line text-green-500 text-xs"></i>English voice input</li>
              <li class="flex items-center gap-2"><i class="ri-check-line text-green-500 text-xs"></i>English directions</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="stagger-fade order-1 lg:order-2">
        <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80" alt="Languages and books" class="rounded-2xl shadow-2xl w-full h-auto" loading="lazy">
      </div>
    </div>
  </div>
</section>

<section class="py-24 bg-white">
  <div class="max-w-6xl mx-auto px-4">
    <div class="text-center mb-16 stagger-fade">
      <span class="text-indigo-600 font-semibold text-sm uppercase tracking-[.2em]">Why Use It</span>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Benefits</h2>
    </div>
    <div class="grid md:grid-cols-4 gap-6">
      <?php $benefits=[
        ['ri-hindi-input','from-indigo-500 to-violet-600','Full Hindi UI','Complete interface in Devanagari. Menus, buttons, notifications, and help content — all in Hindi.'],
        ['ri-english-input','from-blue-500 to-cyan-600','English UI','Full English interface with proper medical terminology. No auto-translation artifacts.'],
        ['ri-mic-line','from-purple-500 to-pink-600','Voice Input','Speak in Hindi or English. Our voice engine understands both languages with high accuracy.'],
        ['ri-home-heart-line','from-emerald-500 to-green-600','Rural-friendly','Designed for first-time smartphone users. Large text buttons, Hindi-first navigation, and simple flows.'],
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

<section class="py-20 bg-gradient-to-r from-indigo-600 to-violet-700 relative overflow-hidden">
  <div class="hero-glow hero-glow-1" style="background:#818cf8;opacity:.15"></div>
  <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
    <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 reveal-text"><span class="reveal-inner">अपनी भाषा में स्वास्थ्य सेवा</span></h2>
    <p class="text-indigo-100/80 text-lg mb-8 max-w-2xl mx-auto">Healthcare in your language. Switch between Hindi and English freely.</p>
    <div class="flex flex-wrap justify-center gap-4">
      <a href="#" class="bg-white text-indigo-700 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 btn-shimmer flex items-center gap-3"><i class="ri-translate-2"></i> Switch to Hindi</a>
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

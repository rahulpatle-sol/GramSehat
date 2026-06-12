<?php
$title = 'Symptom Checker - GramSehat';
$page = 'symptom-checker';
require 'includes/header.php';
?>

<section class="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
  <div class="hero-glow hero-glow-1"></div>
  <div class="hero-glow hero-glow-2"></div>

  <div class="max-w-6xl mx-auto px-4 py-32 relative z-10 w-full">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="space-y-8">
        <div class="hero-badge inline-flex items-center gap-3 bg-white/10 text-white/90 px-5 py-2 rounded-full text-sm border border-white/10 backdrop-blur-sm">
          <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span>AI-powered diagnosis for rural India</span>
        </div>
        <h1 class="hero-title">
          <span class="text-4xl md:text-6xl font-bold block reveal-text"><span class="reveal-inner bg-gradient-to-r from-green-300 via-emerald-300 to-green-200 bg-clip-text text-transparent">AI-Powered Symptom Checker</span></span>
          <span class="text-xl md:text-2xl font-medium block mt-4 text-green-100/80 reveal-text"><span class="reveal-inner">अपने लक्षण जांचें, सही इलाज पाएं</span></span>
        </h1>
        <p class="hero-desc text-lg md:text-xl text-green-100/80 leading-relaxed max-w-lg" style="opacity:0">Select your symptoms and let our AI analyze possible conditions. Get outbreak alerts for your area with real-time tracking.</p>
        <div class="hero-cta flex flex-wrap gap-4 pt-4">
          <a href="#" class="group bg-white text-green-800 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 flex items-center gap-3 btn-shimmer"><i class="ri-stethoscope-line group-hover:animate-bounce"></i><span>Check Symptoms</span><i class="ri-arrow-right-line text-sm opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all"></i></a>
          <a href="#" class="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-3"><i class="ri-play-circle-line"></i><span>Watch Demo</span></a>
        </div>
      </div>
      <div class="hidden lg:flex justify-center hero-svg">
        <div class="relative float-anim">
          <svg width="320" height="320" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-2xl">
            <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(74,222,128,.3)" stroke-width="2" class="pulse-ring"/>
            <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(74,222,128,.2)" stroke-width="1.5"/>
            <g class="svg-animate">
              <line x1="100" y1="30" x2="100" y2="170" stroke="#86efac" stroke-width="3" stroke-linecap="round"/>
              <line x1="30" y1="100" x2="170" y2="100" stroke="#86efac" stroke-width="3" stroke-linecap="round"/>
              <line x1="50.4" y1="50.4" x2="149.6" y2="149.6" stroke="#86efac" stroke-width="3" stroke-linecap="round"/>
              <line x1="149.6" y1="50.4" x2="50.4" y2="149.6" stroke="#86efac" stroke-width="3" stroke-linecap="round"/>
            </g>
            <circle cx="100" cy="100" r="20" fill="rgba(134,239,172,.15)" stroke="#86efac" stroke-width="2"/>
            <circle cx="100" cy="100" r="8" fill="#22c55e"/>
            <g fill="#22c55e" opacity=".6">
              <circle cx="55" cy="55" r="4"/><circle cx="145" cy="55" r="4"/>
              <circle cx="55" cy="145" r="4"/><circle cx="145" cy="145" r="4"/>
              <circle cx="100" cy="15" r="3"/><circle cx="100" cy="185" r="3"/>
              <circle cx="15" cy="100" r="3"/><circle cx="185" cy="100" r="3"/>
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
      <span class="text-green-600 font-semibold text-sm uppercase tracking-[.2em]">How It Works</span>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Three Simple Steps</h2>
      <p class="text-gray-500 mt-4 max-w-2xl mx-auto">From selecting symptoms to getting advice — in seconds</p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      <?php $steps=[
        ['ri-stethoscope-line','from-green-500 to-emerald-600','Select Symptoms','Choose from common symptoms like fever, cough, headache, and more. Our smart interface suggests related symptoms.'],
        ['ri-robot-line','from-blue-500 to-indigo-600','AI Analysis','Our AI cross-references your symptoms with known disease patterns and local outbreak data for accurate results.'],
        ['ri-heart-pulse-line','from-rose-500 to-red-600','Get Advice','Receive actionable advice, medication tips, and recommendations to visit the nearest health center if needed.'],
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

<section class="py-24 bg-green-50">
  <div class="max-w-6xl mx-auto px-4">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="stagger-fade">
        <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80" alt="Doctor using tablet" class="rounded-2xl shadow-2xl w-full h-auto" loading="lazy">
      </div>
      <div class="space-y-6">
        <span class="text-green-600 font-semibold text-sm uppercase tracking-[.2em]">Smart Diagnosis</span>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 reveal-text"><span class="reveal-inner">Powered by Medical <br>AI &amp; Local Data</span></h2>
        <p class="text-gray-600 leading-relaxed">Our symptom checker combines medical AI models with region-specific outbreak data from local health departments. Every analysis considers diseases prevalent in your area.</p>
        <ul class="space-y-4 pt-4">
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">500+ symptoms</strong> mapped to 200+ conditions</span></li>
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">Real-time outbreak</strong> data integration</span></li>
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">Hindi &amp; English</strong> bilingual support</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="py-24 bg-white">
  <div class="max-w-6xl mx-auto px-4">
    <div class="text-center mb-16 stagger-fade">
      <span class="text-green-600 font-semibold text-sm uppercase tracking-[.2em]">Why Use It</span>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Benefits</h2>
    </div>
    <div class="grid md:grid-cols-4 gap-6">
      <?php $benefits=[
        ['ri-flashlight-line','from-amber-500 to-yellow-600','Instant Analysis','Get AI-driven results in seconds without waiting for a doctor consultation.'],
        ['ri-radar-line','from-cyan-500 to-blue-600','Outbreak Tracking','Know what diseases are spreading in your pincode with real-time alerts.'],
        ['ri-translate-2','from-indigo-500 to-violet-600','Hindi Support','Full Hindi language support — ask questions and read results in your language.'],
        ['ri-wifi-off-line','from-slate-500 to-gray-600','Offline Cache','Previously analyzed symptoms and results are cached. Works without internet.'],
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

<section class="py-20 bg-gradient-to-r from-green-600 to-emerald-700 relative overflow-hidden">
  <div class="hero-glow hero-glow-1" style="background:#22c55e;opacity:.15"></div>
  <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
    <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 reveal-text"><span class="reveal-inner">Start Checking Your Symptoms</span></h2>
    <p class="text-green-100/80 text-lg mb-8 max-w-2xl mx-auto">Don't ignore early signs. Let AI guide you to the right care — instantly and privately.</p>
    <div class="flex flex-wrap justify-center gap-4">
      <a href="#" class="bg-white text-green-700 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 btn-shimmer flex items-center gap-3"><i class="ri-stethoscope-line"></i> Check Now</a>
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

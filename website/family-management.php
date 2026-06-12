<?php
$title = 'Family Management - GramSehat';
$page = 'family-management';
require 'includes/header.php';
?>

<section class="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900">
  <div class="hero-glow hero-glow-1"></div>
  <div class="hero-glow hero-glow-2"></div>

  <div class="max-w-6xl mx-auto px-4 py-32 relative z-10 w-full">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="space-y-8">
        <div class="hero-badge inline-flex items-center gap-3 bg-white/10 text-white/90 px-5 py-2 rounded-full text-sm border border-white/10 backdrop-blur-sm">
          <span class="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
          <span>Manage health for the whole family</span>
        </div>
        <h1 class="hero-title">
          <span class="text-4xl md:text-6xl font-bold block reveal-text"><span class="reveal-inner bg-gradient-to-r from-teal-300 via-cyan-300 to-teal-200 bg-clip-text text-transparent">Family Health Management</span></span>
          <span class="text-xl md:text-2xl font-medium block mt-4 text-teal-100/80 reveal-text"><span class="reveal-inner">पूरे परिवार की सेहत एक साथ</span></span>
        </h1>
        <p class="hero-desc text-lg md:text-xl text-teal-100/80 leading-relaxed max-w-lg" style="opacity:0">Add family members, track their health records, and manage everything from one place. Your family, your control.</p>
        <div class="hero-cta flex flex-wrap gap-4 pt-4">
          <a href="#" class="group bg-white text-teal-800 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-300 flex items-center gap-3 btn-shimmer"><i class="ri-group-line group-hover:animate-bounce"></i><span>Add Family Members</span><i class="ri-arrow-right-line text-sm opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all"></i></a>
          <a href="#" class="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-3"><i class="ri-play-circle-line"></i><span>Watch Demo</span></a>
        </div>
      </div>
      <div class="hidden lg:flex justify-center hero-svg">
        <div class="relative float-anim">
          <svg width="320" height="320" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-2xl">
            <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(45,212,191,.3)" stroke-width="2" class="pulse-ring"/>
            <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(45,212,191,.2)" stroke-width="1.5"/>
            <g class="svg-animate" fill="none" stroke="#5eead4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M65,70 C65,55 78,45 90,50 C95,52 98,56 100,60 C102,56 105,52 110,50 C122,45 135,55 135,70 C135,85 120,95 100,110 C80,95 65,85 65,70Z"/>
              <circle cx="100" cy="130" r="25"/>
              <line x1="100" y1="105" x2="100" y2="115"/>
              <rect x="75" y="140" width="50" height="35" rx="4"/>
              <line x1="85" y1="148" x2="115" y2="148"/>
              <line x1="85" y1="158" x2="105" y2="158"/>
              <line x1="90" y1="168" x2="110" y2="168"/>
            </g>
            <g fill="rgba(45,212,191,.3)">
              <circle cx="40" cy="50" r="3"/><circle cx="160" cy="40" r="3"/>
              <circle cx="170" cy="130" r="3"/><circle cx="30" cy="140" r="3"/>
              <circle cx="50" cy="170" r="2.5"/><circle cx="150" cy="170" r="2.5"/>
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
      <span class="text-teal-600 font-semibold text-sm uppercase tracking-[.2em]">How It Works</span>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Three Simple Steps</h2>
      <p class="text-gray-500 mt-4 max-w-2xl mx-auto">Start managing your family health in minutes</p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      <?php $steps=[
        ['ri-user-add-line','from-teal-500 to-cyan-600','Add Members','Add family members with age, gender, and medical history. Each member gets a unique profile.'],
        ['ri-file-list-line','from-blue-500 to-indigo-600','Track Records','Log prescriptions, lab reports, vaccinations, and checkups for each family member.'],
        ['ri-group-line','from-green-500 to-emerald-600','Manage All','View and manage all family health data from a single dashboard with smart insights.'],
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

<section class="py-24 bg-teal-50">
  <div class="max-w-6xl mx-auto px-4">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="stagger-fade">
        <img src="https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80" alt="Family together" class="rounded-2xl shadow-2xl w-full h-auto" loading="lazy">
      </div>
      <div class="space-y-6">
        <span class="text-teal-600 font-semibold text-sm uppercase tracking-[.2em]">Family First</span>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 reveal-text"><span class="reveal-inner">One App for Your <br>Entire Family's Health</span></h2>
        <p class="text-gray-600 leading-relaxed">Keep track of everyone's health — from grandparents to grandchildren. Manage appointments, medications, and emergencies in one place.</p>
        <ul class="space-y-4 pt-4">
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">Up to 10 members</strong> per family account</span></li>
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">Shared records</strong> accessible by caregivers</span></li>
          <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 shrink-0 mt-0.5"><i class="ri-check-line text-sm"></i></span><span class="text-gray-700"><strong class="text-gray-900">Age-based tracking</strong> for children &amp; elderly</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="py-24 bg-white">
  <div class="max-w-6xl mx-auto px-4">
    <div class="text-center mb-16 stagger-fade">
      <span class="text-teal-600 font-semibold text-sm uppercase tracking-[.2em]">Why Use It</span>
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Benefits</h2>
    </div>
    <div class="grid md:grid-cols-4 gap-6">
      <?php $benefits=[
        ['ri-group-2-line','from-teal-500 to-cyan-600','Multiple Members','Add and manage up to 10 family members with individual health profiles and records.'],
        ['ri-share-line','from-blue-500 to-indigo-600','Shared Records','Share medical records with doctors and family caregivers with controlled access.'],
        ['ri-phone-line','from-rose-500 to-red-600','Emergency Contacts','Store and quickly access emergency contacts for each family member.'],
        ['ri-user-heart-line','from-green-500 to-emerald-600','Age-based Tracking','Personalized health tracking for children, adults, and seniors with age-appropriate metrics.'],
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

<section class="py-20 bg-gradient-to-r from-teal-600 to-cyan-700 relative overflow-hidden">
  <div class="hero-glow hero-glow-1" style="background:#14b8a6;opacity:.15"></div>
  <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
    <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 reveal-text"><span class="reveal-inner">Start Managing Your Family's Health</span></h2>
    <p class="text-teal-100/80 text-lg mb-8 max-w-2xl mx-auto">Keep your whole family healthy with one app. Easy, secure, and built for India.</p>
    <div class="flex flex-wrap justify-center gap-4">
      <a href="#" class="bg-white text-teal-700 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 btn-shimmer flex items-center gap-3"><i class="ri-group-line"></i> Get Started</a>
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

<?php
header('Content-Type: text/html; charset=utf-8');
$page = $_GET['page'] ?? 'home';
$pages = ['home','features','download'];
if (!in_array($page,$pages)) $page='home';
$title = match($page){
  'home'=>'GramSehat - ग्राम स्वास्थ्य',
  'features'=>'Features - GramSehat',
  'download'=>'Download - GramSehat',
};
require 'includes/header.php';
?>

<?php if($page==='home'): ?>
  <section id="hero" class="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
    <div class="hero-glow hero-glow-1"></div>
    <div class="hero-glow hero-glow-2"></div>
    <div class="absolute inset-0 opacity-[0.03]" style="background-image:url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23fff\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E')"></div>

    <div class="max-w-6xl mx-auto px-4 py-32 relative z-10 w-full">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <div class="space-y-8">
          <div class="hero-badge inline-flex items-center gap-3 bg-white/10 text-white/90 px-5 py-2 rounded-full text-sm border border-white/10 backdrop-blur-sm">
            <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>Empowering <strong class="text-white">10,000+</strong> rural lives</span>
          </div>
          <h1 class="hero-title">
            <span class="text-5xl md:text-7xl font-bold text-white leading-[1.1] block reveal-text"><span class="reveal-inner">ग्राम स्वास्थ्य</span></span>
            <span class="text-4xl md:text-6xl font-bold block mt-3 reveal-text"><span class="reveal-inner bg-gradient-to-r from-green-300 via-emerald-300 to-green-200 bg-clip-text text-transparent">GramSehat</span></span>
          </h1>
          <p class="hero-desc text-lg md:text-xl text-green-100/80 leading-relaxed max-w-lg">Bridging the gap between rural communities and quality healthcare. Smart symptom checking, medicine verification, and nearby health centers — <span class="text-white font-semibold">all in your pocket. Offline ready.</span></p>
          <div class="hero-cta flex flex-wrap gap-4 pt-4">
            <a href="download-apk.php" class="group bg-white text-green-800 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 flex items-center gap-3 btn-shimmer"><i class="ri-download-line group-hover:animate-bounce"></i><span>Download APK</span><i class="ri-arrow-right-line text-sm opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all"></i></a>
            <a href="index.php?page=features" class="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-3"><i class="ri-play-circle-line"></i><span>Explore Features</span></a>
          </div>
          <div class="hero-stats flex items-center gap-8 pt-4">
            <div class="flex -space-x-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-300 to-green-400 border-2 border-white/80 flex items-center justify-center text-xs font-bold text-green-900">1k</div>
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 border-2 border-white/80 flex items-center justify-center text-xs font-bold">5k</div>
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 border-2 border-white/80 flex items-center justify-center text-xs font-bold text-white">10k+</div>
            </div>
            <div class="text-green-200/80 text-sm"><span class="text-2xl font-bold text-white counter-num" data-target="10000">0</span><span class="ml-1">+ rural users</span></div>
          </div>
        </div>
        <div class="hidden lg:flex justify-center hero-phone">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-[3rem] blur-3xl"></div>
            <div class="relative w-72 h-[30rem] rounded-[3rem] bg-gradient-to-b from-green-500 to-emerald-700 p-4 shadow-2xl border border-white/10">
              <div class="w-full h-full rounded-[2.5rem] bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden p-3 flex flex-col">
                <div class="flex items-center gap-3 mb-4 pt-2">
                  <div class="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center text-white text-xs font-bold">GS</div>
                  <div><div class="text-white text-xs font-semibold">GramSehat</div><div class="text-green-300 text-[10px]">Connected</div></div>
                  <div class="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div class="flex-1 space-y-2">
                  <div class="bg-white/10 rounded-xl p-3"><div class="text-white text-xs font-semibold mb-1"><i class="ri-map-pin-fill mr-1"></i> Your Location</div><div class="text-green-200 text-[10px]">Bela, Ambedkar Nagar, UP</div></div>
                  <div class="bg-white/10 rounded-xl p-3"><div class="text-white text-xs font-semibold mb-2"><i class="ri-hospital-line mr-1"></i> Nearby</div>
                    <div class="space-y-1.5">
                      <div class="flex items-center gap-2 bg-white/5 rounded-lg p-2"><div class="w-2 h-2 bg-green-400 rounded-full"></div><div class="text-white text-[10px]">PHC Bela — 1.2 km</div></div>
                      <div class="flex items-center gap-2 bg-white/5 rounded-lg p-2"><div class="w-2 h-2 bg-blue-400 rounded-full"></div><div class="text-white text-[10px]">CHC Jalalpur — 3.5 km</div></div>
                      <div class="flex items-center gap-2 bg-white/5 rounded-lg p-2"><div class="w-2 h-2 bg-purple-400 rounded-full"></div><div class="text-white text-[10px]">Dist. Hospital — 12 km</div></div>
                    </div>
                  </div>
                  <div class="bg-green-500/20 rounded-xl p-3 border border-green-400/30"><div class="text-white text-xs font-semibold mb-1"><i class="ri-alert-fill mr-1"></i> Outbreak Alert</div><div class="text-green-200 text-[10px]">3 viral fever cases in your area</div></div>
                </div>
                <div class="mt-2 flex gap-2">
                  <div class="flex-1 bg-green-500 rounded-full py-2 text-white text-[10px] font-semibold text-center">Symptoms</div>
                  <div class="flex-1 bg-white/10 rounded-full py-2 text-white text-[10px] font-semibold text-center">Scan</div>
                </div>
              </div>
            </div>
            <div class="absolute -bottom-4 -right-4 w-16 h-16 bg-yellow-400 rounded-2xl shadow-lg flex items-center justify-center text-2xl animate-bounce"><i class="ri-hospital-fill text-white"></i></div>
            <div class="absolute -top-4 -left-4 w-14 h-14 bg-blue-400 rounded-2xl shadow-lg flex items-center justify-center text-xl"><i class="ri-medicine-bottle-line text-white"></i></div>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg"><path d="M0 120L60 110C120 100 240 80 360 70 480 60 600 60 720 65 840 70 960 80 1080 85 1200 90 1320 90 1380 90L1440 90V120H0Z" fill="white"/></svg>
    </div>
  </section>

  <section id="features" class="py-28 bg-white">
    <div class="max-w-6xl mx-auto px-4">
      <div class="text-center mb-20">
        <span class="section-label text-green-600 font-semibold text-sm uppercase tracking-[.2em]">Why GramSehat</span>
        <h2 class="section-title text-4xl md:text-5xl font-bold text-gray-900 mt-4">Healthcare for Rural India</h2>
        <p class="section-desc text-gray-500 mt-4 max-w-2xl mx-auto">Built for villages, by the people. Zero internet? No problem — works offline with cached data.</p>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
        <?php $fcs=[
          ['ri-stethoscope-line','Symptom Checker','AI-powered analysis with outbreak alerts for your area.','from-green-500 to-emerald-600','symptom-checker.php'],
          ['ri-medicine-bottle-line','Medicine Scanner','Scan barcodes to verify medicines, check expiry & dosage.','from-blue-500 to-indigo-600','medicine-scanner.php'],
          ['ri-hospital-line','Nearby Centers','Find PHC, CHC, hospitals & clinics using OpenStreetMap.','from-purple-500 to-pink-600','nearby-centers.php'],
          ['ri-direction-line','Directions','Get routes to nearest health center via OpenRouteService.','from-orange-500 to-red-600','directions.php'],
          ['ri-group-line','Family Management','Add members & manage health records for everyone.','from-teal-500 to-cyan-600','family-management.php'],
          ['ri-file-list-3-line','Health Records','Store checkups, prescriptions, tests & vaccinations.','from-rose-500 to-pink-600','health-records.php'],
          ['ri-alert-line','Outbreak Alerts','Real-time disease outbreak alerts based on symptom reports.','from-amber-500 to-yellow-600','outbreak-alerts.php'],
          ['ri-translate-2','Bilingual','Full Hindi & English support for India\'s diversity.','from-indigo-500 to-violet-600','bilingual.php'],
          ['ri-wifi-off-line','Offline Mode','Cache hospitals & location. Works without internet.','from-slate-500 to-gray-600','offline-mode.php'],
        ]; foreach($fcs as $i=>$f): ?>
        <a href="<?=$f[4]?>" class="card-3d feat-card stagger-fade block">
          <div class="card-3d-inner bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br <?=$f[3]?> flex items-center justify-center text-white text-2xl mb-5 shadow-md"><i class="<?=$f[0]?>"></i></div>
            <h3 class="text-xl font-bold text-gray-900 mb-3"><?=$f[1]?></h3>
            <p class="text-gray-500 leading-relaxed"><?=$f[2]?></p>
          </div>
        </a>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <section class="py-20 bg-green-50 relative overflow-hidden">
    <div class="absolute inset-0 opacity-[0.02]" style="background-image:url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 0v40M0 20h40\' stroke=\'%2316a34a\' stroke-width=\'.5\'/%3E%3C/svg%3E')"></div>
    <div class="max-w-4xl mx-auto px-4 relative">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900">What People Say</h2>
      </div>
      <div class="marquee" data-lenis-prevent>
        <div class="marquee-track gap-8">
          <?php $testimonials=[
            ['RK','Ramu Kaka','Village Head, Bela, UP','GramSehat ne hamare gaon mein swasthya seva ko pahuncha diya. Ab koi bhi bina ilaaj se nahi rahega.'],
            ['SP','Sunita Devi','ASHA Worker, Jalalpur','Ab main ghar ghar jaakar logo ko sahi seva de sakti hoon. Bahut aasan hai.'],
            ['RM','Rahul Maurya','Student, Akbarpur','Medicine scanner bahut kaam aata hai. Nakli dawaiyon se bachav ho gaya.'],
            ['PK','Phool Kumar','Farmer, Katehri','Apne gaon ke PHC ka pata aur phone number mil gaya. Bahut fayda hua.'],
            ['RK','Ramu Kaka','Village Head, Bela, UP','GramSehat ne hamare gaon mein swasthya seva ko pahuncha diya. Ab koi bhi bina ilaaj se nahi rahega.'],
            ['SP','Sunita Devi','ASHA Worker, Jalalpur','Ab main ghar ghar jakar logo ko sahi seva de sakti hoon. Bahut aasan hai.'],
          ]; foreach($testimonials as $t): ?>
          <div class="bg-white rounded-2xl p-6 shadow-lg min-w-[350px] border border-green-100">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold"><?=$t[0]?></div>
              <div><div class="font-semibold text-gray-900"><?=$t[1]?></div><div class="text-gray-500 text-sm"><?=$t[2]?></div></div>
            </div>
            <p class="text-gray-600 italic">"<?=$t[3]?>"</p>
          </div>
          <?php endforeach; ?>
        </div>
      </div>
    </div>
  </section>

  <script>
    gsap.from('.hero-badge', { opacity: 0, y: 30, duration: 0.8, delay: 0.2 });
    gsap.to('.reveal-inner', { y: 0, duration: 1, stagger: 0.2, ease: 'power4.out', delay: 0.5 });
    gsap.from('.hero-desc', { opacity: 0, y: 30, duration: 0.8, delay: 0.9 });
    gsap.from('.hero-cta > *', { opacity: 0, y: 30, duration: 0.6, stagger: 0.15, delay: 1.1 });
    gsap.from('.hero-stats', { opacity: 0, y: 30, duration: 0.6, delay: 1.3 });
    gsap.from('.hero-phone', { opacity: 0, x: 100, duration: 1, delay: 0.6, ease: 'power4.out' });
    gsap.utils.toArray('.section-label, .section-title, .section-desc').forEach(el=>{
      gsap.from(el, { opacity: 0, y: 40, duration: 0.8, scrollTrigger: { trigger: el, start: 'top 85%' } });
    });
    gsap.utils.toArray('.feat-card').forEach((card, i)=>{
      gsap.to(card, {
        opacity: 1, y: 0, scale: 1, duration: 0.7, delay: i * 0.08,
        scrollTrigger: { trigger: card, start: 'top 88%' }
      });
    });
    const counterEl = document.querySelector('.counter-num[data-target]');
    if(counterEl){
      gsap.to(counterEl, {
        innerText: 10000, duration: 2.5, ease: 'power2.out', snap: { innerText: 1 },
        scrollTrigger: { trigger: counterEl, start: 'top 85%' }
      });
    }
  </script>

<?php elseif($page==='features'): ?>
  <section class="pt-32 pb-20 bg-gradient-to-b from-green-50 to-white min-h-screen">
    <div class="max-w-6xl mx-auto px-4">
      <div class="text-center mb-16 stagger-fade">
        <span class="text-green-600 font-semibold text-sm uppercase tracking-[.2em]">Everything You Need</span>
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Powerful Features</h2>
        <p class="text-gray-500 mt-4 max-w-2xl mx-auto">Designed for low-bandwidth areas with full offline support</p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <?php $allF=[
          ['ri-stethoscope-line','green','Smart Symptom Check','Select symptoms, get AI analysis. Track outbreaks in your pincode.','symptom-checker.php'],
          ['ri-camera-line','blue','Medicine Scanner','Scan barcodes to verify authenticity, check expiry & dosage.','medicine-scanner.php'],
          ['ri-map-2-line','purple','Nearby Healthcare','OSM-powered map to find PHCs, CHCs, hospitals & clinics.','nearby-centers.php'],
          ['ri-direction-line','orange','Directions & Routes','Turn-by-turn directions to nearest health center via ORS.','directions.php'],
          ['ri-group-line','red','Family Management','Add family members, manage everyone\'s records in one place.','family-management.php'],
          ['ri-file-list-3-line','teal','Health Records','Checkups, prescriptions, tests, vaccinations — all stored.','health-records.php'],
          ['ri-alert-line','yellow','Outbreak Alerts','Real-time disease alerts based on community symptom reports.','outbreak-alerts.php'],
          ['ri-translate-2','indigo','Bilingual Support','Full Hindi & English. Built for India\'s linguistic diversity.','bilingual.php'],
          ['ri-wifi-off-line','gray','Offline Mode','Cache data. Works without internet in remote areas.','offline-mode.php'],
        ]; $colors=['green'=>'from-green-500 to-emerald-600','blue'=>'from-blue-500 to-cyan-600','purple'=>'from-purple-500 to-violet-600','orange'=>'from-orange-500 to-amber-600','red'=>'from-red-500 to-rose-600','teal'=>'from-teal-500 to-cyan-600','yellow'=>'from-yellow-500 to-amber-600','indigo'=>'from-indigo-500 to-violet-600','gray'=>'from-gray-500 to-slate-600']; foreach($allF as $f): ?>
        <a href="<?=$f[4]?>" class="bg-white rounded-xl p-6 shadow-md border border-gray-100 card-3d stagger-fade block">
          <div class="card-3d-inner"><div class="w-12 h-12 rounded-lg bg-gradient-to-br <?=$colors[$f[1]]?> flex items-center justify-center text-white text-xl mb-4 shadow"><i class="<?=$f[0]?>"></i></div>
          <h3 class="font-bold text-gray-900 mb-2"><?=$f[2]?></h3>
          <p class="text-gray-500 text-sm leading-relaxed"><?=$f[3]?></p></div>
        </a>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

<?php elseif($page==='download'): ?>
  <section class="pt-32 pb-20 bg-gradient-to-b from-green-50 to-white min-h-screen">
    <div class="max-w-4xl mx-auto px-4">
      <div class="text-center mb-16 stagger-fade">
        <span class="text-green-600 font-semibold text-sm uppercase tracking-[.2em]">Get Started</span>
        <h2 class="text-4xl font-bold text-gray-900 mt-3">Download GramSehat</h2>
        <p class="text-gray-500 mt-4 max-w-xl mx-auto">Free, open-source. Built for India.</p>
      </div>
      <div class="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-green-100 text-center card-3d">
        <div class="card-3d-inner"><div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mx-auto flex items-center justify-center text-white text-4xl shadow-lg mb-6"><i class="ri-heart-pulse-line"></i></div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">GramSehat v1.0</h3>
        <p class="text-gray-500 mb-6">Android APK • 25MB • Android 8+</p>
        <div class="flex flex-wrap justify-center gap-4 mb-8">
          <a href="download-apk.php" class="btn-shimmer bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"><i class="ri-download-line"></i> Download APK</a>
          <a href="https://github.com/rahulpatle-sol/GramSehat" target="_blank" class="border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-full font-semibold hover:bg-gray-50 transition flex items-center gap-3"><i class="ri-github-line"></i> View Source</a>
        </div>
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 text-left border border-green-100">
          <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2"><i class="ri-information-line text-green-600"></i> Install Guide</h4>
          <ol class="space-y-2 text-gray-600 text-sm">
            <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span><span>Download the APK</span></li>
            <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span><span>Settings → Security → Enable "Install Unknown Apps"</span></li>
            <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span><span>Open the downloaded APK → Install</span></li>
            <li class="flex items-start gap-3"><span class="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span><span>Launch GramSehat → Grant location permission</span></li>
          </ol>
        </div></div>
      </div>
    </div>
  </section>
<?php endif; ?>

<?php require 'includes/footer.php'; ?>

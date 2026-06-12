<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title><?=$title?></title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"></script>
<style>
  html.lenis{scroll-behavior:auto}
  html.lenis body{overflow-x:hidden}
  .lenis.lenis-smooth [data-lenis-prevent]{overscroll-behavior:contain}
  :root{--primary:#16a34a}
  ::-webkit-scrollbar{width:6px}
  ::-webkit-scrollbar-track{background:#f1f5f9}
  ::-webkit-scrollbar-thumb{background:var(--primary);border-radius:3px}
  .hero-glow{position:absolute;width:600px;height:600px;border-radius:50%;filter:blur(120px);pointer-events:none;opacity:.3}
  .hero-glow-1{background:#22c55e;top:-200px;right:-200px;animation:glowFloat 8s ease-in-out infinite}
  .hero-glow-2{background:#16a34a;bottom:-200px;left:-200px;animation:glowFloat 10s ease-in-out infinite reverse}
  @keyframes glowFloat{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-30px) scale(1.1)}66%{transform:translate(-20px,20px) scale(.95)}}
  .reveal-text{clip-path:polygon(0 0,100% 0,100% 100%,0 100%)}
  .reveal-text .reveal-inner{display:block;will-change:transform;transform:translateY(100%)}
  .stagger-fade{opacity:0;transform:translateY(40px) scale(.95)}
  .card-3d{perspective:1200px}
  .card-3d-inner{transition:transform .6s cubic-bezier(.23,1,.32,1);transform-style:preserve-3d}
  .card-3d:hover .card-3d-inner{transform:rotateY(6deg) rotateX(3deg)}
  .btn-shimmer{position:relative;overflow:hidden}
  .btn-shimmer::after{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:linear-gradient(45deg,transparent 40%,rgba(255,255,255,.15) 50%,transparent 60%);animation:shimmer 3s ease-in-out infinite}
  @keyframes shimmer{0%{transform:translateX(-100%) rotate(25deg)}100%{transform:translateX(100%) rotate(25deg)}}
  .particle{position:fixed;width:4px;height:4px;background:var(--primary);border-radius:50%;opacity:.15;pointer-events:none;z-index:0;animation:particleFloat linear infinite}
  @keyframes particleFloat{0%{transform:translateY(100vh) rotate(0deg);opacity:0}10%{opacity:.15}90%{opacity:.15}100%{transform:translateY(-100vh) rotate(720deg);opacity:0}}
  .nav-blur{backdrop-filter:blur(16px) saturate(180%);-webkit-backdrop-filter:blur(16px) saturate(180%)}
  .cursor-dot{width:8px;height:8px;background:var(--primary);border-radius:50%;position:fixed;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);transition:width .2s,height .2s}
  .cursor-ring{width:40px;height:40px;border:2px solid var(--primary);border-radius:50%;position:fixed;pointer-events:none;z-index:99998;transform:translate(-50%,-50%);transition:width .3s,height .3s,border-color .3s,background .3s;mix-blend-mode:difference}
  .cursor-ring.hovering{width:60px;height:60px;border-color:#86efac;background:rgba(22,163,74,.08)}
  .svg-animate{stroke-dasharray:1000;stroke-dashoffset:1000;animation:dash 2s ease forwards}
  @keyframes dash{to{stroke-dashoffset:0}}
  .float-anim{animation:float 6s ease-in-out infinite}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
  .pulse-ring{animation:pulseRing 2s ease-in-out infinite}
  @keyframes pulseRing{0%{box-shadow:0 0 0 0 rgba(22,163,74,.4)}70%{box-shadow:0 0 0 20px rgba(22,163,74,0)}100%{box-shadow:0 0 0 0 rgba(22,163,74,0)}}
</style>
</head>
<body class="bg-white text-gray-800 overflow-x-hidden">
  <div class="cursor-dot hidden lg:block" id="cursorDot"></div>
  <div class="cursor-ring hidden lg:block" id="cursorRing"></div>

  <nav id="navbar" class="fixed top-0 w-full z-50 nav-blur bg-white/80 border-b border-green-100/50 transition-all duration-500">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <a href="index.php?page=home" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">GS</div>
        <span class="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">GramSehat</span>
      </a>
      <div class="hidden md:flex items-center gap-6">
        <a href="index.php?page=home" class="text-gray-600 hover:text-green-600 font-medium transition nav-link <?=($page??'')==='home'?'text-green-600':''?>">Home</a>
        <div class="relative group dropdown">
          <a href="index.php?page=features" class="text-gray-600 hover:text-green-600 font-medium transition nav-link flex items-center gap-1 <?=($page??'')==='features'||in_array($page??'',['symptom-checker','medicine-scanner','nearby-centers','directions','family-management','health-records','outbreak-alerts','bilingual','offline-mode'])?'text-green-600':''?>">Features <i class="ri-arrow-down-s-line text-sm transition-transform group-hover:rotate-180"></i></a>
          <div class="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
            <div class="bg-white rounded-2xl shadow-xl border border-green-100 p-3 w-64 grid grid-cols-1 gap-1">
              <a href="symptom-checker.php" class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-green-50 transition text-sm font-medium text-gray-700 hover:text-green-700"><i class="ri-stethoscope-line text-green-600"></i>Symptom Checker</a>
              <a href="medicine-scanner.php" class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-green-50 transition text-sm font-medium text-gray-700 hover:text-green-700"><i class="ri-medicine-bottle-line text-blue-600"></i>Medicine Scanner</a>
              <a href="nearby-centers.php" class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-green-50 transition text-sm font-medium text-gray-700 hover:text-green-700"><i class="ri-hospital-line text-purple-600"></i>Nearby Centers</a>
              <a href="directions.php" class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-green-50 transition text-sm font-medium text-gray-700 hover:text-green-700"><i class="ri-direction-line text-orange-600"></i>Directions</a>
              <a href="family-management.php" class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-green-50 transition text-sm font-medium text-gray-700 hover:text-green-700"><i class="ri-group-line text-teal-600"></i>Family Management</a>
              <a href="health-records.php" class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-green-50 transition text-sm font-medium text-gray-700 hover:text-green-700"><i class="ri-file-list-3-line text-rose-600"></i>Health Records</a>
              <a href="outbreak-alerts.php" class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-green-50 transition text-sm font-medium text-gray-700 hover:text-green-700"><i class="ri-alert-line text-amber-600"></i>Outbreak Alerts</a>
              <a href="bilingual.php" class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-green-50 transition text-sm font-medium text-gray-700 hover:text-green-700"><i class="ri-translate-2 text-indigo-600"></i>Bilingual</a>
              <a href="offline-mode.php" class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-green-50 transition text-sm font-medium text-gray-700 hover:text-green-700"><i class="ri-wifi-off-line text-slate-600"></i>Offline Mode</a>
            </div>
          </div>
        </div>
        <a href="download-apk.php" class="text-gray-600 hover:text-green-600 font-medium transition nav-link <?=($page??'')==='download'?'text-green-600':''?>">Download</a>
        <a href="contact.php" class="text-gray-600 hover:text-green-600 font-medium transition nav-link <?=($page??'')==='contact'?'text-green-600':''?>">Contact</a>
        <a href="download-apk.php" class="btn-shimmer bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:shadow-green-300/40 transition-all duration-300 flex items-center gap-2 text-sm"><i class="ri-download-line"></i> Get APK</a>
      </div>
      <button id="menuBtn" class="md:hidden text-green-700 text-2xl p-2"><i class="ri-menu-line"></i></button>
    </div>
    <div id="mobileMenu" class="hidden md:hidden border-t border-green-100/50 px-4 py-4 space-y-2 bg-white/95 backdrop-blur-lg">
      <a href="index.php?page=home" class="block text-gray-600 hover:text-green-600 font-medium py-2">Home</a>
      <div class="border-t border-gray-100 pt-2 mt-2">
        <p class="text-xs text-gray-400 uppercase tracking-wider mb-2 px-2">Features</p>
        <a href="symptom-checker.php" class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-green-50 text-gray-600 text-sm"><i class="ri-stethoscope-line text-green-600"></i>Symptom Checker</a>
        <a href="medicine-scanner.php" class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-green-50 text-gray-600 text-sm"><i class="ri-medicine-bottle-line text-blue-600"></i>Medicine Scanner</a>
        <a href="nearby-centers.php" class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-green-50 text-gray-600 text-sm"><i class="ri-hospital-line text-purple-600"></i>Nearby Centers</a>
        <a href="directions.php" class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-green-50 text-gray-600 text-sm"><i class="ri-direction-line text-orange-600"></i>Directions</a>
        <a href="family-management.php" class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-green-50 text-gray-600 text-sm"><i class="ri-group-line text-teal-600"></i>Family Management</a>
        <a href="health-records.php" class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-green-50 text-gray-600 text-sm"><i class="ri-file-list-3-line text-rose-600"></i>Health Records</a>
        <a href="outbreak-alerts.php" class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-green-50 text-gray-600 text-sm"><i class="ri-alert-line text-amber-600"></i>Outbreak Alerts</a>
        <a href="bilingual.php" class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-green-50 text-gray-600 text-sm"><i class="ri-translate-2 text-indigo-600"></i>Bilingual</a>
        <a href="offline-mode.php" class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-green-50 text-gray-600 text-sm"><i class="ri-wifi-off-line text-slate-600"></i>Offline Mode</a>
      </div>
      <div class="border-t border-gray-100 pt-2 mt-2">
        <a href="contact.php" class="block text-gray-600 hover:text-green-600 font-medium py-2">Contact</a>
      </div>
      <a href="download-apk.php" class="block text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-3 rounded-full font-semibold mt-2"><i class="ri-download-line mr-2"></i>Get APK</a>
    </div>
  </nav>

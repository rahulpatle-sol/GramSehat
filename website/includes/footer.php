  <footer class="bg-gray-900 text-gray-400 py-16">
    <div class="max-w-6xl mx-auto px-4">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <div><div class="flex items-center gap-3 mb-4"><div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">GS</div><span class="text-xl font-bold text-white">GramSehat</span></div><p class="text-sm leading-relaxed text-gray-500">Bridging rural healthcare gaps with tech. Made with <i class="ri-heart-fill text-red-400"></i> for India.</p></div>
        <div><h4 class="font-semibold text-white mb-4">Quick Links</h4><div class="space-y-2 text-sm"><a href="index.php?page=home" class="block hover:text-green-400 transition">Home</a><a href="index.php?page=features" class="block hover:text-green-400 transition">Features</a><a href="download-apk.php" class="block hover:text-green-400 transition">Download</a><a href="contact.php" class="block hover:text-green-400 transition">Contact</a></div></div>
        <div><h4 class="font-semibold text-white mb-4">Features</h4><div class="space-y-2 text-sm"><a href="symptom-checker.php" class="block hover:text-green-400 transition">Symptom Checker</a><a href="medicine-scanner.php" class="block hover:text-green-400 transition">Medicine Scanner</a><a href="nearby-centers.php" class="block hover:text-green-400 transition">Nearby Centers</a><a href="directions.php" class="block hover:text-green-400 transition">Directions</a><a href="offline-mode.php" class="block hover:text-green-400 transition">Offline Mode</a></div></div>
        <div><h4 class="font-semibold text-white mb-4">Connect</h4><div class="flex gap-3"><a href="https://github.com/rahulpatle-sol/GramSehat" target="_blank" class="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-green-600 transition text-lg"><i class="ri-github-line"></i></a></div></div>
      </div>
      <div class="border-t border-gray-800 pt-8 text-center text-sm"><p class="text-gray-600">&copy; 2026 GramSehat. MIT License.</p></div>
    </div>
  </footer>

  <script>
    const lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.8 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t)=>{lenis.raf(t*1000)});
    gsap.ticker.lagSmoothing(0);

    let lastScroll = 0;
    lenis.on('scroll', (e)=>{
      const nav = document.getElementById('navbar');
      if(e.velocity > 1 && e.scroll > 100) nav.style.transform = 'translateY(-100%)';
      else if(e.velocity < -0.5) nav.style.transform = 'translateY(0)';
      lastScroll = e.scroll;
    });

    gsap.utils.toArray('.stagger-fade').forEach(el=>{
      gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.6, scrollTrigger: { trigger: el, start: 'top 85%' } });
    });

    gsap.utils.toArray('.reveal-text').forEach(el=>{
      gsap.to(el.querySelector('.reveal-inner'), { y: 0, duration: 1, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 80%' } });
    });

    for(let i=0; i<25; i++){
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
      p.style.animationDuration = (15 + Math.random() * 25) + 's';
      p.style.animationDelay = Math.random() * 20 + 's';
      document.body.appendChild(p);
    }

    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if(dot && ring){
      let mx = 0, my = 0;
      document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; });
      gsap.ticker.add(()=>{ gsap.to(ring, { x: mx, y: my, duration: 0.3, ease: 'power2.out' }); });
      document.querySelectorAll('a, button, .card-3d').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
      });
    }

    document.getElementById('menuBtn')?.addEventListener('click', ()=>{
      document.getElementById('mobileMenu').classList.toggle('hidden');
    });
    document.querySelectorAll('#mobileMenu a').forEach(a => {
      a.addEventListener('click', ()=>document.getElementById('mobileMenu')?.classList.add('hidden'));
    });
  </script>
</body>
</html>

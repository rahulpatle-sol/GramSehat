<?php
$title = 'Contact - GramSehat';
$page = 'contact';
require 'includes/header.php';
?>
<section class="pt-32 pb-20 bg-gradient-to-b from-green-50 to-white min-h-screen">
  <div class="max-w-4xl mx-auto px-4">
    <div class="text-center mb-16 stagger-fade">
      <span class="text-green-600 font-semibold text-sm uppercase tracking-[.2em]">Get In Touch</span>
      <h2 class="text-4xl font-bold text-gray-900 mt-3">Contact Us</h2>
      <p class="text-gray-500 mt-4 max-w-xl mx-auto">Have questions or feedback? Let us know.</p>
    </div>
    <div class="grid md:grid-cols-2 gap-8">
      <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 card-3d stagger-fade">
        <div class="card-3d-inner"><h3 class="text-xl font-bold text-gray-900 mb-6">Send a Message</h3>
        <form action="contact.php" method="POST" class="space-y-4">
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Name</label><input type="text" name="name" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" name="email" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Message</label><textarea name="message" rows="4" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"></textarea></div>
          <button type="submit" class="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all w-full"><i class="ri-send-plane-line mr-2"></i>Send</button>
        </form></div>
      </div>
      <div class="space-y-6 stagger-fade">
        <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 class="text-xl font-bold text-gray-900 mb-6">Contact Info</h3>
          <div class="space-y-4">
            <div class="flex items-start gap-4"><div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600"><i class="ri-mail-line"></i></div><div><p class="font-medium text-gray-900">Email</p><p class="text-gray-500 text-sm">support@gramsehat.in</p></div></div>
            <div class="flex items-start gap-4"><div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600"><i class="ri-global-line"></i></div><div><p class="font-medium text-gray-900">Web</p><p class="text-gray-500 text-sm">gramsehat.onrender.com</p></div></div>
            <div class="flex items-start gap-4"><div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600"><i class="ri-map-pin-line"></i></div><div><p class="font-medium text-gray-900">Location</p><p class="text-gray-500 text-sm">Ambedkar Nagar, UP, India</p></div></div>
          </div>
        </div>
        <div class="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 shadow-lg text-white">
          <h3 class="text-xl font-bold mb-3">Join Our Mission</h3>
          <p class="text-green-100 text-sm mb-4">Help bring healthcare to every village. Contribute on GitHub.</p>
          <a href="https://github.com/rahulpatle-sol/GramSehat" target="_blank" class="inline-flex items-center gap-2 bg-white/20 px-5 py-2.5 rounded-full font-semibold hover:bg-white/30 transition text-sm"><i class="ri-github-line"></i> GitHub</a>
        </div>
      </div>
    </div>
  </div>
</section>
<?php require 'includes/footer.php'; ?>

<?php
// APK Download handler - put your actual APK file in this directory
$apkFile = __DIR__ . '/GramSehat-v1.0.apk';

if (file_exists($apkFile)) {
  header('Content-Type: application/vnd.android.package-archive');
  header('Content-Disposition: attachment; filename="GramSehat-v1.0.apk"');
  header('Content-Length: ' . filesize($apkFile));
  header('Cache-Control: public, max-age=3600');
  readfile($apkFile);
  exit;
}

// If APK doesn't exist yet, show info page
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Download - GramSehat</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css">
  <style>
    @keyframes pulse-glow { 0%,100%{box-shadow:0 0 20px rgba(34,197,94,.3)} 50%{box-shadow:0 0 40px rgba(34,197,94,.6)} }
    .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite }
  </style>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center p-4">
  <div class="bg-white rounded-3xl p-8 md:p-12 shadow-xl max-w-lg w-full text-center border border-green-100">
    <div class="w-20 h-20 rounded-2xl bg-amber-100 mx-auto flex items-center justify-center text-amber-500 text-4xl mb-6">
      <i class="ri-time-line"></i>
    </div>
    <h1 class="text-2xl font-bold text-gray-900 mb-3">APK Build in Progress</h1>
    <p class="text-gray-500 mb-6">
      The Android APK is currently being built on EAS Cloud. 
      Check back in a few minutes once the build completes.
    </p>
    <div class="bg-amber-50 rounded-xl p-4 mb-6 text-sm text-amber-700 text-left">
      <p class="font-semibold mb-1"><i class="ri-information-line mr-2"></i>Build Status:</p>
      <p>Once the EAS build finishes, place the .apk file in this directory as <code class="bg-amber-100 px-2 py-0.5 rounded text-xs">GramSehat-v1.0.apk</code></p>
    </div>
    <div class="flex flex-col gap-3">
      <a href="https://expo.dev/accounts/rahulpatle-sol/projects/GramSehat/builds/6bf53325-eb2e-4995-88f7-89e76baa2a0e" target="_blank" class="bg-green-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-green-700 transition shadow-lg">
        <i class="ri-external-link-line mr-2"></i> Track Build
      </a>
      <a href="?page=home" class="text-gray-500 hover:text-gray-700 font-medium text-sm">
        <i class="ri-arrow-left-line mr-1"></i> Back to Home
      </a>
    </div>
  </div>
</body>
</html>

<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// 1️⃣ WhatsApp 群组链接（只改这里）
$whatsapp_group_link = "https://chat.whatsapp.com/FjN0SD1ri8pIjI8hwUzlqV?mode=wwt";

// 2️⃣ Google Pixel
$google_pixel = <<<HTML



<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-725505446"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-725505446');
</script>



<script>
function gtag_report_conversion(url) {
  var callback = function () {
    if (url) window.location = url;
  };
  gtag('event', 'conversion', {
    'send_to': 'AW-725505446/Mb3iCO6ekdIbEKar-dkC',
    'event_callback': callback
  });
  return false;
}
</script>




HTML;

// 3️⃣ Facebook Pixel
$facebook_pixel = <<<HTML



<script>
!function(f,b,e,v,n,t,s){
if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)
}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

fbq('init', '你的FACEBOOK_PIXEL_ID');
fbq('track', 'PageView');
</script>




HTML;
$is_change_link = !str_contains($whatsapp_group_link, "FjN0SD1ri8pIjI8hwUzlqV");

header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'gg'             => $google_pixel ?? '',
    'fb'             => $facebook_pixel ?? '',
    'whatsapp_link'  => $whatsapp_group_link ?? '',
    'is_change_link' => $is_change_link,
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
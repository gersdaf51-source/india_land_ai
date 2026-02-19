<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');  // 如果有跨域問題，可視情況調整

$directory = __DIR__;  // 目前資料夾，就是 pics/
$images = [];

$files = scandir($directory);

foreach ($files as $file) {
    // 跳過 . 和 .. 以及 pic.php 本身
    if ($file === '.' || $file === '..' || $file === 'pic.php') {
        continue;
    }

    // 只取圖片檔（可擴充格式）
    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'])) {
        // 產生完整相對 URL，例如 /pics/照片1.jpg
        $images[] = '/pics/' . $file;
    }
}

// 排序（可改成按檔名、修改時間等）
sort($images);

echo json_encode([
    'success' => true,
    'count'   => count($images),
    'images'  => $images
]);
?>
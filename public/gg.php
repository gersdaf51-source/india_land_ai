<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

define('CONFIG_FILE', __DIR__ . '/config.json');

// 預設值（原始硬編碼）
$default = [
    'whatsapp' => ['link' => 'https://cutt.ly/rtjaj890'],
    'pixels' => [
        'google' => '<!-- 預設 Google Pixel -->',
        'facebook' => '<!-- 預設 Facebook Pixel -->'
    ],
    'settings' => [
        'is_need_limt_click' => true,
        'button_text' => ' want to join',
        'app_name' => 'AI tool learn',
        "set_time" => ""

    ]
];

// 讀取 JSON
$config = $default;
if (file_exists(CONFIG_FILE)) {
    $json = file_get_contents(CONFIG_FILE);
    $parsed = json_decode($json, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($parsed)) {
        $config = array_replace_recursive($config, $parsed);
    } else {
        error_log("config.json 解析失敗: " . json_last_error_msg());
    }
}

$whatsapp_group_link = $config['whatsapp']['link'] ?? $default['whatsapp']['link'];
$google_pixel        = $config['pixels']['google']   ?? $default['pixels']['google'];
$facebook_pixel      = $config['pixels']['facebook'] ?? $default['pixels']['facebook'];
$is_need_limt_click  = $config['settings']['is_need_limt_click'] ?? $default['settings']['is_need_limt_click'];
$button_text  = $config['settings']['button_text'] ?? $default['settings']['button_text'];
$app_name  = $config['settings']['app_name'] ?? $default['settings']['app_name'];
$set_time  = $config['set_time'] ?? $default['set_time'];

// 保留原始邏輯
$is_change_link = !str_contains($whatsapp_group_link, "rtjaj890");

echo json_encode([
    'gg'                => $google_pixel,
    'fb'                => $facebook_pixel,
    'whatsapp_link'     => $whatsapp_group_link,
    'is_change_link'    => $is_change_link,
    'is_need_limt_click' => $is_need_limt_click,
    'button_text' => $button_text,
    'app_name' => $app_name,
    'set_time' => $set_time
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

<?php
session_start();

// ==================== 基本設定 ====================
define('CONFIG_FILE', dirname(__DIR__) . '/config.json');  // public/config.json
define('PASSWORD', '666888');  // ← 務必改成強密碼！
define('MAX_FAILED_ATTEMPTS', 10);
define('LOCKOUT_DURATION', 3600); // 鎖定 1 小時 (秒)

// 獲取客戶端 IP（明文使用）
function getClientIp() {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    foreach (['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED'] as $key) {
        if (isset($_SERVER[$key])) {
            $ipList = explode(',', $_SERVER[$key]);
            $ip = trim($ipList[0]);
            break;
        }
    }
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '0.0.0.0';
}

$clientIp = getClientIp();

// 鎖定相關檔案（放在 cf/ 目錄，明文 IP）
$lockDir = __DIR__;
$attemptsFile = $lockDir . '/.attempts_' . $clientIp . '.txt';
$lockoutTimeFile = $lockDir . '/.lock_' . $clientIp . '.txt';

// ==================== 最先檢查鎖定狀態 ====================
$lockoutTime = 0;
if (file_exists($lockoutTimeFile)) {
    $lockoutTime = (int) trim(file_get_contents($lockoutTimeFile));
}

if ($lockoutTime > time()) {
    $remaining = $lockoutTime - time();
    die("<h1 style='color:red; text-align:center; margin-top:100px; font-family:sans-serif;'>
        因連續輸入錯誤密碼，IP 已被鎖定！<br>
        剩餘時間：約 " . ceil($remaining / 60) . " 分鐘<br><br>
        <small>自動解鎖時間：" . date('Y-m-d H:i:s', $lockoutTime) . "</small><br>
        <small>（防暴力破解保護）</small>
    </h1>");
}

// ==================== 登入狀態 ====================
$loggedIn = isset($_SESSION['cf_logged_in']) && $_SESSION['cf_logged_in'] === true;

$error = $success = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['password'])) {
        if ($_POST['password'] === PASSWORD) {
            $_SESSION['cf_logged_in'] = true;
            // 登入成功 → 清除該 IP 的所有錯誤記錄
            if (file_exists($attemptsFile)) @unlink($attemptsFile);
            if (file_exists($lockoutTimeFile)) @unlink($lockoutTimeFile);
            $loggedIn = true;
        } else {
            // 密碼錯誤 → 開始/繼續記錄
            $failedAttempts = 0;
            if (file_exists($attemptsFile)) {
                $failedAttempts = (int) trim(file_get_contents($attemptsFile));
            }
            $failedAttempts++;

            // 寫入錯誤次數
            file_put_contents($attemptsFile, $failedAttempts);

            if ($failedAttempts >= MAX_FAILED_ATTEMPTS) {
                $lockoutTime = time() + LOCKOUT_DURATION;
                file_put_contents($lockoutTimeFile, $lockoutTime);
                die("<h1 style='color:red; text-align:center; margin-top:100px; font-family:sans-serif;'>
                    連續輸入錯誤密碼 " . MAX_FAILED_ATTEMPTS . " 次！<br>
                    IP 已被鎖定 1 小時（到 " . date('Y-m-d H:i:s', $lockoutTime) . " 自動解鎖）<br><br>
                    <small>請勿使用自動化工具或腳本嘗試登入</small>
                </h1>");
            }

            $error = "密碼錯誤！已嘗試 $failedAttempts / " . MAX_FAILED_ATTEMPTS . " 次";
        }
    }

    // 儲存配置（JSON）
    if ($loggedIn && isset($_POST['save_config'])) {
        $newConfig = [
            'whatsapp' => [
                'link' => trim($_POST['whatsapp_link'] ?? '')
            ],
            'pixels' => [
                'google'   => trim($_POST['google_pixel'] ?? ''),
                'facebook' => trim($_POST['facebook_pixel'] ?? '')
            ],
            'settings' => [
                'is_need_limt_click' => isset($_POST['is_need_limt_click']) ? true : false
            ]
        ];

        $jsonContent = json_encode($newConfig, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        if (file_put_contents(CONFIG_FILE, $jsonContent) !== false) {
            $success = "設定已成功儲存！";
            header("Refresh:0");
            exit;
        } else {
            $error = "寫入 config.json 失敗！請檢查權限（chmod 664 或 666）";
        }
    }
}

// ==================== 讀取 config.json ====================
$config = [
    'whatsapp' => ['link' => ''],
    'pixels'   => ['google' => '', 'facebook' => ''],
    'settings' => ['is_need_limt_click' => false]
];

if (file_exists(CONFIG_FILE)) {
    $json = file_get_contents(CONFIG_FILE);
    $parsed = json_decode($json, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($parsed)) {
        $config = array_replace_recursive($config, $parsed);
    } else {
        $error = "config.json 格式錯誤：" . json_last_error_msg();
    }
} else {
    $error = "config.json 不存在。請儲存一次來建立檔案。";
}
?>

<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>配置管理 - cf.php</title>
    <style>
        body { font-family: system-ui, sans-serif; background:#f0f4f8; margin:0; padding:20px; color:#333; line-height:1.6; }
        .container { max-width:960px; margin:0 auto; background:white; padding:30px; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.1); }
        h1 { text-align:center; color:#2c3e50; margin-bottom:10px; }
        .subtitle { text-align:center; color:#7f8c8d; margin-bottom:30px; }
        .form-group { margin-bottom:24px; }
        label { display:block; margin-bottom:8px; font-weight:600; color:#34495e; }
        input[type=text], textarea { width:100%; padding:12px; border:1px solid #bdc3c7; border-radius:6px; font-family:monospace; font-size:14px; box-sizing:border-box; }
        textarea { min-height:220px; resize:vertical; white-space:pre-wrap; overflow-wrap:break-word; word-wrap:break-word; overflow-x:hidden; line-height:1.5; }
        .checkbox-label { display:flex; align-items:center; gap:8px; font-weight:normal; }
        button { background:#3498db; color:white; border:none; padding:12px 28px; border-radius:6px; cursor:pointer; font-size:16px; transition:background 0.2s; }
        button:hover { background:#2980b9; }
        .msg { padding:14px; margin:20px 0; border-radius:6px; font-weight:500; }
        .success { background:#d4edda; color:#155724; border:1px solid #c3e6cb; }
        .error   { background:#f8d7da; color:#721c24; border:1px solid #f5c6cb; }
        .info { font-size:0.9em; color:#7f8c8d; margin-top:6px; }
        .logout { text-align:right; margin-bottom:20px; }
        .logout a { color:#e74c3c; text-decoration:none; font-weight:500; }
        .logout a:hover { text-decoration:underline; }
    </style>
</head>
<body>

<div class="container">
    <h1>配置管理面板</h1>
    <p class="subtitle">目前 IP: <strong><?php echo htmlspecialchars($clientIp); ?></strong></p>

    <?php if (!$loggedIn): ?>
        <h2>請輸入管理密碼</h2>
        <?php if ($error): ?>
            <div class="msg error"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <form method="post">
            <div class="form-group">
                <label for="password">密碼</label>
                <input type="password" id="password" name="password" required autofocus>
            </div>
            <button type="submit">登入</button>
        </form>
    <?php else: ?>
<div class="logout" style="margin-bottom:20px; text-align:right;">
    <a href="?reload=1" style="margin-right:20px; color:#3498db; text-decoration:none; font-weight:500;">
        重新載入配置
    </a>
    <a href="?logout=1" onclick="return confirm('確定登出？');" style="color:#e74c3c; text-decoration:none; font-weight:500;">
        登出
    </a>
</div>

<?php
// 處理重新載入參數（其實就是刷新頁面）
if (isset($_GET['reload'])) {
    header("Location: cf.php");  // 直接重新導向自己，清除 GET 參數並重新讀取 config
    exit;
}
?>
        <?php if (isset($_GET['logout'])) { session_destroy(); header("Location: cf.php"); exit; } ?>

        <?php if ($success): ?>
            <div class="msg success"><?php echo $success; ?></div>
        <?php endif; ?>
        <?php if ($error): ?>
            <div class="msg error"><?php echo $error; ?></div>
        <?php endif; ?>

        <form method="post">
            <input type="hidden" name="save_config" value="1">
            
            <div class="form-group">
                <label for="whatsapp_link">WhatsApp 群組連結</label>
                <textarea 
                    id="whatsapp_link" 
                    name="whatsapp_link" 
                    rows="5" 
                    placeholder="貼上完整的 WhatsApp 群組連結，例如：https://chat.whatsapp.com/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?mode=wwt"
                    style="width:100%; padding:12px; font-family:monospace; font-size:14px; resize:vertical; white-space:pre-wrap; overflow-wrap:break-word; word-wrap:break-word; overflow-x:hidden; line-height:1.5;"
                    required><?php echo htmlspecialchars($config['whatsapp']['link'] ?? ''); ?></textarea>
                <div class="info">長連結會自動斷行，可上下拖拉調整高度</div>
            </div>

            <div class="form-group">
                <label for="google_pixel">Google Pixel 代碼</label>
                <textarea id="google_pixel" name="google_pixel"><?php echo htmlspecialchars($config['pixels']['google'] ?? ''); ?></textarea>
                <div class="info">支援多行，請完整貼上原始代碼</div>
            </div>

            <div class="form-group">
                <label for="facebook_pixel">Facebook Pixel 代碼</label>
                <textarea id="facebook_pixel" name="facebook_pixel"><?php echo htmlspecialchars($config['pixels']['facebook'] ?? ''); ?></textarea>
                <div class="info">支援多行，請完整貼上原始代碼</div>
            </div>

            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" name="is_need_limt_click" value="1" 
                           <?php echo ($config['settings']['is_need_limt_click'] ?? false) ? 'checked' : ''; ?>>
                    啟用點擊次數限制 (is_need_limt_click)
                </label>
            </div>

            <button type="submit">儲存並立即生效</button>
        </form>
    <?php endif; ?>
</div>

</body>
</html>
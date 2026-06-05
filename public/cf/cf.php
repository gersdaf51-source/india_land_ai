<?php
session_start();

// ==================== 基本設定 ====================
define('CONFIG_FILE', dirname(__DIR__) . '/config.json');
define('PASSWORD', '666888');
define('MAX_FAILED_ATTEMPTS', 10);
define('LOCKOUT_DURATION', 3600); // 1 小時

define('DEFAULT_WHATSAPP_LINK', 'https://cutt.ly/rtjaj890');

// 獲取客戶端 IP
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

// 鎖定相關檔案
$lockDir = __DIR__;
$attemptsFile = $lockDir . '/.attempts_' . $clientIp . '.txt';
$lockoutTimeFile = $lockDir . '/.lock_' . $clientIp . '.txt';

// 檢查是否已被鎖定
$lockoutTime = 0;
if (file_exists($lockoutTimeFile)) {
    $lockoutTime = (int) trim(file_get_contents($lockoutTimeFile));
}

if ($lockoutTime > time()) {
    $remainingSeconds = $lockoutTime - time();
    die('
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>帳號暫時鎖定</title>
        <style>
            body {font-family:system-ui, sans-serif; background:#f8f9fa; margin:0; padding:60px 20px; text-align:center; color:#333;}
            h1 {color:#e74c3c; margin-bottom:20px;}
            .time {font-size:56px; font-weight:bold; color:#e74c3c; margin:30px 0;}
            .info {font-size:1.1em; color:#555; margin:20px 0;}
            small {color:#777;}
        </style>
    </head>
    <body>
        <h1>因連續輸入錯誤密碼，IP 已被暫時鎖定</h1>
        <p class="info">剩餘時間：</p>
        <div class="time" id="countdown">--:--</div>
        <p>約 <strong id="remaining">' . ceil($remainingSeconds / 60) . '</strong> 分鐘</p>
        <p><small>自動解鎖時間：' . date('Y-m-d H:i:s', $lockoutTime) . '</small></p>
        <br>
        <small>（防暴力破解保護，請勿使用自動化工具嘗試登入）</small>

        <script>
            let seconds = ' . $remainingSeconds . ';
            function updateCountdown() {
                let min = Math.floor(seconds / 60);
                let sec = seconds % 60;
                document.getElementById("countdown").textContent = 
                    min.toString().padStart(2, "0") + ":" + sec.toString().padStart(2, "0");
                document.getElementById("remaining").textContent = min;
                if (seconds > 0) {
                    seconds--;
                    setTimeout(updateCountdown, 1000);
                } else {
                    location.reload();
                }
            }
            updateCountdown();
        </script>
    </body>
    </html>');
}

// 處理登出
if (isset($_GET['logout']) && $_GET['logout'] === '1') {
    session_unset();
    session_destroy();
    header("Location: cf.php");
    exit;
}

// 登入狀態
$loggedIn = isset($_SESSION['cf_logged_in']) && $_SESSION['cf_logged_in'] === true;

$error = $success = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 登入驗證
    if (isset($_POST['password'])) {
        if ($_POST['password'] === PASSWORD) {
            $_SESSION['cf_logged_in'] = true;
            if (file_exists($attemptsFile)) @unlink($attemptsFile);
            if (file_exists($lockoutTimeFile)) @unlink($lockoutTimeFile);
            $loggedIn = true;
            $success = "登入成功！";
        } else {
            $failedAttempts = file_exists($attemptsFile) ? (int)trim(file_get_contents($attemptsFile)) : 0;
            $failedAttempts++;
            file_put_contents($attemptsFile, $failedAttempts);

            if ($failedAttempts >= MAX_FAILED_ATTEMPTS) {
                $lockoutTime = time() + LOCKOUT_DURATION;
                file_put_contents($lockoutTimeFile, $lockoutTime);
                header("Location: cf.php");
                exit;
            }

            $remaining = MAX_FAILED_ATTEMPTS - $failedAttempts;
            $error = "密碼錯誤！已嘗試 <strong>$failedAttempts / " . MAX_FAILED_ATTEMPTS . "</strong> 次<br>還剩 <strong>$remaining</strong> 次機會";
        }
    }

    // 儲存配置
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
                'is_need_limt_click' => isset($_POST['is_need_limt_click']) ? true : false,
                'button_text'        => trim($_POST['button_text'] ?? 'I want to join'),
                'app_name'           => trim($_POST['app_name'] ?? 'AI tool learn')
            ],
            'set_time' => trim($_POST['set_time'] ?? '')
        ];

        if (isset($_POST['reset_whatsapp']) && $_POST['reset_whatsapp'] === '1') {
            $newConfig['whatsapp']['link'] = DEFAULT_WHATSAPP_LINK;
            $success = "WhatsApp 群組連結已復原為預設值！";
        } else {
            $success = "設定已成功儲存！";
        }

        $jsonContent = json_encode($newConfig, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        if (file_put_contents(CONFIG_FILE, $jsonContent) !== false) {
            header("Location: cf.php");
            exit;
        } else {
            $error = "寫入 config.json 失敗！請檢查檔案權限（建議 chmod 664 或 666）";
        }
    }
}

// 讀取 config.json
$config = [
    'whatsapp' => ['link' => ''],
    'pixels'   => ['google' => '', 'facebook' => ''],
    'settings' => [
        'is_need_limt_click' => false,
        'button_text'        => 'I want to join',
        'app_name'           => 'AI tool learn',
    ],
    'set_time' => ''
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

// 計算剩餘時間
$remainingText = '';
if (!empty($config['set_time'])) {
    $targetTime = @strtotime($config['set_time']);
    if ($targetTime !== false) {
        $diff = $targetTime - time();
        if ($diff > 0) {
            $days    = floor($diff / 86400);
            $hours   = floor(($diff % 86400) / 3600);
            $minutes = floor(($diff % 3600) / 60);

            $parts = [];
            if ($days > 0)    $parts[] = $days . '天';
            if ($hours > 0)   $parts[] = $hours . '小時';
            if ($minutes > 0) $parts[] = $minutes . '分';
            if (empty($parts)) $parts[] = '不到1分';

            $remainingText = '剩餘 ' . implode(' ', $parts);
        } else {
            $remainingText = '已過期';
        }
    } else {
        $remainingText = '格式錯誤';
    }
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
        .form-group { margin-bottom:24px; position: relative; }
        label { display:block; margin-bottom:8px; font-weight:600; color:#34495e; }
        input[type=text], input[type=password], input[type=datetime-local], textarea { width:100%; padding:12px; border:1px solid #bdc3c7; border-radius:6px; font-family:monospace; font-size:14px; box-sizing:border-box; }
        textarea { min-height:110px; resize:vertical; white-space:pre-wrap; overflow-wrap:break-word; word-wrap:break-word; overflow-x:hidden; line-height:1.5; }
        .reset-btn { position: absolute; top: 32px; right: 12px; background:#e74c3c; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; font-size:13px; }
        .reset-btn:hover { background:#c0392b; }
        .checkbox-label { display:flex; align-items:center; gap:8px; font-weight:normal; }
        button { background:#3498db; color:white; border:none; padding:12px 28px; border-radius:6px; cursor:pointer; font-size:16px; }
        button:hover { background:#2980b9; }
        .msg { padding:14px; margin:20px 0; border-radius:6px; font-weight:500; }
        .success { background:#d4edda; color:#155724; border:1px solid #c3e6cb; }
        .error   { background:#f8d7da; color:#721c24; border:1px solid #f5c6cb; }
        .info { font-size:0.9em; color:#7f8c8d; margin-top:6px; }
        .logout { text-align:right; margin-bottom:20px; }
        .logout a { color:#e74c3c; text-decoration:none; font-weight:500; margin-left:15px; }
        .logout a:hover { text-decoration:underline; }
        .remaining-time {
            margin-top: 6px;
            font-weight: 500;
            padding: 8px 12px;
            border-radius: 6px;
            background: #ecfdf5;
            color: #065f46;
        }
        .remaining-expired {
            background: #fee2e2;
            color: #991b1b;
        }
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
        <?php if ($success): ?>
            <div class="msg success"><?php echo $success; ?></div>
        <?php endif; ?>
        
        <form method="post">
            <div class="form-group">
                <label for="password">密碼</label>
                <input type="password" id="password" name="password" required autofocus>
            </div>
            <button type="submit">登入</button>
        </form>
    <?php else: ?>
        <div class="logout">
            <a href="?reload=1" style="color:#3498db;">重新載入配置</a>
            <a href="?logout=1" onclick="return confirm('確定登出？');">登出</a>
        </div>

        <?php if (isset($_GET['reload'])) { header("Location: cf.php"); exit; } ?>

        <?php if ($success): ?>
            <div class="msg success"><?php echo $success; ?></div>
        <?php endif; ?>
        <?php if ($error): ?>
            <div class="msg error"><?php echo $error; ?></div>
        <?php endif; ?>

        <form method="post" id="configForm">
            <input type="hidden" name="save_config" value="1">
            
            <div class="form-group">
                <label for="set_time">網站到期時間 (set_time)</label>
                <input type="datetime-local" id="set_time" name="set_time" 
                       value="<?php echo htmlspecialchars($config['set_time'] ?? ''); ?>">
                <?php if ($remainingText): ?>
                    <div class="remaining-time <?php echo strpos($remainingText, '已過期') !== false ? 'remaining-expired' : ''; ?>">
                        <?php echo $remainingText; ?>
                    </div>
                <?php endif; ?>
                <div class="info">
                    給其他系統/前端使用的到期時間欄位<br>
                    格式：YYYY-MM-DDTHH:MM<br>
                    留空 = 無到期限制（由其他系統自行判斷）
                </div>
            </div>

            <div class="form-group">
                <label for="whatsapp_link">WhatsApp 群組連結</label>
                <textarea 
                    id="whatsapp_link" 
                    name="whatsapp_link" 
                    rows="3" 
                    placeholder="貼上完整的 WhatsApp 群組連結"
                    style="width:100%; padding:12px; font-family:monospace; font-size:14px; resize:vertical; white-space:pre-wrap; overflow-wrap:break-word; word-wrap:break-word; overflow-x:hidden; line-height:1.5;"
                    required><?php echo htmlspecialchars($config['whatsapp']['link'] ?? ''); ?></textarea>
                
                <button type="button" class="reset-btn" onclick="resetWhatsappLink()">复原审核链接</button>
                
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

            <div class="form-group">
                <label for="button_text">按鈕文字 (Button Text)</label>
                <input type="text" id="button_text" name="button_text" 
                       value="<?php echo htmlspecialchars($config['settings']['button_text'] ?? 'I want to join'); ?>"
                       placeholder="例如：I want to join / 立即加入">
                <div class="info">前端顯示的按鈕文字</div>
            </div>

            <div class="form-group">
                <label for="app_name">應用程式名稱 (App Name)（未实现）</label>
                <input type="text" id="app_name" name="app_name" 
                       value="<?php echo htmlspecialchars($config['settings']['app_name'] ?? 'AI tool learn'); ?>"
                       placeholder="例如：AI tool learn">
                <div class="info">用於標題、品牌顯示的名稱</div>
            </div>

            <button type="submit">儲存並立即生效</button>
        </form>
    <?php endif; ?>
</div>

<script>
function resetWhatsappLink() {
    if (confirm('確定要將 WhatsApp 群組連結復原為預設值？')) {
        document.getElementById('whatsapp_link').value = '<?php echo addslashes(DEFAULT_WHATSAPP_LINK); ?>';
        
        const form = document.getElementById('configForm');
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'reset_whatsapp';
        input.value = '1';
        form.appendChild(input);
        form.submit();
    }
}
</script>

</body>
</html>
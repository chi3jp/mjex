// コラボレーション管理システム用JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // ツールチップの初期化
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // プロジェクト状況チャート
    const projectStatusChart = document.getElementById('project-status-chart');
    if (projectStatusChart) {
        new Chart(projectStatusChart, {
            type: 'doughnut',
            data: {
                labels: ['進行中', '完了', '遅延', '未開始'],
                datasets: [{
                    data: [2, 3, 1, 1],
                    backgroundColor: [
                        '#0d6efd',
                        '#198754',
                        '#dc3545',
                        '#adb5bd'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                },
                cutout: '70%'
            }
        });
    }
    
    // タスクのチェックボックス処理
    const taskCheckboxes = document.querySelectorAll('.task-item .form-check-input');
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.nextElementSibling;
            const badge = this.closest('.task-item').querySelector('.badge');
            
            if (this.checked) {
                label.classList.add('text-decoration-line-through');
                badge.textContent = '完了';
                badge.className = 'badge bg-secondary';
            } else {
                label.classList.remove('text-decoration-line-through');
                // 優先度に応じてバッジを戻す処理（デモでは省略）
            }
        });
    });
    
    // サイドバーのアクティブ状態
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 実際のアプリではページ遷移するため不要ですが、デモ用に実装
            e.preventDefault();
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 通知ドロップダウン
    const notificationsDropdown = document.getElementById('notificationsDropdown');
    if (notificationsDropdown) {
        notificationsDropdown.addEventListener('click', function() {
            // 実際のアプリでは通知を既読にする処理などを実装
            const badge = this.querySelector('.badge');
            if (badge) {
                setTimeout(() => {
                    badge.style.display = 'none';
                }, 2000);
            }
        });
    }
    
    // 新規タスク追加ボタン
    const addTaskBtn = document.querySelector('.btn-outline-primary');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', function() {
            // 実際のアプリではモーダルを表示するなどの処理を実装
            alert('この機能はデモ版では利用できません。実際のアプリではタスク追加フォームが表示されます。');
        });
    }
    
    // プロジェクト進捗の更新（デモ用）
    function updateProjectProgress() {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const currentValue = parseInt(bar.getAttribute('aria-valuenow'));
            // ランダムに少し進捗を更新
            const newValue = Math.min(100, currentValue + Math.floor(Math.random() * 5));
            bar.style.width = newValue + '%';
            bar.setAttribute('aria-valuenow', newValue);
            bar.textContent = newValue + '%';
        });
    }
    
    // 定期的に進捗を更新（デモ用）
    setInterval(updateProjectProgress, 30000);
    
    // アクティビティフィードの時間表示を更新（デモ用）
    function updateActivityTimes() {
        const times = document.querySelectorAll('.activity-time');
        const now = new Date();
        
        times.forEach((time, index) => {
            let minutes;
            switch(index) {
                case 0:
                    minutes = 30 + Math.floor(Math.random() * 10);
                    time.textContent = minutes + '分前';
                    break;
                case 1:
                    minutes = 120 + Math.floor(Math.random() * 30);
                    time.textContent = Math.floor(minutes / 60) + '時間前';
                    break;
                case 2:
                    time.textContent = '昨日';
                    break;
                case 3:
                    time.textContent = '2日前';
                    break;
                case 4:
                    time.textContent = '3日前';
                    break;
            }
        });
    }
    
    // 初回実行
    updateActivityTimes();
    
    // 定期的に時間表示を更新（デモ用）
    setInterval(updateActivityTimes, 60000);
});
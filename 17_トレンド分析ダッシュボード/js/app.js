// トレンド分析ダッシュボード用JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM要素
    const refreshBtn = document.getElementById('refresh-btn');
    const timeRangeDropdown = document.getElementById('timeRangeDropdown');
    const dropdownItems = document.querySelectorAll('.dropdown-menu .dropdown-item');
    const viewButtons = document.querySelectorAll('[data-view]');
    
    // チャート用のコンテキスト
    const trendChart = document.getElementById('trend-chart');
    const styleChart = document.getElementById('style-chart');
    const parameterChart = document.getElementById('parameter-chart');
    
    let currentTimeRange = 30; // デフォルトは30日
    let currentView = 'daily'; // デフォルトは日次
    
    // チャートインスタンス
    let trendChartInstance = null;
    let styleChartInstance = null;
    let parameterChartInstance = null;
    
    // 初期化
    initCharts();
    
    // 更新ボタンクリック
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            // 更新アニメーション
            const icon = refreshBtn.querySelector('i');
            icon.classList.add('spin');
            
            // データ更新をシミュレート
            setTimeout(() => {
                updateCharts();
                icon.classList.remove('spin');
            }, 1000);
        });
    }
    
    // 期間選択ドロップダウン
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const range = parseInt(this.dataset.range);
            currentTimeRange = range;
            
            // アクティブクラスを更新
            dropdownItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // ドロップダウンボタンのテキストを更新
            timeRangeDropdown.textContent = this.textContent;
            
            // チャートを更新
            updateCharts();
        });
    });
    
    // 表示切替ボタン
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.dataset.view;
            currentView = view;
            
            // アクティブクラスを更新
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // トレンドチャートを更新
            updateTrendChart();
        });
    });
    
    /**
     * チャートを初期化する
     */
    function initCharts() {
        initTrendChart();
        initStyleChart();
        initParameterChart();
    }
    
    /**
     * トレンドチャートを初期化する
     */
    function initTrendChart() {
        if (!trendChart) return;
        
        const data = generateTrendData();
        
        trendChartInstance = new Chart(trendChart, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: data.datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }
    
    /**
     * スタイルチャートを初期化する
     */
    function initStyleChart() {
        if (!styleChart) return;
        
        styleChartInstance = new Chart(styleChart, {
            type: 'doughnut',
            data: {
                labels: ['フォトリアリスティック', 'アニメ/マンガ', '3Dレンダリング', 'イラスト', 'ピクセルアート', 'その他'],
                datasets: [{
                    data: [35, 25, 15, 12, 8, 5],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 159, 64, 0.8)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        });
    }
    
    /**
     * パラメータチャートを初期化する
     */
    function initParameterChart() {
        if (!parameterChart) return;
        
        parameterChartInstance = new Chart(parameterChart, {
            type: 'bar',
            data: {
                labels: ['解像度', 'アスペクト比', 'スタイル化', 'カラーパレット', 'ライティング', 'カメラアングル'],
                datasets: [{
                    label: '使用頻度',
                    data: [85, 72, 65, 58, 45, 32],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    /**
     * チャートを更新する
     */
    function updateCharts() {
        updateTrendChart();
        updateStyleChart();
        updateParameterChart();
    }
    
    /**
     * トレンドチャートを更新する
     */
    function updateTrendChart() {
        if (!trendChartInstance) return;
        
        const data = generateTrendData();
        
        trendChartInstance.data.labels = data.labels;
        trendChartInstance.data.datasets = data.datasets;
        trendChartInstance.update();
    }
    
    /**
     * スタイルチャートを更新する
     */
    function updateStyleChart() {
        if (!styleChartInstance) return;
        
        // ランダムなデータを生成
        const data = [
            Math.floor(Math.random() * 20) + 25, // フォトリアリスティック
            Math.floor(Math.random() * 15) + 20, // アニメ/マンガ
            Math.floor(Math.random() * 10) + 10, // 3Dレンダリング
            Math.floor(Math.random() * 8) + 8,   // イラスト
            Math.floor(Math.random() * 5) + 5,   // ピクセルアート
            Math.floor(Math.random() * 5) + 3    // その他
        ];
        
        styleChartInstance.data.datasets[0].data = data;
        styleChartInstance.update();
    }
    
    /**
     * パラメータチャートを更新する
     */
    function updateParameterChart() {
        if (!parameterChartInstance) return;
        
        // ランダムなデータを生成
        const data = [
            Math.floor(Math.random() * 20) + 70, // 解像度
            Math.floor(Math.random() * 20) + 60, // アスペクト比
            Math.floor(Math.random() * 20) + 50, // スタイル化
            Math.floor(Math.random() * 20) + 40, // カラーパレット
            Math.floor(Math.random() * 20) + 30, // ライティング
            Math.floor(Math.random() * 20) + 20  // カメラアングル
        ];
        
        parameterChartInstance.data.datasets[0].data = data;
        parameterChartInstance.update();
    }
    
    /**
     * トレンドデータを生成する
     */
    function generateTrendData() {
        const labels = [];
        const photorealisticData = [];
        const animeData = [];
        const renderingData = [];
        
        // 期間に応じてラベルとデータを生成
        const now = new Date();
        const dateFormat = { month: 'short', day: 'numeric' };
        
        for (let i = currentTimeRange - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(now.getDate() - i);
            
            // 表示形式に応じてラベルを調整
            if (currentView === 'daily' || (currentView === 'weekly' && i % 7 === 0) || (currentView === 'monthly' && i % 30 === 0)) {
                labels.push(date.toLocaleDateString('ja-JP', dateFormat));
            } else {
                labels.push('');
            }
            
            // ランダムなデータを生成
            const baseValue1 = 50 + Math.sin(i / 5) * 10;
            const baseValue2 = 40 + Math.cos(i / 4) * 8;
            const baseValue3 = 30 + Math.sin(i / 3) * 6;
            
            photorealisticData.push(baseValue1 + Math.random() * 10);
            animeData.push(baseValue2 + Math.random() * 8);
            renderingData.push(baseValue3 + Math.random() * 6);
        }
        
        // 表示形式に応じてデータを間引く
        const filteredLabels = [];
        const filteredPhotorealisticData = [];
        const filteredAnimeData = [];
        const filteredRenderingData = [];
        
        const step = currentView === 'daily' ? 1 : (currentView === 'weekly' ? 7 : 30);
        
        for (let i = 0; i < labels.length; i += step) {
            if (labels[i] !== '') {
                filteredLabels.push(labels[i]);
                filteredPhotorealisticData.push(photorealisticData[i]);
                filteredAnimeData.push(animeData[i]);
                filteredRenderingData.push(renderingData[i]);
            }
        }
        
        return {
            labels: currentView === 'daily' ? labels : filteredLabels,
            datasets: [
                {
                    label: 'フォトリアリスティック',
                    data: currentView === 'daily' ? photorealisticData : filteredPhotorealisticData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'アニメ/マンガ',
                    data: currentView === 'daily' ? animeData : filteredAnimeData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: '3Dレンダリング',
                    data: currentView === 'daily' ? renderingData : filteredRenderingData,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        };
    }
    
    // スピンアニメーション用のスタイルを追加
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .spin {
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(style);
});
// AI画像品質分析ツール用JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM要素
    const imageUpload = document.getElementById('image-upload');
    const dropArea = document.getElementById('drop-area');
    const imageUrl = document.getElementById('image-url');
    const fetchUrlBtn = document.getElementById('fetch-url-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    const previewContainer = document.getElementById('preview-container');
    const loadingIndicator = document.getElementById('loading');
    const resultsContainer = document.getElementById('results-container');
    const noResults = document.getElementById('no-results');
    const copyPromptBtn = document.getElementById('copy-prompt-btn');
    
    // チャート用のコンテキスト
    const radarChart = document.getElementById('radar-chart');
    const histogramChart = document.getElementById('histogram-chart');
    
    let currentImage = null;
    let radarChartInstance = null;
    let histogramChartInstance = null;
    
    // ファイルアップロードイベント
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleImageFile(file);
        }
    });
    
    // ドラッグ&ドロップイベント
    dropArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropArea.classList.add('dragover');
    });
    
    dropArea.addEventListener('dragleave', function() {
        dropArea.classList.remove('dragover');
    });
    
    dropArea.addEventListener('drop', function(e) {
        e.preventDefault();
        dropArea.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            const file = e.dataTransfer.files[0];
            imageUpload.files = e.dataTransfer.files;
            handleImageFile(file);
        }
    });
    
    // URLから画像を取得
    fetchUrlBtn.addEventListener('click', function() {
        const url = imageUrl.value.trim();
        if (url) {
            fetchImageFromUrl(url);
        } else {
            alert('URLを入力してください');
        }
    });
    
    // 分析ボタンクリック
    analyzeBtn.addEventListener('click', function() {
        if (currentImage) {
            analyzeImage();
        }
    });
    
    // プロンプト提案をコピー
    if (copyPromptBtn) {
        copyPromptBtn.addEventListener('click', function() {
            const promptText = document.getElementById('prompt-recommendations').textContent;
            navigator.clipboard.writeText(promptText).then(() => {
                const originalText = copyPromptBtn.innerHTML;
                copyPromptBtn.innerHTML = '<i class="bi bi-check"></i> コピー完了';
                setTimeout(() => {
                    copyPromptBtn.innerHTML = originalText;
                }, 2000);
            }).catch(err => {
                console.error('クリップボードへのコピーに失敗しました:', err);
                alert('コピーに失敗しました。手動でコピーしてください。');
            });
        });
    }
    
    /**
     * 画像ファイルを処理する
     */
    function handleImageFile(file) {
        if (!file.type.match('image.*')) {
            alert('画像ファイルを選択してください');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            displayPreview(e.target.result);
            currentImage = {
                src: e.target.result,
                name: file.name,
                size: file.size,
                type: file.type
            };
            analyzeBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }
    
    /**
     * URLから画像を取得する
     */
    function fetchImageFromUrl(url) {
        // CORS制限があるため、実際のアプリではプロキシサーバーを使用する必要があります
        // このデモでは、直接画像を表示するだけにします
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            try {
                const dataUrl = canvas.toDataURL('image/png');
                displayPreview(dataUrl);
                currentImage = {
                    src: dataUrl,
                    name: url.split('/').pop(),
                    size: null,
                    type: 'image/png'
                };
                analyzeBtn.disabled = false;
            } catch (e) {
                alert('CORS制限により、この画像は読み込めません。別の画像を試してください。');
                console.error(e);
            }
        };
        
        img.onerror = function() {
            alert('画像の読み込みに失敗しました。URLを確認してください。');
        };
        
        img.src = url;
    }
    
    /**
     * プレビューを表示する
     */
    function displayPreview(src) {
        previewContainer.innerHTML = '';
        const img = document.createElement('img');
        img.src = src;
        previewContainer.appendChild(img);
    }
    
    /**
     * 画像を分析する
     */
    function analyzeImage() {
        // 実際のアプリではAPIを呼び出しますが、このデモではモックデータを使用します
        showLoading(true);
        
        // 分析処理をシミュレート
        setTimeout(() => {
            showLoading(false);
            showResults();
            
            // チャートを描画
            drawRadarChart();
            drawHistogramChart();
        }, 2000);
    }
    
    /**
     * ローディング表示を切り替える
     */
    function showLoading(isLoading) {
        if (isLoading) {
            loadingIndicator.classList.remove('d-none');
            resultsContainer.classList.add('d-none');
            noResults.classList.add('d-none');
        } else {
            loadingIndicator.classList.add('d-none');
        }
    }
    
    /**
     * 結果を表示する
     */
    function showResults() {
        resultsContainer.classList.remove('d-none');
        noResults.classList.add('d-none');
        
        // 画像情報を表示
        if (currentImage) {
            document.getElementById('resolution').textContent = '1024 x 1024 ピクセル'; // 実際には画像から取得
            document.getElementById('aspect-ratio').textContent = '1:1 (正方形)';
            document.getElementById('file-size').textContent = formatFileSize(currentImage.size || 2500000);
            document.getElementById('format').textContent = currentImage.type ? currentImage.type.split('/')[1].toUpperCase() : 'PNG';
            document.getElementById('color-mode').textContent = 'RGB';
        }
    }
    
    /**
     * レーダーチャートを描画する
     */
    function drawRadarChart() {
        if (!radarChart) return;
        
        if (radarChartInstance) {
            radarChartInstance.destroy();
        }
        
        radarChartInstance = new Chart(radarChart, {
            type: 'radar',
            data: {
                labels: ['解像度', 'シャープネス', 'ノイズ除去', 'カラーバランス', '構図', 'ディテール'],
                datasets: [{
                    label: '画像評価',
                    data: [85, 90, 75, 80, 70, 85],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(54, 162, 235)'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
    
    /**
     * ヒストグラムを描画する
     */
    function drawHistogramChart() {
        if (!histogramChart) return;
        
        if (histogramChartInstance) {
            histogramChartInstance.destroy();
        }
        
        // モックデータ
        const redData = Array.from({length: 256}, () => Math.floor(Math.random() * 100));
        const greenData = Array.from({length: 256}, () => Math.floor(Math.random() * 100));
        const blueData = Array.from({length: 256}, () => Math.floor(Math.random() * 100));
        
        // 表示用にデータを間引く
        const step = 8;
        const labels = Array.from({length: 256/step}, (_, i) => i * step);
        const redSampled = Array.from({length: 256/step}, (_, i) => redData[i * step]);
        const greenSampled = Array.from({length: 256/step}, (_, i) => greenData[i * step]);
        const blueSampled = Array.from({length: 256/step}, (_, i) => blueData[i * step]);
        
        histogramChartInstance = new Chart(histogramChart, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'R',
                        data: redSampled,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 1,
                        pointRadius: 0,
                        fill: true
                    },
                    {
                        label: 'G',
                        data: greenSampled,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1,
                        pointRadius: 0,
                        fill: true
                    },
                    {
                        label: 'B',
                        data: blueSampled,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderWidth: 1,
                        pointRadius: 0,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '輝度値 (0-255)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'ピクセル数'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }
    
    /**
     * ファイルサイズをフォーマットする
     */
    function formatFileSize(bytes) {
        if (!bytes) return '不明';
        
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return size.toFixed(1) + ' ' + units[unitIndex];
    }
});
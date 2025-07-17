// AI画像比較ツール用JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM要素
    const imageUpload1 = document.getElementById('image-upload-1');
    const imageUpload2 = document.getElementById('image-upload-2');
    const imageUrl1 = document.getElementById('image-url-1');
    const imageUrl2 = document.getElementById('image-url-2');
    const fetchUrl1Btn = document.getElementById('fetch-url-1');
    const fetchUrl2Btn = document.getElementById('fetch-url-2');
    const label1Input = document.getElementById('label-1');
    const label2Input = document.getElementById('label-2');
    const compareBtn = document.getElementById('compare-btn');
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');
    
    // 比較タイプラジオボタン
    const compareSideRadio = document.getElementById('compare-side');
    const compareSliderRadio = document.getElementById('compare-slider');
    const compareOverlayRadio = document.getElementById('compare-overlay');
    
    // 比較ビュー
    const noImagesDiv = document.getElementById('no-images');
    const sideBySideView = document.getElementById('side-by-side-view');
    const sliderView = document.getElementById('slider-view');
    const overlayView = document.getElementById('overlay-view');
    
    // 分析コンテナ
    const analysisContainer = document.getElementById('analysis-container');
    
    // オプション要素
    const displaySizeSelect = document.getElementById('display-size');
    const showGridCheck = document.getElementById('show-grid');
    const showHistogramCheck = document.getElementById('show-histogram');
    const showMetadataCheck = document.getElementById('show-metadata');
    const gridRowsInput = document.getElementById('grid-rows');
    const gridColsInput = document.getElementById('grid-cols');
    const gridGoldenRatioCheck = document.getElementById('grid-golden-ratio');
    const overlayNormalRadio = document.getElementById('overlay-normal');
    const overlayDifferenceRadio = document.getElementById('overlay-difference');
    const overlayBlendRadio = document.getElementById('overlay-blend');
    const opacitySlider = document.getElementById('opacity-slider');
    const opacityValue = document.getElementById('opacity-value');
    
    // 画像要素
    const sideImage1 = document.getElementById('side-image-1');
    const sideImage2 = document.getElementById('side-image-2');
    const sideLabel1 = document.getElementById('side-label-1');
    const sideLabel2 = document.getElementById('side-label-2');
    const sideGrid1 = document.getElementById('side-grid-1');
    const sideGrid2 = document.getElementById('side-grid-2');
    
    const sliderImage1 = document.getElementById('slider-image-1');
    const sliderImage2 = document.getElementById('slider-image-2');
    const sliderLabel1 = document.getElementById('slider-label-1');
    const sliderLabel2 = document.getElementById('slider-label-2');
    const sliderGrid = document.getElementById('slider-grid');
    const sliderDivisor = document.querySelector('.slider-divisor');
    
    const overlayImage1 = document.getElementById('overlay-image-1');
    const overlayImage2 = document.getElementById('overlay-image-2');
    const overlayLabel = document.getElementById('overlay-label');
    const overlayGrid = document.getElementById('overlay-grid');
    
    // ヒストグラムキャンバス
    const histogram1Canvas = document.getElementById('histogram-1');
    const histogram2Canvas = document.getElementById('histogram-2');
    
    // 画像データ
    let image1Data = null;
    let image2Data = null;
    
    // チャートインスタンス
    let histogram1Chart = null;
    let histogram2Chart = null;
    
    // ファイルアップロードイベント
    imageUpload1.addEventListener('change', function(e) {
        handleImageUpload(e.target.files[0], 1);
    });
    
    imageUpload2.addEventListener('change', function(e) {
        handleImageUpload(e.target.files[0], 2);
    });
    
    // URL取得ボタンクリック
    fetchUrl1Btn.addEventListener('click', function() {
        fetchImageFromUrl(imageUrl1.value, 1);
    });
    
    fetchUrl2Btn.addEventListener('click', function() {
        fetchImageFromUrl(imageUrl2.value, 2);
    });
    
    // 比較ボタンクリック
    compareBtn.addEventListener('click', function() {
        if (image1Data && image2Data) {
            showComparisonView();
            updateAnalysis();
        }
    });
    
    // ダウンロードボタンクリック
    downloadBtn.addEventListener('click', function() {
        downloadComparison();
    });
    
    // 共有ボタンクリック
    shareBtn.addEventListener('click', function() {
        shareComparison();
    });
    
    // 比較タイプ変更
    compareSideRadio.addEventListener('change', updateComparisonView);
    compareSliderRadio.addEventListener('change', updateComparisonView);
    compareOverlayRadio.addEventListener('change', updateComparisonView);
    
    // オプション変更イベント
    displaySizeSelect.addEventListener('change', updateImageSize);
    showGridCheck.addEventListener('change', updateGridVisibility);
    showHistogramCheck.addEventListener('change', updateHistogramVisibility);
    showMetadataCheck.addEventListener('change', updateMetadataVisibility);
    gridRowsInput.addEventListener('change', updateGrid);
    gridColsInput.addEventListener('change', updateGrid);
    gridGoldenRatioCheck.addEventListener('change', updateGrid);
    
    // オーバーレイモード変更
    overlayNormalRadio.addEventListener('change', updateOverlayMode);
    overlayDifferenceRadio.addEventListener('change', updateOverlayMode);
    overlayBlendRadio.addEventListener('change', updateOverlayMode);
    
    // 不透明度スライダー
    opacitySlider.addEventListener('input', function() {
        const opacity = this.value;
        opacityValue.textContent = opacity;
        overlayImage2.style.opacity = opacity / 100;
    });
    
    // スライダードラッグ機能
    let isDragging = false;
    
    sliderDivisor.addEventListener('mousedown', function(e) {
        isDragging = true;
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const sliderWrapper = document.querySelector('.slider-wrapper');
        const rect = sliderWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        
        // スライダーの位置を制限
        const position = Math.max(0, Math.min(width, x));
        const percentage = (position / width) * 100;
        
        sliderDivisor.style.left = `${percentage}%`;
        sliderImage1.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
    
    /**
     * 画像アップロードを処理する
     */
    function handleImageUpload(file, imageNumber) {
        if (!file || !file.type.match('image.*')) {
            alert('画像ファイルを選択してください');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = {
                src: e.target.result,
                name: file.name,
                size: file.size,
                type: file.type
            };
            
            if (imageNumber === 1) {
                image1Data = imageData;
            } else {
                image2Data = imageData;
            }
            
            updateCompareButtonState();
        };
        reader.readAsDataURL(file);
    }
    
    /**
     * URLから画像を取得する
     */
    function fetchImageFromUrl(url, imageNumber) {
        if (!url) {
            alert('URLを入力してください');
            return;
        }
        
        // CORS制限があるため、実際のアプリではプロキシサーバーを使用する必要があります
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
                const imageData = {
                    src: dataUrl,
                    name: url.split('/').pop(),
                    size: null,
                    type: 'image/png'
                };
                
                if (imageNumber === 1) {
                    image1Data = imageData;
                    imageUrl1.value = url;
                } else {
                    image2Data = imageData;
                    imageUrl2.value = url;
                }
                
                updateCompareButtonState();
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
     * 比較ボタンの状態を更新する
     */
    function updateCompareButtonState() {
        compareBtn.disabled = !(image1Data && image2Data);
    }
    
    /**
     * 比較ビューを表示する
     */
    function showComparisonView() {
        noImagesDiv.classList.add('d-none');
        updateComparisonView();
        
        // ダウンロードと共有ボタンを有効化
        downloadBtn.disabled = false;
        shareBtn.disabled = false;
        
        // 分析コンテナを表示
        analysisContainer.classList.remove('d-none');
    }
    
    /**
     * 比較ビューを更新する
     */
    function updateComparisonView() {
        // すべてのビューを非表示
        sideBySideView.classList.add('d-none');
        sliderView.classList.add('d-none');
        overlayView.classList.add('d-none');
        
        // 選択されたビューを表示
        if (compareSideRadio.checked) {
            sideBySideView.classList.remove('d-none');
            updateSideBySideView();
        } else if (compareSliderRadio.checked) {
            sliderView.classList.remove('d-none');
            updateSliderView();
        } else if (compareOverlayRadio.checked) {
            overlayView.classList.remove('d-none');
            updateOverlayView();
        }
        
        // グリッドを更新
        updateGrid();
    }
    
    /**
     * 横並びビューを更新する
     */
    function updateSideBySideView() {
        if (!image1Data || !image2Data) return;
        
        sideImage1.src = image1Data.src;
        sideImage2.src = image2Data.src;
        
        sideLabel1.textContent = label1Input.value || '画像1';
        sideLabel2.textContent = label2Input.value || '画像2';
    }
    
    /**
     * スライダービューを更新する
     */
    function updateSliderView() {
        if (!image1Data || !image2Data) return;
        
        sliderImage1.src = image1Data.src;
        sliderImage2.src = image2Data.src;
        
        sliderLabel1.textContent = label1Input.value || '画像1';
        sliderLabel2.textContent = label2Input.value || '画像2';
        
        // スライダーを中央に設定
        sliderDivisor.style.left = '50%';
        sliderImage1.style.clipPath = 'inset(0 50% 0 0)';
    }
    
    /**
     * オーバーレイビューを更新する
     */
    function updateOverlayView() {
        if (!image1Data || !image2Data) return;
        
        overlayImage1.src = image1Data.src;
        overlayImage2.src = image2Data.src;
        
        const label1 = label1Input.value || '画像1';
        const label2 = label2Input.value || '画像2';
        overlayLabel.textContent = `${label1} + ${label2}`;
        
        // 不透明度を設定
        const opacity = opacitySlider.value;
        overlayImage2.style.opacity = opacity / 100;
        
        // オーバーレイモードを更新
        updateOverlayMode();
    }
    
    /**
     * オーバーレイモードを更新する
     */
    function updateOverlayMode() {
        if (!overlayImage2) return;
        
        if (overlayNormalRadio.checked) {
            overlayImage2.style.mixBlendMode = 'normal';
        } else if (overlayDifferenceRadio.checked) {
            overlayImage2.style.mixBlendMode = 'difference';
        } else if (overlayBlendRadio.checked) {
            overlayImage2.style.mixBlendMode = 'multiply';
        }
    }
    
    /**
     * 画像サイズを更新する
     */
    function updateImageSize() {
        const size = displaySizeSelect.value;
        let maxWidth;
        
        switch (size) {
            case 'small':
                maxWidth = '500px';
                break;
            case 'medium':
                maxWidth = '800px';
                break;
            case 'large':
                maxWidth = '1200px';
                break;
            case 'original':
                maxWidth = 'none';
                break;
            default:
                maxWidth = '800px';
        }
        
        // 各ビューのコンテナサイズを更新
        document.querySelectorAll('.image-wrapper, .slider-container, .overlay-container').forEach(container => {
            container.style.maxWidth = maxWidth;
        });
    }
    
    /**
     * グリッドの表示/非表示を更新する
     */
    function updateGridVisibility() {
        const showGrid = showGridCheck.checked;
        
        document.querySelectorAll('.grid-overlay').forEach(grid => {
            grid.style.display = showGrid ? 'block' : 'none';
        });
        
        if (showGrid) {
            updateGrid();
        }
    }
    
    /**
     * グリッドを更新する
     */
    function updateGrid() {
        const rows = parseInt(gridRowsInput.value) || 3;
        const cols = parseInt(gridColsInput.value) || 3;
        const showGoldenRatio = gridGoldenRatioCheck.checked;
        
        // すべてのグリッドをクリア
        document.querySelectorAll('.grid-overlay').forEach(grid => {
            grid.innerHTML = '';
        });
        
        if (!showGridCheck.checked) return;
        
        // 通常のグリッド線を追加
        document.querySelectorAll('.grid-overlay').forEach(grid => {
            // 水平線
            for (let i = 1; i < rows; i++) {
                const percent = (i / rows) * 100;
                const line = document.createElement('div');
                line.className = 'grid-line grid-line-h';
                line.style.top = `${percent}%`;
                grid.appendChild(line);
            }
            
            // 垂直線
            for (let i = 1; i < cols; i++) {
                const percent = (i / cols) * 100;
                const line = document.createElement('div');
                line.className = 'grid-line grid-line-v';
                line.style.left = `${percent}%`;
                grid.appendChild(line);
            }
            
            // 黄金比のグリッド線
            if (showGoldenRatio) {
                // 水平黄金比 (約0.618)
                const goldenH1 = document.createElement('div');
                goldenH1.className = 'grid-line grid-line-h grid-line-golden';
                goldenH1.style.top = '38.2%';
                grid.appendChild(goldenH1);
                
                const goldenH2 = document.createElement('div');
                goldenH2.className = 'grid-line grid-line-h grid-line-golden';
                goldenH2.style.top = '61.8%';
                grid.appendChild(goldenH2);
                
                // 垂直黄金比
                const goldenV1 = document.createElement('div');
                goldenV1.className = 'grid-line grid-line-v grid-line-golden';
                goldenV1.style.left = '38.2%';
                grid.appendChild(goldenV1);
                
                const goldenV2 = document.createElement('div');
                goldenV2.className = 'grid-line grid-line-v grid-line-golden';
                goldenV2.style.left = '61.8%';
                grid.appendChild(goldenV2);
            }
        });
    }
    
    /**
     * ヒストグラムの表示/非表示を更新する
     */
    function updateHistogramVisibility() {
        const showHistogram = showHistogramCheck.checked;
        
        if (showHistogram) {
            document.getElementById('histogram-tab').click();
            drawHistograms();
        }
    }
    
    /**
     * メタデータの表示/非表示を更新する
     */
    function updateMetadataVisibility() {
        const showMetadata = showMetadataCheck.checked;
        
        if (showMetadata) {
            document.getElementById('metadata-tab').click();
            updateMetadata();
        }
    }
    
    /**
     * 分析情報を更新する
     */
    function updateAnalysis() {
        updateMetadata();
        drawHistograms();
        generateDifferenceMap();
    }
    
    /**
     * メタデータを更新する
     */
    function updateMetadata() {
        if (!image1Data || !image2Data) return;
        
        // 画像1のメタデータ
        const metadata1 = document.getElementById('metadata-1');
        metadata1.innerHTML = '';
        
        addMetadataRow(metadata1, '解像度', '1024 x 1024 px'); // 実際には画像から取得
        addMetadataRow(metadata1, 'アスペクト比', '1:1');
        addMetadataRow(metadata1, 'ファイルサイズ', formatFileSize(image1Data.size || 2500000));
        addMetadataRow(metadata1, 'フォーマット', image1Data.type ? image1Data.type.split('/')[1].toUpperCase() : 'PNG');
        
        // 画像2のメタデータ
        const metadata2 = document.getElementById('metadata-2');
        metadata2.innerHTML = '';
        
        addMetadataRow(metadata2, '解像度', '1024 x 1024 px'); // 実際には画像から取得
        addMetadataRow(metadata2, 'アスペクト比', '1:1');
        addMetadataRow(metadata2, 'ファイルサイズ', formatFileSize(image2Data.size || 2100000));
        addMetadataRow(metadata2, 'フォーマット', image2Data.type ? image2Data.type.split('/')[1].toUpperCase() : 'PNG');
    }
    
    /**
     * メタデータ行を追加する
     */
    function addMetadataRow(container, label, value) {
        const row = document.createElement('tr');
        
        const th = document.createElement('th');
        th.textContent = label;
        
        const td = document.createElement('td');
        td.textContent = value;
        
        row.appendChild(th);
        row.appendChild(td);
        container.appendChild(row);
    }
    
    /**
     * ヒストグラムを描画する
     */
    function drawHistograms() {
        if (!histogram1Canvas || !histogram2Canvas) return;
        
        // 既存のチャートを破棄
        if (histogram1Chart) histogram1Chart.destroy();
        if (histogram2Chart) histogram2Chart.destroy();
        
        // モックデータ
        const redData1 = Array.from({length: 256}, () => Math.floor(Math.random() * 100));
        const greenData1 = Array.from({length: 256}, () => Math.floor(Math.random() * 100));
        const blueData1 = Array.from({length: 256}, () => Math.floor(Math.random() * 100));
        
        const redData2 = Array.from({length: 256}, () => Math.floor(Math.random() * 100));
        const greenData2 = Array.from({length: 256}, () => Math.floor(Math.random() * 100));
        const blueData2 = Array.from({length: 256}, () => Math.floor(Math.random() * 100));
        
        // 表示用にデータを間引く
        const step = 8;
        const labels = Array.from({length: 256/step}, (_, i) => i * step);
        
        const redSampled1 = Array.from({length: 256/step}, (_, i) => redData1[i * step]);
        const greenSampled1 = Array.from({length: 256/step}, (_, i) => greenData1[i * step]);
        const blueSampled1 = Array.from({length: 256/step}, (_, i) => blueData1[i * step]);
        
        const redSampled2 = Array.from({length: 256/step}, (_, i) => redData2[i * step]);
        const greenSampled2 = Array.from({length: 256/step}, (_, i) => greenData2[i * step]);
        const blueSampled2 = Array.from({length: 256/step}, (_, i) => blueData2[i * step]);
        
        // ヒストグラム1を描画
        histogram1Chart = new Chart(histogram1Canvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'R',
                        data: redSampled1,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 1,
                        pointRadius: 0,
                        fill: true
                    },
                    {
                        label: 'G',
                        data: greenSampled1,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1,
                        pointRadius: 0,
                        fill: true
                    },
                    {
                        label: 'B',
                        data: blueSampled1,
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
        
        // ヒストグラム2を描画
        histogram2Chart = new Chart(histogram2Canvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'R',
                        data: redSampled2,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 1,
                        pointRadius: 0,
                        fill: true
                    },
                    {
                        label: 'G',
                        data: greenSampled2,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1,
                        pointRadius: 0,
                        fill: true
                    },
                    {
                        label: 'B',
                        data: blueSampled2,
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
     * 差分マップを生成する
     */
    function generateDifferenceMap() {
        // 実際のアプリでは2つの画像を比較して差分マップを生成しますが、
        // このデモではダミー画像を使用します
        const differenceMap = document.getElementById('difference-map');
        
        // ダミーの差分マップ画像URL (実際のアプリでは動的に生成)
        const dummyDifferenceMapUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAD8klEQVR4nO3UMQEAIAzAMMC/5yFjRxMFfXpnZg5A4P5dAMAVwwIShoUkDAtJGBaSMCwkYVhIwrCQhGEhCcNCEoaFJAwLSRgWkjAsJGFYSMKwkIRhIQnDQhKGhSQMC0kYFpIwLCRhWEjCsJCEYSEJw0IShoUkDAtJGBaSMCwkYVhIwrCQhGEhCcNCEoaFJAwLSRgWkjAsJGFYSMKwkIRhIQnDQhKGhSQMC0kYFpIwLCRhWEjCsJCEYSEJw0IShoUkDAtJGBaSMCwkYVhIwrCQhGEhCcNCEoaFJAwLSRgWkjAsJGFYSMKwkIRhIQnDQhKGhSQMC0kYFpIwLCRhWEjCsJCEYSEJw0IShoUkDAtJGBaSMCwkYVhIwrCQhGEhCcNCEoaFJAwLSRgWkjAsJGFYSMKwkIRhIQnDQhKGhSQMC0kYFpIwLCRhWEjCsJCEYSEJw0IShoUkDAtJGBaSMCwkYVhIwrCQhGEhCcNCEoaFJAwLSRgWkjAsJGFYSMKwkIRhIQnDQhKGhSQMC0kYFpIwLCRhWEjCsJCEYSEJw0IShoUkDAtJGBaSMCwkYVhIwrCQhGEhCcNCEoaFJAwLSRgWkjAsJGFYSMKwkIRhIQnDQhKGhSQMC0kYFpIwLCRhWEjCsJCEYSEJw0IShoUkDAtJGBaSMCwkYVhIwrCQhGEhCcNCEoaFJAwLSRgWkjAsJGFYSMKwkIRhIQnDQhKGhSQMC0kYFpIwLCRhWEjCsJCEYSEJw0IShoUkDAtJGBaSMCwkYVhIwrCQhGEhCcNCEoaFJAwLSRgWkjAsJGFYSMKwkIRhIQnDQhKGhSQMC0kYFpIwLCRhWEjCsJCEYSEJw0IShoUkDAtJGBaSMCwkYVhIwrCQhGEhCcNCEoaFJAwLSRgWkjAsJGFYSMKwkIRhIQnDQhKGhSQMC0kYFpIwLCRhWEjCsJCEYSEJw0IShoUkDAtJGBaSMCwkYVhIwrCQhGEhCcNCEoaFJAwLSRgWkjAsJGFYSMKwkIRhIQnDQhKGhSQMC0kYFpIwLCRhWEjCsJCEYSEJw0IShoUkDAtJGBaSMCwkYVhIwrCQhGEhCcNCEoaFJAwLSRgWkjAsJGFYSMKwkIRhIQnDQhKGhSQMC0kYFpIwLCRhWEjCsJCEYSEJw0IShoUkDAtJGBaSMCwkYVhIwrCQhGEhCcNCEoaFJAwLSRgWkjAsJGFYSMKwkIRhIQnDQhKGhSQMC0kYFpIwLCRhWEjCsJCEYSEJw0IShoUkDAtJGBaSMCwkYVhIwrCQhGEhCcNCEoaFJAwLSRgWkjAsJGFYSMKwkIRhIQnDQhKGhSQMC0kYFpIwLCRhWEjCsJCEYSEJw0IShoUkDAtJGBaSMCwkYVhIwrCQhGEhCcNCEoaFJAwLSRgWkjAsJGFYSMKwkIRhIQnDQhKGhSQeWecFRlZXYCgAAAAASUVORK5CYII=';
        
        differenceMap.src = dummyDifferenceMapUrl;
    }
    
    /**
     * 比較結果をダウンロードする
     */
    function downloadComparison() {
        // 実際のアプリでは現在の比較ビューをキャプチャして画像としてダウンロードします
        alert('この機能はデモ版では利用できません。実際のアプリでは比較結果をダウンロードできます。');
    }
    
    /**
     * 比較結果を共有する
     */
    function shareComparison() {
        // 実際のアプリでは共有機能を実装します
        alert('この機能はデモ版では利用できません。実際のアプリでは比較結果を共有できます。');
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
    
    // 初期化
    updateGridVisibility();
    updateImageSize();
});
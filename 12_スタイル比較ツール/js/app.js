// スタイル比較ツール用JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 要素の取得
    const generateBtn = document.getElementById('generate-btn');
    const basePrompt = document.getElementById('base-prompt');
    const styleInputs = document.querySelectorAll('.style-input');
    const promptsContainer = document.getElementById('prompts-container');
    const imageUploads = document.querySelectorAll('.image-upload');
    
    // プロンプト生成ボタンのイベントリスナー
    generateBtn.addEventListener('click', generatePrompts);
    
    // 画像アップロードのイベントリスナー
    imageUploads.forEach(upload => {
        upload.addEventListener('change', handleImageUpload);
    });
    
    /**
     * スタイル別のプロンプトを生成する関数
     */
    function generatePrompts() {
        const basePromptText = basePrompt.value.trim();
        
        if (!basePromptText) {
            alert('基本プロンプトを入力してください');
            return;
        }
        
        // プロンプトコンテナをクリア
        promptsContainer.innerHTML = '';
        
        // 各スタイルに対してプロンプトを生成
        styleInputs.forEach((input, index) => {
            const styleText = input.value.trim();
            if (!styleText) return; // スタイルが入力されていない場合はスキップ
            
            // スタイル番号（1から始まる）
            const styleNumber = index + 1;
            
            // プロンプトを生成
            const prompt = `${basePromptText}, ${styleText}`;
            
            // プロンプト表示用の要素を作成
            const promptCol = document.createElement('div');
            promptCol.className = 'col-md-6 col-lg-3 mb-3';
            
            const promptCard = document.createElement('div');
            promptCard.className = 'prompt-card';
            
            const promptHeader = document.createElement('h3');
            promptHeader.className = 'h6';
            promptHeader.textContent = `スタイル${styleNumber}: ${styleText}`;
            
            const promptText = document.createElement('div');
            promptText.className = 'prompt-text';
            promptText.textContent = prompt;
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'btn btn-sm btn-outline-secondary copy-btn';
            copyBtn.textContent = 'コピー';
            copyBtn.addEventListener('click', () => {
                copyToClipboard(prompt);
                copyBtn.textContent = 'コピー済み';
                setTimeout(() => {
                    copyBtn.textContent = 'コピー';
                }, 2000);
            });
            
            // 要素を組み立て
            promptCard.appendChild(promptHeader);
            promptCard.appendChild(promptText);
            promptCard.appendChild(copyBtn);
            promptCol.appendChild(promptCard);
            promptsContainer.appendChild(promptCol);
            
            // スタイルラベルを更新
            updateStyleLabel(styleNumber, styleText);
        });
    }
    
    /**
     * スタイルラベルを更新する関数
     */
    function updateStyleLabel(styleNumber, styleText) {
        const styleLabels = document.querySelectorAll('.style-label');
        if (styleLabels[styleNumber - 1]) {
            styleLabels[styleNumber - 1].textContent = `スタイル${styleNumber}: ${styleText}`;
        }
    }
    
    /**
     * テキストをクリップボードにコピーする関数
     */
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('クリップボードへのコピーに失敗しました:', err);
        });
    }
    
    /**
     * 画像アップロードを処理する関数
     */
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            alert('画像ファイルを選択してください');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const uploadArea = event.target.closest('.image-upload-area');
            
            // 既存の画像があれば削除
            const existingImg = uploadArea.querySelector('img');
            if (existingImg) {
                existingImg.remove();
            }
            
            // プレースホルダーを非表示
            const placeholder = uploadArea.querySelector('.upload-placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            
            // 画像を表示
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'uploaded-image';
            uploadArea.appendChild(img);
            
            // 画像クリックで拡大表示
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                showFullscreen(e.target.src);
            });
        };
        
        reader.readAsDataURL(file);
    }
    
    /**
     * 画像をフルスクリーン表示する関数
     */
    function showFullscreen(src) {
        // フルスクリーンオーバーレイがなければ作成
        let overlay = document.querySelector('.fullscreen-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'fullscreen-overlay';
            
            const closeBtn = document.createElement('div');
            closeBtn.className = 'close-fullscreen';
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', () => {
                overlay.style.display = 'none';
            });
            
            const img = document.createElement('img');
            img.className = 'fullscreen-image';
            
            overlay.appendChild(closeBtn);
            overlay.appendChild(img);
            document.body.appendChild(overlay);
            
            // オーバーレイクリックで閉じる
            overlay.addEventListener('click', function() {
                this.style.display = 'none';
            });
        }
        
        // 画像を設定して表示
        const fullscreenImg = overlay.querySelector('.fullscreen-image');
        fullscreenImg.src = src;
        overlay.style.display = 'flex';
    }
});
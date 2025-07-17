// プロンプト履歴管理システム用JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // モーダル要素
    const promptDetailModal = new bootstrap.Modal(document.getElementById('prompt-detail-modal'));
    const promptEditModal = new bootstrap.Modal(document.getElementById('prompt-edit-modal'));
    
    // ボタン要素
    const addPromptBtn = document.getElementById('add-prompt-btn');
    const editPromptBtn = document.getElementById('edit-prompt-btn');
    const savePromptBtn = document.getElementById('save-prompt-btn');
    const searchBtn = document.getElementById('search-btn');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    const importBtn = document.getElementById('import-btn');
    const exportBtn = document.getElementById('export-btn');
    
    // フォーム要素
    const searchInput = document.getElementById('search-input');
    const dateFrom = document.getElementById('date-from');
    const dateTo = document.getElementById('date-to');
    const tagFilters = document.getElementById('tag-filters');
    const promptList = document.getElementById('prompt-list');
    const ratingInputs = document.querySelectorAll('#edit-rating i');
    
    // サンプルデータ
    let prompts = [
        {
            id: 1,
            text: 'beautiful landscape with mountains, sunset lighting, dramatic sky, 8k, detailed --ar 16:9',
            date: '2025-07-15',
            tags: ['風景', '山', '夕暮れ'],
            rating: 4,
            notes: '山の風景がとても美しく出力された。夕暮れの光の表現が素晴らしい。',
            images: ['https://via.placeholder.com/300x200?text=Mountain+Sunset']
        },
        {
            id: 2,
            text: 'cyberpunk city street, neon lights, rainy night, futuristic architecture, detailed, 8k --ar 16:9',
            date: '2025-07-14',
            tags: ['SF', 'サイバーパンク', '都市'],
            rating: 5,
            notes: 'ネオンの表現が素晴らしい。雨の表現も良い。',
            images: ['https://via.placeholder.com/300x200?text=Cyberpunk+City']
        },
        {
            id: 3,
            text: 'portrait of a young woman, soft lighting, bokeh background, photorealistic, 8k --ar 4:5',
            date: '2025-07-10',
            tags: ['ポートレート', '女性'],
            rating: 3,
            notes: '顔の表情が少し不自然。光の表現は良い。',
            images: ['https://via.placeholder.com/300x200?text=Portrait']
        }
    ];
    
    // ローカルストレージからデータを読み込む
    function loadData() {
        const storedPrompts = localStorage.getItem('midjourneyPrompts');
        if (storedPrompts) {
            prompts = JSON.parse(storedPrompts);
        }
        
        renderPromptList();
        updateStatistics();
        updateTagFilters();
    }
    
    // データをローカルストレージに保存
    function saveData() {
        localStorage.setItem('midjourneyPrompts', JSON.stringify(prompts));
    }
    
    // プロンプトリストを表示
    function renderPromptList(filteredPrompts = null) {
        const displayPrompts = filteredPrompts || prompts;
        promptList.innerHTML = '';
        
        if (displayPrompts.length === 0) {
            promptList.innerHTML = '<tr><td colspan="5" class="text-center py-3">プロンプトがありません</td></tr>';
            return;
        }
        
        displayPrompts.forEach(prompt => {
            const row = document.createElement('tr');
            row.className = 'fade-in';
            
            // 日付
            const dateCell = document.createElement('td');
            dateCell.textContent = formatDate(prompt.date);
            
            // プロンプト
            const promptCell = document.createElement('td');
            const promptText = document.createElement('div');
            promptText.className = 'prompt-text';
            promptText.textContent = prompt.text;
            promptCell.appendChild(promptText);
            
            // タグ
            const tagCell = document.createElement('td');
            prompt.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'tag';
                tagSpan.textContent = tag;
                tagCell.appendChild(tagSpan);
            });
            
            // 評価
            const ratingCell = document.createElement('td');
            ratingCell.innerHTML = generateRatingStars(prompt.rating);
            
            // 操作ボタン
            const actionCell = document.createElement('td');
            
            const viewBtn = document.createElement('button');
            viewBtn.className = 'btn btn-sm btn-outline-secondary me-1';
            viewBtn.innerHTML = '<i class="bi bi-eye"></i>';
            viewBtn.addEventListener('click', () => showPromptDetail(prompt.id));
            
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-outline-primary me-1';
            editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
            editBtn.addEventListener('click', () => showEditPrompt(prompt.id));
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
            deleteBtn.addEventListener('click', () => deletePrompt(prompt.id));
            
            actionCell.appendChild(viewBtn);
            actionCell.appendChild(editBtn);
            actionCell.appendChild(deleteBtn);
            
            // 行に追加
            row.appendChild(dateCell);
            row.appendChild(promptCell);
            row.appendChild(tagCell);
            row.appendChild(ratingCell);
            row.appendChild(actionCell);
            
            promptList.appendChild(row);
        });
    }
    
    // 統計情報を更新
    function updateStatistics() {
        document.getElementById('total-prompts').textContent = prompts.length;
        
        // 今月のプロンプト数
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const monthlyCount = prompts.filter(prompt => {
            const promptDate = new Date(prompt.date);
            return promptDate.getMonth() === currentMonth && promptDate.getFullYear() === currentYear;
        }).length;
        
        document.getElementById('monthly-prompts').textContent = monthlyCount;
        
        // よく使うキーワード
        const keywords = {};
        prompts.forEach(prompt => {
            const words = prompt.text.toLowerCase().split(/\s+/);
            words.forEach(word => {
                if (word.length > 3) { // 短すぎる単語は除外
                    keywords[word] = (keywords[word] || 0) + 1;
                }
            });
        });
        
        const topKeywords = Object.entries(keywords)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        const topKeywordsContainer = document.getElementById('top-keywords');
        topKeywordsContainer.innerHTML = '';
        
        topKeywords.forEach(([keyword, count]) => {
            const keywordSpan = document.createElement('span');
            keywordSpan.className = 'tag';
            keywordSpan.textContent = `${keyword} (${count})`;
            topKeywordsContainer.appendChild(keywordSpan);
        });
    }
    
    // タグフィルターを更新
    function updateTagFilters() {
        const allTags = new Set();
        prompts.forEach(prompt => {
            prompt.tags.forEach(tag => allTags.add(tag));
        });
        
        tagFilters.innerHTML = '';
        
        Array.from(allTags).sort().forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag filter-badge';
            tagSpan.textContent = tag;
            tagSpan.dataset.tag = tag;
            
            tagSpan.addEventListener('click', function() {
                this.classList.toggle('active');
                applyFilters();
            });
            
            tagFilters.appendChild(tagSpan);
        });
    }
    
    // フィルターを適用
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const fromDate = dateFrom.value;
        const toDate = dateTo.value;
        const activeTags = Array.from(document.querySelectorAll('#tag-filters .tag.active'))
            .map(tag => tag.dataset.tag);
        
        const filtered = prompts.filter(prompt => {
            // 検索語でフィルター
            if (searchTerm && !prompt.text.toLowerCase().includes(searchTerm)) {
                return false;
            }
            
            // 日付範囲でフィルター
            if (fromDate && prompt.date < fromDate) {
                return false;
            }
            if (toDate && prompt.date > toDate) {
                return false;
            }
            
            // タグでフィルター
            if (activeTags.length > 0) {
                return activeTags.some(tag => prompt.tags.includes(tag));
            }
            
            return true;
        });
        
        renderPromptList(filtered);
    }
    
    // プロンプト詳細を表示
    function showPromptDetail(id) {
        const prompt = prompts.find(p => p.id === id);
        if (!prompt) return;
        
        document.getElementById('detail-prompt').value = prompt.text;
        document.getElementById('detail-date').textContent = formatDate(prompt.date);
        document.getElementById('detail-rating').innerHTML = generateRatingStars(prompt.rating);
        
        const detailTags = document.getElementById('detail-tags');
        detailTags.innerHTML = '';
        prompt.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag';
            tagSpan.textContent = tag;
            detailTags.appendChild(tagSpan);
        });
        
        document.getElementById('detail-notes').textContent = prompt.notes || '特になし';
        
        const detailImages = document.getElementById('detail-images');
        detailImages.innerHTML = '';
        
        if (prompt.images && prompt.images.length > 0) {
            prompt.images.forEach(image => {
                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-4 mb-3';
                
                const img = document.createElement('img');
                img.src = image;
                img.className = 'img-fluid detail-image';
                img.alt = 'Generated image';
                
                col.appendChild(img);
                detailImages.appendChild(col);
            });
        } else {
            detailImages.innerHTML = '<p class="text-muted">画像がありません</p>';
        }
        
        promptDetailModal.show();
    }
    
    // プロンプト編集画面を表示
    function showEditPrompt(id = null) {
        const modalTitle = document.getElementById('edit-modal-title');
        const promptIdInput = document.getElementById('edit-prompt-id');
        const promptTextInput = document.getElementById('edit-prompt-text');
        const tagsInput = document.getElementById('edit-tags');
        const ratingInput = document.getElementById('edit-rating-value');
        const notesInput = document.getElementById('edit-notes');
        const imagePreview = document.getElementById('image-preview');
        
        // フォームをリセット
        document.getElementById('prompt-form').reset();
        imagePreview.innerHTML = '';
        resetRatingStars();
        
        if (id) {
            // 編集モード
            const prompt = prompts.find(p => p.id === id);
            if (!prompt) return;
            
            modalTitle.textContent = 'プロンプト編集';
            promptIdInput.value = prompt.id;
            promptTextInput.value = prompt.text;
            tagsInput.value = prompt.tags.join(', ');
            setRatingStars(prompt.rating);
            notesInput.value = prompt.notes || '';
            
            // 画像プレビュー
            if (prompt.images && prompt.images.length > 0) {
                prompt.images.forEach(image => {
                    addImagePreview(image);
                });
            }
        } else {
            // 新規追加モード
            modalTitle.textContent = 'プロンプト追加';
            promptIdInput.value = '';
            setRatingStars(0);
        }
        
        promptEditModal.show();
    }
    
    // プロンプトを保存
    function savePrompt() {
        const id = document.getElementById('edit-prompt-id').value;
        const text = document.getElementById('edit-prompt-text').value.trim();
        const tagsText = document.getElementById('edit-tags').value;
        const rating = parseInt(document.getElementById('edit-rating-value').value) || 0;
        const notes = document.getElementById('edit-notes').value.trim();
        
        if (!text) {
            alert('プロンプトを入力してください');
            return;
        }
        
        // タグを配列に変換
        const tags = tagsText.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
        
        // 画像URLを取得
        const imageElements = document.querySelectorAll('#image-preview img');
        const images = Array.from(imageElements).map(img => img.src);
        
        if (id) {
            // 既存プロンプトの更新
            const index = prompts.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                prompts[index] = {
                    ...prompts[index],
                    text,
                    tags,
                    rating,
                    notes,
                    images
                };
            }
        } else {
            // 新規プロンプトの追加
            const newId = prompts.length > 0 ? Math.max(...prompts.map(p => p.id)) + 1 : 1;
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            
            prompts.unshift({
                id: newId,
                text,
                date: today,
                tags,
                rating,
                notes,
                images
            });
        }
        
        saveData();
        renderPromptList();
        updateStatistics();
        updateTagFilters();
        promptEditModal.hide();
    }
    
    // プロンプトを削除
    function deletePrompt(id) {
        if (!confirm('このプロンプトを削除してもよろしいですか？')) {
            return;
        }
        
        const index = prompts.findIndex(p => p.id === id);
        if (index !== -1) {
            prompts.splice(index, 1);
            saveData();
            renderPromptList();
            updateStatistics();
            updateTagFilters();
        }
    }
    
    // 画像プレビューを追加
    function addImagePreview(src) {
        const imagePreview = document.getElementById('image-preview');
        
        const col = document.createElement('div');
        col.className = 'col-md-4 image-preview-item';
        
        const img = document.createElement('img');
        img.src = src;
        img.className = 'img-thumbnail';
        
        const removeBtn = document.createElement('div');
        removeBtn.className = 'remove-image';
        removeBtn.innerHTML = '&times;';
        removeBtn.addEventListener('click', function() {
            col.remove();
        });
        
        col.appendChild(img);
        col.appendChild(removeBtn);
        imagePreview.appendChild(col);
    }
    
    // 評価スターを生成
    function generateRatingStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="bi bi-star-fill"></i>';
            } else {
                stars += '<i class="bi bi-star"></i>';
            }
        }
        return `<div class="rating-stars">${stars}</div>`;
    }
    
    // 評価スターをリセット
    function resetRatingStars() {
        ratingInputs.forEach(star => {
            star.className = 'bi bi-star';
        });
        document.getElementById('edit-rating-value').value = 0;
    }
    
    // 評価スターを設定
    function setRatingStars(rating) {
        ratingInputs.forEach(star => {
            const starRating = parseInt(star.dataset.rating);
            if (starRating <= rating) {
                star.className = 'bi bi-star-fill active';
            } else {
                star.className = 'bi bi-star';
            }
        });
        document.getElementById('edit-rating-value').value = rating;
    }
    
    // 日付をフォーマット
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP');
    }
    
    // イベントリスナーの設定
    addPromptBtn.addEventListener('click', () => showEditPrompt());
    editPromptBtn.addEventListener('click', () => {
        const id = document.getElementById('detail-prompt').dataset.id;
        promptDetailModal.hide();
        showEditPrompt(parseInt(id));
    });
    savePromptBtn.addEventListener('click', savePrompt);
    searchBtn.addEventListener('click', applyFilters);
    clearFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        dateFrom.value = '';
        dateTo.value = '';
        document.querySelectorAll('#tag-filters .tag.active').forEach(tag => {
            tag.classList.remove('active');
        });
        renderPromptList();
    });
    
    // 評価スターのクリックイベント
    ratingInputs.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            setRatingStars(rating);
        });
    });
    
    // 画像アップロードイベント
    document.getElementById('edit-images').addEventListener('change', function(e) {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.match('image.*')) continue;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                addImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // インポート/エクスポート機能
    importBtn.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    if (Array.isArray(importedData)) {
                        prompts = importedData;
                        saveData();
                        loadData();
                        alert('データをインポートしました');
                    } else {
                        throw new Error('Invalid data format');
                    }
                } catch (error) {
                    alert('データの形式が正しくありません');
                    console.error(error);
                }
            };
            reader.readAsText(file);
        });
        
        input.click();
    });
    
    exportBtn.addEventListener('click', function() {
        const dataStr = JSON.stringify(prompts, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileName = 'midjourney-prompts-' + new Date().toISOString().split('T')[0] + '.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileName);
        linkElement.click();
    });
    
    // 初期データ読み込み
    loadData();
});
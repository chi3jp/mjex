// プロンプト生成Webアプリ用JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // 要素の取得
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const discordBtn = document.getElementById('discord-btn');
    const promptOutput = document.getElementById('prompt-output');
    const savedPrompts = document.getElementById('saved-prompts');
    const randomizeBtn = document.getElementById('randomize-btn');
    const advancedOptionsToggle = document.getElementById('advanced-options-toggle');
    const advancedOptions = document.getElementById('advanced-options');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const aspectRatioBtns = document.querySelectorAll('.aspect-ratio-btn');
    const randomSeedBtn = document.getElementById('random-seed-btn');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const exportPromptsBtn = document.getElementById('export-prompts-btn');
    const importPromptsBtn = document.getElementById('import-prompts-btn');

    // サンプルプロンプトボタン
    const useSampleBtns = document.querySelectorAll('.use-sample-btn');

    // プリセットデータ
    const presets = {
        landscape: {
            keywords: ['山', '海', '森', '湖', '滝', '砂漠', '雪景色', '夕暮れ', '朝焼け', '星空'],
            styles: ['photorealistic', 'oil painting', 'watercolor', 'digital art'],
            modifiers: ['dramatic lighting', 'fog', 'mist', 'golden hour', 'blue hour', 'panoramic view']
        },
        portrait: {
            keywords: ['女性', '男性', '子供', '老人', '笑顔', '真剣', '横顔', '上半身', '全身'],
            styles: ['photorealistic', 'cinematic', 'studio portrait', 'candid'],
            modifiers: ['soft lighting', 'dramatic lighting', 'bokeh background', 'shallow depth of field']
        },
        fantasy: {
            keywords: ['城', 'ドラゴン', '魔法使い', '妖精', 'エルフ', '騎士', '魔法', '異世界', 'ファンタジー生物'],
            styles: ['digital art', 'concept art', 'fantasy illustration', 'epic scene'],
            modifiers: ['magical atmosphere', 'mystical', 'ethereal lighting', 'epic scale']
        },
        scifi: {
            keywords: ['宇宙船', 'ロボット', 'サイバーパンク', '未来都市', '宇宙ステーション', 'エイリアン', '惑星', '宇宙'],
            styles: ['digital art', 'concept art', 'sci-fi illustration', 'futuristic'],
            modifiers: ['neon lights', 'holographic', 'futuristic technology', 'dystopian']
        },
        abstract: {
            keywords: ['パターン', '形状', '色彩', '動き', 'フラクタル', '幾何学', '抽象的'],
            styles: ['abstract art', 'digital art', 'generative art', 'minimalist'],
            modifiers: ['vibrant colors', 'flowing', 'dynamic composition', 'surreal']
        },
        anime: {
            keywords: ['少女', '少年', '戦士', '魔法少女', 'ロボット', '学校', '冒険', 'ファンタジー'],
            styles: ['anime style', 'manga style', 'studio ghibli', 'cel shaded'],
            modifiers: ['vibrant colors', 'dynamic pose', 'expressive', 'cute']
        },
        realistic: {
            keywords: ['静物', '風景', '人物', '動物', '建築物', '食べ物', '日常風景'],
            styles: ['photorealistic', 'hyperrealistic', 'documentary', 'still life'],
            modifiers: ['studio lighting', 'natural lighting', 'detailed textures', 'high definition']
        }
    };

    // 日本語から英語への変換辞書
    const translationDict = {
        // 一般的な被写体
        '山': 'mountain',
        '山の風景': 'mountain landscape',
        '美しい山の風景': 'beautiful mountain landscape',
        '海': 'ocean',
        '海の風景': 'ocean landscape',
        '森': 'forest',
        '森の風景': 'forest landscape',
        '都市': 'city',
        '都市の風景': 'cityscape',
        '夜の都市': 'night city',
        '女性': 'woman',
        '若い女性': 'young woman',
        '男性': 'man',
        '若い男性': 'young man',
        '子供': 'child',
        '少女': 'girl',
        '少年': 'boy',
        '動物': 'animal',
        '猫': 'cat',
        '犬': 'dog',
        '鳥': 'bird',
        '花': 'flower',
        '木': 'tree',
        '空': 'sky',
        '雲': 'cloud',
        '川': 'river',
        '湖': 'lake',
        '滝': 'waterfall',

        // ファンタジー要素
        'ファンタジー': 'fantasy',
        'ファンタジーの城': 'fantasy castle',
        'ドラゴン': 'dragon',
        '魔法': 'magic',
        '魔法使い': 'wizard',
        '妖精': 'fairy',
        'エルフ': 'elf',
        'ユニコーン': 'unicorn',
        '中世': 'medieval',

        // SF要素
        '未来': 'future',
        '未来都市': 'futuristic city',
        'サイバーパンク': 'cyberpunk',
        'ロボット': 'robot',
        '宇宙': 'space',
        '宇宙船': 'spaceship',
        '惑星': 'planet',
        '宇宙ステーション': 'space station',

        // アート・スタイル
        '抽象的': 'abstract',
        '抽象的なパターン': 'abstract pattern',
        '写実的': 'realistic',
        '写実的な静物': 'realistic still life',
        'アニメ': 'anime',
        'アニメキャラクター': 'anime character',
        '水彩画': 'watercolor',
        '油絵': 'oil painting',
        'スケッチ': 'sketch',
        '3Dレンダリング': '3D render',

        // 環境・背景
        '夕暮れ': 'sunset',
        '夜': 'night',
        '朝': 'morning',
        '雨': 'rain',
        '雪': 'snow',
        '霧': 'fog',
        '嵐': 'storm',
        '砂漠': 'desert',
        '熱帯': 'tropical',
        '北極': 'arctic',
        '都会': 'urban',
        '田舎': 'rural',
        '海岸': 'beach',
        '山頂': 'mountain peak',

        // 照明
        '自然光': 'natural lighting',
        'スタジオライト': 'studio lighting',
        'ドラマチック': 'dramatic lighting',
        '夕暮れの光': 'sunset lighting',
        'ネオン': 'neon lighting',
        'シネマティック': 'cinematic lighting',
        'ソフト': 'soft lighting',
        'バックライト': 'backlit',
        '月明かり': 'moonlight',

        // カメラ設定
        'ポートレートレンズ': 'portrait lens',
        '広角レンズ': 'wide angle lens',
        'マクロレンズ': 'macro lens',
        '望遠レンズ': 'telephoto lens',
        '魚眼レンズ': 'fisheye lens',
        '空撮': 'aerial view',
        'クローズアップ': 'close-up',
        'パノラマ': 'panoramic view',

        // 品質
        '高品質': 'high quality',
        '詳細': 'detailed',
        '非常に詳細': 'highly detailed',
        '8K': '8k',
        '4K': '4k',
        'HD': 'HD',
        'ウルトラHD': 'ultra HD',

        // 除外キーワード
        '低品質': 'low quality',
        'ぼやけた': 'blurry',
        '歪み': 'distortion',
        '不自然': 'unnatural',
        '異常': 'abnormal'
    };

    // ダークモード設定
    if (darkModeToggle) {
        // ローカルストレージからダークモード設定を読み込む
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        darkModeToggle.checked = isDarkMode;

        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }

        // ダークモード切り替え
        darkModeToggle.addEventListener('change', function () {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'false');
            }
        });
    }

    // 高度なオプションの表示/非表示
    if (advancedOptionsToggle && advancedOptions) {
        advancedOptionsToggle.addEventListener('click', function () {
            advancedOptions.classList.toggle('d-none');
            this.innerHTML = advancedOptions.classList.contains('d-none') ?
                '高度なオプションを表示 <i class="bi bi-chevron-down"></i>' :
                '高度なオプションを隠す <i class="bi bi-chevron-up"></i>';
        });
    }

    // カテゴリ選択時のサジェスト機能
    const categorySelect = document.getElementById('category');
    const mainSubjectInput = document.getElementById('main-subject');
    const suggestionsContainer = document.getElementById('subject-suggestions');

    if (categorySelect && mainSubjectInput && suggestionsContainer) {
        categorySelect.addEventListener('change', function () {
            updateSuggestions(this.value);
        });

        // 初期サジェスト表示
        updateSuggestions(categorySelect.value);

        // サジェスト機能
        function updateSuggestions(category) {
            if (!presets[category]) return;

            suggestionsContainer.innerHTML = '';

            presets[category].keywords.forEach(keyword => {
                const badge = document.createElement('span');
                badge.className = 'badge bg-light text-dark me-1 mb-1 suggestion-badge';
                badge.textContent = keyword;
                badge.style.cursor = 'pointer';

                badge.addEventListener('click', function () {
                    if (mainSubjectInput.value) {
                        mainSubjectInput.value += ', ' + keyword;
                    } else {
                        mainSubjectInput.value = keyword;
                    }
                });

                suggestionsContainer.appendChild(badge);
            });
        }
    }

    // アスペクト比ボタン
    aspectRatioBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const ratio = this.dataset.ratio;
            document.getElementById('aspect-ratio').value = ratio;

            // アクティブなボタンのスタイルを更新
            aspectRatioBtns.forEach(b => b.classList.remove('btn-primary'));
            aspectRatioBtns.forEach(b => b.classList.add('btn-outline-secondary'));
            this.classList.remove('btn-outline-secondary');
            this.classList.add('btn-primary');
        });
    });

    // ランダムシード生成
    if (randomSeedBtn) {
        randomSeedBtn.addEventListener('click', function () {
            document.getElementById('seed').value = Math.floor(Math.random() * 4294967295);
        });
    }

    // ランダムサジェスト機能
    if (randomizeBtn) {
        randomizeBtn.addEventListener('click', function () {
            const category = categorySelect.value;
            if (!presets[category]) return;

            // ランダムな被写体
            const randomSubject = getRandomItem(presets[category].keywords);
            mainSubjectInput.value = randomSubject;

            // ランダムなスタイル
            const styleCheckboxes = document.querySelectorAll('input[id^="style-"]');
            styleCheckboxes.forEach(checkbox => checkbox.checked = false);

            const randomStyle = getRandomItem(presets[category].styles);
            switch (randomStyle) {
                case 'photorealistic':
                case 'hyperrealistic':
                    document.getElementById('style-realistic').checked = true;
                    break;
                case 'anime style':
                case 'manga style':
                case 'studio ghibli':
                    document.getElementById('style-anime').checked = true;
                    break;
                case 'oil painting':
                case 'watercolor':
                case 'digital art':
                    document.getElementById('style-painting').checked = true;
                    break;
                case '3D render':
                    document.getElementById('style-3d').checked = true;
                    break;
            }

            // ランダムな環境
            const environmentInput = document.getElementById('environment');
            if (environmentInput) {
                environmentInput.value = getRandomItem(presets[category].modifiers);
            }

            // ランダムな照明
            const lightingSelect = document.getElementById('lighting');
            if (lightingSelect) {
                const lightingOptions = Array.from(lightingSelect.options).map(opt => opt.value);
                lightingSelect.value = getRandomItem(lightingOptions);
            }

            // ランダムなカメラ設定
            const cameraSelect = document.getElementById('camera');
            if (cameraSelect) {
                const cameraOptions = Array.from(cameraSelect.options).map(opt => opt.value);
                cameraSelect.value = getRandomItem(cameraOptions);
            }

            // ランダムなアスペクト比
            const aspectRatioSelect = document.getElementById('aspect-ratio');
            if (aspectRatioSelect) {
                const aspectOptions = Array.from(aspectRatioSelect.options).map(opt => opt.value);
                const randomAspect = getRandomItem(aspectOptions);
                aspectRatioSelect.value = randomAspect;

                // アスペクト比ボタンも更新
                aspectRatioBtns.forEach(btn => {
                    if (btn.dataset.ratio === randomAspect) {
                        btn.click();
                    }
                });
            }

            // ランダムな品質
            const qualityInput = document.getElementById('quality');
            if (qualityInput) {
                qualityInput.value = Math.floor(Math.random() * 5) + 1;
            }

            // 高度なオプションもランダム化
            if (!advancedOptions.classList.contains('d-none')) {
                // ランダムなバージョン
                const versionSelect = document.getElementById('version');
                if (versionSelect) {
                    const versionOptions = Array.from(versionSelect.options).map(opt => opt.value);
                    versionSelect.value = getRandomItem(versionOptions);
                }

                // ランダムなStylize値
                const stylizeInput = document.getElementById('stylize');
                if (stylizeInput) {
                    stylizeInput.value = Math.floor(Math.random() * 11) * 100;
                }

                // ランダムなChaos値
                const chaosInput = document.getElementById('chaos');
                if (chaosInput) {
                    chaosInput.value = Math.floor(Math.random() * 101);
                }

                // ランダムなSeed値
                const seedInput = document.getElementById('seed');
                if (seedInput) {
                    // 50%の確率でSeed値を設定
                    if (Math.random() > 0.5) {
                        seedInput.value = Math.floor(Math.random() * 4294967295);
                    } else {
                        seedInput.value = '';
                    }
                }
            }
        });

        function getRandomItem(array) {
            return array[Math.floor(Math.random() * array.length)];
        }
    }

    // サンプルプロンプトを使用
    useSampleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const samplePrompt = this.closest('.card').querySelector('.card-text').textContent;
            promptOutput.textContent = samplePrompt;

            // モーダルを閉じる
            const modal = bootstrap.Modal.getInstance(document.getElementById('examplesModal'));
            if (modal) modal.hide();

            // プロンプトを保存
            savePrompt(samplePrompt);
        });
    });

    // Discordボタン
    if (discordBtn) {
        discordBtn.addEventListener('click', function () {
            const prompt = promptOutput.textContent;
            if (prompt && prompt !== 'ここに生成されたプロンプトが表示されます') {
                // Midjourneyの公式Discordに移動
                window.open(`https://discord.com/channels/@me?draft=/imagine ${encodeURIComponent(prompt)}`, '_blank');
            } else {
                alert('先にプロンプトを生成してください');
            }
        });
    }

    // 英語変換トグル
    if (translateToggle) {
        translateToggle.addEventListener('change', function () {
            if (this.checked) {
                // 既にプロンプトが生成されている場合は英語版を表示
                const prompt = promptOutput.textContent;
                if (prompt && prompt !== 'ここに生成されたプロンプトが表示されます') {
                    translateToEnglish(prompt);
                    englishOutput.classList.remove('d-none');
                }
            } else {
                englishOutput.classList.add('d-none');
            }
        });
    }

    // プロンプト生成ボタンのイベントリスナー
    generateBtn.addEventListener('click', generatePrompt);

    // コピーボタンのイベントリスナー
    copyBtn.addEventListener('click', copyPromptToClipboard);

    // 履歴クリアボタン
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', function () {
            if (confirm('保存したプロンプト履歴をすべて削除してもよろしいですか？')) {
                localStorage.removeItem('savedPrompts');
                loadSavedPrompts();
            }
        });
    }

    // エクスポート機能
    if (exportPromptsBtn) {
        exportPromptsBtn.addEventListener('click', function () {
            const savedPromptsList = JSON.parse(localStorage.getItem('savedPrompts')) || [];
            if (savedPromptsList.length === 0) {
                alert('エクスポートするプロンプトがありません');
                return;
            }

            const dataStr = JSON.stringify(savedPromptsList, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

            const exportFileName = 'midjourney-prompts-' + new Date().toISOString().split('T')[0] + '.json';

            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileName);
            linkElement.click();
        });
    }

    // インポート機能
    if (importPromptsBtn) {
        importPromptsBtn.addEventListener('click', function () {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';

            input.addEventListener('change', function (e) {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function (e) {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        if (Array.isArray(importedData)) {
                            // 既存のプロンプトと結合
                            let savedPromptsList = JSON.parse(localStorage.getItem('savedPrompts')) || [];

                            // 重複を避けながら結合
                            importedData.forEach(importedPrompt => {
                                const promptText = typeof importedPrompt === 'string' ? importedPrompt : importedPrompt.text;
                                const exists = savedPromptsList.some(p => {
                                    const existingText = typeof p === 'string' ? p : p.text;
                                    return existingText === promptText;
                                });

                                if (!exists) {
                                    savedPromptsList.unshift(importedPrompt);
                                }
                            });

                            // 最大数を制限
                            if (savedPromptsList.length > 50) {
                                savedPromptsList = savedPromptsList.slice(0, 50);
                            }

                            localStorage.setItem('savedPrompts', JSON.stringify(savedPromptsList));
                            loadSavedPrompts();
                            alert('プロンプトをインポートしました');
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
    }

    // ローカルストレージからプロンプトを読み込む
    loadSavedPrompts();

    /**
     * プロンプトを生成する関数
     */
    function generatePrompt() {
        // 各入力値を取得
        const category = document.getElementById('category').value;
        const mainSubject = document.getElementById('main-subject').value;
        const environment = document.getElementById('environment').value;
        const lighting = document.getElementById('lighting').value;
        const camera = document.getElementById('camera').value;
        const additional = document.getElementById('additional').value;
        const negative = document.getElementById('negative').value;
        const aspectRatio = document.getElementById('aspect-ratio').value;
        const quality = document.getElementById('quality').value;

        // スタイルのチェックボックスを取得
        const styleRealistic = document.getElementById('style-realistic').checked;
        const styleAnime = document.getElementById('style-anime').checked;
        const stylePainting = document.getElementById('style-painting').checked;
        const style3d = document.getElementById('style-3d').checked;

        // 高度なオプション
        const version = document.getElementById('version').value;
        const stylize = document.getElementById('stylize').value;
        const chaos = document.getElementById('chaos').value;
        const seed = document.getElementById('seed').value;

        // プロンプトの基本部分を構築
        let prompt = '';

        // メイン被写体
        if (mainSubject) {
            prompt += mainSubject;
        } else {
            // カテゴリに基づくデフォルト被写体
            switch (category) {
                case 'landscape':
                    prompt += '美しい山の風景';
                    break;
                case 'portrait':
                    prompt += '若い女性のポートレート';
                    break;
                case 'fantasy':
                    prompt += 'ファンタジーの城';
                    break;
                case 'scifi':
                    prompt += '未来都市';
                    break;
                case 'abstract':
                    prompt += '抽象的なパターン';
                    break;
                case 'anime':
                    prompt += 'アニメキャラクター';
                    break;
                case 'realistic':
                    prompt += '写実的な静物';
                    break;
            }
        }

        // 環境・背景
        if (environment) {
            prompt += `, ${environment}`;
        }

        // スタイル
        let styles = [];
        if (styleRealistic) styles.push('photorealistic');
        if (styleAnime) styles.push('anime style');
        if (stylePainting) styles.push('oil painting');
        if (style3d) styles.push('3D render');

        if (styles.length > 0) {
            prompt += `, ${styles.join(', ')}`;
        }

        // 照明
        switch (lighting) {
            case 'natural':
                prompt += ', natural lighting';
                break;
            case 'studio':
                prompt += ', studio lighting';
                break;
            case 'dramatic':
                prompt += ', dramatic lighting';
                break;
            case 'sunset':
                prompt += ', sunset lighting';
                break;
            case 'neon':
                prompt += ', neon lighting';
                break;
            case 'cinematic':
                prompt += ', cinematic lighting';
                break;
            case 'soft':
                prompt += ', soft lighting';
                break;
            case 'backlit':
                prompt += ', backlit';
                break;
            case 'moonlight':
                prompt += ', moonlight';
                break;
        }

        // カメラ設定
        switch (camera) {
            case 'portrait':
                prompt += ', portrait lens';
                break;
            case 'wide':
                prompt += ', wide angle lens';
                break;
            case 'macro':
                prompt += ', macro lens';
                break;
            case 'telephoto':
                prompt += ', telephoto lens';
                break;
            case 'fisheye':
                prompt += ', fisheye lens';
                break;
            case 'aerial':
                prompt += ', aerial view';
                break;
            case 'closeup':
                prompt += ', close-up';
                break;
            case 'panoramic':
                prompt += ', panoramic view';
                break;
        }

        // 追加キーワード
        if (additional) {
            prompt += `, ${additional}`;
        }

        // 品質設定
        switch (quality) {
            case '5':
                prompt += ', highly detailed, 8k, ultra HD';
                break;
            case '4':
                prompt += ', detailed, 4k, HD';
                break;
            case '3':
                prompt += ', good quality';
                break;
            // 1-2は追加しない
        }

        // アスペクト比
        prompt += ` --ar ${aspectRatio}`;

        // 高度なオプション
        if (version) {
            prompt += ` ${version}`;
        }

        if (stylize && stylize !== '100') {
            prompt += ` --s ${stylize}`;
        }

        if (chaos && chaos !== '0') {
            prompt += ` --c ${chaos}`;
        }

        if (seed) {
            prompt += ` --seed ${seed}`;
        }

        // 除外キーワード
        if (negative) {
            prompt += ` --no ${negative}`;
        }

        // プロンプトを表示
        promptOutput.textContent = prompt;
        promptOutput.classList.add('fade-in');

        // アニメーション効果を削除（次回のために）
        setTimeout(() => {
            promptOutput.classList.remove('fade-in');
        }, 500);

        // プロンプトを保存
        savePrompt(prompt);

        // 英語版の表示
        if (translateToggle && translateToggle.checked) {
            translateToEnglish(prompt);
            englishOutput.classList.remove('d-none');
        } else {
            englishOutput.classList.add('d-none');
        }
    }

    /**
     * プロンプトを英語に翻訳する関数
     */
    function translateToEnglish(japanesePrompt) {
        if (!englishPrompt) return;

        let englishText = japanesePrompt;

        // 特殊なパラメータ（--ar, --v, --s, --c, --seed, --no）を一時的に保存
        const paramMatches = {};
        const paramRegex = /(--[a-z]+\s+[^-]+)/g;
        let match;
        let paramCounter = 0;

        while ((match = paramRegex.exec(englishText)) !== null) {
            const placeholder = `__PARAM_${paramCounter}__`;
            paramMatches[placeholder] = match[0];
            englishText = englishText.replace(match[0], placeholder);
            paramCounter++;
        }

        // カンマで区切られた部分ごとに翻訳
        const parts = englishText.split(',');
        const translatedParts = parts.map(part => {
            let trimmedPart = part.trim();

            // 辞書にある完全一致の単語を翻訳
            if (translationDict[trimmedPart]) {
                return ' ' + translationDict[trimmedPart];
            }

            // 部分一致の翻訳
            let translatedPart = trimmedPart;

            // 長い単語から順に翻訳（短い単語が長い単語の一部である場合の誤訳を防ぐ）
            const sortedKeys = Object.keys(translationDict).sort((a, b) => b.length - a.length);

            for (const japaneseWord of sortedKeys) {
                const englishWord = translationDict[japaneseWord];
                // 単語の境界を考慮せずに置換（部分一致も許可）
                translatedPart = translatedPart.replace(new RegExp(japaneseWord, 'g'), englishWord);
            }

            return ' ' + translatedPart;
        });

        // 翻訳結果を結合
        englishText = translatedParts.join(',');

        // 特殊パラメータを元に戻す
        Object.keys(paramMatches).forEach(placeholder => {
            englishText = englishText.replace(placeholder, paramMatches[placeholder]);
        });

        // 余分なスペースを整理
        englishText = englishText.replace(/\s+/g, ' ').trim();

        // 英語のプロンプトを表示
        englishPrompt.textContent = englishText;
    }

    /**
     * プロンプトをクリップボードにコピーする関数
     */
    function copyPromptToClipboard() {
        const promptText = promptOutput.textContent;
        if (promptText === 'ここに生成されたプロンプトが表示されます') {
            alert('先にプロンプトを生成してください');
            return;
        }

        navigator.clipboard.writeText(promptText).then(() => {
            // コピー成功時の処理
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="bi bi-check"></i> コピー完了';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            console.error('クリップボードへのコピーに失敗しました:', err);

            // フォールバック: テキストエリアを使用してコピー
            const textarea = document.createElement('textarea');
            textarea.value = promptText;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="bi bi-check"></i> コピー完了';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });
    }

    /**
     * プロンプトをローカルストレージに保存する関数
     */
    function savePrompt(prompt) {
        if (prompt === 'ここに生成されたプロンプトが表示されます') return;

        let savedPromptsList = JSON.parse(localStorage.getItem('savedPrompts')) || [];

        // 重複を避ける
        const exists = savedPromptsList.some(p => {
            const existingText = typeof p === 'string' ? p : p.text;
            return existingText === prompt;
        });

        if (!exists) {
            // 最大20個まで保存
            if (savedPromptsList.length >= 20) {
                savedPromptsList.pop(); // 最も古いものを削除
            }

            // 現在の日時を追加
            const promptWithDate = {
                text: prompt,
                date: new Date().toISOString()
            };

            savedPromptsList.unshift(promptWithDate); // 先頭に追加
            localStorage.setItem('savedPrompts', JSON.stringify(savedPromptsList));

            // 表示を更新
            loadSavedPrompts();
        }
    }

    /**
     * 保存されたプロンプトをロードして表示する関数
     */
    function loadSavedPrompts() {
        const savedPromptsList = JSON.parse(localStorage.getItem('savedPrompts')) || [];
        savedPrompts.innerHTML = '';

        if (savedPromptsList.length === 0) {
            savedPrompts.innerHTML = '<p class="text-center text-muted my-3">保存されたプロンプトはありません</p>';

            // 履歴クリアボタンを非表示
            if (clearHistoryBtn) {
                clearHistoryBtn.style.display = 'none';
            }
            return;
        }

        // 履歴クリアボタンを表示
        if (clearHistoryBtn) {
            clearHistoryBtn.style.display = 'inline-block';
        }

        savedPromptsList.forEach((promptObj, index) => {
            // 古いフォーマット対応
            const prompt = typeof promptObj === 'string' ? promptObj : promptObj.text;
            const date = promptObj.date ? new Date(promptObj.date) : null;

            const promptElement = document.createElement('div');
            promptElement.className = 'list-group-item saved-prompt-item';

            // プロンプトが長い場合は省略
            const displayPrompt = prompt.length > 100 ? prompt.substring(0, 100) + '...' : prompt;

            // 日付フォーマット
            const dateStr = date ? `<small class="text-muted">${date.toLocaleDateString()}</small>` : '';

            promptElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div class="prompt-text">${displayPrompt}</div>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary use-prompt-btn">使用</button>
                        <button class="btn btn-sm btn-outline-danger delete-prompt-btn">削除</button>
                    </div>
                </div>
                ${dateStr}
            `;

            // 使用ボタンのイベント
            promptElement.querySelector('.use-prompt-btn').addEventListener('click', () => {
                promptOutput.textContent = prompt;
                promptOutput.scrollIntoView({ behavior: 'smooth' });

                // 英語版も表示
                if (translateToggle && translateToggle.checked) {
                    translateToEnglish(prompt);
                    englishOutput.classList.remove('d-none');
                }
            });

            // 削除ボタンのイベント
            promptElement.querySelector('.delete-prompt-btn').addEventListener('click', () => {
                savedPromptsList.splice(index, 1);
                localStorage.setItem('savedPrompts', JSON.stringify(savedPromptsList));
                loadSavedPrompts();
            });

            savedPrompts.appendChild(promptElement);
        });
    }
});
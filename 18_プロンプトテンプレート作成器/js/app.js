// プロンプトテンプレート作成器用JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM要素
    const templateNameInput = document.getElementById('template-name');
    const templateDescriptionInput = document.getElementById('template-description');
    const templateCategorySelect = document.getElementById('template-category');
    
    // 主題関連
    const subjectFixedRadio = document.getElementById('subject-fixed');
    const subjectVariableRadio = document.getElementById('subject-variable');
    const subjectTextInput = document.getElementById('subject-text');
    const subjectVariableNameGroup = document.getElementById('subject-variable-name-group');
    const subjectVariableNameInput = document.getElementById('subject-variable-name');
    const subjectRequiredCheck = document.getElementById('subject-required');
    
    // スタイル関連
    const styleSelect = document.getElementById('style-select');
    const styleCustomInput = document.getElementById('style-custom');
    const styleRequiredCheck = document.getElementById('style-required');
    
    // 品質関連
    const qualityHdCheck = document.getElementById('quality-hd');
    const qualityDetailedCheck = document.getElementById('quality-detailed');
    const qualitySharpCheck = document.getElementById('quality-sharp');
    const qualityCustomInput = document.getElementById('quality-custom');
    const qualityRequiredCheck = document.getElementById('quality-required');
    
    // ライティング関連
    const lightingTypeSelect = document.getElementById('lighting-type');
    const lightingCustomInput = document.getElementById('lighting-custom');
    const lightingRequiredCheck = document.getElementById('lighting-required');
    
    // カスタム要素関連
    const customElementsContainer = document.getElementById('custom-elements');
    const addCustomElementBtn = document.getElementById('add-custom-element');
    
    // プレビュー関連
    const refreshPreviewBtn = document.getElementById('refresh-preview');
    const viewTemplateBtn = document.getElementById('view-template');
    const viewPreviewBtn = document.getElementById('view-preview');
    const templateView = document.getElementById('template-view');
    const previewView = document.getElementById('preview-view');
    const templateCode = document.getElementById('template-code');
    const promptPreview = document.getElementById('prompt-preview');
    const variablesContainer = document.getElementById('variables-container');
    
    // ボタン関連
    const saveTemplateBtn = document.getElementById('save-template');
    const exportTemplateBtn = document.getElementById('export-template');
    const copyPromptBtn = document.getElementById('copy-prompt');
    const importTemplateBtn = document.getElementById('import-template');
    
    // 変数タイプの切り替え
    subjectFixedRadio.addEventListener('change', toggleSubjectVariableField);
    subjectVariableRadio.addEventListener('change', toggleSubjectVariableField);
    
    // カスタム要素の追加
    addCustomElementBtn.addEventListener('click', addCustomElement);
    
    // カスタム要素の削除イベントを委譲
    customElementsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-custom-element')) {
            e.target.closest('.custom-element').remove();
        }
    });
    
    // プレビュー表示切替
    viewTemplateBtn.addEventListener('click', function() {
        templateView.classList.remove('d-none');
        previewView.classList.add('d-none');
        viewTemplateBtn.classList.add('active');
        viewPreviewBtn.classList.remove('active');
        updateTemplateCode();
    });
    
    viewPreviewBtn.addEventListener('click', function() {
        templateView.classList.add('d-none');
        previewView.classList.remove('d-none');
        viewTemplateBtn.classList.remove('active');
        viewPreviewBtn.classList.add('active');
        updatePromptPreview();
    });
    
    // プレビュー更新
    refreshPreviewBtn.addEventListener('click', function() {
        if (templateView.classList.contains('d-none')) {
            updatePromptPreview();
        } else {
            updateTemplateCode();
        }
    });
    
    // プロンプトコピー
    copyPromptBtn.addEventListener('click', function() {
        const promptText = promptPreview.textContent;
        navigator.clipboard.writeText(promptText).then(() => {
            showCopySuccess(copyPromptBtn);
        }).catch(err => {
            console.error('クリップボードへのコピーに失敗しました:', err);
            alert('コピーに失敗しました。手動でコピーしてください。');
        });
    });
    
    // テンプレート保存
    saveTemplateBtn.addEventListener('click', function() {
        const template = buildTemplateObject();
        
        // 実際のアプリではデータベースに保存しますが、このデモではローカルストレージに保存
        try {
            const templates = JSON.parse(localStorage.getItem('promptTemplates') || '[]');
            templates.push(template);
            localStorage.setItem('promptTemplates', JSON.stringify(templates));
            showSaveSuccess(saveTemplateBtn);
        } catch (e) {
            console.error('テンプレートの保存に失敗しました:', e);
            alert('テンプレートの保存に失敗しました。');
        }
    });
    
    // テンプレートエクスポート
    exportTemplateBtn.addEventListener('click', function() {
        const template = buildTemplateObject();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(template, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", template.name + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });
    
    // テンプレートインポート
    importTemplateBtn.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                try {
                    const template = JSON.parse(event.target.result);
                    loadTemplateFromObject(template);
                } catch (e) {
                    console.error('テンプレートの読み込みに失敗しました:', e);
                    alert('テンプレートの読み込みに失敗しました。有効なJSONファイルを選択してください。');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    });
    
    // 初期化
    initializeApp();
    
    /**
     * アプリを初期化する
     */
    function initializeApp() {
        // 変数フィールドの初期状態を設定
        toggleSubjectVariableField();
        
        // 初期プレビューを更新
        updatePromptPreview();
    }
    
    /**
     * 主題の変数フィールドの表示/非表示を切り替える
     */
    function toggleSubjectVariableField() {
        if (subjectVariableRadio.checked) {
            subjectVariableNameGroup.classList.remove('d-none');
        } else {
            subjectVariableNameGroup.classList.add('d-none');
        }
    }
    
    /**
     * カスタム要素を追加する
     */
    function addCustomElement() {
        const element = document.createElement('div');
        element.className = 'custom-element mb-3 p-2 border rounded';
        element.innerHTML = `
            <div class="mb-2">
                <label class="form-label">要素名</label>
                <input type="text" class="form-control custom-element-name" placeholder="例: カメラアングル">
            </div>
            <div class="mb-2">
                <label class="form-label">値</label>
                <input type="text" class="form-control custom-element-value" placeholder="例: wide angle">
            </div>
            <div class="form-check form-switch mb-2">
                <input class="form-check-input custom-element-variable" type="checkbox">
                <label class="form-check-label">変数として設定</label>
            </div>
            <div class="form-check form-switch mb-2">
                <input class="form-check-input custom-element-required" type="checkbox">
                <label class="form-check-label">必須要素</label>
            </div>
            <button type="button" class="btn btn-sm btn-outline-danger remove-custom-element">削除</button>
        `;
        
        customElementsContainer.appendChild(element);
    }
    
    /**
     * プロンプトプレビューを更新する
     */
    function updatePromptPreview() {
        // 変数コンテナをクリア
        variablesContainer.innerHTML = '';
        
        let variables = [];
        let promptParts = [];
        
        // 主題
        if (subjectTextInput.value) {
            if (subjectVariableRadio.checked && subjectVariableNameInput.value) {
                const varName = subjectVariableNameInput.value.toUpperCase();
                promptParts.push(`{${varName}}`);
                variables.push({
                    name: varName,
                    defaultValue: subjectTextInput.value,
                    required: subjectRequiredCheck.checked
                });
            } else {
                promptParts.push(subjectTextInput.value);
            }
        }
        
        // スタイル
        let styles = Array.from(styleSelect.selectedOptions).map(option => option.value);
        if (styleCustomInput.value) {
            styles = styles.concat(styleCustomInput.value.split(',').map(s => s.trim()));
        }
        if (styles.length > 0) {
            promptParts.push(styles.join(', '));
        }
        
        // 品質
        let qualities = [];
        if (qualityHdCheck.checked) qualities.push('8K, high resolution');
        if (qualityDetailedCheck.checked) qualities.push('highly detailed, intricate');
        if (qualitySharpCheck.checked) qualities.push('sharp focus');
        if (qualityCustomInput.value) {
            qualities = qualities.concat(qualityCustomInput.value.split(',').map(q => q.trim()));
        }
        if (qualities.length > 0) {
            promptParts.push(qualities.join(', '));
        }
        
        // ライティング
        if (lightingTypeSelect.value) {
            promptParts.push(lightingTypeSelect.options[lightingTypeSelect.selectedIndex].text);
        }
        if (lightingCustomInput.value) {
            promptParts.push(lightingCustomInput.value);
        }
        
        // カスタム要素
        const customElements = document.querySelectorAll('.custom-element');
        customElements.forEach(element => {
            const nameInput = element.querySelector('.custom-element-name');
            const valueInput = element.querySelector('.custom-element-value');
            const variableCheck = element.querySelector('.custom-element-variable');
            const requiredCheck = element.querySelector('.custom-element-required');
            
            if (nameInput.value && valueInput.value) {
                if (variableCheck.checked) {
                    const varName = nameInput.value.toUpperCase().replace(/\s+/g, '_');
                    promptParts.push(`${nameInput.value}: {${varName}}`);
                    variables.push({
                        name: varName,
                        defaultValue: valueInput.value,
                        required: requiredCheck.checked
                    });
                } else {
                    promptParts.push(`${nameInput.value}: ${valueInput.value}`);
                }
            }
        });
        
        // プロンプトプレビューを更新
        promptPreview.textContent = promptParts.join(', ');
        
        // 変数入力フィールドを生成
        if (variables.length > 0) {
            variables.forEach(variable => {
                const varDiv = document.createElement('div');
                varDiv.className = 'variable-input';
                varDiv.innerHTML = `
                    <label class="form-label">${variable.name}${variable.required ? ' <span class="text-danger">*</span>' : ''}</label>
                    <input type="text" class="form-control" data-var-name="${variable.name}" value="${variable.defaultValue}" placeholder="${variable.name}">
                `;
                variablesContainer.appendChild(varDiv);
                
                // 変数入力時にプレビューを更新
                const input = varDiv.querySelector('input');
                input.addEventListener('input', updateVariableValues);
            });
        } else {
            variablesContainer.innerHTML = '<p class="text-muted">変数を設定するとここに入力フィールドが表示されます。</p>';
        }
    }
    
    /**
     * 変数値を更新してプレビューを更新する
     */
    function updateVariableValues() {
        let promptText = promptPreview.textContent;
        
        const variableInputs = document.querySelectorAll('#variables-container input');
        variableInputs.forEach(input => {
            const varName = input.dataset.varName;
            const varValue = input.value;
            promptText = promptText.replace(`{${varName}}`, varValue);
        });
        
        promptPreview.textContent = promptText;
    }
    
    /**
     * テンプレートコードを更新する
     */
    function updateTemplateCode() {
        const template = buildTemplateObject();
        templateCode.textContent = JSON.stringify(template, null, 2);
    }
    
    /**
     * テンプレートオブジェクトを構築する
     */
    function buildTemplateObject() {
        const template = {
            name: templateNameInput.value || 'Untitled Template',
            description: templateDescriptionInput.value || '',
            category: templateCategorySelect.value || 'other',
            elements: []
        };
        
        // 主題
        if (subjectTextInput.value) {
            template.elements.push({
                type: 'subject',
                value: subjectTextInput.value,
                isVariable: subjectVariableRadio.checked,
                variableName: subjectVariableRadio.checked ? (subjectVariableNameInput.value || 'SUBJECT') : null,
                required: subjectRequiredCheck.checked
            });
        }
        
        // スタイル
        const selectedStyles = Array.from(styleSelect.selectedOptions).map(option => option.value);
        const customStyles = styleCustomInput.value ? styleCustomInput.value.split(',').map(s => s.trim()) : [];
        if (selectedStyles.length > 0 || customStyles.length > 0) {
            template.elements.push({
                type: 'style',
                selectedStyles: selectedStyles,
                customStyles: customStyles,
                required: styleRequiredCheck.checked
            });
        }
        
        // 品質
        const qualities = {
            hd: qualityHdCheck.checked,
            detailed: qualityDetailedCheck.checked,
            sharp: qualitySharpCheck.checked,
            custom: qualityCustomInput.value
        };
        if (qualities.hd || qualities.detailed || qualities.sharp || qualities.custom) {
            template.elements.push({
                type: 'quality',
                settings: qualities,
                required: qualityRequiredCheck.checked
            });
        }
        
        // ライティング
        if (lightingTypeSelect.value || lightingCustomInput.value) {
            template.elements.push({
                type: 'lighting',
                lightingType: lightingTypeSelect.value,
                customLighting: lightingCustomInput.value,
                required: lightingRequiredCheck.checked
            });
        }
        
        // カスタム要素
        const customElements = document.querySelectorAll('.custom-element');
        customElements.forEach(element => {
            const nameInput = element.querySelector('.custom-element-name');
            const valueInput = element.querySelector('.custom-element-value');
            const variableCheck = element.querySelector('.custom-element-variable');
            const requiredCheck = element.querySelector('.custom-element-required');
            
            if (nameInput.value && valueInput.value) {
                template.elements.push({
                    type: 'custom',
                    name: nameInput.value,
                    value: valueInput.value,
                    isVariable: variableCheck.checked,
                    variableName: variableCheck.checked ? nameInput.value.toUpperCase().replace(/\s+/g, '_') : null,
                    required: requiredCheck.checked
                });
            }
        });
        
        return template;
    }
    
    /**
     * テンプレートオブジェクトからフォームを読み込む
     */
    function loadTemplateFromObject(template) {
        // 基本情報
        templateNameInput.value = template.name || '';
        templateDescriptionInput.value = template.description || '';
        templateCategorySelect.value = template.category || '';
        
        // 要素をリセット
        subjectTextInput.value = '';
        subjectFixedRadio.checked = true;
        subjectVariableNameInput.value = '';
        subjectRequiredCheck.checked = false;
        
        styleSelect.querySelectorAll('option').forEach(option => option.selected = false);
        styleCustomInput.value = '';
        styleRequiredCheck.checked = false;
        
        qualityHdCheck.checked = false;
        qualityDetailedCheck.checked = false;
        qualitySharpCheck.checked = false;
        qualityCustomInput.value = '';
        qualityRequiredCheck.checked = false;
        
        lightingTypeSelect.value = '';
        lightingCustomInput.value = '';
        lightingRequiredCheck.checked = false;
        
        customElementsContainer.innerHTML = '';
        
        // 要素を読み込む
        if (template.elements && Array.isArray(template.elements)) {
            template.elements.forEach(element => {
                switch (element.type) {
                    case 'subject':
                        subjectTextInput.value = element.value || '';
                        if (element.isVariable) {
                            subjectVariableRadio.checked = true;
                            subjectVariableNameInput.value = element.variableName || 'SUBJECT';
                        } else {
                            subjectFixedRadio.checked = true;
                        }
                        subjectRequiredCheck.checked = element.required || false;
                        break;
                        
                    case 'style':
                        if (element.selectedStyles && Array.isArray(element.selectedStyles)) {
                            element.selectedStyles.forEach(style => {
                                const option = styleSelect.querySelector(`option[value="${style}"]`);
                                if (option) option.selected = true;
                            });
                        }
                        styleCustomInput.value = element.customStyles ? element.customStyles.join(', ') : '';
                        styleRequiredCheck.checked = element.required || false;
                        break;
                        
                    case 'quality':
                        if (element.settings) {
                            qualityHdCheck.checked = element.settings.hd || false;
                            qualityDetailedCheck.checked = element.settings.detailed || false;
                            qualitySharpCheck.checked = element.settings.sharp || false;
                            qualityCustomInput.value = element.settings.custom || '';
                        }
                        qualityRequiredCheck.checked = element.required || false;
                        break;
                        
                    case 'lighting':
                        lightingTypeSelect.value = element.lightingType || '';
                        lightingCustomInput.value = element.customLighting || '';
                        lightingRequiredCheck.checked = element.required || false;
                        break;
                        
                    case 'custom':
                        const customElement = document.createElement('div');
                        customElement.className = 'custom-element mb-3 p-2 border rounded';
                        customElement.innerHTML = `
                            <div class="mb-2">
                                <label class="form-label">要素名</label>
                                <input type="text" class="form-control custom-element-name" value="${element.name || ''}" placeholder="例: カメラアングル">
                            </div>
                            <div class="mb-2">
                                <label class="form-label">値</label>
                                <input type="text" class="form-control custom-element-value" value="${element.value || ''}" placeholder="例: wide angle">
                            </div>
                            <div class="form-check form-switch mb-2">
                                <input class="form-check-input custom-element-variable" type="checkbox" ${element.isVariable ? 'checked' : ''}>
                                <label class="form-check-label">変数として設定</label>
                            </div>
                            <div class="form-check form-switch mb-2">
                                <input class="form-check-input custom-element-required" type="checkbox" ${element.required ? 'checked' : ''}>
                                <label class="form-check-label">必須要素</label>
                            </div>
                            <button type="button" class="btn btn-sm btn-outline-danger remove-custom-element">削除</button>
                        `;
                        customElementsContainer.appendChild(customElement);
                        break;
                }
            });
        }
        
        // 変数フィールドの表示状態を更新
        toggleSubjectVariableField();
        
        // プレビューを更新
        updatePromptPreview();
    }
    
    /**
     * コピー成功表示
     */
    function showCopySuccess(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="bi bi-check"></i> コピー完了';
        button.classList.add('copy-success');
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('copy-success');
        }, 2000);
    }
    
    /**
     * 保存成功表示
     */
    function showSaveSuccess(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="bi bi-check"></i> 保存完了';
        button.classList.add('save-success');
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('save-success');
        }, 2000);
    }
});
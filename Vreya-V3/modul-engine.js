    const alertsContainer = window.document.getElementById('alerts-container');

    // 1. Ambil URL Parameters
    const Url_Params_Dungeon = new URLSearchParams(location.search);
    const instance_id = Url_Params_Dungeon.get('instance_id');
    const location_id = Number(Url_Params_Dungeon.get('location_id'));
    const Vreya_Current_Stamina = 0;
    const Vreya_Battle_Cooldown = 1000;

    // START HERE //
    const StartMenu = [
        { name: "🏠 Home", link: "https://demonicscans.org/game_dash.php" },
        { name: "🏰 Guild Dungeon", link: "https://demonicscans.org/guild_dungeon.php" },
        { name: "⚔️ Wave 1", link: "https://demonicscans.org/active_wave.php?gate=3&wave=3" },
        { name: "⚔️ Wave 2", link: "https://demonicscans.org/active_wave.php?gate=3&wave=5" },
        { name: "⚔️ Wave 3", link: "https://demonicscans.org/active_wave.php?gate=3&wave=8" },
        { name: "⚔️ Wave 4", link: "https://demonicscans.org/active_wave.php?gate=5&wave=9" },
        { name: "⛩️ Hermes Gate", link: "https://demonicscans.org/active_wave.php?gate=5&wave=10" },
        { name: "🏹 Artemis Gate", link: "https://demonicscans.org/active_wave.php?gate=5&wave=11" },
        { name: "🏰 Olympus", link: "https://demonicscans.org/olympus.php" },
    ];

    // Inisialisasi Default LocalStorage
    if (localStorage.getItem('Vreya_Attack_Mode') === null) localStorage.setItem('Vreya_Attack_Mode', 'minDmg');
    if (localStorage.getItem('Vreya_Console') === null) localStorage.setItem('Vreya_Console', 'true');
    if (localStorage.getItem('Vreya_UConsole') === null) localStorage.setItem('Vreya_UConsole', 'true');
    if (localStorage.getItem('Vreya_Attack_Power') === null) localStorage.setItem('Vreya_Attack_Power', '10000');
    if (localStorage.getItem('Vreya_Tiger_Multiplier') === null) localStorage.setItem('Vreya_Tiger_Multiplier', '1.0');
    if (localStorage.getItem('Vreya_Use_Lsp') === null) localStorage.setItem('Vreya_Use_Lsp', 'false');
    if (localStorage.getItem('Vreya_Use_Fsp') === null) localStorage.setItem('Vreya_Use_Fsp', 'false');
    if (localStorage.getItem('Vreya_AutoHeal') === null) localStorage.setItem('Vreya_AutoHeal', 'true');
    if (localStorage.getItem('Vreya_AutoLoots') === null) localStorage.setItem('Vreya_AutoLoots', 'false');
    if (localStorage.getItem('Vreya_ShowNotif') === null) localStorage.setItem('Vreya_ShowNotif', 'true');
    if (localStorage.getItem('Vreya_AutoBuyOlympus') === null) localStorage.setItem('Vreya_AutoBuyOlympus', 'false');
    if (localStorage.getItem('Vreya_AutoBuyMerchant') === null) localStorage.setItem('Vreya_AutoBuyMerchant', 'false');
    if (localStorage.getItem('Vreya_AutoBuyAdvGuild') === null) localStorage.setItem('Vreya_AutoBuyAdvGuild', 'false');
    if (localStorage.getItem('Vreya_AutoRun_Active') === null) localStorage.setItem('Vreya_AutoRun_Active', 'false');
    if (localStorage.getItem('Vreya_AutoBot') === null) localStorage.setItem('Vreya_AutoBot', 'false');
    if (localStorage.getItem('Vreya_MapTable') === null) localStorage.setItem('Vreya_MapTable', 'false');
    if (localStorage.getItem('Vreya_UI_Minimized') === null) localStorage.setItem('Vreya_UI_Minimized', 'false');

    if (localStorage.getItem('Vreya_hdMobs') === null) localStorage.setItem('Vreya_hdMobs', JSON.stringify(defaultHdMobs));
    if (localStorage.getItem('Vreya_ndMobs') === null) localStorage.setItem('Vreya_ndMobs', JSON.stringify(defaultNdMobs));
    if (localStorage.getItem('Vreya_cbMobs') === null) localStorage.setItem('Vreya_cbMobs', JSON.stringify(defaultCbMobs));

    const usedDmg = localStorage.getItem('Vreya_Attack_Mode');

    let storageKey = "";
    if (location_id >= 1 && location_id <= 5) {
        storageKey = "Vreya_ndMobs";
    } else if (location_id >= 6 && location_id <= 10) {
        storageKey = "Vreya_hdMobs";
    } else if (location_id >= 11 && location_id <= 13) {
        storageKey = "Vreya_cbMobs";
    }

    const activeDB = storageKey ? JSON.parse(localStorage.getItem(storageKey) || "[]") : [];

    let Current_Stamina = 0;

    const buffs_btn = document.querySelector('.gtb-buffs-btn');
    if(buffs_btn){ buffs_btn.style.display = 'none'; }

    // Helper Functions
    function getStorage(key, defaultValue) {
        const val = localStorage.getItem(key);
        return val !== null ? val : defaultValue;
    }

    function formatNumberInput(val) {
        if (!val && val !== 0) return 0;
        let clean = val.toString().replace(/[\.,]/g, '');
        let num = parseInt(clean, 10);
        return isNaN(num) ? 0 : num;
    }

    function formatNumberDisplay(val) {
        let num = parseInt(val, 10);
        if (isNaN(num)) num = 0;
        return num.toLocaleString('de-DE');
    }

    function formatTigerInput(val) {
        let clean = val.toString().replace(',', '.');
        let num = parseFloat(clean);
        return isNaN(num) ? "1.0" : num.toFixed(1);
    }

    function getLocationName(locId) {
        const loc = LocDunBase.find(l => l.location_id === locId);
        return loc ? loc.name : `Location ${locId}`;
    }

    function createFloatAlert(message, type = 'info') {
        const container = document.getElementById('alerts-container');
        if (!container) return;

        const alert = document.createElement('div');
        alert.className = `float-alert ${type}`;
        alert.innerHTML = `<span>${message}</span>`;
        container.appendChild(alert);

        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transition = 'opacity 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        }, 2500);
    }

    // Custom Modal Box Function
    function showCustomModal(title, bodyHTML, onCloseCallback = null) {
        // Hapus modal lama jika sedang terbuka
        const existingModal = document.getElementById('vreya-custom-modal');
        if (existingModal) existingModal.remove();

        const modalContainer = document.createElement('div');
        modalContainer.id = 'vreya-custom-modal';
        modalContainer.className = 'custom-modal';
        modalContainer.style.display = 'flex';

        modalContainer.innerHTML = `
            <div class="custom-modal-content" style="width: 400px; max-width: 90%;">
                <div class="custom-modal-header">
                    <span>${title}</span>
                    <span class="custom-modal-close" id="vreya-modal-close-btn">&times;</span>
                </div>
                <div class="custom-modal-body" style="padding: 16px;">
                    ${bodyHTML}
                </div>
            </div>
        `;

        document.body.appendChild(modalContainer);

        const closeModal = () => {
            modalContainer.remove();
            if (typeof onCloseCallback === 'function') {
                onCloseCallback();
            }
        };

        modalContainer.querySelector('#vreya-modal-close-btn').onclick = closeModal;
        modalContainer.onclick = (e) => {
            if (e.target === modalContainer) closeModal();
        };
    }

    function createModalFooterHTML(prefixId) {
        return `
            <div class="modal-footer-action">
                <span id="${prefixId}-save-indicator" class="save-indicator">Saved!</span>
                <button id="${prefixId}-btn-save" class="btn-save-modal">Save</button>
            </div>
        `;
    }

    function triggerSaveIndicator(indicatorId) {
        const el = document.getElementById(indicatorId);
        if (el) {
            el.classList.add('show');
            setTimeout(() => { el.classList.remove('show'); }, 2000);
        }
    }

    function generateGroupedMobsHTML(mobsDataArr, prefix) {
        let html = '';
        let currentLocId = null;

        mobsDataArr.forEach((mob, index) => {
            if (mob.location_id !== currentLocId) {
                currentLocId = mob.location_id;
                const locName = getLocationName(currentLocId);
                html += `
                    <div class="location-group-header">
                        📍 ${locName}
                    </div>
                `;
            }

            html += `
                <div class="mob-card-compact">
                    <label class="checkbox-container mob-title">
                        <input type="checkbox" class="${prefix}-actived" data-index="${index}" ${mob.actived ? 'checked' : ''}>
                        <span>${mob.name}</span>
                    </label>
                    <div class="mob-inputs-inline">
                        <div class="mob-input-item">
                            <span>Min</span>
                            <input type="text" class="setting-input ${prefix}-min-dmg" data-index="${index}" value="${formatNumberDisplay(mob.minDmg || 0)}">
                        </div>
                        <div class="mob-input-item">
                            <span>Max</span>
                            <input type="text" class="setting-input ${prefix}-max-dmg" data-index="${index}" value="${formatNumberDisplay(mob.maxDmg || 0)}">
                        </div>
                    </div>
                </div>
            `;
        });

        html += createModalFooterHTML(prefix);
        return html;
    }

    // 2. CSS Style & Render Float UI (Termasuk Minimizer Header)
    function renderFloatUI() {
        const style = document.createElement('style');
        style.innerHTML = `
        .muted {
                display: flex;
                align-items: center;
                font-size: 12px;
                margin-top: 20px;
                margin-bottom: 10px;
            }
            .custom-ui-toolbar {
                position: fixed;
                bottom: 70px;
                right: 20px;
                z-index: 999;
                display: flex;
                flex-direction: column;
                gap: 8px;
                background: rgba(21, 25, 34, 0.95);
                backdrop-filter: blur(8px);
                border: 1px solid #2e3a52;
                padding: 8px 10px 10px 10px;
                border-radius: 10px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.5);
                width: 320px;
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                transition: width 0.2s ease, padding 0.2s ease;
            }

            .custom-ui-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none;
                margin-bottom: 2px;
            }

            .custom-ui-title {
                color: #94a3b8;
                font-size: 11px;
                font-weight: bold;
                letter-spacing: 0.5px;
            }

            .custom-ui-toggle-btn {
                background: transparent;
                color: #94a3b8;
                border: none;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                padding: 0 4px;
                line-height: 1;
                transition: color 0.2s;
            }

            .custom-ui-toggle-btn:hover {
                color: #ffffff;
            }

            .custom-ui-content {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .toolbar-row {
                display: flex;
                gap: 8px;
                width: 100%;
            }

            .toolbar-row > * {
                flex: 1;
                min-width: 0;
            }

            .custom-btn {
                background-color: #1e2538;
                color: #ffffff;
                border: 1px solid #2e3a52;
                padding: 8px 4px;
                font-size: 12px;
                font-weight: 600;
                border-radius: 6px;
                cursor: pointer;
                text-align: center;
                user-select: none;
                width: 100%;
                box-sizing: border-box;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
                transition: all 0.2s ease;
            }

            .custom-btn:hover {
                background-color: #28324a;
                border-color: #3b82f6;
            }

            .custom-btn.btn-active-run {
                background-color: #15803d !important;
                border-color: #22c55e !important;
                color: #ffffff;
            }

            .btn-dropdown-wrapper {
                position: relative;
                width: 100%;
            }

            .float-dropup-menu {
                display: none;
                position: absolute;
                bottom: 110%;
                left: 0;
                width: 170px;
                background-color: #151922;
                border: 1px solid #2e3a52;
                border-radius: 8px;
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
                padding: 6px 0;
                z-index: 1000000;
                flex-direction: column;
            }

            .float-dropup-menu.right-aligned {
                left: auto;
                right: 0;
            }

            .float-dropup-menu.show {
                display: flex;
            }

            .float-dropup-item {
                color: #e2e8f0;
                padding: 8px 14px;
                text-decoration: none;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                transition: background 0.2s, color 0.2s;
            }

            .float-dropup-item:hover {
                background-color: #28324a;
                color: #ffffff;
            }

            .float-dropup-item.active {
                color: #3b82f6;
                font-weight: bold;
            }

            @media (max-width: 480px) {
                .custom-ui-toolbar {
                    width: calc(100% - 20px);
                    right: 10px;
                    bottom: 10px;
                    padding: 8px;
                }
                .custom-btn {
                    font-size: 11px;
                    padding: 8px 2px;
                }
            }

            .custom-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.6);
                z-index: 1000005;
                justify-content: center;
                align-items: center;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                padding: 10px;
                box-sizing: border-box;
            }

            .custom-modal-content {
                background-color: #151922;
                border: 1px solid #2e3a52;
                border-radius: 8px;
                color: #e2e8f0;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                max-height: 90vh;
            }

            #modal-setting .custom-modal-content { width: 300px; max-width: 95%; }
            #modal-hard-dungeon .custom-modal-content,
            #modal-normal-dungeon .custom-modal-content,
            #modal-cube-dungeon .custom-modal-content { width: 480px; max-width: 95%; }

            .custom-modal-header {
                background-color: #1e2538;
                padding: 10px 14px;
                font-size: 14px;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #2e3a52;
            }

            .custom-modal-close {
                cursor: pointer;
                color: #94a3b8;
                font-size: 18px;
                font-weight: bold;
            }

            .custom-modal-close:hover { color: #ffffff; }

            .custom-modal-body {
                padding: 12px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                overflow-y: auto;
                font-size: 13px;
            }

            .location-group-header {
                font-size: 12px;
                font-weight: bold;
                color: #3b82f6;
                background-color: #1e2538;
                padding: 6px 10px;
                border-radius: 4px;
                border-left: 3px solid #3b82f6;
                margin-top: 6px;
                margin-bottom: 2px;
            }

            .location-group-header:first-child {
                margin-top: 0;
            }

            .setting-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 13px;
            }

            .setting-input {
                background-color: #1a202c;
                border: 1px solid #2e3a52;
                color: #ffffff;
                padding: 5px 8px;
                border-radius: 4px;
                width: 90px;
                text-align: right;
                font-size: 12px;
            }

            .toggle-btn, .btn-toggle-switch {
                background-color: #2e3a52;
                color: #94a3b8;
                border: none;
                padding: 4px 10px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                font-size: 12px;
                min-width: 65px;
            }

            .toggle-btn.active, .btn-toggle-switch.active {
                background-color: #22c55e;
                color: #ffffff;
            }

            .reset-btn {
                background-color: #ef4444;
                color: #ffffff;
                border: none;
                padding: 4px 10px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                font-size: 12px;
            }

            .checkbox-container {
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                user-select: none;
            }

            .checkbox-container input {
                cursor: pointer;
                width: 15px;
                height: 15px;
                accent-color: #3b82f6;
            }

            .setting-row-inline {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
            }

            .setting-row-toggle {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 13px;
            }

            .modal-footer-action {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                gap: 10px;
                margin-top: 10px;
                padding-top: 8px;
                border-top: 1px solid #2e3a52;
            }

            .save-indicator {
                font-size: 12px;
                color: #22c55e;
                opacity: 0;
                transition: opacity 0.3s ease;
                font-weight: 500;
            }

            .save-indicator.show { opacity: 1; }

            .btn-save-modal {
                background-color: #3b82f6;

                color: #ffffff;
                border: none;
                padding: 6px 16px;
                border-radius: 4px;
                font-weight: bold;
                font-size: 12px;
                cursor: pointer;
            }

            .mob-card-compact {
                background-color: #1a202c;
                border: 1px solid #2e3a52;
                border-radius: 6px;
                padding: 8px 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
            }

            .mob-title {
                font-size: 12px;
                font-weight: 500;
                color: #e2e8f0;
                flex: 1;
            }

            .mob-inputs-inline {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .mob-input-item {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 11px;
                color: #94a3b8;
            }

            .alerts-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000001;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                max-width: 320px;
                width: 100%;
                pointer-events: none;
            }

            .float-alert {
                background: #1e2538;
                color: #ffffff;
                border-left: 4px solid #3b82f6;
                padding: 0.75rem 1rem;
                border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                pointer-events: auto;
                font-size: 0.8rem;
            }
            .float-alert.success { border-left-color: #10b981; }
            .float-alert.warning { border-left-color: #f59e0b; }
        `;
        document.head.appendChild(style);

        const mainToolbar = document.createElement('div');
        mainToolbar.className = 'custom-ui-toolbar';

        // --- HEADER LOGIKA MINIMIZE / MAXIMIZE ---
        const uiHeader = document.createElement('div');
        uiHeader.className = 'custom-ui-header';

        const uiTitle = document.createElement('span');
        uiTitle.className = 'custom-ui-title';
        uiTitle.innerText = '⚡ VREYA HELPER';

        const btnToggleMinimize = document.createElement('button');
        btnToggleMinimize.className = 'custom-ui-toggle-btn';

        const contentBox = document.createElement('div');
        contentBox.className = 'custom-ui-content';

        let isMinimized = getStorage('Vreya_UI_Minimized', 'false') === 'true';

        function applyMinimizeState() {
            if (isMinimized) {
                contentBox.style.display = 'none';
                btnToggleMinimize.innerText = '+';
                mainToolbar.style.width = 'auto';
            } else {
                contentBox.style.display = 'flex';
                btnToggleMinimize.innerText = '−';
                mainToolbar.style.width = '320px';
            }
        }

        btnToggleMinimize.onclick = function() {
            isMinimized = !isMinimized;
            localStorage.setItem('Vreya_UI_Minimized', isMinimized.toString());
            applyMinimizeState();
        };

        uiHeader.appendChild(uiTitle);
        uiHeader.appendChild(btnToggleMinimize);
        mainToolbar.appendChild(uiHeader);

        // --- BARIS PERTAMA ---
        const row1 = document.createElement('div');
        row1.className = 'toolbar-row';

        const btnLSP = document.createElement('button');
        btnLSP.className = 'custom-btn';
        btnLSP.innerHTML = `<img src="https://demonicscans.org/images/items/1768627855_stamina_xl.webp" alt="LSP Pot" style="width:20px; vertical-align:middle; margin-right:5px;"> LSP Pot`;
        btnLSP.onclick = function() {
            if(getStorage('Vreya_Use_Lsp', 'false') === 'true'){
                clickLSP();
                createFloatAlert('Use Large Stamina Potion', 'success');
            }else{
                createFloatAlert('Please activate it first.');
            }
        };

        const btnFSP = document.createElement('button');
        btnFSP.className = 'custom-btn';
        btnFSP.innerHTML = `<img src="https://demonicscans.org/images/items/1755909636_full_stamina_potion.webp" alt="LSP Pot" style="width:20px; vertical-align:middle; margin-right:5px;"> FSP Pot`;
        btnFSP.onclick = function() {
            if(getStorage('Vreya_Use_Fsp', 'false') === 'true'){
                clickFSP();
                createFloatAlert('Use Full Stamina Potion', 'success');
            }else{
                createFloatAlert('Please activate it first.');
            }
        };

        const modeWrapper = document.createElement('div');
        modeWrapper.className = 'btn-dropdown-wrapper';

        const btnMode = document.createElement('button');
        btnMode.className = 'custom-btn';
        btnMode.innerText = '⚔️ Atk Mode';

        const modePopup = document.createElement('div');
        modePopup.className = 'float-dropup-menu right-aligned';

        let currentAttackMode = getStorage('Vreya_Attack_Mode', 'minDmg');

        function renderModeItems() {
            modePopup.innerHTML = '';
            const modes = [
                { id: 'minDmg', label: 'Min Dmg' },
                { id: 'maxDmg', label: 'Max Dmg' }
            ];

            modes.forEach(m => {
                const item = document.createElement('div');
                item.className = 'float-dropup-item' + (currentAttackMode === m.id ? ' active' : '');
                item.innerHTML = `<span>${m.label}</span>${currentAttackMode === m.id ? '<span>✓</span>' : ''}`;
                item.onclick = function(e) {
                    e.stopPropagation();
                    currentAttackMode = m.id;
                    localStorage.setItem('Vreya_Attack_Mode', currentAttackMode);
                    renderModeItems();
                    modePopup.classList.remove('show');
                    createFloatAlert(`Mode set to ${m.label}`, 'success');
                    createFloatAlert('Please Wait... Reloading Page');
                    setTimeout(() => { window.location.reload(); }, 3000);
                };
                modePopup.appendChild(item);
            });
        }
        renderModeItems();

        btnMode.onclick = function(e) {
            e.stopPropagation();
            navPopup.classList.remove('show');
            settingPopup.classList.remove('show');
            modePopup.classList.toggle('show');
        };

        modeWrapper.appendChild(btnMode);
        modeWrapper.appendChild(modePopup);

        row1.appendChild(btnLSP);
        row1.appendChild(btnFSP);

        // --- BARIS KEDUA ---
        const row2 = document.createElement('div');
        row2.className = 'toolbar-row';

        const menuWrapper = document.createElement('div');
        menuWrapper.className = 'btn-dropdown-wrapper';

        const btnStartMenu = document.createElement('button');
        btnStartMenu.className = 'custom-btn';
        btnStartMenu.innerHTML = '☰ Menu';

        const navPopup = document.createElement('div');
        navPopup.className = 'float-dropup-menu';

        StartMenu.forEach(item => {
            const mLink = document.createElement('a');
            mLink.className = 'float-dropup-item';
            mLink.href = item.link;
            mLink.innerText = item.name;
            navPopup.appendChild(mLink);
        });

        btnStartMenu.onclick = (e) => {
            e.stopPropagation();
            settingPopup.classList.remove('show');
            modePopup.classList.remove('show');
            navPopup.classList.toggle('show');
        };

        menuWrapper.appendChild(btnStartMenu);
        menuWrapper.appendChild(navPopup);

        let isAutoBotActive = getStorage('Vreya_AutoBot', 'false') === 'true';
        let isAutoRunActive = getStorage('Vreya_AutoRun_Active', 'false') === 'true';
        const btnAutoRun = document.createElement('button');

        function updateAutoRunBtnUI() {
            isAutoBotActive = getStorage('Vreya_AutoBot', 'false') === 'true';
            isAutoRunActive = getStorage('Vreya_AutoRun_Active', 'false') === 'true';

            btnAutoRun.style.display = isAutoBotActive ? 'flex' : 'none';

            if (isAutoRunActive) {
                btnAutoRun.className = 'custom-btn btn-active-run';
                btnAutoRun.innerHTML = '⏹ Bot';
            } else {
                btnAutoRun.className = 'custom-btn';
                btnAutoRun.innerHTML = '▶ Bot';
            }
        }
        updateAutoRunBtnUI();
        btnAutoRun.onclick = function() {
            const currentState = getStorage('Vreya_AutoRun_Active', 'false') === 'true';

            if (!currentState) {
                isAutoRunActive = true;
                updateAutoRunBtnUI();

                if (typeof createFloatAlert === 'function') {
                    createFloatAlert('Auto Run Started!', 'success');
                }

                startAutoRun();

            } else {
                stopAutoRun();

                isAutoRunActive = false;
                updateAutoRunBtnUI();

                if (typeof createFloatAlert === 'function') {
                    createFloatAlert('Auto Run Stopped!', 'warning');
                }
            }
        };

        let isAutoLootsActive = getStorage('Vreya_AutoLoots_Active', 'false') === 'true';
        const btnAutoLoots = document.createElement('button');
        function updateAutoLootsBtnUI() {
            isAutoBotActive = getStorage('Vreya_AutoBot', 'false') === 'true';
            isAutoLootsActive = getStorage('Vreya_AutoLoots_Active', 'false') === 'true';

            btnAutoLoots.style.display = isAutoBotActive ? 'flex' : 'none';

            if (isAutoLootsActive) {
                btnAutoLoots.className = 'custom-btn btn-active-run';
                btnAutoLoots.innerHTML = '⏹ Loot';
            } else {
                btnAutoLoots.className = 'custom-btn';
                btnAutoLoots.innerHTML = '▶ Loot';
            }
        }
        updateAutoLootsBtnUI();
        btnAutoLoots.onclick = function() {
            const currentState = getStorage('Vreya_AutoLoots_Active', 'false') === 'true';

            if (!currentState) {
                isAutoLootsActive = true;
                updateAutoLootsBtnUI();

                if (typeof createFloatAlert === 'function') {
                    createFloatAlert('Auto Loots Started!', 'success');
                }

                startAutoLoots();
            } else {
                stopAutoLoots();

                isAutoLootsActive = false;
                updateAutoLootsBtnUI();

                if (typeof createFloatAlert === 'function') {
                    createFloatAlert('Auto Loots Stopped!', 'warning');
                }
            }
        };

        const settingWrapper = document.createElement('div');
        settingWrapper.className = 'btn-dropdown-wrapper';

        const btnSettingMenu = document.createElement('button');
        btnSettingMenu.className = 'custom-btn';
        btnSettingMenu.innerHTML = '⚙️Setting';

        const settingPopup = document.createElement('div');
        settingPopup.className = 'float-dropup-menu right-aligned';

        const settingOptions = [
            { name: "🏰 Normal Dungeon", action: () => openModal('modal-normal-dungeon') },
            { name: "⚔️ Hard Dungeon", action: () => openModal('modal-hard-dungeon') },
            { name: "🧊 Cube Dungeon", action: () => openModal('modal-cube-dungeon') },
            { name: "🔧 Setup", action: () => openModal('modal-setting') }
        ];

        settingOptions.forEach(opt => {
            const item = document.createElement('div');
            item.className = 'float-dropup-item';
            item.innerText = opt.name;
            item.onclick = (e) => {
                e.stopPropagation();
                settingPopup.classList.remove('show');
                opt.action();
            };
            settingPopup.appendChild(item);
        });

        btnSettingMenu.onclick = (e) => {
            e.stopPropagation();
            navPopup.classList.remove('show');
            modePopup.classList.remove('show');
            settingPopup.classList.toggle('show');
        };

        settingWrapper.appendChild(btnSettingMenu);
        settingWrapper.appendChild(settingPopup);

        document.addEventListener('click', function(e) {
            if (!menuWrapper.contains(e.target)) navPopup.classList.remove('show');
            if (!settingWrapper.contains(e.target)) settingPopup.classList.remove('show');
            if (!modeWrapper.contains(e.target)) modePopup.classList.remove('show');
        });

        row2.appendChild(btnAutoLoots);
        row2.appendChild(btnAutoRun);

        // --- BARIS KETIGA ---
        const row3 = document.createElement('div');
        row3.className = 'toolbar-row';

        row3.appendChild(menuWrapper);
        row3.appendChild(settingWrapper);
        row3.appendChild(modeWrapper);

        contentBox.appendChild(row1);
        contentBox.appendChild(row2);
        contentBox.appendChild(row3);

        mainToolbar.appendChild(contentBox);
        document.body.appendChild(mainToolbar);

        // Terapkan status awal minimize/maximize dari localStorage
        applyMinimizeState();

        if (!document.getElementById('alerts-container')) {
            const alertsContainer = document.createElement('div');
            alertsContainer.id = 'alerts-container';
            alertsContainer.className = 'alerts-container';
            document.body.appendChild(alertsContainer);
        }
    }

    function createModal(id, title, bodyContent) {
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = 'custom-modal';

        modal.innerHTML = `
            <div class="custom-modal-content">
                <div class="custom-modal-header">
                    <span>${title}</span>
                    <span class="custom-modal-close">&times;</span>
                </div>
                <div class="custom-modal-body">
                    ${bodyContent}
                </div>
            </div>
        `;

        modal.querySelector('.custom-modal-close').onclick = () => modal.style.display = 'none';
        modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

        document.body.appendChild(modal);
    }

    function openModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = 'flex';
    }

    function attachDungeonModalListeners(prefix, mobsDataArr) {
        document.querySelectorAll(`.${prefix}-actived`).forEach(chk => {
            chk.onchange = function() {
                const idx = this.getAttribute('data-index');
                mobsDataArr[idx].actived = this.checked;
            };
        });

        document.querySelectorAll(`.${prefix}-min-dmg`).forEach(inp => {
            inp.oninput = function() {
                const idx = this.getAttribute('data-index');
                mobsDataArr[idx].minDmg = formatNumberInput(this.value);
            };
            inp.onblur = function() {
                this.value = formatNumberDisplay(formatNumberInput(this.value));
            };
        });

        document.querySelectorAll(`.${prefix}-max-dmg`).forEach(inp => {
            inp.oninput = function() {
                const idx = this.getAttribute('data-index');
                mobsDataArr[idx].maxDmg = formatNumberInput(this.value);
            };
            inp.onblur = function() {
                this.value = formatNumberDisplay(formatNumberInput(this.value));
            };
        });
    }

    renderFloatUI();

    let ndMobsData = JSON.parse(localStorage.getItem('Vreya_ndMobs')) || defaultNdMobs;
    createModal('modal-normal-dungeon', 'Normal Dungeon Mobs', generateGroupedMobsHTML(ndMobsData, 'nd'));
    attachDungeonModalListeners('nd', ndMobsData);

    let hdMobsData = JSON.parse(localStorage.getItem('Vreya_hdMobs')) || defaultHdMobs;
    createModal('modal-hard-dungeon', 'Hard Dungeon Mobs', generateGroupedMobsHTML(hdMobsData, 'hd'));
    attachDungeonModalListeners('hd', hdMobsData);

    let cbMobsData = JSON.parse(localStorage.getItem('Vreya_cbMobs')) || defaultCbMobs;
    createModal('modal-cube-dungeon', 'Cube Dungeon Mobs', generateGroupedMobsHTML(cbMobsData, 'cb'));
    attachDungeonModalListeners('cb', cbMobsData);

    let isAutoHeal = getStorage('Vreya_AutoHeal', 'false') === 'true';
    let isAutoLoots = getStorage('Vreya_AutoLoots', 'false') === 'true';
    let isAutoBot = getStorage('Vreya_AutoBot', 'false') === 'true';
    let isConsole = getStorage('Vreya_Console', 'true') === 'true';
    let isUConsole = getStorage('Vreya_UConsole', 'true') === 'true';
    let isNotif = getStorage('Vreya_ShowNotif', 'true') === 'true';
    let isMapTable = getStorage('Vreya_MapTable', 'false') === 'true';

    let isAutoBuyOlympus = getStorage('Vreya_AutoBuyOlympus', 'false') === 'true';
    let isAutoBuyMerchant = getStorage('Vreya_AutoBuyMerchant', 'false') === 'true';
    let isAutoBuyAdvGuild = getStorage('Vreya_AutoBuyAdvGuild', 'false') === 'true';

    function generateModalSetting(){
        const settingHTML = `
        <div class="setting-row">
            <label>Console</label>
            <button id="cfg-console" class="toggle-btn ${isConsole ? 'active' : ''}">${isConsole ? 'ON' : 'OFF'}</button>
        </div>
        <div class="setting-row">
            <label>User Console</label>
            <button id="cfg-uconsole" class="toggle-btn ${isUConsole ? 'active' : ''}">${isUConsole ? 'ON' : 'OFF'}</button>
        </div>
        <div class="setting-row">
            <label>Notification</label>
            <button id="cfg-notif" class="toggle-btn ${isNotif ? 'active' : ''}">${isNotif ? 'ON' : 'OFF'}</button>
        </div>
        <div class="setting-row">
            <label>Reset Console</label>
            <button id="cfg-reset-console" class="reset-btn">Reset</button>
        </div>
        <div class="setting-row">
            <label>Migration</label>
            <button id="cfg-migration" class="reset-btn">Reset</button>
        </div>
        <div class="setting-row">
            <label>Atk Power</label>
            <input type="text" id="cfg-atk-power" class="setting-input" value="${formatNumberDisplay(getStorage('Vreya_Attack_Power', '10000'))}">
        </div>
        <div class="setting-row">
            <label>Tiger</label>
            <input type="text" id="cfg-tiger" class="setting-input" value="${getStorage('Vreya_Tiger_Multiplier', '1.0')}">
        </div>
        <div class="setting-row-inline">
            <label class="checkbox-container">
                <input type="checkbox" id="cfg-use-lsp" ${getStorage('Vreya_Use_Lsp', 'false') === 'true' ? 'checked' : ''}>
                <span>Use LSP</span>
            </label>
            <label class="checkbox-container">
                <input type="checkbox" id="cfg-use-fsp" ${getStorage('Vreya_Use_Fsp', 'false') === 'true' ? 'checked' : ''}>
                <span>Use FSP</span>
            </label>
        </div>
        <hr style="border: 0; border-top: 1px solid #2e3a52; margin: 4px 0;">
        <div class="setting-row-toggle">
            <span>Map to Table</span>
            <button id="cfg-maptable" class="btn-toggle-switch ${isMapTable ? 'active' : ''}">${isMapTable ? 'Enable' : 'Disable'}</button>
        </div>
        <div class="setting-row-toggle">
            <span>Auto Bot</span>
            <button id="cfg-auto-bot" class="btn-toggle-switch ${isAutoBot ? 'active' : ''}">${isAutoBot ? 'Enable' : 'Disable'}</button>
        </div>
        <div class="setting-row-toggle">
            <span>Auto Heal</span>
            <button id="cfg-auto-heal" class="btn-toggle-switch ${isAutoHeal ? 'active' : ''}">${isAutoHeal ? 'Enable' : 'Disable'}</button>
        </div>
        <div class="setting-row-toggle">
            <span>Auto Loots</span>
            <button id="cfg-auto-loots" class="btn-toggle-switch ${isAutoLoots ? 'active' : ''}">${isAutoLoots ? 'Enable' : 'Disable'}</button>
        </div>

        <div class="setting-row-toggle">
            <span>Auto Buy Olympus</span>
            <button id="cfg-auto-bolympus" class="btn-toggle-switch ${isAutoBuyOlympus ? 'active' : ''}">${isAutoBuyOlympus ? 'Enable' : 'Disable'}</button>
        </div>

        <div class="setting-row-toggle">
            <span>Auto Buy Merchant</span>
            <button id="cfg-auto-bmerchant" class="btn-toggle-switch ${isAutoBuyMerchant ? 'active' : ''}">${isAutoBuyMerchant ? 'Enable' : 'Disable'}</button>
        </div>

        <div class="setting-row-toggle">
            <span>Auto Buy Adv Guild</span>
            <button id="cfg-auto-advguild" class="btn-toggle-switch ${isAutoBuyAdvGuild ? 'active' : ''}">${isAutoBuyAdvGuild ? 'Enable' : 'Disable'}</button>
        </div>
        ${createModalFooterHTML('cfg')}
    `;
        createModal('modal-setting', 'Setup Configuration', settingHTML);

        const btnConsole = document.getElementById('cfg-console');
        if (btnConsole) btnConsole.onclick = function() {
            isConsole = !isConsole;
            this.innerText = isConsole ? 'ON' : 'OFF';
            this.classList.toggle('active', isConsole);
            localStorage.setItem('Vreya_Console', isConsole.toString());
        };

        const btnUConsole = document.getElementById('cfg-uconsole');
        if (btnUConsole) btnUConsole.onclick = function() {
            isUConsole = !isUConsole;
            this.innerText = isUConsole ? 'ON' : 'OFF';
            this.classList.toggle('active', isUConsole);
            localStorage.setItem('Vreya_UConsole', isUConsole.toString());
        };

        const btnNotif = document.getElementById('cfg-notif');
        if (btnNotif) btnNotif.onclick = function() {
            isNotif = !isNotif;
            this.innerText = isNotif ? 'ON' : 'OFF';
            this.classList.toggle('active', isNotif);
            localStorage.setItem('Vreya_ShowNotif', isNotif.toString());
        };

        const btnResetConsole = document.getElementById('cfg-reset-console');
        if (btnResetConsole) btnResetConsole.onclick = function() {
            ResetConsole();
        };

        const btnMigration = document.getElementById('cfg-migration');
        if (btnMigration) btnMigration.onclick = function() {
            checkAndMigrateVreya();
        };

        const btnMapTable = document.getElementById('cfg-maptable');
        if (btnMapTable) btnMapTable.onclick = function() {
            isMapTable = !isMapTable;
            this.innerText = isMapTable ? 'Enable' : 'Disable';
            this.classList.toggle('active', isMapTable);
        };

        const btnAutoBot = document.getElementById('cfg-auto-bot');
        if (btnAutoBot) btnAutoBot.onclick = function() {
            isAutoBot = !isAutoBot;
            this.innerText = isAutoBot ? 'Enable' : 'Disable';
            this.classList.toggle('active', isAutoBot);
        };

        const btnAutoHeal = document.getElementById('cfg-auto-heal');
        if (btnAutoHeal) btnAutoHeal.onclick = function() {
            isAutoHeal = !isAutoHeal;
            this.innerText = isAutoHeal ? 'Enable' : 'Disable';
            this.classList.toggle('active', isAutoHeal);
        };

        const btnAutoLoots = document.getElementById('cfg-auto-loots');
        if (btnAutoLoots) btnAutoLoots.onclick = function() {
            isAutoLoots = !isAutoLoots;
            this.innerText = isAutoLoots ? 'Enable' : 'Disable';
            this.classList.toggle('active', isAutoLoots);
        };

        const inputAtkPower = document.getElementById('cfg-atk-power');
        if (inputAtkPower) {
            inputAtkPower.oninput = function() {
                this.value = formatNumberDisplay(formatNumberInput(this.value));
            };
        }

        const btnAutoBuyOlympus = document.getElementById('cfg-auto-bolympus');
        if (btnAutoBuyOlympus) btnAutoBuyOlympus.onclick = function() {
            isAutoBuyOlympus = !isAutoBuyOlympus;
            this.innerText = isAutoBuyOlympus ? 'Enable' : 'Disable';
            this.classList.toggle('active', isAutoBuyOlympus);
        };

        const btnAutoBuyMerchant = document.getElementById('cfg-auto-bmerchant');
        if (btnAutoBuyMerchant) btnAutoBuyMerchant.onclick = function() {
            isAutoBuyMerchant = !isAutoBuyMerchant;
            this.innerText = isAutoBuyMerchant ? 'Enable' : 'Disable';
            this.classList.toggle('active', isAutoBuyMerchant);
        };

        const btnAutoBuyAdvGuild = document.getElementById('cfg-auto-advguild');
        if (btnAutoBuyAdvGuild) btnAutoBuyAdvGuild.onclick = function() {
            isAutoBuyAdvGuild = !isAutoBuyAdvGuild;
            this.innerText = isAutoBuyAdvGuild ? 'Enable' : 'Disable';
            this.classList.toggle('active', isAutoBuyAdvGuild);
        };
    }
    generateModalSetting();

    const btnNdSave = document.getElementById('nd-btn-save');
    if (btnNdSave) {
        btnNdSave.onclick = function() {
            localStorage.setItem('Vreya_ndMobs', JSON.stringify(ndMobsData));
            triggerSaveIndicator('nd-save-indicator');
            createFloatAlert('Normal Dungeon saved!', 'success');
        };
    }

    const btnHdSave = document.getElementById('hd-btn-save');
    if (btnHdSave) {
        btnHdSave.onclick = function() {
            localStorage.setItem('Vreya_hdMobs', JSON.stringify(hdMobsData));
            triggerSaveIndicator('hd-save-indicator');
            createFloatAlert('Hard Dungeon saved!', 'success');
        };
    }

    const btnCbSave = document.getElementById('cb-btn-save');
    if (btnCbSave) {
        btnCbSave.onclick = function() {
            localStorage.setItem('Vreya_cbMobs', JSON.stringify(cbMobsData));
            triggerSaveIndicator('cb-save-indicator');
            createFloatAlert('Cube Dungeon saved!', 'success');
        };
    }

    const btnCfgSave = document.getElementById('cfg-btn-save');
    if (btnCfgSave) {
        btnCfgSave.onclick = function() {
            const inputAtkPower = document.getElementById('cfg-atk-power');
            const inputTiger = document.getElementById('cfg-tiger');
            const chkLsp = document.getElementById('cfg-use-lsp');
            const chkFsp = document.getElementById('cfg-use-fsp');

            if (inputAtkPower) localStorage.setItem('Vreya_Attack_Power', formatNumberInput(inputAtkPower.value).toString());
            if (inputTiger) localStorage.setItem('Vreya_Tiger_Multiplier', formatTigerInput(inputTiger.value));
            if (chkLsp) localStorage.setItem('Vreya_Use_Lsp', chkLsp.checked.toString());
            if (chkFsp) localStorage.setItem('Vreya_Use_Fsp', chkFsp.checked.toString());

            localStorage.setItem('Vreya_AutoBot', isAutoBot.toString());
            localStorage.setItem('Vreya_AutoHeal', isAutoHeal.toString());
            localStorage.setItem('Vreya_AutoLoots', isAutoLoots.toString());
            localStorage.setItem('Vreya_MapTable', isMapTable.toString());

            triggerSaveIndicator('cfg-save-indicator');
            createFloatAlert('Setup saved! Reloading...', 'success');

            setTimeout(() => { window.location.reload(); }, 500);
        };
    }

    // END HERE //
    function ResetConsole(){
        localStorage.removeItem('Arka_Console');
        localStorage.removeItem('Arka_UserConsole');

        createFloatAlert('Console Box Reset', 'success');
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }

    function transformDMapToTable() {
        // 1. Hapus element yang tidak diinginkan
        const legend = document.querySelector('.legend');
        if (legend) legend.remove();

        const avatars = document.querySelectorAll('img.avatar');
        avatars.forEach(img => img.remove());

        // 2. Ambil container utama
        const mapWrap = document.querySelector('.mapwrap');
        if (!mapWrap || mapWrap.querySelector('table')) return; // Berhenti jika sudah jadi tabel

        // 3. Ekstrak data dari pin
        const pins = Array.from(mapWrap.querySelectorAll('a.pin'));
        const data = pins.map(pin => {
            const img = pin.querySelector('img');
            const label = pin.querySelector('.label');
            const labelText = label ? label.innerText : '';
            const mobMatch = labelText.match(/(\d+\/\d+)/);

            return {
                href: pin.getAttribute('href'),
                title: labelText.replace(/\s*—\s*\d+\/\d+/, '').replace(/\s*•\s*Boss\s*\d+\/\d+/, ' • Boss').replace(/\d+\/\d+/, '').trim() || 'Tanpa Judul',
                mobs: mobMatch ? mobMatch[0] : '-',
                imgSrc: img ? img.getAttribute('src') : ''
            };
        });

        // 4. Buat Element Tabel
        const table = document.createElement('table');
        Object.assign(table.style, {
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#121522',
            color: '#e6e8f0',
            fontFamily: 'sans-serif'
        });

        table.innerHTML = `
            <tbody>
                ${data.map(item => `
                    <tr style="border-bottom: 1px solid #30363d;" onmouseover="this.style.backgroundColor='#1c2136'" onmouseout="this.style.backgroundColor='transparent'">
                        <td style="padding: 8px 12px; width: 60px;">
                            <a href="${item.href}"><img src="${item.imgSrc}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover; border: 1px solid #30363d; display: block;"></a>
                        </td>
                        <td style="padding: 12px; font-weight: bold;">
                            <a href="${item.href}" style="color: inherit; text-decoration: none; display: block;">${item.title}</a>
                        </td>
                        <td style="padding: 12px; text-align: right; width: 80px;">
                            <span style="background: #232a42; padding: 2px 8px; border-radius: 4px; border: 1px solid #3f4a6e; font-family: monospace;">${item.mobs}</span>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        // 5. Update DOM
        mapWrap.innerHTML = '';
        Object.assign(mapWrap.style, { display: 'block', background: 'none', height: 'auto' });
        mapWrap.appendChild(table);
    }
    function Update_Stamina_Required_UI() {
        Apply_EXP_Top_Styles();
        const container = document.querySelector(".gtb-right");
        if (!container){
            return;
        }
        const levelDiv = container.querySelector(".gtb-level");
        const expDiv = container.querySelector(".gtb-exp");
        const expText = container.querySelector(".gtb-exp-top span:last-child");

        if (!levelDiv || !expDiv || !expText){
            return;
        }
        const level = parseInt(levelDiv.textContent.replace(/\D/g, ""));

        const [currentExp, totalExp] = expText.textContent
        .replace(/,/g, "")
        .split("/")
        .map(v => parseInt(v.trim()));

        if (!level || !totalExp){
            return;
        }

        const staminaRequired = Math.ceil((totalExp - currentExp) / Math.max(1, Math.floor(level / 4)));
        const NeedExp = (totalExp - currentExp);
        let staminaDiv = container.querySelector("#arka_stamina_required");

        if (!staminaDiv) {
            staminaDiv = levelDiv.cloneNode(true);
            staminaDiv.id = "arka_stamina_required";
            staminaDiv.style.fontSize = "12px";
            staminaDiv.style.opacity = "0.85";
            staminaDiv.style.fontWeight = "400";
            expDiv.insertAdjacentElement("afterend", staminaDiv);
        }

        staminaDiv.textContent = "💪" + staminaRequired.toLocaleString() +" | ⚡"+ NeedExp.toLocaleString();

    }
    function Apply_EXP_Top_Styles() {

        const expTop = document.querySelector(".gtb-exp-top");
        if (!expTop){
            return;
        }

        expTop.style.display = "flex";
        expTop.style.alignItems = "center";
        expTop.style.gap = "4px";
        expTop.style.whiteSpace = "nowrap";
        expTop.style.flexWrap = "nowrap";

        expTop.querySelectorAll("span").forEach(s => {
            s.style.whiteSpace = "nowrap";
        });

        // Cek dulu apakah ID style ini sudah ada di <head>
        if (!document.getElementById("vreya-exp-style")) {
            const Top_Style = document.createElement("style");
            Top_Style.id = "vreya-exp-style"; // Beri ID unik
            Top_Style.innerHTML = `.gtb-inner{max-width:1150px!important}`;
            document.head.appendChild(Top_Style);
        }
    }

    function extractUserIdFromScripts() {
        for (const s of document.scripts) {
            const m = s.textContent.match(/const\s+USER_ID\s*=\s*(\d+)/);
            if (m){
                return Number(m[1]);
            }
        }
        return null;
    }
    const userId = extractUserIdFromScripts();

    function normalize(str) {
        return str
            ?.replace(/\s+/g, " ")
            ?.trim()
            ?.toLowerCase();
    }
    function attachDmgLabel(fightBtn) {
        if (fightBtn.nextSibling?.className === "dmg-label") {
            return fightBtn.nextSibling;
        }

        const span = document.createElement("div");
        span.className = "dmg-label";
        span.style.marginLeft = "8px";
        span.style.fontSize = "12px";
        span.style.color = "#ffb3b3";
        span.style.display = "flex";
        span.style.flexDirection = "column";
        //span.textContent = " DMG: 0";

        span.innerHTML = `
<span>DMG: 0 / 0</span>
<span>Cost: 0 / 0</span>`;

        fightBtn.after(span);
        return span;
    }
    function isJoined(mon) {
        const pill = mon.querySelector(".pill");
        return pill?.textContent.trim().toLowerCase() === "joined";
    }
    function baseQS_N(x) {
        const url = new URL(x);
        const p = new URLSearchParams();

        const isDungeon = url.searchParams.has("dgmid");
        const isNormal = url.searchParams.has("id");

        if (isDungeon) {
            const instance_id = url.searchParams.get('instance_id');
            const dgmid = url.searchParams.get('dgmid');
            p.set('instance_id', String(instance_id));
            p.set('dgmid', String(dgmid || 0));
        } else if (isNormal) {
            const battleId = url.searchParams.get('id');
            p.set('monster_id', String(battleId || 0));
        }
        return p;
    }
    function ep(name) {
        const url2 = new URL(window.location.href);
        const isDungeon1 = url2.searchParams.has("dgmid");
        const isDungeon2 = url2.searchParams.has("location_id");
        const isDungeon3 = url2.searchParams.has("instance_id");
        if (isDungeon1 || (isDungeon2 && isDungeon3)) {
            const EP1 = {
                "ATTACK": "damage.php",
                "JOIN": "dungeon_join_battle.php",
                "LOOT": "dungeon_loot.php",
                "HEAL": "user_heal.php",
                "HEAL_POTION": "user_heal_potion.php"
            }
            || {};
            return EP1[name] || '';
        } else {
            const EP2 = {
                "ATTACK": "damage.php",
                "JOIN": "user_join_battle.php",
                "LOOT": "loot.php",
                "HEAL": "user_heal.php",
                "HEAL_POTION": "user_heal_potion.php"
            }
            || {};
            return EP2[name] || '';
        }
    }
    function getCookie(name) {
        return document.cookie
            .split("; ")
            .find(row => row.startsWith(name + "="))
            ?.split("=")[1];
    }
    function setCookie(name, value, seconds) {
        const expires = new Date(Date.now() + seconds * 1000).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/`;
    }

    async function Join_Battle_D(x) {
        try {
            const p = baseQS_N(x);
            p.set('user_id', userId);

            const res = await fetch(ep('JOIN'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: p.toString()
            });
        } catch (e) {
            console.log('Server error. Please try again.', 'error');
        }
    }
    async function ensureJoined(mon, fightBtn) {
        if (isJoined(mon)){
            return;
        }
        await Join_Battle_D(fightBtn.href);
    }
    const dmgCache = new Map();
    async function fetchMonsterDmg(url) {
        if (dmgCache.has(url)){
            return dmgCache.get(url);
        }
        try {
            const res = await fetch(url, {
                credentials: "include"
            });
            const html = await res.text();

            const doc = new DOMParser().parseFromString(html, "text/html");
            const dmgEl = doc.querySelector("#yourDamageValue");

            const dmg = dmgEl ? dmgEl.textContent.trim() : "N/A";
            dmgCache.set(url, dmg);
            return dmg;
        } catch {
            return "ERR";
        }
    }
    async function fetchMonsterDmgValue(url) {
        const dmgText = await fetchMonsterDmg(url);
        if (!dmgText || dmgText === "N/A" || dmgText === "ERR"){
            return 0;
        }
        return parseInt(dmgText.replace(/,/g, ""), 10);
    }
    async function GetMobDmgDungeon(){
        const stamLabel = document.querySelector("#stamina_span");
        if (!stamLabel) return false;
        const MobQue = [...document.querySelectorAll(".mon")].map(mon => {
            const nameEl = mon.querySelector("div[style*='font-weight:700']");
            const domName = nameEl ? normalize(nameEl.textContent) : "";
            if (!domName) return null;

            // 1. Cari monster di ActiveDB yang aktif (actived === true)
            const matchedMonster = activeDB.find(m =>
                                                 m.actived === true &&
                                                 Number(m.location_id) === location_id &&
                                                 domName.includes(normalize(m.name))
                                                );

            // ❌ RULE 1: Jika actived === false / Tidak ada di DB -> SKIPPED (Bebas Label)
            if (!matchedMonster) return null;

            // Evaluasi Mode
            const isMinDmgMode = (usedDmg === "minDmg");
            const isMaxDmgMode = (usedDmg === "maxDmg");

            // Cek tipe target monster bawaan DB
            const monsterTargetType = matchedMonster.usedDmg || (matchedMonster.useMaxDmg ? "maxDmg" : "minDmg");

            // ❌ RULE 2: Jika usedDmg global = "minDmg", tapi monster targetnya = "maxDmg" -> SKIPPED
            if (isMinDmgMode && monsterTargetType === "maxDmg") {
                return null;
            }

            // Tentukan nilai target damage angka murni
            const targetDmgValue = isMaxDmgMode ? matchedMonster.maxDmg : matchedMonster.minDmg;
            const targetDmg = Number(targetDmgValue) || 0;

            // ❌ RULE 3: Jika nilai minDmg / maxDmg dari LocalStorage = 0 atau Kosong -> SKIPPED (Bebas Label)
            if (targetDmg <= 0) {
                return null;
            }

            const fightBtn = mon.querySelector("a.btn[href^='battle.php']");
            if (!fightBtn) return null;

            const url = new URL(fightBtn.href);
            const dgmid = url.searchParams.get('dgmid');
            const dmgLabel = attachDmgLabel(fightBtn);

            return {
                id: dgmid,
                fightBtn,
                dmgLabel,
                targetDmg,
            };
        }).filter(Boolean);

        for (const g of MobQue) {
            const url = g.fightBtn
            let totalDmg = Number(await fetchMonsterDmgValue(url.href)) || 0;
            const numTargetDmg = Number(g.targetDmg);
            if (totalDmg >= numTargetDmg) {
                if (g.dmgLabel) {
                    g.dmgLabel.innerHTML = `
<span>DMG: ${Number(totalDmg).toLocaleString()} / ${numTargetDmg.toLocaleString()}</span>
<span>Cost: 0 / 0</span>`;
                }
            }
        }
    }

    async function processDungeon() {
        const stamLabel = document.querySelector("#stamina_span");
        if (!stamLabel) return false;

        const MobQue = [...document.querySelectorAll(".mon")].map(mon => {
            const nameEl = mon.querySelector("div[style*='font-weight:700']");
            const domName = nameEl ? normalize(nameEl.textContent) : "";
            if (!domName) return null;

            // 1. Cari monster di ActiveDB yang aktif (actived === true)
            const matchedMonster = activeDB.find(m =>
                                                 m.actived === true &&
                                                 Number(m.location_id) === location_id &&
                                                 domName.includes(normalize(m.name))
                                                );

            // ❌ RULE 1: Jika actived === false / Tidak ada di DB -> SKIPPED (Bebas Label)
            if (!matchedMonster) return null;

            // Evaluasi Mode
            const isMinDmgMode = (usedDmg === "minDmg");
            const isMaxDmgMode = (usedDmg === "maxDmg");

            // Cek tipe target monster bawaan DB
            const monsterTargetType = matchedMonster.usedDmg || (matchedMonster.useMaxDmg ? "maxDmg" : "minDmg");

            // ❌ RULE 2: Jika usedDmg global = "minDmg", tapi monster targetnya = "maxDmg" -> SKIPPED
            if (isMinDmgMode && monsterTargetType === "maxDmg") {
                return null;
            }

            // Tentukan nilai target damage angka murni
            const targetDmgValue = isMaxDmgMode ? matchedMonster.maxDmg : matchedMonster.minDmg;
            const targetDmg = Number(targetDmgValue) || 0;

            // ❌ RULE 3: Jika nilai minDmg / maxDmg dari LocalStorage = 0 atau Kosong -> SKIPPED (Bebas Label)
            if (targetDmg <= 0) {
                return null;
            }

            const fightBtn = mon.querySelector("a.btn[href^='battle.php']");
            if (!fightBtn) return null;

            const url = new URL(fightBtn.href);
            const dgmid = url.searchParams.get('dgmid');

            // 🟢 PASANG LABEL UI (Hanya monster yang lolos SEMUA aturan di atas yang diberi label)
            const dmgLabel = attachDmgLabel(fightBtn);

            // 2. Cek Status Damage Terkini di UI
            if (dmgLabel) {
                const currentDmgMatch = dmgLabel.textContent.match(/DMG:\s*([\d,]+)/i);
                if (currentDmgMatch) {
                    const currentDmg = parseInt(currentDmgMatch[1].replace(/,/g, ''), 10) || 0;

                    // Jika damage monster sudah terpenuhi/lunas
                    if (currentDmg >= targetDmg) {
                        // Update tampilan labelnya di UI agar angkanya presisi
                        dmgLabel.innerHTML = `
<span>DMG: ${currentDmg.toLocaleString()} / ${targetDmg.toLocaleString()}</span>
<span>Cost: 0 / 0</span>`;

                        // Skip dari antrean serangan (MobQue)
                        return null;
                    }
                }
            }

            return {
                id: dgmid,
                mon,
                fightBtn,
                dmgLabel,
                stamLabel: stamLabel,
                targetDmg,
                expRate: Number(matchedMonster.exp) || 0,
                locationId: typeof location_id !== 'undefined' ? location_id : 0
            };
        }).filter(Boolean);

        // 🟢 JIKA TIDAK ADA MONSTER YANG HARUS DISERANG (SEMUA SUDAH DONE / TUNTAS)
        // Maka lokasi ini dianggap SUDAH SELESAI -> Return True agar pindah lokasi!
        if (!MobQue.length) {
            console.log("✅ Semua target monster di lokasi ini sudah tuntas!");
            return true;
        }

        console.log('Start Attacking the Monster');
        createFloatAlert('Start Attacking the Monster', 'warning');

        let didAttack = false;
        let isStaminaOut = false; // Flag penanda jika kehabisan stamina

        // Helper Fungsi Simpan Log
        const saveLogs = (logDataList) => {
            if (!logDataList || !logDataList.length) return;
            const existingLogs = JSON.parse(localStorage.getItem("Vreya_ddMobs")) || [];

            logDataList.forEach(logData => {
                if (logData && (logData.totaldmg > 0 || logData.exp > 0)) {
                    const index = existingLogs.findIndex(item => item.dgmid === logData.dgmid);
                    if (index !== -1) {
                        existingLogs[index].totaldmg = logData.totaldmg;
                        existingLogs[index].exp = logData.exp;
                    } else {
                        existingLogs.push(logData);
                    }
                }
            });

            localStorage.setItem("Vreya_ddMobs", JSON.stringify(existingLogs));
        };

        // ⚡ BATCH PARALLEL PROCESSING (5 Monster Sekaligus)
        const BATCH_SIZE = 5;

        for (let i = 0; i < MobQue.length; i += BATCH_SIZE) {
            const chunk = MobQue.slice(i, i + BATCH_SIZE);
            didAttack = true;

            const batchResults = await Promise.all(
                chunk.map(g => prepareAttack(g.id, g.mon, g.fightBtn, g.dmgLabel, g.stamLabel, g.targetDmg, g.locationId, g.expRate))
            );

            // Simpan Log Penyerangan
            saveLogs(batchResults);

            // 🛑 CEK STATUS HASIL ATTACK
            // Jika ada minimal 1 hasil batch yang statusnya 'waiting' (stamina habis)
            const hasWaiting = batchResults.some(res => res && res.status === 'waiting');
            if (hasWaiting) {
                console.warn('⚠️ Stamina habis ditengah proses batch!');
                isStaminaOut = true;
                break; // Stop loop batch berikutnya
            }
        }

        // 🔴 JIKA STAMINA HABIS -> RETURN FALSE (Jangan pindah lokasi & jangan potong antrean)
        if (isStaminaOut) {
            createFloatAlert('Stamina Out! Pausing AutoRun...', 'danger');
            return false;
        }

        if (didAttack) {
            createFloatAlert('Done Processing Active Mobs', 'success');
        }

        // 🟢 JIKA SEMUA BATCH SUDAH SELESAI DENGAN TUNTAS -> RETURN TRUE (Boleh pindah lokasi)
        localStorage.removeItem("Vreya_ddMobs");
        return true;
    }

    let isStaminaAlertActive = false;

    async function prepareAttack(id, mon, fightBtn, dmgLabel, stamLabel, targetDmg, locationId, expRate = 0) {
        if (!id || !locationId || !targetDmg) return;

        const numTargetDmg = Number(targetDmg);

        // ⚡ 1. Ambil damage awal dari server/DOM
        let totalDmg = Number(await fetchMonsterDmgValue(fightBtn.href)) || 0;

        // 🟢 CEK DINI: Jika damage DARI AWAL sudah memenuhi target
        if (totalDmg >= numTargetDmg) {
            if (dmgLabel) {
                dmgLabel.innerHTML = `
<span>DMG: ${Number(totalDmg).toLocaleString()} / ${numTargetDmg.toLocaleString()}</span>
<span>Cost: 0 / 0</span>`;
            }
            return {
                dgmid: id,
                totaldmg: totalDmg,
                exp: Math.floor(totalDmg * expRate),
                status: 'done'
            };
        }

        // 2. Jika damage belum terpenuhi, baru lakukan join
        await ensureJoined(mon, fightBtn);

        const stamElement = document.querySelector("#stamina_span");
        let Current_Stamina = stamElement
        ? parseInt(stamElement.textContent.replace(/,/g, "").trim(), 10) || 0
        : 0;

        dmgLabel.innerHTML = `
<span>DMG: ${Number(totalDmg).toLocaleString()} / ${numTargetDmg.toLocaleString()}</span>
<span>Cost: 0 / 0</span>`;

        const Vreya_Tiger_Multiplier = Number(localStorage.getItem("Vreya_Tiger_Multiplier")) || 1;
        const Vreya_Min_Stamina = Number(localStorage.getItem("Vreya_Min_Stamina")) || 1;
        const Arka_Attack_Power = Number(localStorage.getItem("Vreya_Attack_Power")) || 10000;

        const locId = Number(locationId);

        const availableTiers = (locId >= 6 && locId <= 13)
        ? [1, 10, 50, 100, 200, 1000]
        : [1, 10];

        while (totalDmg < numTargetDmg) {
            const exactStaminaNeeded = (numTargetDmg - totalDmg) / Arka_Attack_Power;
            let Stamina_Cost = availableTiers[0];

            for (const tier of availableTiers) {
                const minStam = tier * Vreya_Tiger_Multiplier;
                if (Current_Stamina >= minStam) {
                    Stamina_Cost = tier;
                    if (tier >= exactStaminaNeeded) {
                        break;
                    }
                }
            }

            // 🎯 Kunci Zone 1 (Lokasi 1-5) ke Cost 1
            if (locId >= 1 && locId <= 5) {
                if (exactStaminaNeeded <= 10 && Current_Stamina >= (1 * Vreya_Tiger_Multiplier)) {
                    Stamina_Cost = 1;
                }
            }

            const requiredMinStam = Stamina_Cost * Vreya_Tiger_Multiplier;
            if (Current_Stamina < requiredMinStam || Current_Stamina < (Vreya_Min_Stamina * Vreya_Tiger_Multiplier)) {
                console.log('Insufficient stamina. Current Stamina: ' + Current_Stamina);

                // 🎯 CEK KUNCI: Hanya panggil FloatAlert & Delay JIKA belum dipanggil oleh monster lain!
                if (!isStaminaAlertActive) {
                    isStaminaAlertActive = true; // Kunci agar monster lain di batch ini diam

                    createFloatAlert('Stamina Out! Waiting before refreshing...', 'warning');
                    await new Promise(r => setTimeout(r, 1000));

                    // Reset kunci setelah 2 detik agar siap digunakan lagi jika stamina diisi ulang nanti
                    setTimeout(() => { isStaminaAlertActive = false; }, 2000);
                }

                return {
                    dgmid: id,
                    totaldmg: totalDmg,
                    exp: totalExp,
                    status: 'waiting',
                };
            }

            const result = await attackOnce(fightBtn, Stamina_Cost, Current_Stamina, locId);

            if (!result || !result.DamageDone) {
                if (result && result.isDead) {
                    // 1. Ambil & bersihkan nama monster dari DOM mon
                    const nameEl = mon ? mon.querySelector("div[style*='font-weight:700']") : null;
                    let mobName = nameEl ? nameEl.textContent : "";

                    mobName = mobName
                        .replace(/no loot|not looted|not joined|joined|dead/gi, "") // Buang kata status game
                        .replace(/\(\s*\)/g, "") // Buang kurung kosong ()
                        .replace(/\s+/g, " ") // Hapuskan spasi ganda
                        .trim();

                    // 2. Format tampilan nama (Fallback ke Mob #id jika nama tidak ditemukan)
                    const cleanDisplayName = mobName || `Mob #${id}`;

                    // 🎯 Log menggunakan Nama Monster
                    console.log(`[Skip] ${cleanDisplayName} is already dead.`);
                } else {
                    console.log('Attack failed. Loop stopped.');
                }
                break;
            }

            if (result.ServerTotalDmg !== null && result.ServerTotalDmg !== undefined) {
                totalDmg = Number(result.ServerTotalDmg);
            } else {
                totalDmg += Number(result.DamageDone);
            }

            Current_Stamina = Number(result.Current_Stamina);
            Stamina_Cost = Number(result.Arka_Stamina_Cost) || Stamina_Cost;

            if (stamLabel) {
                stamLabel.textContent = Current_Stamina.toLocaleString();
            }

            console.log('Used: ' + Stamina_Cost + ' Stam');
            console.log('Damage: ' + Number(result.DamageDone).toLocaleString());

            dmgLabel.innerHTML = `
<span>DMG: ${Number(totalDmg).toLocaleString()} / ${numTargetDmg.toLocaleString()}</span>
<span>Cost: ${Stamina_Cost} / ${Number(result.DamageDone).toLocaleString()}</span>`;

            if (totalDmg >= numTargetDmg) {
                // 1. Ambil teks asli dari elemen DOM
                const nameEl = mon ? mon.querySelector("div[style*='font-weight:700']") : null;
                let mobName = nameEl ? nameEl.textContent : "";

                // 2. Bersihkan teks (Hapus "not joined", "joined", newline, dan spasi berlebih)
                mobName = mobName
                    .replace(/no loot|not looted|not joined|joined|dead/gi, "") // Buang kata status game
                    .replace(/\(\s*\)/g, "") // Buang kurung kosong ()
                    .replace(/\s+/g, " ") // Hapuskan spasi ganda
                    .trim();

                // 3. Fallback jika nama kosong, gunakan Mob #id
                const displayName = mobName || `#${id}`;

                // 🎯 Tampilan di FloatAlert & Console
                createFloatAlert(`🎯 ${displayName}: Target Damage Reached! #${id}`, 'success');
                console.log(`[Done] ${displayName} Damage: ${Number(totalDmg).toLocaleString()}`);

                break;
            }

            if (locId >= 1 && locId <= 5) {
                // await new Promise(r => setTimeout(r, 25));
            }
        }

        const totalExp = Math.floor(totalDmg * expRate);

        if (typeof Update_Stamina_Required_UI === 'function') {
            Update_Stamina_Required_UI();
        }

        return {
            dgmid: id,
            totaldmg: totalDmg,
            exp: totalExp,
            status: 'done',
        };
    }
    async function attackOnce(fightBtn, Stamina_Cost, Current_Stamina, locationId) {
        if (!locationId) return { DamageDone: 0, Current_Stamina, Arka_Stamina_Cost: 1 };

        const fd = baseQS_N(fightBtn.href);

        // Multiplier & parameter
        const Vreya_Tiger_Multiplier = Number(localStorage.getItem("Vreya_Tiger_Multiplier")) || 1;
        let stamina = Number(Current_Stamina);
        const locId = Number(locationId);
        const requestedCost = Number(Stamina_Cost);

        // 1. Tentukan Tier Stamina TERURUT DARI TERKECIL KE TERBESAR per Zona
        // Zone 2 & 3 (Loc 6-13): [10, 50, 100, 200, 1000]
        // Zone 1 (Loc 1-5):      [1, 10]
        const availableTiers = (locId >= 6 && locId <= 13)
        ? [1, 10, 50, 100, 200, 1000]
        : [1, 10];

        // Pemetaan Skill ID
        const skillMap = {
            "1000": "-5",
            "200":  "-4",
            "100":  "-3",
            "50":   "-2",
            "10":   "-1",
            "1":    "0"
        };

        // 2. Evaluasi Cost: Prioritaskan cost terkecil yang memenuhi syarat
        let Arka_Stamina_Cost = availableTiers[0]; // Default ke tier terkecil (1 atau 10)

        for (const tier of availableTiers) {
            const requiredStamina = tier * Vreya_Tiger_Multiplier;

            if (stamina >= requiredStamina) {
                Arka_Stamina_Cost = tier;
                // Jika tier ini sudah menyamai atau melebihi cost yang diminta prepareAttack, STOP!
                if (tier >= requestedCost) {
                    break;
                }
            }
        }

        const Arka_Skill_ID = skillMap[String(Arka_Stamina_Cost)] || "0";

        fd.set('skill_id', Arka_Skill_ID);
        fd.set('stamina_cost', String(Arka_Stamina_Cost));

        try {
            const res = await fetch(ep('ATTACK'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: fd.toString()
            });

            const data = await res.json();
            //console.log(data);

            // 🎯 CEK KHUSUS: Jika monster ternyata sudah mati di server
            if (data.status === "error" && data.message === "Monster is already dead.") {
                //console.log("⚠️ Monster is already dead. Skipping...");

                // Kembalikan objek khusus/null agar prepareAttack tahu untuk STOP memukul
                return {
                    isDead: true,
                    DamageDone: 0,
                    Current_Stamina: Current_Stamina // Stamina tidak berkurang
                };
            }

            // Penanganan Karakter Mati
            if (data.message === "You are dead.") {
                console.log("Die, using a Heal Potion...");
                createFloatAlert('Die, using a Heal Potion...', 'info');

                const healpotion = new URLSearchParams();
                healpotion.set('user_id', typeof userId !== 'undefined' ? userId : '');

                await fetch(ep('HEAL_POTION'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: healpotion.toString()
                });

                console.log("Healed, counter-attacking...");
                return await attackOnce(fightBtn, Stamina_Cost, Current_Stamina, locationId);
            }

            if (data.status !== "success") {
                return {
                    DamageDone: 0,
                    Current_Stamina: stamina,
                    Arka_Stamina_Cost
                };
            }

            // Parsing Output
            const msg = data.message || "";
            const m = msg.match(/<strong>([\d,]+)<\/strong>/);
            const dmg = m ? (parseInt(m[1].replace(/,/g, ""), 10) || 0) : 0;

            const xpDelta = Number(data.xp_delta) || 0;
            const serverStamina = typeof data.stamina !== 'undefined' ? Number(data.stamina) : stamina;
            const serverTotalDmg = typeof data.totaldmgdealt !== 'undefined' ? Number(data.totaldmgdealt) : null;

            return {
                DamageDone: dmg,
                Current_Stamina: serverStamina,
                ServerTotalDmg: serverTotalDmg,
                XpDelta: xpDelta,
                Arka_Stamina_Cost
            };

        } catch (err) {
            console.error("Attack Failed:", err);
            return {
                DamageDone: 0,
                Current_Stamina: stamina,
                Arka_Stamina_Cost
            };
        }
    }
    function getOptimalStaminaCost(targetDmg, attackPower, availableTiers) {
        // 1. Urutkan tier dari terkecil ke terbesar: [1, 10, 50, 100, 200, 1000]
        const sortedTiers = [...availableTiers].sort((a, b) => a - b);

        let chosenCost = sortedTiers[0]; // Default ke tier terkecil

        for (const cost of sortedTiers) {
            const estimatedDmg = attackPower * cost;

            chosenCost = cost;

            // Jika perkiraan damage dengan cost ini sudah mencapai/melewati target,
            // hentikan pencarian agar tidak memakai cost yang lebih besar lagi
            if (estimatedDmg >= targetDmg) {
                break;
            }
        }

        return chosenCost;
    }

    // DUNGEON AUTO HEAL
    function dungeonAutoHeal(){
        const fside_head = document.querySelector('.side-head');
        if(fside_head){
            const find_a_side_head = fside_head.querySelector('a');
            const find_urlString_for_id = find_a_side_head.href;
            const findurlObj = new URL(find_urlString_for_id);
            const user_pid = findurlObj.searchParams.get('pid');

            if (location.href.includes("guild_dungeon_instance.php")){
                const healBarr = window.document.querySelector(".playerhp .bar .fill");
                const healBarr_width = healBarr.style.width;

                const healCountdown = window.document.getElementById('healCountdown');
                setTimeout(function() {
                    if(healCountdown.innerHTML === "00:00:00"){
                        if(healBarr_width !== "100%"){
                            createFloatAlert('Auto Heal Run', 'warning');
                            healDPlayer(instance_id, user_pid, this);
                            const buttons = document.querySelectorAll(".custom-btn");
                            buttons.forEach(button => {
                                button.disabled = true;
                            });

                        }else{
                            createFloatAlert('Max HP', 'warning');
                        }
                    }else{
                        createFloatAlert('Heal Time still Run', 'warning');
                    }
                }, 2000);
            }
        }
    }

    function healDPlayer(instanceId, userId, btn){
        const fd = new FormData();
        fd.append('instance_id', instanceId);
        fd.append('user_id', userId);

        fetch('user_heal.php', {
            method: 'POST',
            body: fd,
            headers: {'X-Requested-With': 'fetch'}
        }).then(r => r.json()).then(j => {
            if (j && j.ok){
                location.reload();
            }else {
                createFloatAlert('Auto Heal Done', 'success');
                setTimeout(function() {
                    location.reload();
                }, 2000);
            }
        }).catch(() => {
            alert('Network error.');
        });
    }

    //SILENT FETCH LOOT
    async function directLootAll(instanceId, locationId) {
        const body = new URLSearchParams();
        body.append('action', 'loot_all');
        body.append('instance_id', String(instanceId));
        body.append('location_id', String(locationId));

        try {
            await fetch('dungeon_loot.php', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: body.toString()
            });
            return true;
        } catch (err) {
            console.error("[Vreya AutoLoots] Fetch loot error:", err);
            return false;
        }
    }
    function closeLootAllModal() {
        const modal = document.getElementById('lootAllModal');
        if (modal) {
            modal.style.display = 'none';
        }
        if (lootAllReloadOnClose) {
            location.reload();
        }
    }

    // MIGRATE FROM OLD TO NEW
    function checkAndMigrateVreya() {
        try {
            // 1. Cek apakah migrasi V3 sudah pernah dilakukan
            const isMigrated = localStorage.getItem("Vreya_v3_Migrated");
            if (isMigrated === "true") return;

            // 🔵 Alert Start
            createFloatAlert('Starting Arka data migration to Vreya...', 'info');

            // 2. MIGRASI CONFIG / SETTINGS
            const configMappings = {
                "Arka_Attack_Power": "Vreya_Attack_Power",
                "Arka_Damage_Target": "Vreya_Damage_Target",
                "Arka_Min_Stamina": "Vreya_Min_Stamina",
                "Arka_Tiger_Multiplier": "Vreya_Tiger_Multiplier",
                "Arka_Use_Lsp": "Vreya_Use_Lsp",
                "Arka_Use_Fsp": "Vreya_Use_Fsp"
            };

            Object.entries(configMappings).forEach(([oldKey, newKey]) => {
                const oldVal = localStorage.getItem(oldKey);
                if (oldVal !== null && oldVal !== undefined) {
                    localStorage.setItem(newKey, oldVal);
                }
            });

            // 3. MIGRASI DATA MONSTER (Vreya_*Mobs)
            const rawMin = localStorage.getItem("Arka_Guild_Monsters");
            const rawMax = localStorage.getItem("Arka_GuildC_Monsters");

            if (rawMin || rawMax) {
                const oldMin = JSON.parse(rawMin || "[]");
                const oldMax = JSON.parse(rawMax || "[]");

                if (oldMin.length > 0 || oldMax.length > 0) {
                    const norm = str => (str || "").toLowerCase().trim();
                    const vreyaKeys = ["Vreya_ndMobs", "Vreya_hdMobs", "Vreya_cbMobs"];

                    vreyaKeys.forEach(key => {
                        let vreyaList = JSON.parse(localStorage.getItem(key) || "[]");
                        if (vreyaList.length === 0) return;

                        vreyaList = vreyaList.map(mob => {
                            const mobName = norm(mob.name);
                            const matchedMin = oldMin.find(m => norm(m.name) === mobName);
                            const matchedMax = oldMax.find(m => norm(m.name) === mobName);

                            if (matchedMin || matchedMax) {
                                return {
                                    ...mob,
                                    actived: true,
                                    minDmg: matchedMin ? Number(matchedMin.dmg) : mob.minDmg,
                                    maxDmg: matchedMax ? Number(matchedMax.dmg) : mob.maxDmg
                                };
                            }
                            return mob;
                        });

                        localStorage.setItem(key, JSON.stringify(vreyaList));
                    });
                }
            }

            // 4. Tandai bahwa migrasi versi 3 sudah selesai
            localStorage.setItem("Vreya_v3_Migrated", "true");

            // 🟢 Alert Finish & Wait Reload
            createFloatAlert('Migration successful! The page will reload in 3 seconds...', 'success');

            // Reload otomatis setelah jeda
            setTimeout(() => {
                location.reload();
            }, 3000);

        } catch (error) {
            // 🔴 Alert Error
            console.error("Migration failed:", error);
            createFloatAlert('Data migration failed! Check the console for details..', 'danger'); // atau 'error' sesuai tema UI Anda
        }
    }
    function getPotionData(targetAlias) {
        const potions = {};

        document.querySelectorAll('.potion-use-btn').forEach(btn => {
            const inv = btn.getAttribute('data-inv');
            const item = btn.getAttribute('data-item');
            const name = btn.getAttribute('data-name') || '';
            const qty = btn.getAttribute('data-max');

            // Membuat alias dari huruf pertama setiap kata (misal: Large Stamina Potion -> LSP)
            const alias = name
            .split(' ')
            .filter(word => word.length > 0)
            .map(word => word[0].toUpperCase())
            .join('');

            const potionData = { inv, item, name, alias, qty };

            // Simpan ke object dictionary dengan key alias
            if (alias) {
                potions[alias] = potionData;
            }
        });

        // Jika parameter alias diberikan, kembalikan data spesifik.
        // Jika tidak, kembalikan seluruh data potion.
        if (targetAlias) {
            return potions[targetAlias.toUpperCase()] || null;
        }

        return potions;
    }
    function get_potion(type, maxstam, rest) {
        const numMaxStam = Number(maxstam) || 0;

        // Menghitung stamina untuk LSP berdasarkan nilai maxstam
        let lspStam = 5000;
        if (numMaxStam > 10000) {
            lspStam = numMaxStam / 2;
        } else if (numMaxStam < 5000) {
            lspStam = numMaxStam;
        } else {
            lspStam = 5000;
        }

        const typeMap = {
            'SSP': { name: 'Small Stamina Potion', stam: 20 },
            'FSP': { name: 'Full Stamina Potion', stam: numMaxStam },
            'LSP': { name: 'Large Stamina Potion', stam: lspStam }
        };

        const target = typeMap[type];
        if (!target) return null;

        // Jika meminta data 'stam', langsung kembalikan hasil kalkulasinya
        if (rest === 'stam') {
            return target.stam;
        }

        const button = document.querySelector(`.potion-use-btn[data-name="${target.name}"]`);

        if (!button) return null;

        if (rest === 'id') {
            const rawId = button.dataset.item || button.getAttribute('data-item');
            return rawId ? parseInt(rawId, 10) : null;
        } else if (rest === 'name') {
            return button.dataset.name || button.getAttribute('data-name');
        } else if (rest === 'qty') {
            const rawQty = button.dataset.max || button.getAttribute('data-max');
            return rawQty ? parseInt(rawQty, 10) : 0;
        }

        return null;
    }
    function player_stats(rest) {
        // Contoh Penggunaan:
        // player_stats('level')           --> Mengembalikan angka level
        // player_stats('currentExp')      --> Mengembalikan EXP saat ini
        // player_stats('totalExp')        --> Mengembalikan total EXP/max EXP
        // player_stats('staminaRequired') --> Mengembalikan sisa stamina yang dibutuhkan
        // player_stats('NeedExp')         --> Mengembalikan sisa EXP yang dibutuhkan
        // player_stats('needPExp')        --> Mengembalikan persentase sisa EXP (%)
        // player_stats('maxstam')         --> Mengembalikan angka maksimal stamina (misal: 10600)

        const container = document.querySelector(".gtb-right");
        if (!container) return null;

        const levelDiv = container.querySelector(".gtb-level");
        const expDiv = container.querySelector(".gtb-exp");
        const expText = container.querySelector(".gtb-exp-top span:last-child");

        if (!levelDiv || !expDiv || !expText) return null;

        const level = parseInt(levelDiv.textContent.replace(/\D/g, ""), 10);

        const [currentExp, totalExp] = expText.textContent
        .replace(/,/g, "")
        .split("/")
        .map(v => parseInt(v.trim(), 10));

        if (!level || !totalExp) return null;

        const staminaRequired = Math.ceil((totalExp - currentExp) / Math.max(1, Math.floor(level / 4)));
        const NeedExp = totalExp - currentExp;
        const needPExp = Math.floor((NeedExp / totalExp) * 100);

        // Ambil nilai max stamina dari elemen #stamina_span
        let maxstam = null;
        const staminaSpan = document.querySelector("#stamina_span");
        if (staminaSpan && staminaSpan.parentElement) {
            const stamParts = staminaSpan.parentElement.textContent.split("/");
            if (stamParts.length > 1) {
                maxstam = parseInt(stamParts[1].replace(/\D/g, ""), 10) || null;
            }
        }

        const stats = {
            level,
            currentExp,
            totalExp,
            staminaRequired,
            NeedExp,
            needPExp,
            maxstam
        };

        return stats[rest] !== undefined ? stats[rest] : null;
    }
    function getUserData() {
        const TestIfWebOpen = document.querySelector("#stamina_span");
        let loaddb = false;
        if(!TestIfWebOpen){
            loaddb = true;
        }

        if(loaddb){
            // 1. Cek apakah data sudah ada di localStorage
            const savedData = localStorage.getItem("Vreya_PotData");
            if (savedData) {
                try {
                    return JSON.parse(savedData);
                } catch (e) {
                    console.error("Failed to read data from localStorage:", e);
                }
            }
        }

        // 2. Jika data belum ada di localStorage, ambil dari DOM
        const sideHead = document.querySelector('.side-head');
        if (!sideHead) return null;

        const userLink = sideHead.querySelector('a');
        let pid = null;

        if (userLink && userLink.getAttribute('href')) {
            const href = userLink.getAttribute('href');
            const urlParams = new URLSearchParams(href.split('?')[1]);
            pid = urlParams.get('pid');
        }

        const name = sideHead.querySelector('.small-name')?.innerText.trim();
        const level = sideHead.querySelector('.small-level')?.innerText.trim();

        const DataFsp = getPotionData("FSP") || { qty: 0 };
        const DataLsp = getPotionData("LSP") || { qty: 0 };
        const DataSsp = getPotionData("SSP") || { qty: 0 };
        const DataFhp = getPotionData("FHP") || { qty: 0 };
        const DataAsp = getPotionData("ASP") || { qty: 0 };
        const DataMps = getPotionData("MPS") || { qty: 0 };
        const DataMpl = getPotionData("MPL") || { qty: 0 };

        const userData = {
            pid: pid,
            name: name,
            level: level,
            FSP: DataFsp.qty,
            LSP: DataLsp.qty,
            SSP: DataSsp.qty,
            FHP: DataFhp.qty,
            ASP: DataAsp.qty,
            MPS: DataMps.qty,
            MPL: DataMpl.qty,
        };

        // 3. Simpan data baru ke localStorage
        try {
            localStorage.setItem("Vreya_PotData", JSON.stringify(userData));
        } catch (e) {
            console.error("Failed to save to localStorage:", e);
        }

        return userData;
    }
    async function Get_Current_Stamina() {
        try {
            const res = await fetch("https://demonicscans.org/stats.php", {
                credentials: "include"
            });
            const html = await res.text();

            const doc = new DOMParser().parseFromString(html, "text/html");
            const current_stamina = parseInt(doc.querySelector("#stamina_span").textContent.replace(/,/g, "").trim(), 10)
            return current_stamina;
        } catch {
            return "ERR";
        }
    }
    async function Vreya_Use_Potion(itemId = 30, quantity = 1) {
        try {
            const cooldownKey = `Vreya_potion_cd_${itemId}`;
            const lastUsed = getCookie(cooldownKey);

            if (lastUsed) {
                return;
            }

            let invId;
            const potionElement = document.querySelector(`.potion-card[data-item-id="${itemId}"]`);

            if (potionElement) {
                invId = potionElement.dataset.invId;
            } else {
                return;
            }

            const response = await fetch("use_item.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `inv_id=${encodeURIComponent(invId)}&qty=${quantity}`
            });

            const result = await response.text();

            if (result.toLowerCase().includes("success")) {
                Vreya_Current_Stamina = await Get_Current_Stamina();
                setCookie(cooldownKey, Date.now(), 5);
                return "Success";
            } else {
                return "Failed";
            }
        } catch (err) {
            return "Failed";
        }
    }

    const userData = getUserData();
    function userdata(){
        const myNav = document.querySelector('.my-nav');
        const lvl = userData.level.replace("LV", "LvL:");
        const myConsole = document.querySelector('#FloatConsoleUserData');
        myConsole.innerHTML = '<div style="margin-bottom: 4px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 2px; color: rgb(46, 204, 113);">'+userData.name+'</div>';
        myConsole.innerHTML += '<div style="margin-bottom: 4px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 2px; color: rgb(46, 204, 113);">'+lvl+'</div>';
        myConsole.innerHTML += '<div style="margin-bottom: 4px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 2px; color: rgb(46, 204, 113);">FSP: '+userData.FSP+'</div>';
        myConsole.innerHTML += '<div style="margin-bottom: 4px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 2px; color: rgb(46, 204, 113);">LSP: '+userData.LSP+'</div>';
        myConsole.innerHTML += '<div style="margin-bottom: 4px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 2px; color: rgb(46, 204, 113);">SSP: '+userData.SSP+'</div>';
        myConsole.innerHTML += '<div style="margin-bottom: 4px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 2px; color: rgb(46, 204, 113);">POT: '+userData.FHP+'</div>';

        const catat = '- '+userData.name+' | '+lvl+' | FSP: '+userData.FSP+' | LSP: '+userData.LSP+' | SSP: '+userData.SSP;

        console.log(catat);
    }

    const maxstam = player_stats('maxstam');
    async function clickLSP(){
        const LspId = get_potion("LSP", maxstam, "id");
        try {
            const LSPused = await Vreya_Use_Potion(LspId, 1);
            if (LSPused) {
                console.log("LSP is a success! Reloading the page...");
                setTimeout(function() {
                    location.reload();
                }, 2000);
                return;
            } else {
                console.log("Failed to use LSP...");
            }
        } catch{}
    }
    async function clickFSP(){
        const FspId = get_potion("FSP", maxstam, "id");
        try {
            const FSPused = await Vreya_Use_Potion(FspId, 1);
            if (FSPused) {
                console.log("FSP is a success! Reloading the page...");
                setTimeout(function() {
                    location.reload();
                }, 2000);
                return;
            } else {
                console.log("Failed to use FSP...");
            }
        } catch{}
    }

    // Modul: AUTO RUN BOT
    function getValidLocations() {
        // 1. Ambil teks judul dari tab browser
        const pageTitle = document.title;
        //console.log("Tab Title Terdeteksi:", pageTitle);

        // 2. Tentukan Storage Key & Range berdasarkan Judul Tab
        let storageKey = "";
        let minLoc = 0;
        let maxLoc = 0;

        if (pageTitle.includes("Shadowbridge Warrens")) {
            storageKey = "Vreya_ndMobs";
            minLoc = 1;
            maxLoc = 5;
        } else if (pageTitle.includes("Castle of the Fallen Prince")) {
            storageKey = "Vreya_hdMobs";
            minLoc = 6;
            maxLoc = 10;
        } else if (pageTitle.includes("The Polyhedral Crucible")) {
            storageKey = "Vreya_cbMobs";
            minLoc = 11;
            maxLoc = 13;
        } else {
            console.warn("The dungeon is not recognized!");
            return [];
        }

        // 3. Ambil Mode Serangan (minDmg / maxDmg)
        const usedDmg = localStorage.getItem('Vreya_Attack_Mode') || 'minDmg';
        console.log("Attack Mode:", usedDmg);
        createFloatAlert(`Attack Mode: ${usedDmg}`);

        // 4. Ambil DB Mobs dari LocalStorage & Filter berdasarkan:
        //    - actived === true
        //    - masuk Range Location
        //    - Damage (minDmg / maxDmg) TIDAK Boleh 0, null, atau undefined
        const mobsData = JSON.parse(localStorage.getItem(storageKey) || "[]");

        const activeLocationIdsFromDB = [
            ...new Set(
                mobsData
                .filter(mob => {
                    const isActived = mob.actived === true;
                    const isInRange = mob.location_id >= minLoc && mob.location_id <= maxLoc;

                    // Cek nilai damage sesuai mode yang dipilih
                    const dmgValue = mob[usedDmg];
                    const hasValidDmg = dmgValue !== undefined && dmgValue !== null && Number(dmgValue) > 0;

                    return isActived && isInRange && hasValidDmg;
                })
                .map(mob => mob.location_id)
            )
        ];

        //console.log(`📋 Location ID Valid:`, activeLocationIdsFromDB);

        if (activeLocationIdsFromDB.length === 0) {
            console.warn("No location with active monsters");
            createFloatAlert('No location with active monsters');
            return [];
        }

        // 5. Ambil semua link lokasi di halaman & filter tombol yang locked
        const locationLinks = Array.from(document.querySelectorAll('a[href*="guild_dungeon_location.php"]'));
        const validLocations = [];

        locationLinks.forEach(link => {
            // Cek class locked
            const isSelfLocked = link.classList.contains('locked');
            const isParentLocked = link.closest('.locked') !== null;

            if (isSelfLocked || isParentLocked) {
                console.log("Locked Location Ignored");
                createFloatAlert('Locked Location Ignored');
                return;
            }

            // Ekstraksi location_id dari URL
            const rawHref = link.getAttribute('href') || '';
            const urlParams = new URLSearchParams(rawHref.includes('?') ? rawHref.split('?')[1] : rawHref);
            const locId = parseInt(urlParams.get('location_id'), 10);

            // Masukkan ke antrean jika lolos filter DB
            if (!isNaN(locId) && activeLocationIdsFromDB.includes(locId)) {
                if (!validLocations.includes(locId)) {
                    validLocations.push(locId);
                }
            }
        });

        // 6. Urutkan dari lokasi terkecil ke terbesar
        validLocations.sort((a, b) => a - b);

        console.log(`Active Final Queue Location:`, validLocations);
        return validLocations;
    }
    function startAutoRun() {
        const urlParams = new URLSearchParams(window.location.search);
        const instanceId = urlParams.get('id') || urlParams.get('instance_id');

        if (!instanceId) return;

        const targetLocations = getValidLocations();
        if (targetLocations.length === 0) {
            if (typeof createFloatAlert === 'function') {
                createFloatAlert('No active locations found!', 'danger');
            }
            return;
        }

        // 🟢 AKTIFKAN SAKLAR MODUL AUTO RUN
        localStorage.setItem('Vreya_AutoRun_Active', 'true');
        localStorage.setItem('Vreya_AutoRun_InstanceId', instanceId);
        localStorage.setItem('Vreya_AutoRun_Queue', JSON.stringify(targetLocations));

        // Pindah ke lokasi pertama setelah jeda singkat (1 detik)
        const firstLocId = targetLocations[0];
        createFloatAlert(`Prepare to ${firstLocId}`);

        setTimeout(() => {
            window.location.href = `guild_dungeon_location.php?instance_id=${instanceId}&location_id=${firstLocId}`;
        }, 3000); // 👈 Jeda 1000ms (3 detik) agar createFloatAlert sempat terbaca
    }
    function stopAutoRun() {
        console.log("Vreya AutoBot Stopped.");
        createFloatAlert('Vreya AutoBot Stopped');
        localStorage.setItem('Vreya_AutoRun_Active', 'false');
        localStorage.removeItem('Vreya_AutoRun_InstanceId');
        localStorage.removeItem('Vreya_AutoRun_Queue');
    }
    if (window.location.href.includes("guild_dungeon_location.php")) {
        const dg_ended = document.querySelector('.pill-warn');
        const text = dg_ended ? dg_ended.innerText.toLowerCase() : '';

        if (text.includes("ended") || text.includes("failed")) {
            //createFloatAlert("Dungeon Ended / Failed!");
            //console.warn("Dungeon telah usai (Ended/Failed). Menghentikan AutoRun...");
            //if (typeof stopAutoRun === 'function') stopAutoRun();
        } else {
            if (localStorage.getItem('Vreya_AutoBot') === 'true') {
                const runLocationProcess = async () => {
                    const isRunActive = localStorage.getItem('Vreya_AutoRun_Active') === 'true';
                    if (!isRunActive) return;

                    //console.log("⚔️ AutoBot & AutoRun Aktif! Memproses lokasi dungeon...");
                    createFloatAlert("Processing dungeon location...");

                    let attempts = 0;
                    while (typeof processDungeon !== 'function' && attempts < 20) {
                        await new Promise(resolve => setTimeout(resolve, 200));
                        attempts++;
                    }

                    if (typeof processDungeon === 'function') {
                        const isFinished = await processDungeon();

                        if (isFinished === true) {
                            let queue = JSON.parse(localStorage.getItem('Vreya_AutoRun_Queue') || "[]");
                            const instanceId = localStorage.getItem('Vreya_AutoRun_InstanceId');

                            queue.shift(); // Potong antrean lokasi
                            localStorage.setItem('Vreya_AutoRun_Queue', JSON.stringify(queue));

                            if (queue.length > 0) {
                                const nextLoc = queue[0];
                                createFloatAlert(`Move to Location ${nextLoc}...`);

                                setTimeout(() => {
                                    window.location.href = `guild_dungeon_location.php?instance_id=${instanceId}&location_id=${nextLoc}`;
                                }, 3000);
                            } else {
                                createFloatAlert("Vreya AutoBot Done");
                                console.log("Vreya AutoBot Done");
                                if (typeof stopAutoRun === 'function') stopAutoRun();

                                setTimeout(() => {
                                    window.location.href = `guild_dungeon_instance.php?id=${instanceId}`;
                                }, 3000);
                            }
                        } else {
                            // ⚡ STAMINA HABIS / BELUM SELESAI
                            // Berikan alert ke user. Vreya_AutoRun_Active TIDAK diubah (tetap true).
                            // Begitu user tekan F5, eksekusi akan berjalan kembali dari awal.
                            createFloatAlert("Paused, Stamina Depleted! Press F5 once stamina has refilled.");
                            //console.warn("processDungeon mereturn false (Stamina habis). Menunggu refresh manual (F5)...");
                        }
                    } else {
                        createFloatAlert("Failed to load the Dungeon process!");
                    }
                };

                if (document.readyState === 'complete' || document.readyState === 'interactive') {
                    runLocationProcess();
                } else {
                    window.addEventListener('DOMContentLoaded', runLocationProcess);
                }
            }
        }
    }

    // Modul: AUTO RUN LOOTS
    function isDungeonEnded() {
        const status = document.querySelector('.muted b')?.textContent.trim();
        return status === 'Ended';
    }

    async function dungeonAutoLoots() {
        const dg_queryString = window.location.search;
        const dg_urlParams = new URLSearchParams(dg_queryString);
        const instance_id = dg_urlParams.get('instance_id');
        const location_id = dg_urlParams.get('location_id');
        const dg_ended = document.querySelector('.pill-warn');
        console.log(location_id);

        if (location.href.includes("guild_dungeon_location.php")) {
            if (dg_ended) {
                if (dg_ended.innerText === "view-only (ended)" || dg_ended.innerText === "view-only (failed)") {
                    let name = "";
                    const instance = String(instance_id);
                    const locationStr = String(location_id);

                    if (["1", "2", "3", "4", "5"].includes(locationStr)) {
                        if (locationStr === "1") name = "Brood Pits";
                        if (locationStr === "2") name = "Plunder Warrens";
                        if (locationStr === "3") name = "Shattered Stone Causeways";
                        if (locationStr === "4") name = "Territory Center";
                        if (locationStr === "5") name = "Boss Room";

                        const flootAllBtn = document.getElementById("lootAllBtn");
                        if (flootAllBtn) {
                            console.log("Auto loot is running on " + name);
                            if (typeof createFloatAlert === 'function') createFloatAlert("Auto loot is running on " + name, 'warning');

                            // Eksekusi fungsi bawaan web
                            if (typeof lootAllLocation === 'function') {
                                lootAllLocation(instance, locationStr, flootAllBtn);
                            }

                            // TUNGGU AJAX + ALERT (2 Detik), LALU SUSUN ANTREAN NEXT LOCATION
                            await new Promise(resolve => {
                                setTimeout(function() {
                                    console.log("Auto loot done on " + name);
                                    if (typeof createFloatAlert === 'function') createFloatAlert("Auto loot done on " + name, 'success');
                                    resolve(); // Langsung izinkan antrean lanjut!
                                }, 2000);
                            });

                            return true;
                        } else {
                            console.log(name + " Has Been Looted");
                            if (typeof createFloatAlert === 'function') createFloatAlert(name + " Has Been Looted", 'warning');
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            return true;
                        }
                    } else {
                        console.log("Only on Normal Dungeon");
                        if (typeof createFloatAlert === 'function') createFloatAlert("Only on Normal Dungeon", 'error');
                        return false;
                    }
                } else {
                    console.log("Dungeon still open, can't run loots");
                    if (typeof createFloatAlert === 'function') createFloatAlert("Dungeon still open, can't run loots", 'error');
                    return false;
                }
            }
        }
        return false;
    }
    function getValidLootsLocations() {
        const locationLinks = Array.from(document.querySelectorAll('a[href*="guild_dungeon_location.php"]'));
        const validLocations = [];

        locationLinks.forEach(link => {
            const rawHref = link.getAttribute('href') || '';
            const urlParams = new URLSearchParams(rawHref.includes('?') ? rawHref.split('?')[1] : rawHref);
            const locId = parseInt(urlParams.get('location_id'), 10);

            if (!isNaN(locId) && !validLocations.includes(locId)) {
                validLocations.push(locId);
            }
        });

        validLocations.sort((a, b) => a - b);
        return validLocations.length > 0 ? validLocations : [1, 2, 3, 4, 5];
    }
    function startAutoLoots() {
        const urlParams = new URLSearchParams(window.location.search);
        const instanceId = urlParams.get('id') || urlParams.get('instance_id');

        if (!instanceId) return;

        const targetLocations = getValidLootsLocations();

        localStorage.setItem('Vreya_AutoLoots_Active', 'true');
        localStorage.setItem('Vreya_AutoLoots_InstanceId', instanceId);
        localStorage.setItem('Vreya_AutoLoots_Queue', JSON.stringify(targetLocations));

        const firstLocId = targetLocations[0];
        if (typeof createFloatAlert === 'function') createFloatAlert(`Prepare AutoLoots to Location ${firstLocId}...`, 'warning');

        setTimeout(() => {
            window.location.href = `guild_dungeon_location.php?instance_id=${instanceId}&location_id=${firstLocId}`;
        }, 1500);
    }
    function stopAutoLoots() {
        console.log("Vreya AutoLoots Stopped.");
        if (typeof createFloatAlert === 'function') createFloatAlert('Vreya AutoLoots Finished!', 'success');
        localStorage.setItem('Vreya_AutoLoots_Active', 'false');
        localStorage.removeItem('Vreya_AutoLoots_InstanceId');
        localStorage.removeItem('Vreya_AutoLoots_Queue');
    }
    if (window.location.href.includes("guild_dungeon_location.php")) {
        const dg_ended = document.querySelector('.pill-warn');
        const text = dg_ended ? dg_ended.innerText.toLowerCase() : '';

        if (text.includes("ended") || text.includes("failed")) {
            const runLootsProcess = async () => {
                const isRunActive = localStorage.getItem('Vreya_AutoLoots_Active') === 'true';
                if (!isRunActive) return;

                if (typeof createFloatAlert === 'function') createFloatAlert("Processing AutoLoots location...");

                const isFinished = await dungeonAutoLoots();
                //const isSuccess = await dungeonAutoLoots();

                if (isFinished === true) {
                    let queue = JSON.parse(localStorage.getItem('Vreya_AutoLoots_Queue') || "[]");
                    const instanceId = localStorage.getItem('Vreya_AutoLoots_InstanceId');

                    queue.shift(); // Potong antrean
                    localStorage.setItem('Vreya_AutoLoots_Queue', JSON.stringify(queue));

                    if (queue.length > 0) {
                        const nextLoc = queue[0];
                        if (typeof createFloatAlert === 'function') createFloatAlert(`Move to Location ${nextLoc}...`, 'warning');

                        setTimeout(() => {
                            window.location.href = `guild_dungeon_location.php?instance_id=${instanceId}&location_id=${nextLoc}`;
                        }, 2000);
                    } else {
                        // Selesai semua lokasi
                        stopAutoLoots();

                        setTimeout(() => {
                            window.location.href = `guild_dungeon_instance.php?id=${instanceId}`;
                        }, 2500);
                    }
                }
            };

            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                runLootsProcess();
            } else {
                window.addEventListener('DOMContentLoaded', runLootsProcess);
            }
        }
    }

    function modalMaxDmg(){
        showCustomModal(
            '⚙️ System Notification',
            `
        <div style="text-align: center;">
            <p>You are currently using maximum damage mode, do you wish to continue? If not, clicking "Change" will automatically switch your attack mode.</p>
            <button id="modal-btn-close" style="padding: 6px 14px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
            <button id="modal-btn-change" style="padding: 6px 14px; background: #0d6efd; color: white; border: none; border-radius: 4px; cursor: pointer;">Change</button>
        </div>
    `,
            () => {
                console.log('User selects mode: Max Damage');
            }
        );

        // Tombol Close
        document.getElementById('modal-btn-close').onclick = function() {
            createFloatAlert('You are using Max Damage!', 'success');
            document.getElementById('vreya-modal-close-btn').click();
        };

        // Tombol Change
        document.getElementById('modal-btn-change').onclick = function() {
            localStorage.setItem('Vreya_Attack_Mode', 'minDmg')
            createFloatAlert('Changes successfully saved!', 'success');
            createFloatAlert('You are using Min Damage!', 'success');
            document.getElementById('vreya-modal-close-btn').click();
            createFloatAlert('Please Wait... Reloading Page');
            setTimeout(() => { window.location.reload(); }, 3000);
        };
    }

    function modalMigrate(){
        showCustomModal(
            '⚙️ System Notification',
            `
        <div style="text-align: center;">
            <p>The system detects that you haven't migrated to Vreya yet.</p>
            <button id="modal-btn-migration" style="padding: 6px 14px; background: #0d6efd; color: white; border: none; border-radius: 4px; cursor: pointer;">Migration</button>
        </div>
    `,
            () => {
                console.log('Migrated to Vreya');
            }
        );
        // Tombol Close
        document.getElementById('vreya-modal-close-btn').onclick = function() {};

        // Tombol Change
        document.getElementById('modal-btn-migration').onclick = function() {
            checkAndMigrateVreya();
        };
    }
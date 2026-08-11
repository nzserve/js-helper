    // Fungsi Notifikasi & Alert
    function addNotif(message, type) {
        const getTodayDate = () => new Date().toISOString().split('T')[0];
        // Menggunakan undefined agar otomatis memakai default locale/pengaturan komputer player
        const getCurrentTime = () => new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

        let stored = [];
        try {
            stored = JSON.parse(localStorage.getItem('vreya_notif') || '[]');
            if (!Array.isArray(stored)) stored = [];
        } catch (e) {
            stored = [];
        }

        const newNotif = {
            id: Date.now().toString(),
            type: type,
            message: message.trim(),
            createdDate: getTodayDate(),
            time: getCurrentTime()
        };

        stored.unshift(newNotif);
        localStorage.setItem('vreya_notif', JSON.stringify(stored));
    }

    // ALERT
    const alertsContainer = unsafeWindow.document.getElementById('alerts-container');
    function createFloatAlert(message, type = 'success') {
        if(message !== "Auto Farm ready for Running"){
            addNotif(message, type);
        }

        const alertEl = document.createElement('div');
        alertEl.className = `float-alert ${type}`;
        alertEl.innerHTML = `
                    <span>${message}</span>
                    <button class="float-alert-close">&times;</button>
                `;

        const closeAlertBtn = alertEl.querySelector('.float-alert-close');
        closeAlertBtn.addEventListener('click', function () {
            alertEl.remove();
        });

        alertsContainer.appendChild(alertEl);

        setTimeout(function () {
            if (alertEl.parentElement) {
                alertEl.style.opacity = '0';
                alertEl.style.transition = 'opacity 0.3s';
                setTimeout(() => alertEl.remove(), 300);
            }
        }, 4000);
    };
    
    // FUNGSI PEMBUAT FLOATING CONSOLE LOG (Draggable + Header & LocalStorage)
    function createArkaFloatingConsole() {
        // Hapus console lama jika sudah ada (mencegah duplikasi saat script dijalankan ulang)
        const existingConsole = document.getElementById("arka_float_console");
        if (existingConsole) {
            existingConsole.remove();
        }

        // Ambil posisi terakhir dari localStorage (jika ada)
        const savedPosition = JSON.parse(localStorage.getItem("Arka_Console")) || { top: "70px", right: "auto", left: "20px", bottom: "auto" };

        // Buat container utama untuk layar log
        const consoleBox = document.createElement("div");
        consoleBox.id = "arka_float_console";

        // Desain gaya tampilan visual kotak log
        Object.assign(consoleBox.style, {
            position: "fixed",
            top: savedPosition.top,
            right: savedPosition.right,
            left: savedPosition.left,
            bottom: savedPosition.bottom,
            width: "380px",
            height: "220px",
            backgroundColor: "rgba(0, 0, 0, 0.90)",
            color: "#2ecc71",
            fontFamily: "monospace",
            fontSize: "11px",
            borderRadius: "8px",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.7)",
            zIndex: "999", // Z-Index maksimum agar selalu tampil di paling depan
            border: "1px solid #444",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            cursor: "move" // Kursor berubah jadi tanda geser di seluruh kotak
        });

        // Buat area konten isi log
        const contentBox = document.createElement("div");
        Object.assign(contentBox.style, {
            flex: "1",
            padding: "10px",
            overflowY: "auto",
            overflowX: "hidden"
        });
        consoleBox.appendChild(contentBox);

        document.body.appendChild(consoleBox);

        // ============================================================================
        // FITUR DRAGGABLE (Melalui Kotak Utama)
        // ============================================================================
        let isDragging = false;
        let startX, startY;

        consoleBox.addEventListener("mousedown", (e) => {
            isDragging = true;
            startX = e.clientX - consoleBox.offsetLeft;
            startY = e.clientY - consoleBox.offsetTop;
            document.body.style.userSelect = "none"; // Mencegah teks ikut ter-highlight saat digeser
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;

            const newX = e.clientX - startX;
            const newY = e.clientY - startY;

            consoleBox.style.left = `${newX}px`;
            consoleBox.style.top = `${newY}px`;
            consoleBox.style.right = "auto";
            consoleBox.style.bottom = "auto";
        });

        document.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = "auto";

                // Simpan posisi terbaru ke localStorage
                const positionData = {
                    top: consoleBox.style.top,
                    left: consoleBox.style.left,
                    right: "auto",
                    bottom: "auto"
                };
                localStorage.setItem("Arka_Console", JSON.stringify(positionData));
            }
        });

        // ============================================================================
        // MEMBAJAK (HOOK) CONSOLE.LOG BAWAAN BROWSER
        // ============================================================================
        const originalLog = console.log;
        console.log = function (...args) {
            // Tetap jalankan console.log asli di F12
            originalLog.apply(console, args);

            // Gabungkan argumen teks log menjadi satu string
            const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');

            // Buat elemen baris teks baru
            const logLine = document.createElement("div");
            logLine.style.marginBottom = "4px";
            logLine.style.borderBottom = "1px solid rgba(255,255,255,0.05)";
            logLine.style.paddingBottom = "2px";
            logLine.style.wordBreak = "break-all";

            // Beri warna khusus berdasarkan kata kunci
            if (message.toLowerCase().includes("success") || message.includes("terpenuhi") || message.includes("melimpah") || message.includes("berhasil")) {
                logLine.style.color = "#2ecc71"; // Hijau
            } else if (message.includes("kurang") || message.includes("Gagal") || message.includes("dihentikan") || message.includes("error")) {
                logLine.style.color = "#e74c3c"; // Merah
            } else {
                logLine.style.color = "#f1c40f"; // Kuning
            }

            // Tambahkan timestamp waktu lokal
            const time = new Date().toLocaleTimeString();
            logLine.textContent = `[${time}] ${message}`;

            contentBox.appendChild(logLine);

            // Otomatis gulung (scroll) ke baris paling bawah
            contentBox.scrollTop = contentBox.scrollHeight;

            // Batasi maksimal menampilkan 50 baris terakhir
            while (contentBox.children.length > 50) {
                contentBox.removeChild(contentBox.firstChild);
            }
        };
    }

    // For reset console location.
    function ResetConsole(){
        const Rconsole_Button = `<button id="ResetConsole" class="nav-btn" style="background-color: rgb(16, 185, 129); font-weight: 600; padding: 0px 0.4rem; height: 24px; font-size: 0.65rem; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; gap: 0.25rem;"><span>🖥️ Reset</span></button><div class="tooltip-text">Reset Console</div>`;

        const Target_Button = unsafeWindow.document.querySelector('#NavGBTN');
        if (Target_Button) {
            Target_Button.insertAdjacentHTML('afterbegin', Rconsole_Button);
        }
        const Rc_Reset = document.getElementById('ResetConsole');

        Rc_Reset.addEventListener("click", () => {
            localStorage.removeItem('Arka_Console');
            localStorage.removeItem('Arka_UserConsole');

            createFloatAlert('Console Box Reset', 'success');
            setTimeout(() => {
                window.location.replace(window.location.href);
            }, 1000);
        });
    }

    // USER FLOATING CONSOLE
    function FloatConsoleUserData() {
        // 1. Cek & Ambil Konfigurasi dari localStorage
        const STORAGE_KEY = 'Arka_UserConsole';
        const defaultData = {
            position: [300, 20], // [top, left] dalam pixel
            enable: true
        };

        let savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData;

        // Jika enable: false, console tidak akan ditampilkan
        if (!savedData.enable) return;

        // Sanity check untuk data position
        const topPos = savedData.position && savedData.position[0] !== undefined ? savedData.position[0] : 300;
        const leftPos = savedData.position && savedData.position[1] !== undefined ? savedData.position[1] : 20;

        // 2. Buat Elemen Console Box
        const consoleBox = document.createElement('div');
        consoleBox.id = 'FloatConsoleUserData';

        // Menggunakan 'left' dan 'top' secara konsisten
        Object.assign(consoleBox.style, {
            position: "fixed",
            top: `${topPos}px`,
            left: `${leftPos}px`, // Menggunakan 'left'
            width: "200px",
            height: "135px",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            color: "#2ecc71",
            fontFamily: "monospace",
            fontSize: "11px",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0px 4px 15px rgba(0,0,0,0.5)",
            zIndex: "999",
            overflowY: "auto",
            pointerEvents: "auto",
            border: "1px solid #333",
            cursor: "move",
            userSelect: "none",
            boxSizing: "border-box",
            'scrollbar-width': 'none',
            '-ms-overflow-style': 'none'
        });

        consoleBox.innerText = "FloatConsoleUserData Initialized...";
        document.body.appendChild(consoleBox);

        // 3. Logika Drag and Drop & Update localStorage
        let isDragging = false;
        let startX, startY, startTop, startLeft;

        consoleBox.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            // Ambil posisi elemen saat ini
            const rect = consoleBox.getBoundingClientRect();
            startTop = rect.top;
            startLeft = rect.left;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            const newTop = startTop + deltaY;
            const newLeft = startLeft + deltaX; // Geser ke kiri/kanan mengikuti pergerakan mouse

            consoleBox.style.top = `${newTop}px`;
            consoleBox.style.left = `${newLeft}px`;
        }

        function onMouseUp() {
            if (!isDragging) return;
            isDragging = false;

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            // Ambil nilai piksel terbaru
            const finalTop = parseInt(consoleBox.style.top, 10);
            const finalLeft = parseInt(consoleBox.style.left, 10);

            // Simpan posisi baru ke localStorage dengan format array [top, left]
            savedData.position = [finalTop, finalLeft];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
        }
    }

    // Utility Helper: Escaping HTML
    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, match => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[match]);
    }

    // Styling Config per Tipe Notifikasi
    const TYPE_STYLES = {
        info: { bg: 'info', icon: '💡' },
        success: { bg: 'success', icon: '✅' },
        warning: { bg: 'warning', icon: '⚠️' },
        danger: { bg: 'danger', icon: '🚨' }
    };
    
    // Render UI Notifikasi
    function renderApp() {
        const items = JSON.parse(localStorage.getItem('vreya_notif') || '[]');
        const container = document.getElementById('notificationsContainer');
        const emptyState = document.getElementById('emptyState');

        if (items.length === 0) {
            container.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        container.innerHTML = items.map(item => {
            const style = TYPE_STYLES[item.type] || TYPE_STYLES.info;
            return `<div class="notif-alert ${style.bg}" id="${item.id}"><span>${style.icon} ${item.createdDate} ${item.time} - ${escapeHtml(item.message)}</span></div>`;
        }).join('');
    }
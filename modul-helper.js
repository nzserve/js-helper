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
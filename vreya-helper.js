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

    // Required for System
    function removeQueueItem(Storange, target) {
        const STORAGE_KEY = Storange;
        // BOS = Arka_Boss_Que
        // Normal = Arka_Que

        // 1. Ambil data dari localStorage (parse JSON)
        const rawData = localStorage.getItem(Storange);

        if (!rawData) {
            console.warn(`'${target}' tidak ditemukan di localStorage.`);
            return;
        }

        try {
            let queue = JSON.parse(rawData);
            const totalAwal = queue.length;

            // 2. Filter out item yang cocok dengan URL atau ID
            queue = queue.filter(item => {
                if (!item || !item.url) return false;
                // Cek apakah URL sama persis ATAU mengandung ID target
                return item.url !== target && !item.url.includes(target);
            });

            //console.log(queue);

            const totalDihapus = totalAwal - queue.length;

            // 3. Simpan data baru kembali ke localStorage
            localStorage.setItem(Storange, JSON.stringify(queue));
        } catch (error) {
            console.error("Gagal memproses data JSON:", error);
        }
    }
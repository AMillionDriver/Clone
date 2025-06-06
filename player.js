// player.js - VERSI FINAL & DIOPTIMALKAN

document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // I. DEKLARASI VARIABEL & SELEKSI ELEMEN DOM
    // =================================================================
    
    // Variabel State Aplikasi
    let player;
    let allVideosData = [];
    let currentVideoData = null;
    let progressUpdateInterval;
    let hideControlsTimeout;
    let lastTap = 0;

    // Ikon SVG untuk Kontrol Kustom
    const ICONS = {
        play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>',
        pause: '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>',
        volumeHigh: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>',
        volumeMute: '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"></path></svg>',
        fullscreen: '<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></svg>',
        exitFullscreen: '<svg viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"></path></svg>'
    };

    // Seleksi Elemen DOM
    const DOM = {
        playerWrapper: document.getElementById('videoPlayerWrapper'),
        loadingSpinner: document.querySelector('.loading-spinner'),
        playPauseBtn: document.querySelector('.play-pause-button'),
        volumeBtn: document.querySelector('.volume-button'),
        volumeSlider: document.querySelector('.volume-slider'),
        progressBarContainer: document.querySelector('.progress-bar-container'),
        playedBar: document.querySelector('.progress-bar-played'),
        currentTimeEl: document.querySelector('.current-time'),
        totalDurationEl: document.querySelector('.total-duration'),
        fullscreenBtn: document.querySelector('.fullscreen-button'),
        theaterBtn: document.querySelector('.theater-mode-button'),
        settingsBtn: document.querySelector('.settings-button'),
        settingsMenu: document.querySelector('.settings-menu'),
        seekOverlayLeft: document.getElementById('seekOverlayLeft'),
        seekOverlayRight: document.getElementById('seekOverlayRight'),
        descriptionBox: document.querySelector('.description-box'),
        toggleDescBtn: document.querySelector('.toggle-description-button'),
        commentInput: document.querySelector('.add-comment input'),
        commentList: document.getElementById('commentList')
    };


    // =================================================================
    // II. FUNGSI-FUNGSI UTAMA YOUTUBE API
    // =================================================================
    
    window.onYouTubeIframeAPIReady = function() {
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get('videoId');
        if (videoId) {
            player = new YT.Player('player', {
                videoId: videoId,
                playerVars: { 'playsinline': 1, 'autoplay': 1, 'controls': 0, 'rel': 0, 'iv_load_policy': 3, 'disablekb': 1 },
                events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange }
            });
        } else {
            showErrorMessage("Error: ID Video tidak ditemukan di URL.");
        }
    };

    function onPlayerReady() {
        DOM.loadingSpinner.style.display = 'none';
        updateProgressBar();
        updateTimeDisplay();
        updateVolumeUI();
        updateFullscreenButton();
        initControlsVisibility();

        const savedTime = localStorage.getItem(`video-progress-${currentVideoData.id}`);
        if (savedTime) {
            player.seekTo(parseFloat(savedTime));
        }
        player.playVideo();
    }

    function onPlayerStateChange(event) {
        updatePlayPauseButton(event.data);
        if (event.data === YT.PlayerState.PLAYING) {
            if (!progressUpdateInterval) updateProgressBar();
            startControlsTimeout();
        } else {
            clearInterval(progressUpdateInterval);
            progressUpdateInterval = null;
            DOM.playerWrapper.classList.add('controls-visible');
            clearTimeout(hideControlsTimeout);
        }
    }


    // =================================================================
    // III. FUNGSI DATA & POPULASI UI
    // =================================================================

    async function initPage() {
        initAllEventListeners();
        
        const urlParams = new URLSearchParams(window.location.search);
        const internalId = urlParams.get('id');
        if (!internalId) {
            showErrorMessage("Error: ID Internal tidak ditemukan.");
            return;
        }

        DOM.loadingSpinner.style.display = 'block';

        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulasi loading
            const response = await fetch('videos.json');
            if (!response.ok) throw new Error('Gagal mengambil data video.');
            allVideosData = await response.json();
            currentVideoData = allVideosData.find(video => video.id === internalId);
            
            if (currentVideoData) {
                populatePageInfo(currentVideoData);
                populateRecommendations(allVideosData, internalId);
                // Fungsi onYouTubeIframeAPIReady akan dipanggil oleh API setelah ini
            } else {
                showErrorMessage("Data untuk video ini tidak ditemukan.");
            }
        } catch (error) {
            console.error(error);
            showErrorMessage("Gagal memuat data. Periksa konsol untuk detail.");
        }
    }

    function populatePageInfo(data) {
        document.title = `${data.title} - Main Web`;
        document.querySelector('.video-title-player').textContent = data.title;
        document.querySelector('.view-count-player').textContent = `${data.views} x ditonton`;
        document.querySelector('.upload-date-player').textContent = `• ${data.uploadDate}`;
        document.querySelector('.channel-logo-player').src = data.channelLogoUrl;
        document.querySelector('.channel-name-player').textContent = data.channelName;
        document.querySelector('.subscriber-count').textContent = data.subscribers || '1 jt subscriber';
        document.querySelector('.like-button .count').textContent = data.jumlahLikeAwal || 0;
        document.querySelector('.description-text').textContent = data.deskripsi || 'Tidak ada deskripsi.';
    }

    function populateRecommendations(allVideos, currentVideoId) {
        const container = document.getElementById('recommendationsContainer');
        container.innerHTML = '';
        const recommended = allVideos.filter(v => v.id !== currentVideoId);
        recommended.forEach(video => {
            const itemHTML = `
                <a href="player.html?videoId=${video.youtubeVideoId}&id=${video.id}" class="recommendation-item">
                    <img src="${video.thumbnailUrl}" alt="${video.title}" class="recommendation-thumbnail" loading="lazy">
                    <div class="recommendation-meta">
                        <h3 class="recommendation-title">${video.title}</h3>
                        <p class="recommendation-channel">${video.channelName}</p>
                        <p class="recommendation-stats">${video.views} x ditonton</p>
                    </div>
                </a>`;
            container.insertAdjacentHTML('beforeend', itemHTML);
        });
    }

    function showErrorMessage(message) {
        DOM.loadingSpinner.style.display = 'none';
        document.querySelector('.main-column').innerHTML = `<p class="grid-message">${message}</p>`;
        document.querySelector('.side-column').style.display = 'none';
    }


    // =================================================================
    // IV. FUNGSI-FUNGSI PEMBARUAN UI (HELPERS)
    // =================================================================
    
    function formatTime(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function updateProgressBar() {
        if (progressUpdateInterval) clearInterval(progressUpdateInterval);
        progressUpdateInterval = setInterval(() => {
            if (player && typeof player.getCurrentTime === 'function') {
                const progress = (player.getCurrentTime() / player.getDuration()) * 100;
                DOM.playedBar.style.width = `${progress}%`;
                updateTimeDisplay();
            }
        }, 250);
    }
    
    function updateTimeDisplay() {
        DOM.currentTimeEl.textContent = formatTime(player.getCurrentTime() || 0);
        DOM.totalDurationEl.textContent = formatTime(player.getDuration() || 0);
    }

    function updateVolumeUI() {
        if (player.isMuted() || player.getVolume() === 0) {
            DOM.volumeBtn.innerHTML = ICONS.volumeMute;
            DOM.volumeSlider.value = 0;
        } else {
            DOM.volumeBtn.innerHTML = ICONS.volumeHigh;
            DOM.volumeSlider.value = player.getVolume();
        }
    }

    function updatePlayPauseButton(playerState) {
        if (playerState === YT.PlayerState.PLAYING) {
            DOM.playPauseBtn.innerHTML = ICONS.pause;
            DOM.playPauseBtn.setAttribute('aria-label', 'Pause');
        } else {
            DOM.playPauseBtn.innerHTML = ICONS.play;
            DOM.playPauseBtn.setAttribute('aria-label', 'Play');
        }
    }

    function updateFullscreenButton() {
        if (document.fullscreenElement) {
            DOM.fullscreenBtn.innerHTML = ICONS.exitFullscreen;
        } else {
            DOM.fullscreenBtn.innerHTML = ICONS.fullscreen;
        }
    }

    function initControlsVisibility() {
        DOM.playerWrapper.addEventListener('mousemove', () => {
            DOM.playerWrapper.classList.add('controls-visible');
            clearTimeout(hideControlsTimeout);
            startControlsTimeout();
        });
        DOM.playerWrapper.addEventListener('mouseleave', () => {
            if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                DOM.playerWrapper.classList.remove('controls-visible');
            }
        });
    }

    function startControlsTimeout() {
        if (player.getPlayerState() !== YT.PlayerState.PLAYING) return;
        clearTimeout(hideControlsTimeout);
        hideControlsTimeout = setTimeout(() => {
            DOM.playerWrapper.classList.remove('controls-visible');
        }, 3000);
    }

    // =================================================================
    // V. INISIALISASI SEMUA EVENT LISTENER
    // =================================================================
    
    function initAllEventListeners() {
        // Kontrol Player Utama
        DOM.playPauseBtn?.addEventListener('click', () => player.getPlayerState() === YT.PlayerState.PLAYING ? player.pauseVideo() : player.playVideo());
        DOM.progressBarContainer?.addEventListener('click', (e) => {
            const rect = DOM.progressBarContainer.getBoundingClientRect();
            const seekTime = (e.clientX - rect.left) / rect.width * player.getDuration();
            player.seekTo(seekTime);
        });
        DOM.volumeBtn?.addEventListener('click', () => { player.isMuted() ? player.unMute() : player.mute(); updateVolumeUI(); });
        DOM.volumeSlider?.addEventListener('input', (e) => { player.setVolume(e.target.value); player.unMute(); });
        DOM.volumeSlider?.addEventListener('change', updateVolumeUI); // Untuk sinkronisasi ikon

        // Fullscreen & Theater Mode
        DOM.fullscreenBtn?.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                DOM.playerWrapper.requestFullscreen().catch(err => alert(`Gagal fullscreen: ${err.message}`));
            } else {
                document.exitFullscreen();
            }
        });
        document.addEventListener('fullscreenchange', updateFullscreenButton);
        DOM.theaterBtn?.addEventListener('click', () => document.body.classList.toggle('theater-mode'));

        // Keyboard Shortcuts
        document.addEventListener('keydown', e => {
            const activeEl = document.activeElement;
            if (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA') return;
            switch (e.key.toLowerCase()) {
                case ' ': case 'k': e.preventDefault(); DOM.playPauseBtn.click(); break;
                case 'm': DOM.volumeBtn.click(); break;
                case 'f': DOM.fullscreenBtn.click(); break;
                case 't': DOM.theaterBtn.click(); break;
                case 'arrowright': player.seekTo(player.getCurrentTime() + 5); break;
                case 'arrowleft': player.seekTo(player.getCurrentTime() - 5); break;
                case 'escape': if (document.body.classList.contains('theater-mode')) document.body.classList.remove('theater-mode'); break;
            }
        });

        // Double Tap to Seek
        DOM.seekOverlayLeft?.addEventListener('click', (e) => {
            const currentTime = new Date().getTime();
            if (currentTime - lastTap < 300) { player.seekTo(player.getCurrentTime() - 10); }
            lastTap = currentTime;
        });
        DOM.seekOverlayRight?.addEventListener('click', (e) => {
            const currentTime = new Date().getTime();
            if (currentTime - lastTap < 300) { player.seekTo(player.getCurrentTime() + 10); }
            lastTap = currentTime;
        });

        // Simpan Progres Tontonan
        setInterval(() => {
            if (player && typeof player.getPlayerState === 'function' && player.getPlayerState() === YT.PlayerState.PLAYING && currentVideoData) {
                localStorage.setItem(`video-progress-${currentVideoData.id}`, player.getCurrentTime());
            }
        }, 5000);

        // Deskripsi Toggle
        DOM.toggleDescBtn?.addEventListener('click', (e) => {
            DOM.descriptionBox.classList.toggle('collapsed');
            e.target.textContent = DOM.descriptionBox.classList.contains('collapsed') ? 'Tampilkan lebih banyak' : 'Tampilkan lebih sedikit';
        });

        // Simulasi Tambah Komentar
        DOM.commentInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && DOM.commentInput.value.trim() !== '') {
                const commentText = DOM.commentInput.value.trim();
                const newCommentHTML = `
                    <div class="comment-item">
                        <img src="https://via.placeholder.com/40/007bff/fff?text=U" alt="Avatar Anda" class="user-avatar-comment">
                        <div class="comment-text">
                            <p class="comment-meta"><strong>Anda</strong> • baru saja</p>
                            <p>${commentText}</p>
                        </div>
                    </div>
                `;
                DOM.commentList.insertAdjacentHTML('afterbegin', newCommentHTML);
                DOM.commentInput.value = '';
            }
        });
    }

    // =================================================================
    // VI. TITIK MASUK UTAMA APLIKASI
    // =================================================================
    initPage();
});

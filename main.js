// mine.js

document.addEventListener('DOMContentLoaded', function() {
    // === Seleksi Elemen DOM ===
    const videoGridContainer = document.getElementById('videoGridContainer');
    const searchInput = document.getElementById('searchInput');

    // === Variabel State Aplikasi ===
    let allVideos = []; // Menyimpan semua data video dari JSON
    let searchDebounceTimeout;

    // === FUNGSI-FUNGSI UTAMA ===

    /**
     * Menampilkan skeleton loader saat data sedang dimuat.
     * @param {number} count - Jumlah skeleton item yang ingin ditampilkan.
     */
    function showSkeletonLoader(count = 8) {
        videoGridContainer.innerHTML = ''; // Kosongkan grid
        for (let i = 0; i < count; i++) {
            const skeletonHTML = `
                <div class="skeleton-item">
                    <div class="skeleton-thumbnail"></div>
                    <div class="skeleton-details">
                        <div class="skeleton-avatar"></div>
                        <div class="skeleton-text-container">
                            <div class="skeleton-text title"></div>
                            <div class="skeleton-text short"></div>
                        </div>
                    </div>
                </div>
            `;
            videoGridContainer.insertAdjacentHTML('beforeend', skeletonHTML);
        }
    }

    /**
     * Menampilkan video di dalam grid container.
     * @param {Array} videosToDisplay - Array dari objek video yang akan ditampilkan.
     */
    function displayVideos(videosToDisplay) {
        videoGridContainer.innerHTML = ''; // Kosongkan grid (hapus skeleton atau hasil sebelumnya)
        if (videosToDisplay.length === 0) {
            videoGridContainer.innerHTML = '<p class="grid-message">Tidak ada video yang cocok dengan pencarian Anda.</p>';
            return;
        }
        videosToDisplay.forEach(video => {
            const videoItemHTML = `
                <div class="video-item" data-video-id="${video.id}">
                    <div class="video-thumbnail-container">
                        <a href="player.html?videoId=${video.youtubeVideoId}&id=${video.id}" class="video-thumbnail-link">
                            <img src="${video.thumbnailUrl}" alt="${video.title}" class="video-thumbnail" loading="lazy">
                            <span class="video-duration">${video.duration}</span>
                        </a>
                    </div>
                    <div class="video-details">
                        <a href="#" class="channel-logo-link" title="${video.channelName}">
                            <img src="${video.channelLogoUrl}" alt="${video.channelName}" class="channel-logo" loading="lazy">
                        </a>
                        <div class="video-meta">
                            <a href="player.html?videoId=${video.youtubeVideoId}&id=${video.id}" class="video-title-link">
                                <h3 class="video-title">${video.title}</h3>
                            </a>
                            <a href="#" class="channel-name-link">
                                <p class="channel-name">${video.channelName}</p>
                            </a>
                            <p class="video-stats">
                                <span class="view-count">${video.views} x ditonton</span> •
                                <span class="upload-date">${video.uploadDate}</span>
                            </p>
                        </div>
                        <button class="video-options-button" title="Opsi Lainnya">⋮</button>
                    </div>
                </div>
            `;
            videoGridContainer.insertAdjacentHTML('beforeend', videoItemHTML);
        });
    }

    /**
     * Memuat data video dari file JSON.
     */
    async function loadVideoData() {
        showSkeletonLoader(); // Tampilkan skeleton saat mulai memuat
        try {
            // Delay simulasi untuk melihat skeleton loader lebih jelas (hapus di produksi)
            await new Promise(resolve => setTimeout(resolve, 1500)); 

            const response = await fetch('videos.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            allVideos = await response.json();
            displayVideos(allVideos);
        } catch (error) {
            console.error("Tidak bisa memuat data video:", error);
            videoGridContainer.innerHTML = '<p class="grid-message">Gagal memuat data video. Silakan coba lagi nanti.</p>';
        }
    }

    /**
     * Menangani input pencarian dengan debouncing.
     */
    function handleSearchInput() {
        clearTimeout(searchDebounceTimeout); // Hapus timeout sebelumnya
        searchDebounceTimeout = setTimeout(() => {
            const query = searchInput.value.toLowerCase().trim();
            const searchResults = allVideos.filter(video => {
                const titleMatch = video.title.toLowerCase().includes(query);
                const channelMatch = video.channelName.toLowerCase().includes(query);
                const tagsMatch = video.tags.some(tag => tag.toLowerCase().includes(query));
                return titleMatch || channelMatch || tagsMatch;
            });
            displayVideos(searchResults);
        }, 300); // Tunggu 300ms setelah pengguna berhenti mengetik
    }

    // === INISIALISASI FUNGSI-FUNGSI UI LAINNYA (Menu, Sidebar, dll) ===
    function initUIInteractions() {
        // Kode untuk Sidebar, Search UI Toggle, dan Nav Active State dari jawaban sebelumnya
        // disalin ke sini agar semua terpusat.
        const topHeader = document.querySelector('.top-header');
        const searchButton = document.getElementById('searchButton');
        const backButton = document.getElementById('backButton');
        const searchContainer = document.querySelector('.search-container');
        const sidebarToggleButton = document.getElementById('sidebarToggleButton');
        const sidebarNav = document.getElementById('sidebarNav');
        const contentArea = document.querySelector('.content-area');

        // Sidebar Toggle
        if (sidebarToggleButton && sidebarNav) {
            sidebarToggleButton.addEventListener('click', () => {
                sidebarNav.classList.toggle('collapsed');
                contentArea.classList.toggle('sidebar-collapsed');
            });
        }
        
        // Search UI Toggle
        const openSearchMode = () => {
            topHeader.classList.add('search-active');
            searchInput.focus();
            document.addEventListener('click', handleClickOutsideSearch, true);
        };
        const closeSearchMode = () => {
            topHeader.classList.remove('search-active');
            document.removeEventListener('click', handleClickOutsideSearch, true);
        };
        const handleClickOutsideSearch = (e) => {
            if (searchContainer && !searchContainer.contains(e.target) && !searchButton.contains(e.target)) {
                closeSearchMode();
            }
        };

        if (searchButton) searchButton.addEventListener('click', e => { e.stopPropagation(); openSearchMode(); });
        if (backButton) backButton.addEventListener('click', e => { e.stopPropagation(); closeSearchMode(); });
        if (searchInput) {
            searchInput.addEventListener('click', e => e.stopPropagation());
            searchInput.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearchMode(); });
        }
        
        // Nav Active State
        const handleNavActiveState = (selector) => {
            const items = document.querySelectorAll(selector);
            items.forEach(item => {
                item.addEventListener('click', () => {
                    items.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                });
            });
        };
        handleNavActiveState('.sidebar-nav .sidebar-item');
        handleNavActiveState('.main-menu-bottom .menu-item');
    }


    // === TITIK MASUK UTAMA APLIKASI ===
    
    // Inisialisasi semua interaksi UI
    initUIInteractions();
    
    // Tambahkan event listener untuk search input
    searchInput.addEventListener('input', handleSearchInput);
    
    // Muat data video utama
    loadVideoData();

});


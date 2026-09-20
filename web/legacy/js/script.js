        // Media files in the project under media/photos
        const mediaItems = [
            { type: 'image', file: 'truong-binh-hoa_page-0001.jpg', title: 'Hình 1 - Di tích trường tư thục Bình Hoà', category: 'object', content: 'Di tích trường tư thục Bình Hoà - Giồng Trôm, Bến Tre' },
            { type: 'image', file: 'truong-binh-hoa_page-0002.jpg', title: 'Hình 2 - Di tích trường tư thục Bình Hoà', category: 'object', content: 'Di tích trường tư thục Bình Hoà - Giồng Trôm, Bến Tre' },
            { type: 'image', file: 'truong-binh-hoa_page-0003.jpg', title: 'Hình 3 - Di tích trường tư thục Bình Hoà', category: 'object', content: 'Di tích trường tư thục Bình Hoà - Giồng Trôm, Bến Tre' },
            { type: 'image', file: 'truong-binh-hoa_page-0004.jpg', title: 'Hình 4 - Di tích trường tư thục Bình Hoà', category: 'object', content: 'Di tích trường tư thục Bình Hoà - Giồng Trôm, Bến Tre' },
            { type: 'image', file: 'truong-binh-hoa_page-0005.jpg', title: 'Hình 5 - Di tích trường tư thục Bình Hoà', category: 'object', content: 'Di tích trường tư thục Bình Hoà - Giồng Trôm, Bến Tre' },
            { type: 'image', file: 'truong-binh-hoa_page-0006.jpg', title: 'Hình 6 - Di tích trường tư thục Bình Hoà', category: 'object', content: 'Di tích trường tư thục Bình Hoà - Giồng Trôm, Bến Tre' },
            { type: 'image', file: 'truong-binh-hoa_page-0007.jpg', title: 'Hình 7 - Di tích trường tư thục Bình Hoà', category: 'object', content: 'Di tích trường tư thục Bình Hoà - Giồng Trôm, Bến Tre' },
            { type: 'image', file: 'truong-binh-hoa_page-0008.jpg', title: 'Hình 8 - Di tích trường tư thục Bình Hoà', category: 'object', content: 'Di tích trường tư thục Bình Hoà - Giồng Trôm, Bến Tre' },
            { type: 'image', file: 'truong-binh-hoa_page-0009.jpg', title: 'Hình 9 - Di tích trường tư thục Bình Hoà', category: 'object', content: 'Di tích trường tư thục Bình Hoà - Giồng Trôm, Bến Tre' },
            { type: 'image', file: 'truong-binh-hoa_page-0010.jpg', title: 'Hình 10 - Di tích trường tư thục Bình Hoà', category: 'object', content: 'Di tích trường tư thục Bình Hoà - Giồng Trôm, Bến Tre' },
            { type: 'image', file: 'truong-binh-hoa_page-0011.jpg', title: 'Hình 11 - Di tích trường tư thục Bình Hoà', category: 'object', content: 'Di tích trường tư thục Bình Hoà - Giồng Trôm, Bến Tre' },
            { type: 'image', file: 'truong-binh-hoa_page-0012.jpg', title: 'Hình 12 - Di tích trường tư thục Bình Hoà', category: 'object', content: 'Di tích trường tư thục Bình Hoà - Giồng Trôm, Bến Tre' },
            { type: 'image', file: 'truong-binh-hoa_page-0013.jpg', title: 'Hình 13 - Di tích trường tư thục Bình Hoà', category: 'object', content: 'Di tích trường tư thục Bình Hoà - Giồng Trôm, Bến Tre' }
        ];

        let currentFilter = 'all';
        let filteredItems = [...mediaItems];
        let selectedIndex = 0;
        let activeVideo = null;
        let controlsTimeout = null;
        let thumbBarTimeout = null;
        let thumbBarPointerInside = false;


        const videoContentElement = document.querySelector('#noteMedia .note-media__content');
        let contentHasUpdated = false;

        const player = document.querySelector('#player');
        const playerContainer = document.querySelector('#playerContainer');
        const playerLoader = document.querySelector('#playerLoader');
        const thumbRowWrap = document.querySelector('#thumbRowWrap');
        const thumbRow = document.querySelector('#thumbRow');
        const playerIndex = document.querySelector('#playerIndex');
        const fullscreenBtn = document.querySelector('#fullscreenBtn');

        // Custom controls elements
        const videoControls = document.querySelector('#videoControls');
        const videoPlayBtn = document.querySelector('#videoPlayBtn');
        const svgPlay = document.querySelector('#svgPlay');
        const svgPause = document.querySelector('#svgPause');
        const videoVolumeBtn = document.querySelector('#videoVolumeBtn');
        const svgVolHigh = document.querySelector('#svgVolHigh');
        const svgVolMute = document.querySelector('#svgVolMute');
        const videoVolumeSlider = document.querySelector('#videoVolumeSlider');
        const videoTime = document.querySelector('#videoTime');
        const videoProgressContainer = document.querySelector('#videoProgressContainer');
        const videoProgressLoaded = document.querySelector('#videoProgressLoaded');
        const videoProgressCurrent = document.querySelector('#videoProgressCurrent');
        const videoProgressKnob = document.querySelector('#videoProgressKnob');
        const mobileThumbBarQuery = window.matchMedia('(max-width: 768px)');

        function getMediaBase() {
            const meta = document.querySelector('meta[name="media-base"]');
            if (meta) return meta.getAttribute('content').replace(/\/+$/, '');
            if (window.MEDIA_BASE) return window.MEDIA_BASE.replace(/\/+$/, '');
            return '/media/images';
        }

        function mediaUrl(file) {
            const base = getMediaBase();
            return (base.endsWith('/') ? base : base + '/') + encodeURI(file);
        }

        function updateVideoContent(item) {
            // Only update if content exists and hasn't been updated yet
            if (item.content && !contentHasUpdated) {
                videoContentElement.textContent = item.content;
                contentHasUpdated = true;
            }
        }

        function updateVideoCategory(item) {
            videoContentElement.setAttribute('data-category', item.category || 'other');
        }

        // Update note media content
        function updateNoteMediaContent(item) {
            const noteMediaContent = document.querySelector('#noteMedia .note-media__content');
            const contentText = item.content || '';

            const lastParenIndex = contentText.lastIndexOf('(');
            const commaIndex = contentText.indexOf(',');

            if (lastParenIndex !== -1) {
                const before = contentText.substring(0, lastParenIndex).trim();
                const after = contentText.substring(lastParenIndex);
                noteMediaContent.innerHTML = before + '<br>' + after;
            } else if (commaIndex !== -1) {
                const rest = contentText.substring(commaIndex + 1).trim();
                const restWords = rest.split(/\s+/).filter(w => w.length > 0);
                if (restWords.length > 2) {
                    noteMediaContent.innerHTML = contentText.replace(/,\s+/, ',<br>');
                } else {
                    noteMediaContent.textContent = contentText;
                }
            } else {
                noteMediaContent.textContent = contentText;
            }

            noteMediaContent.setAttribute('data-content', contentText);
            noteMediaContent.setAttribute('data-category', item.category || 'other');
        }

        function updateNoteMediaTitle(item) {
            const noteMediaTitle = document.querySelector('#noteMedia .note-media__title');
            noteMediaTitle.textContent = item.title;
        }

        // Update note media category
        function updateNoteMediaCategory(item) {
            const noteMediaContent = document.querySelector('#noteMedia .note-media__content');
            noteMediaContent.setAttribute('data-category', item.category || 'other');
        }

        // Clear note media content and category
        function clearNoteMediaContent() {
            const noteMediaContent = document.querySelector('#noteMedia .note-media__content');
            noteMediaContent.textContent = '';
            noteMediaContent.setAttribute('data-category', 'other');
        }

        function clearNoteMediaTitle() {
            const noteMediaTitle = document.querySelector('#noteMedia .note-media__title');
            noteMediaTitle.textContent = '';
        }

        function clearNoteMediaCategory() {
            const noteMediaContent = document.querySelector('#noteMedia .note-media__content');
            noteMediaContent.setAttribute('data-category', 'other');
        }

        function createMedia(item, className, interactive) {
            if (item.type === 'video') {
                const video = document.createElement('video');
                video.className = className;
                video.src = mediaUrl(item.file);
                video.dataset.file = item.file;
                video.controls = false;
                video.preload = 'metadata';
                video.playsInline = true;
                video.setAttribute('aria-label', item.title);

                video.addEventListener('loadeddata', () => {
                    playerLoader.style.display = 'none';
                });

                return video;
            }

            const image = document.createElement('img');
            image.className = className;
            image.src = mediaUrl(item.file);
            image.alt = item.title;
            image.loading = interactive ? 'eager' : 'lazy';
            image.decoding = 'async';

            image.addEventListener('load', () => {
                playerLoader.style.display = 'none';
            });
            image.addEventListener('error', () => {
                playerLoader.style.display = 'none';
            });

            return image;
        }

        function formatTime(seconds) {
            if (isNaN(seconds) || seconds === Infinity) return '0:00';
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        }

        function expandThumbBar() {
            clearTimeout(thumbBarTimeout);
            thumbRowWrap.classList.add('is-expanded');
        }

        function collapseThumbBar() {
            if (mobileThumbBarQuery.matches) {
                expandThumbBar();
                return;
            }
            if (thumbBarPointerInside || document.activeElement.closest?.('#thumbRowWrap')) return;
            thumbRowWrap.classList.remove('is-expanded');
        }

        function scheduleThumbBarCollapse(delay = 2600) {
            clearTimeout(thumbBarTimeout);
            if (mobileThumbBarQuery.matches) {
                expandThumbBar();
                return;
            }
            thumbBarTimeout = setTimeout(collapseThumbBar, delay);
        }

        function keepActiveThumbVisible() {
            const scrollActiveThumb = () => {
                const activeThumb = thumbRow.querySelector('.thumb[aria-current="true"]');
                if (!activeThumb) return;

                const targetLeft = activeThumb.offsetLeft + activeThumb.offsetWidth / 2 - thumbRow.clientWidth / 2;
                const maxLeft = Math.max(0, thumbRow.scrollWidth - thumbRow.clientWidth);
                thumbRow.scrollTo({
                    left: Math.max(0, Math.min(maxLeft, targetLeft)),
                    behavior: 'smooth'
                });
            };

            requestAnimationFrame(scrollActiveThumb);
            setTimeout(scrollActiveThumb, 320);
        }

        function updateVideoProgress() {
            if (!activeVideo) return;

            const current = activeVideo.currentTime;
            const duration = activeVideo.duration || 0;
            const percent = duration > 0 ? (current / duration) * 100 : 0;

            videoProgressCurrent.style.width = `${percent}%`;
            videoProgressKnob.style.left = `${percent}%`;

            if (activeVideo.buffered && activeVideo.buffered.length > 0) {
                const bufferedEnd = activeVideo.buffered.end(activeVideo.buffered.length - 1);
                const bufferedPercent = duration > 0 ? (bufferedEnd / duration) * 100 : 0;
                videoProgressLoaded.style.width = `${bufferedPercent}%`;
            }

            videoTime.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
        }

        // --- Persist playback positions per file using localStorage ---
        function playbackKey(file) {
            return `media:playback:${encodeURIComponent(file)}`;
        }

        function savePlaybackTime(file, time) {
            try {
                localStorage.setItem(playbackKey(file), String(Math.max(0, Math.floor(time * 1000))));
            } catch (e) {
                // ignore storage errors
            }
        }

        function loadPlaybackTime(file) {
            try {
                const v = localStorage.getItem(playbackKey(file));
                if (!v) return 0;
                const ms = Number(v);
                if (isNaN(ms)) return 0;
                return ms / 1000;
            } catch (e) {
                return 0;
            }
        }


        function togglePlay() {
            if (!activeVideo) return;
            if (activeVideo.paused) {
                activeVideo.play();
                svgPlay.style.display = 'none';
                svgPause.style.display = 'block';
                resetControlsTimeout();
            } else {
                activeVideo.pause();
                svgPlay.style.display = 'block';
                svgPause.style.display = 'none';
                showControls();
            }
        }

        // Set controls classes
        function showControls() {
            playerContainer.classList.remove('controls-hidden');
            playerContainer.classList.add('controls-active');
        }

        function hideControls() {
            if (activeVideo && !activeVideo.paused) {
                playerContainer.classList.add('controls-hidden');
                playerContainer.classList.remove('controls-active');
            }
        }

        function resetControlsTimeout() {
            showControls();
            clearTimeout(controlsTimeout);
            if (activeVideo && !activeVideo.paused) {
                controlsTimeout = setTimeout(hideControls, 3000);
            }
        }

        function setupVideoControls() {
            playerContainer.addEventListener('mousemove', resetControlsTimeout);
            playerContainer.addEventListener('mouseleave', () => {
                if (activeVideo && !activeVideo.paused) {
                    clearTimeout(controlsTimeout);
                    hideControls();
                }
            });

            videoPlayBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePlay();
            });

            player.addEventListener('click', () => {
                if (activeVideo) {
                    togglePlay();
                }
            });

            videoVolumeSlider.addEventListener('input', (e) => {
                if (!activeVideo) return;
                activeVideo.volume = e.target.value;
                activeVideo.muted = e.target.value === '0';
                updateVolumeUI();
            });

            videoVolumeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!activeVideo) return;
                activeVideo.muted = !activeVideo.muted;
                updateVolumeUI();
            });

            videoProgressContainer.addEventListener('click', (e) => {
                if (!activeVideo) return;
                const rect = videoProgressContainer.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const percent = Math.max(0, Math.min(1, clickX / width));
                activeVideo.currentTime = percent * activeVideo.duration;
                updateVideoProgress();
            });

            let isDraggingProgress = false;
            videoProgressContainer.addEventListener('mousedown', (e) => {
                isDraggingProgress = true;
                seek(e);
            });

            window.addEventListener('mousemove', (e) => {
                if (isDraggingProgress) seek(e);
            });

            window.addEventListener('mouseup', () => {
                isDraggingProgress = false;
            });

            function seek(e) {
                if (!activeVideo || !activeVideo.duration) return;
                const rect = videoProgressContainer.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const percent = Math.max(0, Math.min(1, clickX / width));
                activeVideo.currentTime = percent * activeVideo.duration;
                updateVideoProgress();
            }
        }

        function updateVolumeUI() {
            if (!activeVideo) return;
            const isMuted = activeVideo.muted || activeVideo.volume === 0;
            svgVolMute.style.display = isMuted ? 'block' : 'none';
            svgVolHigh.style.display = isMuted ? 'none' : 'block';
            videoVolumeSlider.value = activeVideo.muted ? 0 : activeVideo.volume;
        }

        function renderPlayer() {
            if (filteredItems.length === 0) return;

            if (activeVideo) {
                try { savePlaybackTime(activeVideo.dataset.file || '', activeVideo.currentTime); } catch (e) { }
                activeVideo.pause();
                activeVideo = null;
            }
            clearTimeout(controlsTimeout);
            playerContainer.classList.remove('controls-hidden', 'controls-active');

            playerLoader.style.display = 'block';
            const item = filteredItems[selectedIndex];

            playerIndex.textContent = `${selectedIndex + 1} / ${filteredItems.length}`;

            const mediaEl = createMedia(item, '', true);
            player.replaceChildren(mediaEl);
            updateNoteMediaContent(item);

            if (item.type === 'video') {
                activeVideo = mediaEl;
                videoControls.style.display = 'flex';
                showControls();

                svgPlay.style.display = 'block';
                svgPause.style.display = 'none';

                // Keep track of a last-saved time to throttle storage writes
                let lastSavedAt = 0;

                activeVideo.addEventListener('loadedmetadata', () => {
                    const stored = loadPlaybackTime(item.file) || 0;
                    if (stored > 0 && stored < activeVideo.duration - 1) {
                        try { activeVideo.currentTime = stored; } catch (e) { /* ignore */ }
                    }
                    updateVideoProgress();
                });

                activeVideo.addEventListener('timeupdate', () => {
                    updateVideoProgress();
                    const now = Date.now();
                    if (now - lastSavedAt > 900) {
                        savePlaybackTime(item.file, activeVideo.currentTime);
                        lastSavedAt = now;
                    }
                });

                activeVideo.addEventListener('durationchange', updateVideoProgress);
                activeVideo.addEventListener('progress', updateVideoProgress);

                activeVideo.addEventListener('play', () => {
                    svgPlay.style.display = 'none';
                    svgPause.style.display = 'block';
                    resetControlsTimeout();
                });

                activeVideo.addEventListener('pause', () => {
                    svgPlay.style.display = 'block';
                    svgPause.style.display = 'none';
                    showControls();
                    // save position on pause
                    savePlaybackTime(item.file, activeVideo.currentTime);
                });

                activeVideo.addEventListener('ended', () => {
                    // reset stored position when video finishes
                    savePlaybackTime(item.file, 0);
                });

                updateVolumeUI();

                // Autoplay: muted is required by browser autoplay policy
                activeVideo.muted = true;
                updateVolumeUI();
                activeVideo.play().catch(() => {
                    // Autoplay blocked - show play button
                    svgPlay.style.display = 'block';
                    svgPause.style.display = 'none';
                });
            } else {
                videoControls.style.display = 'none';
            }

            document.querySelectorAll('.thumb').forEach((thumb) => {
                const isCurrent = Number(thumb.dataset.index) === selectedIndex;
                thumb.setAttribute('aria-current', String(isCurrent));
            });
            keepActiveThumbVisible();
        }

        function renderThumbs() {
            thumbRow.innerHTML = '';

            filteredItems.forEach((item, index) => {
                const button = document.createElement('button');
                const mediaWrapper = document.createElement('div');

                button.className = 'thumb';
                button.type = 'button';
                button.dataset.index = String(index);
                button.dataset.type = item.type;
                button.title = item.title;
                button.setAttribute('aria-label', item.title);
                button.setAttribute('aria-current', String(index === selectedIndex));

                mediaWrapper.className = 'thumb-media-wrapper';
                mediaWrapper.append(createMedia(item, '', false));

                if (item.type === 'video') {
                    const marker = document.createElement('span');
                    marker.className = 'thumb-play-mark';
                    marker.innerHTML = `
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          `;
                    mediaWrapper.append(marker);
                }

                button.append(mediaWrapper);

                button.addEventListener('click', () => {
                    expandThumbBar();
                    selectedIndex = index;
                    renderPlayer();
                    scheduleThumbBarCollapse();
                });

                thumbRow.append(button);
            });
        }

        function moveSelection(direction) {
            if (filteredItems.length === 0) return;
            selectedIndex = (selectedIndex + direction + filteredItems.length) % filteredItems.length;
            renderPlayer();
        }

        function setupSwipeNavigation() {
            let touchStartX = 0;
            let touchStartY = 0;
            let touchStartTime = 0;

            playerContainer.addEventListener('touchstart', (event) => {
                if (event.touches.length !== 1) return;
                const touch = event.touches[0];
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                touchStartTime = Date.now();
            }, { passive: true });

            playerContainer.addEventListener('touchend', (event) => {
                if (!event.changedTouches || event.changedTouches.length === 0) return;
                const touch = event.changedTouches[0];
                const deltaX = touch.clientX - touchStartX;
                const deltaY = touch.clientY - touchStartY;
                const elapsed = Date.now() - touchStartTime;

                if (window.innerWidth > 768) return;
                if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY) || elapsed > 800) {
                    return;
                }

                if (deltaX < 0) {
                    expandThumbBar();
                    moveSelection(1);
                    scheduleThumbBarCollapse();
                } else {
                    expandThumbBar();
                    moveSelection(-1);
                    scheduleThumbBarCollapse();
                }
            }, { passive: true });
        }

        // Category Tabs Logic
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                currentFilter = e.target.dataset.category;
                if (currentFilter === 'all') {
                    filteredItems = [...mediaItems];
                } else {
                    filteredItems = mediaItems.filter(item => item.category === currentFilter);
                }

                selectedIndex = 0;
                renderThumbs();
                renderPlayer();
                expandThumbBar();
                scheduleThumbBarCollapse();
            });
        });

        // Fullscreen / Theater Mode Logic
        function toggleFullscreen() {
            const viewerPanel = document.querySelector('.viewer-panel');
            if (!document.fullscreenElement) {
                viewerPanel.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        }

        fullscreenBtn.addEventListener('click', toggleFullscreen);

        // Event listeners for navigation buttons
        document.querySelector('#prevButton').addEventListener('click', () => {
            expandThumbBar();
            moveSelection(-1);
            scheduleThumbBarCollapse();
        });
        document.querySelector('#nextButton').addEventListener('click', () => {
            expandThumbBar();
            moveSelection(1);
            scheduleThumbBarCollapse();
        });

        document.querySelector('#playerPrevBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            expandThumbBar();
            moveSelection(-1);
            scheduleThumbBarCollapse();
        });
        document.querySelector('#playerNextBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            expandThumbBar();
            moveSelection(1);
            scheduleThumbBarCollapse();
        });

        thumbRowWrap.addEventListener('mouseenter', () => {
            thumbBarPointerInside = true;
            expandThumbBar();
        });
        thumbRowWrap.addEventListener('mouseleave', () => {
            thumbBarPointerInside = false;
            scheduleThumbBarCollapse(650);
        });
        thumbRowWrap.addEventListener('focusin', expandThumbBar);
        thumbRowWrap.addEventListener('focusout', () => scheduleThumbBarCollapse(650));
        mobileThumbBarQuery.addEventListener('change', () => {
            expandThumbBar();
            scheduleThumbBarCollapse();
        });

        document.addEventListener('pointermove', (event) => {
            if (mobileThumbBarQuery.matches) {
                expandThumbBar();
                return;
            }
            const bottomTriggerHeight = Math.min(96, window.innerHeight * 0.14);
            if (window.innerHeight - event.clientY <= bottomTriggerHeight) {
                expandThumbBar();
            } else if (!thumbBarPointerInside) {
                scheduleThumbBarCollapse(900);
            }
        });

        // Keyboard bindings
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                expandThumbBar();
                moveSelection(-1);
                scheduleThumbBarCollapse();
            } else if (event.key === 'ArrowRight') {
                expandThumbBar();
                moveSelection(1);
                scheduleThumbBarCollapse();
            } else if (event.key.toLowerCase() === 'f') {
                toggleFullscreen();
            } else if (event.key === ' ' && activeVideo) {
                event.preventDefault(); // Prevent page scrolling
                togglePlay();
            }
        });

        // Setup custom controls on startup
        setupVideoControls();
        setupSwipeNavigation();

        // Initial load
        renderThumbs();
        renderPlayer();
        expandThumbBar();
        scheduleThumbBarCollapse(3000);
// DOM elements
const photoInput = document.getElementById('photoInput');
const dynamicPhoto = document.getElementById('dynamicPhoto');
const photoPlaceholderDiv = document.getElementById('photoPlaceholder');
const downloadBtn = document.getElementById('downloadPosterBtn');
const resetPhotoBtn = document.getElementById('resetPhotoBtn');
const resetViewBtn = document.getElementById('resetViewBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const menuToggleBtn = document.getElementById('menuToggleBtn');
const menuDrawer = document.getElementById('menuDrawer');

// Logo elements
const schoolLogoImg = document.getElementById('schoolLogoImg');
const logoFallback = document.getElementById('logoFallback');

// Logo path (adjust if needed)
const SCHOOL_LOGO_PATH = "gldlogo.png";

// Set logo properties
schoolLogoImg.src = SCHOOL_LOGO_PATH;
schoolLogoImg.style.width = "49px";
schoolLogoImg.style.height = "49px";
schoolLogoImg.style.objectFit = "contain";

// Logo error handling
schoolLogoImg.onerror = function() {
    console.log("Logo file not found. Using fallback icon.");
    this.style.display = 'none';
    logoFallback.style.display = 'flex';
};

schoolLogoImg.onload = function() {
    this.style.display = 'block';
    this.style.width = "49px";
    this.style.height = "49px";
    this.style.objectFit = "contain";
    logoFallback.style.display = 'none';
};

// Display uploaded image
function displayUploadedImage(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        dynamicPhoto.src = e.target.result;
        dynamicPhoto.style.display = 'block';
        photoPlaceholderDiv.style.display = 'none';
        dynamicPhoto.style.objectFit = 'contain';
        dynamicPhoto.style.width = '100%';
        dynamicPhoto.style.height = '100%';
    };
    reader.readAsDataURL(file);
}

// Reset photo
function resetPhotoToPlaceholder() {
    dynamicPhoto.src = '';
    dynamicPhoto.style.display = 'none';
    photoPlaceholderDiv.style.display = 'flex';
    photoInput.value = '';
}

// Upload event
photoInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
        displayUploadedImage(file);
    } else {
        alert('Please select a valid JPG or PNG image.');
        resetPhotoToPlaceholder();
    }
});

// Click on upload area
const uploadTrigger = document.getElementById('uploadTrigger');
uploadTrigger.addEventListener('click', (e) => {
    if (e.target === uploadTrigger || uploadTrigger.contains(e.target) && e.target.tagName !== 'INPUT') {
        photoInput.click();
    }
});

// Reset handlers
function handleReset() {
    resetPhotoToPlaceholder();
}
resetPhotoBtn.addEventListener('click', handleReset);
resetViewBtn.addEventListener('click', handleReset);

// ========== UNIVERSAL MOBILE SAVING ==========
function showPosterModal(imageDataUrl) {
    // Remove existing modal if any
    const oldModal = document.getElementById('posterModal');
    if (oldModal) oldModal.remove();

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'posterModal';
    modal.className = 'poster-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>📸 Your Poster is Ready</h3>
            <div class="modal-image-container">
                <img id="modalPosterImg" src="${imageDataUrl}" alt="Poster" style="max-width:100%; max-height:50vh; object-fit:contain; border-radius:8px; -webkit-touch-callout: default; user-select: auto;">
            </div>
            <div class="modal-actions">
                <button id="saveImageBtn" class="save-modal-btn"><i class="fas fa-download"></i> Save Image</button>
                <button id="copyImageBtn" class="copy-modal-btn"><i class="fas fa-copy"></i> Copy to Clipboard</button>
                <p class="modal-note">
                    <i class="fas fa-fingerprint"></i> <strong>Long-press the image</strong> → "Save Image"<br>
                    <i class="fas fa-mobile-alt"></i> If buttons fail, take a <strong>screenshot</strong>.
                </p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .poster-modal {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            z-index: 10000;
            justify-content: center;
            align-items: center;
        }
        .poster-modal .modal-content {
            background: var(--bg-color, white);
            color: var(--text-color, black);
            max-width: 95%;
            max-height: 90%;
            border-radius: 20px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .poster-modal .close-modal {
            position: absolute;
            top: 15px;
            right: 25px;
            font-size: 35px;
            font-weight: bold;
            cursor: pointer;
            color: #fff;
            background: rgba(0,0,0,0.6);
            width: 45px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            z-index: 10001;
        }
        .poster-modal .modal-image-container {
            overflow: auto;
            max-height: 55vh;
        }
        .poster-modal .save-modal-btn, .poster-modal .copy-modal-btn {
            border: none;
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.3s;
            width: 100%;
            margin-bottom: 8px;
        }
        .poster-modal .save-modal-btn {
            background: #4CAF50;
            color: white;
        }
        .poster-modal .save-modal-btn:hover {
            background: #45a049;
        }
        .poster-modal .copy-modal-btn {
            background: #2196F3;
            color: white;
        }
        .poster-modal .copy-modal-btn:hover {
            background: #0b7dda;
        }
        .poster-modal .modal-note {
            font-size: 0.85rem;
            opacity: 0.9;
            margin: 5px 0 0;
            background: #f0f0f0;
            padding: 8px;
            border-radius: 8px;
        }
        body.dark .poster-modal .modal-content {
            background: #1e1e2a;
            color: #f0f0f0;
        }
        body.dark .poster-modal .modal-note {
            background: #2a2a38;
        }
        /* Ensure long-press works */
        #modalPosterImg {
            -webkit-touch-callout: default !important;
            -webkit-user-select: auto !important;
            user-select: auto !important;
            pointer-events: auto !important;
        }
    `;
    document.head.appendChild(style);

    // Close modal
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => modal.remove();
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    // Helper: trigger download
    function triggerDownload(dataUrl, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Save Image button
    const saveBtn = document.getElementById('saveImageBtn');
    saveBtn.addEventListener('click', () => {
        try {
            triggerDownload(imageDataUrl, 'GLD_School_Poster.png');
            saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
            setTimeout(() => {
                saveBtn.innerHTML = '<i class="fas fa-download"></i> Save Image';
            }, 2000);
        } catch (e) {
            alert('Auto-save failed. Please long-press the image or take a screenshot.');
        }
    });

    // Copy to Clipboard button
    const copyBtn = document.getElementById('copyImageBtn');
    copyBtn.addEventListener('click', async () => {
        try {
            const blob = await (await fetch(imageDataUrl)).blob();
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy to Clipboard';
            }, 2000);
        } catch (err) {
            console.warn('Copy failed:', err);
            alert('Copy not supported. Please long-press the image or take a screenshot.');
        }
    });
}

downloadBtn.addEventListener('click', async function() {
    const posterElement = document.getElementById('posterBox');
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Generating...';
    downloadBtn.disabled = true;

    try {
        // Scale reduced to 1.2 for low-memory devices
        const canvas = await html2canvas(posterElement, {
            scale: 1.2,
            backgroundColor: null,
            logging: false,
            useCORS: false,
            allowTaint: false,
            onclone: (clonedDoc, element) => {
                const clonedLogo = clonedDoc.getElementById('schoolLogoImg');
                if (clonedLogo) {
                    clonedLogo.style.width = "49px";
                    clonedLogo.style.height = "49px";
                    clonedLogo.style.objectFit = "contain";
                }
                const clonedFallback = clonedDoc.getElementById('logoFallback');
                if (clonedFallback && clonedFallback.style.display !== 'none') {
                    clonedFallback.style.width = "49px";
                    clonedFallback.style.height = "49px";
                }
                const clonedHeader = clonedDoc.querySelector('.poster-header');
                if (clonedHeader) clonedHeader.style.padding = '0';
                const clonedTitle = clonedDoc.querySelector('.title-section');
                if (clonedTitle) {
                    clonedTitle.style.margin = '0';
                    clonedTitle.style.padding = '0';
                }
            }
        });

        const imageDataUrl = canvas.toDataURL('image/png');
        showPosterModal(imageDataUrl);

    } catch (error) {
        console.error('Poster generation error:', error);
        alert('Failed to generate poster. Please check:\n- Logo file exists (gldlogo.png)\n- Image upload works\n- Try again with a smaller photo');
    } finally {
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
    }
});
// ========== END SAVING ==========

// Dark mode functions
function initDarkMode() {
    const savedTheme = localStorage.getItem('gld_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
    updateDarkModeIcon();
    updatePlaceholderBg();
}

function updateDarkModeIcon() {
    const darkBtn = document.getElementById('darkModeToggle');
    if (document.body.classList.contains('dark')) {
        darkBtn.innerHTML = '<i class="fas fa-sun"></i> Light';
    } else {
        darkBtn.innerHTML = '<i class="fas fa-moon"></i> Dark';
    }
}

function updatePlaceholderBg() {
    if (document.body.classList.contains('dark')) {
        photoPlaceholderDiv.style.backgroundColor = '#2a2a38';
    } else {
        photoPlaceholderDiv.style.backgroundColor = '#eef2f0';
    }
}

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('gld_theme', isDark ? 'dark' : 'light');
    updateDarkModeIcon();
    updatePlaceholderBg();
});

// Toggle menu drawer
menuToggleBtn.addEventListener('click', () => {
    menuDrawer.classList.toggle('open');
    if (menuDrawer.classList.contains('open')) {
        menuToggleBtn.innerHTML = '<i class="fas fa-times"></i> Close';
    } else {
        menuToggleBtn.innerHTML = '<i class="fas fa-bars"></i> Menu';
    }
});

// Placeholder style initialisation
function initPlaceholderStyle() {
    photoPlaceholderDiv.style.display = 'flex';
    photoPlaceholderDiv.style.flexDirection = 'column';
    photoPlaceholderDiv.style.alignItems = 'center';
    photoPlaceholderDiv.style.justifyContent = 'center';
    photoPlaceholderDiv.style.width = '100%';
    photoPlaceholderDiv.style.height = '100%';
    photoPlaceholderDiv.style.backgroundColor = document.body.classList.contains('dark') ? '#2a2a38' : '#eef2f0';
    dynamicPhoto.style.objectFit = 'contain';
}

// Observer to sync display states
const observer = new MutationObserver(() => {
    if (dynamicPhoto.src && dynamicPhoto.src !== '' && dynamicPhoto.src !== window.location.href && !dynamicPhoto.src.includes('null')) {
        if (dynamicPhoto.style.display !== 'block') {
            dynamicPhoto.style.display = 'block';
            photoPlaceholderDiv.style.display = 'none';
        }
        dynamicPhoto.style.objectFit = 'contain';
    } else {
        if (photoPlaceholderDiv.style.display !== 'flex') {
            photoPlaceholderDiv.style.display = 'flex';
            dynamicPhoto.style.display = 'none';
        }
    }
});
observer.observe(dynamicPhoto, { attributes: true, attributeFilter: ['src', 'style'] });

window.addEventListener('resize', () => {
    if (dynamicPhoto.style.display === 'block') {
        dynamicPhoto.style.objectFit = 'contain';
    }
});

// Initial setup
resetPhotoToPlaceholder();
initPlaceholderStyle();
initDarkMode();
console.log("✅ Poster app ready — Multiple save methods available.");
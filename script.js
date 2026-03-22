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

// --- Improved Download for Mobile ---
downloadBtn.addEventListener('click', async function() {
    const posterElement = document.getElementById('posterBox');
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Generating...';
    downloadBtn.disabled = true;

    try {
        const canvas = await html2canvas(posterElement, {
            scale: 2,                // Reduced from 3 to avoid memory issues on mobile
            backgroundColor: null,
            logging: false,
            useCORS: false,          // Not needed for local images; avoid tainting
            allowTaint: false,
            onclone: (clonedDoc, element) => {
                // Ensure logo styles are preserved in the cloned poster
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
                // Ensure header minimal spacing
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

        // Method 1: Open image in new tab (user can long-press to save)
        const newWindow = window.open();
        if (newWindow) {
            newWindow.document.write(`
                <html>
                <head><title>GLD Poster</title></head>
                <body style="margin:0; display:flex; justify-content:center; align-items:center; background:#000;">
                    <img src="${imageDataUrl}" style="max-width:100%; max-height:100%;" />
                </body>
                </html>
            `);
            newWindow.document.close();
            alert('Poster opened in new tab. Long-press the image to save it.');
        } else {
            // Fallback: try share API (mobile browsers)
            if (navigator.share) {
                const blob = await (await fetch(imageDataUrl)).blob();
                const file = new File([blob], 'GLD_School_Poster.png', { type: 'image/png' });
                await navigator.share({
                    title: 'GLD Poster',
                    files: [file]
                });
            } else {
                // Last resort: use download attribute (may still work on some Android)
                const link = document.createElement('a');
                link.download = 'GLD_School_Poster.png';
                link.href = imageDataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    } catch (error) {
        console.error('Poster generation error:', error);
        alert('Failed to generate poster. Please try again or check if the logo file exists.');
    } finally {
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
    }
});

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
console.log("✅ Poster ready — Logo size reduced by 25% (49px). Mobile download fixed.");
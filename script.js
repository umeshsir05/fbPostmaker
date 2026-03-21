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

// ========== LOGO SERVER CONFIGURATION ==========
const SCHOOL_LOGO_PATH = "gldlogo.png";

schoolLogoImg.src = SCHOOL_LOGO_PATH;
schoolLogoImg.style.background = "transparent";
schoolLogoImg.style.padding = "0";
schoolLogoImg.style.margin = "0";
schoolLogoImg.style.boxShadow = "none";

schoolLogoImg.onerror = function() {
  console.log("Logo file 'gldlogo.png' not found. Using fallback icon.");
  this.style.display = 'none';
  logoFallback.style.display = 'flex';
};

schoolLogoImg.onload = function() {
  this.style.display = 'block';
  this.style.background = 'transparent';
  this.style.padding = '0';
  this.style.margin = '0';
  this.style.boxShadow = 'none';
  logoFallback.style.display = 'none';
  console.log("Logo loaded successfully");
};

// Main photo functions
function displayUploadedImage(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const imgUrl = e.target.result;
    dynamicPhoto.src = imgUrl;
    dynamicPhoto.style.display = 'block';
    photoPlaceholderDiv.style.display = 'none';
    dynamicPhoto.style.objectFit = 'contain';
    dynamicPhoto.style.width = '100%';
    dynamicPhoto.style.height = '100%';
  };
  reader.readAsDataURL(file);
}

function resetPhotoToPlaceholder() {
  dynamicPhoto.src = '';
  dynamicPhoto.style.display = 'none';
  photoPlaceholderDiv.style.display = 'flex';
  photoInput.value = '';
}

photoInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
    displayUploadedImage(file);
  } else {
    alert('Please select a valid JPG or PNG image.');
    resetPhotoToPlaceholder();
  }
});

const uploadTrigger = document.getElementById('uploadTrigger');
uploadTrigger.addEventListener('click', (e) => {
  if (e.target === uploadTrigger || uploadTrigger.contains(e.target) && e.target.tagName !== 'INPUT') {
    photoInput.click();
  }
});

function handleReset() {
  resetPhotoToPlaceholder();
}
resetPhotoBtn.addEventListener('click', handleReset);
resetViewBtn.addEventListener('click', handleReset);

// Download poster
downloadBtn.addEventListener('click', function() {
  const posterElement = document.getElementById('posterBox');
  const originalBtnText = downloadBtn.innerHTML;
  downloadBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Generating...';
  downloadBtn.disabled = true;
  
  html2canvas(posterElement, {
    scale: 3,
    backgroundColor: null,
    logging: false,
    useCORS: true,
    allowTaint: false,
    crossOrigin: 'anonymous'
  }).then((canvas) => {
    const link = document.createElement('a');
    link.download = 'GLD_School_Poster_With_Logo.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    downloadBtn.innerHTML = originalBtnText;
    downloadBtn.disabled = false;
  }).catch(error => {
    console.error('Poster download error: ', error);
    alert('Could not generate poster. Please try again.');
    downloadBtn.innerHTML = originalBtnText;
    downloadBtn.disabled = false;
  });
});

// Dark mode
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

// Toggle menu
menuToggleBtn.addEventListener('click', () => {
  menuDrawer.classList.toggle('open');
  if (menuDrawer.classList.contains('open')) {
    menuToggleBtn.innerHTML = '<i class="fas fa-times"></i> Close';
  } else {
    menuToggleBtn.innerHTML = '<i class="fas fa-bars"></i> Menu';
  }
});

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

console.log("Poster ready — Logo on LEFT side, text CENTER aligned, proper spacing between logo and text!");
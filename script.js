// Download poster as PNG – mobile friendly
downloadBtn.addEventListener('click', async function() {
    const posterElement = document.getElementById('posterBox');
    const originalBtnText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Generating...';
    downloadBtn.disabled = true;

    try {
        const canvas = await html2canvas(posterElement, {
            scale: 2,               // reduced from 3 to avoid memory issues
            backgroundColor: null,
            logging: false,
            useCORS: false,         // not needed for local images; avoid taint problems
            allowTaint: false,
            onclone: (clonedDoc, element) => {
                // ensure logo styles persist
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
            }
        });

        // Method 1: Open image in new tab (user can long‑press to save)
        const imageDataUrl = canvas.toDataURL('image/png');
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
            alert('Poster opened in new tab. Long‑press the image to save it.');
        } else {
            // Fallback: try share API
            if (navigator.share) {
                const blob = await (await fetch(imageDataUrl)).blob();
                const file = new File([blob], 'GLD_School_Poster.png', { type: 'image/png' });
                await navigator.share({
                    title: 'GLD Poster',
                    files: [file]
                });
            } else {
                // Last resort: use download attribute (might still work on some Android)
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
        downloadBtn.innerHTML = originalBtnText;
        downloadBtn.disabled = false;
    }
});
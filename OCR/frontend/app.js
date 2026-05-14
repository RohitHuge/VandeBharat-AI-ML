document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('image-input');
    const videoInput = document.getElementById('video-input');
    const resultsSection = document.getElementById('comparison-results');
    const summarySection = document.getElementById('saving-summary');
    const loader = document.getElementById('loader');
    const loaderMsg = document.getElementById('loader-msg');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Tab Logic
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${btn.dataset.tab}-tab`).classList.add('active');
            
            // Clear results when switching
            resultsSection.style.display = 'none';
            summarySection.style.display = 'none';
        });
    });

    // Image Benchmark
    imageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        showLoader('Processing single frame benchmark...');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/ocr/compare', { method: 'POST', body: formData });
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            updateUI(data, 'image');
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            hideLoader();
        }
    });

    // Video Benchmark
    videoInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        showLoader('Processing video benchmark (multi-frame sampling)...');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('frame_skip', '15'); // Sample every 15th frame
        formData.append('max_frames', '5');   // Sample 5 frames for benchmark

        try {
            const response = await fetch('/api/ocr/video_compare', { method: 'POST', body: formData });
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            updateUI(data, 'video');
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            hideLoader();
        }
    });

    function updateUI(data, mode) {
        resultsSection.style.display = 'grid';
        summarySection.style.display = 'block';

        const isVideo = mode === 'video';
        
        // Update Labels
        document.getElementById('m1-desc').textContent = isVideo ? 'Avg. Latency (Full OCR)' : 'Legacy Full-Image OCR';
        document.getElementById('m2-desc').textContent = isVideo ? 'Avg. Latency (YOLO + Crop)' : 'YOLOv8 + Targeted OCR';

        // Method 1
        const m1Time = isVideo ? data.method1.avg_ms : data.method1.total_ms;
        document.getElementById('m1-total').textContent = m1Time;
        
        // Method 2
        const m2Time = isVideo ? data.method2.avg_ms : data.method2.total_ms;
        document.getElementById('m2-total').textContent = m2Time;
        document.getElementById('m2-det').textContent = isVideo ? `${data.method2.avg_det_ms} ms` : `${data.method2.det_ms} ms`;
        document.getElementById('m2-ocr').textContent = isVideo ? `${data.method2.avg_ocr_ms} ms` : `${data.method2.ocr_ms} ms`;

        // Image results hide/show
        document.getElementById('image-only-results-1').style.display = isVideo ? 'none' : 'block';
        document.getElementById('image-only-results-2').style.display = isVideo ? 'none' : 'block';
        
        if (!isVideo) {
            document.getElementById('m1-best').textContent = data.method1.best || 'Not Found';
            document.getElementById('m2-best').textContent = data.method2.best || 'Not Found';
        }

        // Bar Animation
        const ratio = (m2Time / m1Time) * 100;
        document.getElementById('m2-bar').style.width = `${Math.min(ratio, 100)}%`;

        // Summary
        const saving = isVideo ? data.saving_avg : data.saving;
        const percent = Math.round((saving / m1Time) * 100);
        document.getElementById('time-saved').textContent = `${saving} ms`;
        document.getElementById('percent-saved').textContent = `${percent}% faster`;
    }

    function showLoader(msg) {
        loaderMsg.textContent = msg;
        loader.classList.remove('hidden');
        resultsSection.style.display = 'none';
        summarySection.style.display = 'none';
    }

    function hideLoader() {
        loader.classList.add('hidden');
    }
});

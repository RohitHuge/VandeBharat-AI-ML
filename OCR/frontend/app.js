document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const resultsSection = document.getElementById('comparison-results');
    const summarySection = document.getElementById('saving-summary');
    const loader = document.getElementById('loader');

    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Reset UI
        resultsSection.style.display = 'none';
        summarySection.style.display = 'none';
        loader.classList.remove('hidden');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/ocr/compare', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.error) {
                alert(data.error);
                return;
            }

            renderResults(data);
        } catch (err) {
            console.error('Benchmark failed:', err);
            alert('Benchmark failed. Is the server running?');
        } finally {
            loader.classList.add('hidden');
        }
    });

    function renderResults(data) {
        resultsSection.style.display = 'grid';
        summarySection.style.display = 'block';

        // Method 1
        document.getElementById('m1-total').textContent = data.method1.total_ms;
        document.getElementById('m1-best').textContent = data.method1.best || 'Not Found';
        renderTextList('m1-all', data.method1.all_text);

        // Method 2
        document.getElementById('m2-total').textContent = data.method2.total_ms;
        document.getElementById('m2-det').textContent = `${data.method2.det_ms} ms`;
        document.getElementById('m2-ocr').textContent = `${data.method2.ocr_ms} ms`;
        document.getElementById('m2-best').textContent = data.method2.best || 'Not Found';
        renderTextList('m2-all', data.method2.all_text);

        // Bar Animation
        const m1Time = data.method1.total_ms;
        const m2Time = data.method2.total_ms;
        const ratio = (m2Time / m1Time) * 100;
        document.getElementById('m2-bar').style.width = `${Math.min(ratio, 100)}%`;

        // Summary
        const saving = data.saving;
        const percent = Math.round((saving / m1Time) * 100);
        document.getElementById('time-saved').textContent = `${saving} ms`;
        document.getElementById('percent-saved').textContent = `${percent}% faster`;
    }

    function renderTextList(id, texts) {
        const container = document.getElementById(id);
        container.innerHTML = '';
        if (texts.length === 0) {
            container.innerHTML = '<span class="empty-hint">No text detected</span>';
            return;
        }
        texts.forEach(text => {
            const span = document.createElement('span');
            span.className = 'text-pill';
            span.textContent = text;
            container.appendChild(span);
        });
    }
});

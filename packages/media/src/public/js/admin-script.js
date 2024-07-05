document.addEventListener('DOMContentLoaded', function() {
    const articleForm = document.getElementById('articleForm');
    const previewButton = document.getElementById('previewButton');
    const previewContainer = document.getElementById('preview');
    const previewContent = document.getElementById('previewContent');

    previewButton.addEventListener('click', function() {
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const author = document.getElementById('author').value;
        const category = document.getElementById('category').value;

        const previewHtml = `
            <h1>${title}</h1>
            <p><strong>著者:</strong> ${author}</p>
            <p><strong>カテゴリー:</strong> ${category}</p>
            <div>${content}</div>
        `;

        previewContent.innerHTML = previewHtml;
        previewContainer.style.display = 'block';
    });

    articleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
            author: document.getElementById('author').value,
            category: document.getElementById('category').value
        };
        try {
            const response = await fetch('/article', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                document.getElementById('message').innerHTML = '<div class="success-message">記事が投稿されました</div>';
                e.target.reset();
                previewContainer.style.display = 'none';
            } else {
                document.getElementById('message').innerHTML = '<div class="error-message">エラーが発生しました</div>';
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('message').innerHTML = '<div class="error-message">エラーが発生しました</div>';
        }
    });
});
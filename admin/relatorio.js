//relatorio.js

document.addEventListener('DOMContentLoaded', () => {
    const reportData = JSON.parse(localStorage.getItem('reportData'));
    const reportList = document.getElementById('report-list');

    reportData.forEach(book => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.bookId}</td>
            <td>${book.bookTitle}</td>
            <td>${book.bookAuthor}</td>
            <td>${book.bookYear}</td>
            <td>${book.bookQuantity}</td>
        `;

        reportList.appendChild(row);
    });
});

document.getElementById('back-button').addEventListener('click', () => {
    window.location.href = 'inventario.html'; // Redireciona para a página principal
});

document.getElementById('pdf-button').addEventListener('click', () => {
    const element = document.getElementById('report-content');
    
    const opt = {
        margin:       1,
        filename:     'inventory_report.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 3 }, // Aumenta a escala para uma melhor resolução
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
});

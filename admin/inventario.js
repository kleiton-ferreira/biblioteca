// inventario.js

let bookId = parseInt(localStorage.getItem('lastBookId')) || 1;

document.getElementById('add-book').addEventListener('click', addBook);
document.getElementById('generate-report').addEventListener('click', generateReport);
document.getElementById('search-bar').addEventListener('input', searchBook);

const inventoryData = JSON.parse(localStorage.getItem('inventoryData')) || [];

function addBook() {
    const bookTitle = document.getElementById('book-title').value;
    const bookAuthor = document.getElementById('book-author').value;
    const bookYear = document.getElementById('book-year').value;
    const bookQuantity = document.getElementById('book-quantity').value;

    if (bookTitle === '' || bookAuthor === '' || bookYear === '' || bookQuantity === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (bookYear < 0) {
        alert('O ano de lançamento não pode ser negativo.');
        return;
    }

    if (bookQuantity < 0) {
        alert('A quantidade não pode ser negativa.');
        return;
    }

    const book = {
        bookId: bookId++,
        bookTitle,
        bookAuthor,
        bookYear,
        bookQuantity: parseInt(bookQuantity),
        availableQuantity: parseInt(bookQuantity),
        reservedQuantity: 0,
    };

    inventoryData.push(book);
    localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
    localStorage.setItem('lastBookId', bookId); // Armazena o último ID utilizado

    displayBooks();
}

function displayBooks() {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';

    inventoryData.forEach(book => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.bookId}</td>
            <td class="book-title">${book.bookTitle}</td>
            <td>${book.bookAuthor}</td>
            <td>${book.bookYear}</td>
            <td>${book.bookQuantity}</td>
            <td>${book.availableQuantity}</td>
            <td>${book.reservedQuantity}</td>
            <td>
                <button onclick="deleteBook(this)">Excluir</button>
            </td>
        `;

        bookList.appendChild(row);
    });
}

function deleteBook(button) {
    const row = button.parentNode.parentNode;
    const bookId = parseInt(row.cells[0].textContent);

    const bookIndex = inventoryData.findIndex(book => book.bookId === bookId);
    if (bookIndex !== -1) {
        inventoryData.splice(bookIndex, 1);
        localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
        displayBooks();
    }
}

function searchBook() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const bookList = document.getElementById('book-list').querySelectorAll('tr');

    bookList.forEach(row => {
        const bookTitle = row.querySelector('.book-title').textContent.toLowerCase();
        if (bookTitle.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function generateReport() {
    const reportData = inventoryData.map(book => ({
        bookId: book.bookId,
        bookTitle: book.bookTitle,
        bookAuthor: book.bookAuthor,
        bookYear: book.bookYear,
        bookQuantity: book.bookQuantity,
        availableQuantity: book.availableQuantity,
        reservedQuantity: book.reservedQuantity,
    }));

    localStorage.setItem('reportData', JSON.stringify(reportData));
    window.location.href = 'relatorio.html';
}

document.addEventListener('DOMContentLoaded', displayBooks);

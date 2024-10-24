// reserva.js

document.addEventListener('DOMContentLoaded', () => {
    const inventoryData = JSON.parse(localStorage.getItem('inventoryData')) || [];
    const inventoryList = document.getElementById('inventory-list');

    function updateTable() {
        inventoryList.innerHTML = ''; // Limpa a tabela antes de atualizar
        inventoryData.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.bookId}</td>
                <td>${book.bookTitle}</td>
                <td>${book.bookAuthor}</td>
                <td>${book.bookYear}</td>
                <td>${book.bookQuantity}</td>
                <td>${book.isReserved ? 'Sim' : 'Não'}</td>
                <td>
                    ${book.isReserved ? `<button class="return-book" data-id="${book.bookId}">Devolver</button>` : ''}
                </td>
            `;
            inventoryList.appendChild(row);
        });
        addReturnBookEventListeners(); // Adiciona os listeners para os botões "Devolver"
    }

    function addReturnBookEventListeners() {
        const returnButtons = document.querySelectorAll('.return-book');
        returnButtons.forEach(button => {
            button.removeEventListener('click', handleReturnBook); // Remove qualquer listener existente para evitar duplicação
            button.addEventListener('click', handleReturnBook);
        });
    }

    function handleReturnBook(event) {
        const bookId = parseInt(event.target.dataset.id);
        const book = inventoryData.find(b => b.bookId === bookId);

        if (book && book.isReserved) {
            // Pergunta ao usuário quantos livros ele deseja devolver
            const returnQuantity = parseInt(prompt(`Quantos livros deseja devolver? (Máximo: ${book.reservedQuantity})`, book.reservedQuantity));

            // Verificação: A quantidade devolvida não pode ser maior que a quantidade reservada
            if (returnQuantity > 0 && returnQuantity <= book.reservedQuantity) {
                book.bookQuantity += returnQuantity; // Incrementa a quantidade disponível
                book.reservedQuantity -= returnQuantity; // Decrementa a quantidade reservada

                if (book.reservedQuantity === 0) {
                    book.isReserved = false; // Marca como não reservado se não restarem reservas
                }

                localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
                updateTable();
                alert('Livro(s) devolvido(s) com sucesso!');
            } else {
                alert('Quantidade inválida ou maior que a reservada.');
            }
        }
    }

    document.getElementById('reserve-book').addEventListener('click', () => {
        const bookId = document.getElementById('reservation-book-id').value;
        const reservationQuantity = parseInt(document.getElementById('reservation-quantity').value);

        if (bookId === '' || reservationQuantity <= 0) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        const book = inventoryData.find(b => b.bookId === parseInt(bookId));

        if (!book) {
            alert('Livro não encontrado.');
            return;
        }

        if (reservationQuantity > book.bookQuantity) {
            alert('Quantidade de reserva excede a quantidade disponível.');
            return;
        }

        // Atualiza a quantidade e marca o livro como reservado
        book.bookQuantity -= reservationQuantity;
        book.reservedQuantity += reservationQuantity; // Incrementa a quantidade reservada
        book.isReserved = book.reservedQuantity > 0 ? true : false;

        // Atualiza o localStorage com os novos dados
        localStorage.setItem('inventoryData', JSON.stringify(inventoryData));

        // Atualiza a tabela de inventário
        updateTable();

        alert('Livro reservado com sucesso!');
    });

    document.getElementById('back-button').addEventListener('click', () => {
        window.location.href = 'inventario.html'; // Redireciona para a página principal
    });

    // Inicializa a tabela ao carregar a página
    updateTable();
});

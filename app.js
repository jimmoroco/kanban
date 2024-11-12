document.addEventListener('DOMContentLoaded', (event) => {
    let dragged;

    showCards();

    document.addEventListener("drag", function (event) { }, false);

    document.addEventListener("dragstart", function (event) {
        dragged = event.target;
        event.target.style.opacity = 0.5;
    }, false);

    document.addEventListener("dragend", function (event) {
        event.target.style.opacity = "";
    }, false);

    document.addEventListener("dragover", function (event) {
        event.preventDefault();
    }, false);

    document.addEventListener("dragenter", function (event) {
        if (event.target.className == "column") {
            event.target.style.background = "#ff7800";
        }
    }, false);

    document.addEventListener("dragleave", function (event) {
        if (event.target.className == "column") {
            event.target.style.background = "";
        }
    }, false);

    document.addEventListener("drop", function (event) {
        event.preventDefault();
        if (event.target.className == "column") {
            event.target.style.background = "";
            dragged.parentNode.removeChild(dragged);
            event.target.appendChild(dragged);
            saveCards();
        }
    }, false);

    // Añadir detección de tecla "Enter" para las cajas de texto
    document.querySelectorAll('.add-card input').forEach(input => {
        input.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                const cardText = input.value;
                const columnId = input.id.split('new-card-')[1]
                addCard(columnId, cardText, true);
                input.value = ''; // Clear the input field
            }
        });
    });
});

function showCards() {
    const stringKanban = localStorage.getItem("kanban");
    const stringJSON = JSON.parse(stringKanban);

    const columns = document.querySelectorAll('.column');
    //d55    let boardState = {};

    columns.forEach(column => {
        const columnId = column.id;
        const columnlength = stringJSON[columnId].length
        stringJSON[columnId].forEach(cardText => {
            addCard(columnId, cardText, false);
        });
    });
}

function addCard(columnId, cardText, save) {
    //const input = document.getElementById(`new-card-${columnId}`);
    //const cardText = input.value;
    if (cardText) {
        const column = document.getElementById(columnId);
        const newCard = document.createElement('div');
        newCard.className = 'card';
        newCard.draggable = true;
        newCard.textContent = cardText;

        newCard.addEventListener("dragstart", function (event) {
            dragged = event.target;
            event.target.style.opacity = 0.5;
        }, false);

        newCard.addEventListener("dragend", function (event) {
            event.target.style.opacity = "";
        }, false);

        column.appendChild(newCard);
        if (save) {
            saveCards();
        }
    }
}

function saveCards() {
    const columns = document.querySelectorAll('.column');
    let boardState = {};

    columns.forEach(column => {
        let cardTexts = [];
        column.querySelectorAll('.card').forEach(card => {
            cardTexts.push(card.textContent);
        });
        boardState[column.id] = cardTexts;
    });
    console.log("boardState", JSON.stringify(boardState));
    /*
    fetch('/saveBoard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(boardState),
    });
    */
    localStorage.setItem("kanban", JSON.stringify(boardState));
}

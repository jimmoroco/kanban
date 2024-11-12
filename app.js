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
            if (event.target.id == 'done') {
                dragged.classList.add('line-through');
            }
            else {
                dragged.classList.remove('line-through');
            }
            event.target.appendChild(dragged);
            saveCards();
        }
    }, false);

    document.querySelectorAll('.add-card input').forEach(input => {
        input.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                const cardText = input.value;
                const columnId = input.id.split('new-card-')[1]
                addCard(columnId, cardText, true);
                input.value = '';
            }
        });
    });
});

function showCards() {
    const stringKanban = localStorage.getItem("kanban");
    if (!stringKanban) {
        return;
    }
    const stringJSON = JSON.parse(stringKanban);
    const columns = document.querySelectorAll('.column');

    columns.forEach(column => {
        const columnId = column.id;
        stringJSON[columnId].forEach(cardText => {
            addCard(columnId, cardText, false);
        });
    });
}

function addCard(columnId, cardText, save) {
    if (cardText) {
        const column = document.getElementById(columnId);
        const newCard = document.createElement('div');
        newCard.classList.add('card');
        if (columnId == 'done') {
            newCard.classList.add('line-through');
        }
        else {
            newCard.classList.remove('line-through');
        }
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

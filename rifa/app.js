        document.addEventListener('DOMContentLoaded', () => {
    const raffleForm = document.getElementById('raffleForm');
    const participantList = document.getElementById('participantList');
    const drawWinnerButton = document.getElementById('drawWinner');
    const winnerDisplay = document.getElementById('winner');
    const tableBody = document.querySelector('table tbody');
    const participantNumberSelect = document.getElementById('participantNumber');
    let assignedNumbers = new Set();

    // Generar la tabla con celdas enumeradas del 00 al 99
    for (let i = 0; i < 10; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement('td');
            const number = (i * 10 + j).toString().padStart(2, '0');
            cell.textContent = number;
            cell.id = `cell-${number}`;
            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    }

    // Generar las opciones del selector del 00 al 99
    for (let i = 0; i < 100; i++) {
        const option = document.createElement('option');
        option.value = i.toString().padStart(2, '0');
        option.textContent = i.toString().padStart(2, '0');
        participantNumberSelect.appendChild(option);
    }

    // Escuchar el evento de submit del formulario
    raffleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const participantName = document.getElementById('participantName').value;
        const participantNumber = document.getElementById('participantNumber').value;

        if (participantName && participantNumber && !assignedNumbers.has(participantNumber)) {
            try {
                // Agregar participante a Firestore
                await db.collection('participants').doc(participantNumber).set({
                    name: participantName,
                    number: participantNumber
                });
                assignedNumbers.add(participantNumber);
                updateParticipantList();
                updateNumberOptions();
                raffleForm.reset();
            } catch (error) {
                console.error('Error al agregar participante:', error);
            }
        }
    });

    drawWinnerButton.addEventListener('click', () => {
        // Lógica para seleccionar un ganador (sin cambios)
    });

    // Función para actualizar la lista de participantes en el DOM
    async function updateParticipantList() {
        try {
            const snapshot = await db.collection('participants').get();
            participantList.innerHTML = '';
            snapshot.forEach(doc => {
                const participant = doc.data();
                const li = document.createElement('li');
                li.textContent = `${participant.name} - Número: ${participant.number}`;
                participantList.appendChild(li);
                document.getElementById(`cell-${participant.number}`).classList.add('selected');
            });
        } catch (error) {
            console.error('Error al obtener participantes:', error);
        }
    }

    // Función para actualizar las opciones del selector de números
    function updateNumberOptions() {
        const options = participantNumberSelect.options;
        for (let i = 0; i < options.length; i++) {
            if (assignedNumbers.has(options[i].value)) {
                options[i].disabled = true;
            } else {
                options[i].disabled = false;
            }
        }
    }
});

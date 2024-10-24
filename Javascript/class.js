export default class GolfTable {
    constructor(containerId, tableTitle) {
        this.container = document.getElementById(containerId);
        this.tableTitle = tableTitle;
        this.createTable(); // This initializes tableContainer
    }

    createTable() {
        // Create table container div with class 'table-container'
        this.tableContainer = document.createElement('div'); // Store tableContainer as a class property
        this.tableContainer.className = 'table-container';

        // Create and append the table header (title)
        const header = document.createElement('h2');
        header.className = 'name';
        header.textContent = this.tableTitle;
        this.tableContainer.appendChild(header);

        // Create table element
        const table = document.createElement('table');
        table.className = 'table responsive-lg';
        table.id = 'table';

        // Create thead element
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        // Define column headers
        const headers = ['Hole', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Out'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.scope = 'col';
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create tbody element and assign it to this.tbody
        this.tbody = document.createElement('tbody');
        this.tbody.id = 'tableBody';

        // Define row labels
        const rows = ['Handicap', 'Yardage', 'Par', 'Strokes'];

        // Create table rows and cells
        rows.forEach(rowLabel => {
            const row = document.createElement('tr');
            const th = document.createElement('th');
            th.scope = 'row';
            th.textContent = rowLabel;
            row.appendChild(th);

            // Create 10 empty cells for each row
            for (let i = 0; i < 10; i++) {
                const td = document.createElement('td');
                td.id = `${rowLabel.toLowerCase()}-${i + 1}`;
                row.appendChild(td);
            }

            if (rowLabel === 'Handicap') {
                for (let i = 0; i < 10; i++) {
                    row.children[i + 1].textContent = '36.4';
                }
            }

            if (rowLabel === 'Yardage') {
                for (let i = 0; i < 10; i++) {
                    row.children[i + 1].textContent = '200';
                }
            }

            if (rowLabel === 'Par') {
                for (let i = 0; i < 10; i++) {
                    row.children[i + 1].textContent = '5';
                }
            }
            if (rowLabel === 'Strokes') {
                for (let i = 0; i < 10; i++) {
                    row.children[i + 1].textContent = '|';
                }
            }

            this.tbody.appendChild(row); // Append to this.tbody
        });

        table.appendChild(this.tbody); // Append the tbody to the table

        // Append the created table to the table container
        this.tableContainer.appendChild(table);

        // Create the button section once
        this.createButton();

        // Append the table container to the main container
        this.container.appendChild(this.tableContainer);
    }

    createButton() {
        const scoreSection = document.createElement('div');
        scoreSection.className = 'scoreSection';

        const scoreInput = document.createElement('input');
        scoreInput.type = 'text';
        scoreInput.id = 'scoreInput';
        scoreSection.appendChild(scoreInput);

        const addScore = document.createElement('button');
        addScore.textContent = 'Add Score';
        addScore.id = 'addScore';
        addScore.addEventListener('click', () => {
            this.addScore();
        });
        scoreSection.appendChild(addScore);

        this.tableContainer.appendChild(scoreSection); // Append to the table container
    }

    addPlayer(player) {
        if (!player || !player.name) {
            console.error('Player name is undefined or missing');
            return;
        }
    
        // Count existing players to determine the next ID
        const existingPlayersCount = Array.from(this.tbody.children).filter(row => {
            const th = row.children[0];
            return th && th.id && th.id.startsWith('player'); // Ensure th has id and starts with 'player'
        }).length;
    
        const playerId = `player${existingPlayersCount + 1}`; // Assign ID based on the count
    
        const playerRow = document.createElement('tr');
        const th = document.createElement('th');
        th.scope = 'row';
        th.textContent = player.name;
        th.id = playerId; // Assign the generated ID to the th element
        playerRow.appendChild(th);
    
        // Create 10 cells for each player
        for (let i = 0; i < 10; i++) {
            const td = document.createElement('td');
            td.id = `${player.name.toLowerCase()}-${i + 1}`; // Only access name if it's defined
            playerRow.appendChild(td);
        }
    
        this.tbody.appendChild(playerRow); // Append row to this.tbody
    }
    

    addScore() {
        const scoreInput = document.getElementById('scoreInput');
        const score = scoreInput.value.trim();
    
        if (score === '') {
            alert('Please enter a score');
            scoreInput.value = '';
            return;
        }
    
        // Count existing players to determine the current player row
        const existingPlayersCount = Array.from(this.tbody.children).filter(row => row.children[0].id.startsWith('player')).length;
        console.log(existingPlayersCount);
    
        // Get the player row based on the count
        const playerRowId = `player${existingPlayersCount}`; // This gets the ID of the last player
        const playerRow = Array.from(this.tbody.children).find(row => row.children[0].id === playerRowId);
    
        // Check if playerRow was found
        if (!playerRow) {
            console.error('Player row not found');
            return;
        }
    
        // Initialize sum if needed
        let sum = 0;
        
        // Loop to find the first empty cell or set the score in the last cell
        for (let i = 1; i < 11; i++) { // Start from 1 to skip the <th>
            const cell = playerRow.children[i];
    
            if (i < 10) { // Check cells 1 to 9
                if (cell.textContent === '') {
                    cell.textContent = score; // Assign the score to the first empty cell
                    break; // Exit the loop after assigning the score
                }
            } else if (i === 10) { // The 10th cell
                // Calculate sum of scores in cells 1 to 9
                for (let j = 1; j < 10; j++) {
                    const currentCellValue = playerRow.children[j].textContent;
                    if (currentCellValue) {
                        sum += parseInt(currentCellValue);
                    }
                }
                cell.textContent = sum; // Assign the cumulative score to the last cell
            }
        }
    
    }
    
}

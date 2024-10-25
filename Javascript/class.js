export default class GolfTable {
    constructor(containerId, tableTitle, id, backTableInstance = null) {
        this.container = document.getElementById(containerId);
        this.tableTitle = tableTitle;
        this.id = id;
        this.backTableInstance = backTableInstance; // Store the back table instance
        this.createTable(); // This initializes tableContainer
        this.createButton(); // Create the button section here
    }

    createTable() {
        // Create table container div with class 'table-container'
        this.tableContainer = document.createElement('div'); // Store tableContainer as a class property
        this.tableContainer.className = 'table-container';
        this.tableContainer.id = this.id;

        // Create and append the table header (title)
        const header = document.createElement('h2');
        header.className = 'name';
        header.textContent = this.tableTitle;
        this.tableContainer.appendChild(header);

        // Create table element
        const table = document.createElement('table');
        table.className = 'table responsive-lg';

        // Create thead element
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        // Define column headers
        const headers = ['Hole', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Out', 'Total'];
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

            // Create 11 empty cells for each row
            for (let i = 0; i < 11; i++) {
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
            this.addScore(); // No need to pass backTableInstance anymore
        });
        scoreSection.appendChild(addScore);

        const flipButton = document.createElement('button');
        flipButton.textContent = 'Flip';
        flipButton.id = 'flipButton';
        flipButton.addEventListener('click', () => {
            this.flipTable();
        });

        scoreSection.appendChild(flipButton);
        this.tableContainer.appendChild(scoreSection); // Append to the table container
    }

    addPlayer(player) {
        if (!player || !player.name) {
            console.error('Player name is undefined or missing');
            return;
        }

        const playerId = `player${this.tbody.children.length}`;
        const playerRow = document.createElement('tr');
        const th = document.createElement('th');
        th.scope = 'row';
        th.textContent = player.name;
        th.id = playerId;
        playerRow.appendChild(th);

        // Create 11 cells for each player
        for (let i = 0; i < 11; i++) {
            const td = document.createElement('td');
            td.id = `${player.name.toLowerCase()}-${i + 1}`;
            playerRow.appendChild(td);
        }

        this.tbody.appendChild(playerRow); // Append to the specified table's tbody

        // If backTableInstance exists, also add player to the back table
        if (this.backTableInstance) {
            this.backTableInstance.addPlayer({ name: player.name });
        }
    }

    addScore() {
        const scoreInput = document.getElementById('scoreInput');
        const score = scoreInput.value.trim();

        if (score === '') {
            alert('Please enter a score');
            scoreInput.value = '';
            return;
        }

        // Get the last player row from the front table
        const playerRows = Array.from(this.tbody.children).filter(row => row.children[0].id.startsWith('player'));
        const playerRow = playerRows[playerRows.length - 1]; // Get the last player row

        if (!playerRow) {
            console.error('Player row not found');
            return;
        }

        const frontTableVisible = this.tableTitle === 'Scorecard';
        const backPlayerRow = frontTableVisible && this.backTableInstance ? this.backTableInstance.tbody.children[playerRows.length - 1] : null;

        let frontOutSum = 0;
        let backOutSum = 0;

        // Function to add score to a row
        const addScoreToRow = (row) => {
            for (let i = 1; i < 10; i++) { // Holes 1-9
                const cell = row.children[i];
                if (cell.textContent === '') {
                    cell.textContent = score; // Add score to first empty cell
                    break;
                }
            }
        };

        // Function to calculate sum for a row's cells (holes 1-9)
        const calculateOutSum = (row) => {
            let sum = 0;
            for (let i = 1; i < 10; i++) {
                const cellValue = row.children[i].textContent;
                if (cellValue) {
                    sum += parseInt(cellValue);
                }
            }
            return sum;
        };

        // Add score to both front and back rows
        addScoreToRow(playerRow);
        if (backPlayerRow) addScoreToRow(backPlayerRow);

        // Calculate sums for the "Out" columns in front and back tables
        frontOutSum = calculateOutSum(playerRow); // Front Out
        backOutSum = backPlayerRow ? calculateOutSum(backPlayerRow) : 0; // Back Out

        // Display front "Out" in the 10th cell of the front table
        playerRow.children[10].textContent = frontOutSum;

        // Display back "Out" in the 10th cell of the back table
        if (backPlayerRow) {
            backPlayerRow.children[10].textContent = backOutSum;
        }

        // Display total sum (frontOutSum + backOutSum) in the last cell of the front table row
        const totalSum = frontOutSum + backOutSum;
        playerRow.children[11].textContent = totalSum;
    }

    hide() {
        this.tableContainer.style.display = 'none';
    }

    flipTable() {
        const frontTable = document.getElementById('front');
        const backTable = document.getElementById('back');

        if (this.tableTitle === 'Scorecard') {
            this.hide();
            backTable.style.display = 'flex';
        } else if (this.tableTitle === 'Back 9') {
            this.hide();
            frontTable.style.display = 'flex';
        }
    }
}

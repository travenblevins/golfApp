import { container1Table, container1BackTable } from "/Javascript/main.js";

export default class GolfTable {
    constructor(containerId, tableTitle, id) {
        this.container = document.getElementById(containerId);
        this.tableTitle = tableTitle;
        this.id = id;
        this.createTable();
        this.createButton();
    }

    createTable() {
        this.tableContainer = document.createElement('div');
        this.tableContainer.className = 'table-container';
        this.tableContainer.id = this.id;

        const header = document.createElement('h2');
        header.className = 'name';
        header.textContent = this.tableTitle;
        this.tableContainer.appendChild(header);

        const table = document.createElement('table');
        table.className = 'table responsive-lg';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const headers = ['Hole', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Out', 'Total'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.scope = 'col';
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        this.tbody = document.createElement('tbody');
        this.tbody.id = 'tableBody';

        const rows = ['Handicap', 'Yardage', 'Par', 'Strokes'];
        rows.forEach(rowLabel => {
            const row = document.createElement('tr');
            const th = document.createElement('th');
            th.scope = 'row';
            th.textContent = rowLabel;
            row.appendChild(th);

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

            this.tbody.appendChild(row);
        });

        table.appendChild(this.tbody);
        this.tableContainer.appendChild(table);
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

        const flipButton = document.createElement('button');
        flipButton.textContent = 'Flip';
        flipButton.id = 'flipButton';
        flipButton.addEventListener('click', () => {
            this.flipTable();
        });

        scoreSection.appendChild(flipButton);
        this.tableContainer.appendChild(scoreSection);
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

        for (let i = 0; i < 11; i++) {
            const td = document.createElement('td');
            td.id = `${player.name.toLowerCase()}-${i + 1}`;
            playerRow.appendChild(td);
        }

        // Add the player to the front table
        this.tbody.appendChild(playerRow);

        // Add the player to the back table
        if (container1BackTable) {
            const backPlayerRow = playerRow.cloneNode(true);
            container1BackTable.tbody.appendChild(backPlayerRow);
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

        const currentTable = this.tableTitle === 'Scorecard' ? container1Table : container1BackTable;
        const oppositeTable = this.tableTitle === 'Scorecard' ? container1BackTable : container1Table;

        const playerRows = Array.from(currentTable?.tbody.children || []).filter(row => row.children[0].id.startsWith('player'));
        if (playerRows.length === 0) {
            console.error('No players have been added yet');
            return;
        }

        const playerRow = playerRows[playerRows.length - 1];
        const addScoreToRowAndCalculateOutSum = (row) => {
            let sum = 0;
            for (let i = 1; i < 10; i++) {
                const cell = row.children[i];
                if (cell.textContent === '') {
                    cell.textContent = score;
                    break;
                }
                sum += parseInt(cell.textContent) || 0;
            }
            return sum;
        };

        const frontOutSum = addScoreToRowAndCalculateOutSum(playerRow);

        let backOutSum = 0;
        if (oppositeTable) {
            const oppositePlayerRow = Array.from(oppositeTable.tbody.children).find(row => row.id === playerRow.id);
            if (oppositePlayerRow) {
                backOutSum = addScoreToRowAndCalculateOutSum(oppositePlayerRow);
            }
        }

        playerRow.children[10].textContent = frontOutSum;
        const totalSum = frontOutSum + backOutSum;
        playerRow.children[11].textContent = totalSum;

        if (oppositeTable) {
            const oppositePlayerRow = Array.from(oppositeTable.tbody.children).find(row => row.id === playerRow.id);
            if (oppositePlayerRow) {
                oppositePlayerRow.children[10].textContent = backOutSum;
                oppositePlayerRow.children[11].textContent = totalSum;
            }
        }
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

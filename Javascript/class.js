export default class GolfTable {
    constructor(containerId, tableTitle) {
        this.container = document.getElementById(containerId);
        this.tableTitle = tableTitle;
        this.createTable();
    }

    createTable() {
        // Create table container div with class 'table-container'
        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-container';

        // Create and append the table header (title)
        const header = document.createElement('h2');
        header.className = 'name';
        header.textContent = this.tableTitle;
        tableContainer.appendChild(header);

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

        // Create tbody element
        const tbody = document.createElement('tbody');
        tbody.id = 'tableBody';

        // Define row labels
        const rows = ['Strokes', 'Yardage', 'Par', 'Handicap'];

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
            tbody.appendChild(row);
        });

        table.appendChild(tbody);

        // Append the created table to the table container
        tableContainer.appendChild(table);

        // Append the table container to the main container
        this.container.appendChild(tableContainer);
    }
}
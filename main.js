class GolfTable {
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

async function getAvailableCourses() {
    const url = 'https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json';
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch courses: ' + response.status);
    }

    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not valid JSON');
    }

    const data = await response.json();
    return data;
}

async function DisplayCourses() {
    try {
        const courses = await getAvailableCourses();
        let courseOptionsHtml = '';
        courses.forEach((course) => {
            courseOptionsHtml += `
            <div class="course-item" data-id="${course.id}">
                <span>${course.name}</span>
                <button id="course-button-${course.id}">Select</button>
            </div>`;
        });
        document.getElementById('course-select').innerHTML = courseOptionsHtml;

        // Add event listeners for the course buttons
        courses.forEach((course) => {
            const button = document.getElementById(`course-button-${course.id}`);
            button.addEventListener('click', () => handleButtonClick(course.id));
        });
    } catch (error) {
        console.error('Error displaying courses:', error);
    }
}

function handleButtonClick(courseId) {
    const courseSelect = document.querySelectorAll('.course-item');
    courseSelect.forEach((courseItem) => {
        if (courseItem.dataset.id !== courseId.toString()) {
            courseItem.remove(); // Remove non-selected course items
        } else {
            const button = courseItem.querySelector('button');
            button.remove(); // Remove button from selected course item
            console.log(courseItem.dataset.id); // Log the selected course ID
        }
    });
}

// Set up the event listener for the main "Select Course" button
const selectCourseButton = document.getElementById('course-button'); // Ensure this is the correct ID for the main button
selectCourseButton.addEventListener('click', async () => {
    await DisplayCourses(); // Call DisplayCourses when the "Select Course" button is clicked
});

const playerButton = document.getElementById('playerButton');
const playerInput = document.getElementById('playerInput');

const container1 = document.getElementById('container1');
const frontContainer1 = document.getElementById('frontContainer1');
const backContainer1 = document.getElementById('backContainer1');

const container2 = document.getElementById('container2');
const container3 = document.getElementById('container3');
const container4 = document.getElementById('container4');

playerButton.addEventListener('click', () => {
    if (document.querySelector('.course-item') === null) {
        alert('Please select a course');
        playerInput.value = '';
    } else if (playerInput.value === '') {
        alert('Please enter a player name');
        playerInput.value = '';
    } else {
        // Clear container1
        container1.innerHTML = '';

        // Create front and back containers dynamically if they don't exist
        const frontContainer1 = document.createElement('div');
        frontContainer1.id = 'frontContainer1';
        frontContainer1.style.display = 'block'; // Show the front side initially
        container1.appendChild(frontContainer1);

        const backContainer1 = document.createElement('div');
        backContainer1.id = 'backContainer1';
        backContainer1.style.display = 'none'; // Hide the back side initially
        container1.appendChild(backContainer1);

        // Player name and flip button
        const playerName = playerInput.value;
        const flipButton = document.createElement('button');
        flipButton.textContent = 'Flip Scorecard';
        container1.appendChild(flipButton); // Only append once to a shared container

        // Create scorecard tables
        const firstTableFront = new GolfTable('frontContainer1', `${playerName}'s Scorecard`);
        const firstTableBack = new GolfTable('backContainer1', `Back of ${playerName}'s Scorecard`);

        // Flip logic
        flipButton.addEventListener('click', () => {
            if (getComputedStyle(frontContainer1).display === 'block') {
                frontContainer1.style.display = 'none';
                backContainer1.style.display = 'block';
            } else {
                frontContainer1.style.display = 'block';
                backContainer1.style.display = 'none';
            }
        });
        playerInput.value = '';
        const score = document.createElement('div');
        const scoreInput = document.createElement('input');
        const addScoreButton = document.createElement('button');

        scoreInput.placeholder = 'Enter score';
        addScoreButton.textContent = 'Add score';
        score.appendChild(scoreInput);
        score.appendChild(addScoreButton);
        container1.appendChild(score);

        let sum = 0;
        addScoreButton.addEventListener('click', () => {
            if (scoreInput.value === '') {
                alert('Please enter a score');
            } else if (frontContainer1.style.display === 'block') {
                for (let i = 0; i < 9; i++) {
                    const strokes = document.getElementById(`strokes-${i + 1}`);
                    const yardage = document.getElementById(`yardage-${i + 1}`);
                    const par = document.getElementById(`par-${i + 1}`);
                    const handicap = document.getElementById(`handicap-${i + 1}`);
                    if (strokes.textContent === '') {
                        strokes.textContent = scoreInput.value;
                        sum += parseInt(strokes.textContent);
                        yardage.textContent = '400';
                        par.textContent = '4';
                        handicap.textContent = '1';
                        break;
                    }
                    if (i === 8) {
                        const strokesTotal = document.getElementById('strokes-10');
                        strokesTotal.textContent = sum
                        const yardageOut = document.getElementById('yardage-10');
                        yardageOut.textContent = '3600';
                        const parOut = document.getElementById('par-10');
                        parOut.textContent = '4';
                        const handicapOut = document.getElementById('handicap-10');
                        handicapOut.textContent = '1';
                        scoreInput.value = '';
                    }
                }
            }
            else if (backContainer1.style.display === 'block') {
                for (let i = 0; i < 9; i++) {
                    const strokes = document.getElementById(`strokes-${i + 1}`);
                    const yardage = document.getElementById(`yardage-${i + 1}`);
                    const par = document.getElementById(`par-${i + 1}`);
                    const handicap = document.getElementById(`handicap-${i + 1}`);
                    if (strokes.textContent === '') {
                        strokes.textContent = scoreInput.value;
                        sum += parseInt(strokes.textContent);
                        yardage.textContent = '400';
                        par.textContent = '4';
                        handicap.textContent = '1';
                        break;
                    }
                    if (i === 8) {
                        const strokesTotal = document.getElementById('strokes-10');
                        strokesTotal.textContent = sum
                        const yardageOut = document.getElementById('yardage-10');
                        yardageOut.textContent = '3600';
                        const parOut = document.getElementById('par-10');
                        parOut.textContent = '4';
                        const handicapOut = document.getElementById('handicap-10');
                        handicapOut.textContent = '1';
                        scoreInput.value = '';
                    }
                }
            }
        });
    }
});



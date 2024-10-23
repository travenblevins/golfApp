import GolfTable from '/Javascript/class.js';

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


async function getCourseDetails(courseId) {
    const url = `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${courseId}.json`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

const details = document.getElementById('details');

async function handleButtonClick(courseId) {
    const courseSelect = document.querySelectorAll('.course-item');
    
    // Clear any previous details
    details.innerHTML = '';

    for (const courseItem of courseSelect) {
        if (courseItem.dataset.id !== courseId.toString()) {
            courseItem.remove(); // Remove non-selected course items
        } else {
            const button = courseItem.querySelector('button');
            button.remove(); // Remove button from selected course item
            
            // Fetch course details
            try {
                const courseDetails = await getCourseDetails(courseId);
                console.log(courseDetails); // Log the course details
                
                // Display course address
                const courseAddress = courseDetails.addr1; // Adjust based on your JSON structure
                details.innerHTML = `<p>Address: ${courseAddress}</p>`;
            } catch (error) {
                console.error('Error fetching course details:', error);
                details.innerHTML = '<summary>Course Details</summary><p>Error loading details.</p>';
            }
        }
    }
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
const backcontainer1 = document.getElementById('backcontainer1');

const container2 = document.getElementById('container2');
const frontContainer2 = document.getElementById('frontContainer2');
const backContainer2 = document.getElementById('backContainer2');

const container3 = document.getElementById('container3');
const container4 = document.getElementById('container4');

playerButton.addEventListener('click', () => {
    if (document.querySelector('.course-item') === null) {
        alert('Please select a course');
        playerInput.value = '';
    } else if (playerInput.value === '') {
        alert('Please enter a player name');
        playerInput.value = '';
    } else if (container1.innerHTML === '') {
        // Clear container1
        container1.innerHTML = '';

        // Create front and back containers dynamically if they don't exist
        const frontcontainer1 = document.createElement('div');
        frontcontainer1.id = 'frontcontainer1';
        frontcontainer1.style.display = 'block'; // Show the front side initially
        container1.appendChild(frontcontainer1);

        const backcontainer1 = document.createElement('div');
        backcontainer1.id = 'backcontainer1';
        backcontainer1.style.display = 'none'; // Hide the back side initially
        container1.appendChild(backcontainer1);

        // Player name and flip button
        const playerName = playerInput.value;
        const flipButton = document.createElement('button');
        flipButton.textContent = 'Flip Scorecard';
        container1.appendChild(flipButton); // Only append once to a shared container

        // Create scorecard tables
        const firstTableFront = new GolfTable('frontcontainer1', `${playerName}'s Scorecard`);
        const firstTableBack = new GolfTable('backcontainer1', `Back of ${playerName}'s Scorecard`);

        // Flip logic
        flipButton.addEventListener('click', () => {
            if (getComputedStyle(frontcontainer1).display === 'block') {
                frontcontainer1.style.display = 'none';
                backcontainer1.style.display = 'block';
            } else {
                frontcontainer1.style.display = 'block';
                backcontainer1.style.display = 'none';
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

        const backTable = document.querySelector('#backcontainer1 .table-container table #tableBody');
        backTable.querySelectorAll('tr').forEach((row) => {
            row.querySelectorAll('td').forEach((cell) => {
                if (cell.id) {
                    cell.id = `back-${cell.id}`;
                }
            });
        });



        let sum = 0;
        let frontTotal = 0;
        let backTotal = 0;

        let total = document.createElement('div');
        total.id = 'total';
        total.textContent = `Stroke Total: 0`;
        container1.appendChild(total);
        addScoreButton.addEventListener('click', () => {
            if (scoreInput.value === '') {
                alert('Please enter a score');
            } else if (frontcontainer1.style.display === 'block') {
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
                        frontTotal = sum;
                        total.textContent = `Stroke Total: ${frontTotal + backTotal}`;
                    }
                }
            }
            else if (backcontainer1.style.display === 'block') {
                for (let i = 0; i < 9; i++) {
                    const strokes = document.getElementById(`back-strokes-${i + 1}`);
                    const yardage = document.getElementById(`back-yardage-${i + 1}`);
                    const par = document.getElementById(`back-par-${i + 1}`);
                    const handicap = document.getElementById(`back-handicap-${i + 1}`);
                    if (strokes.textContent === '') {
                        strokes.textContent = scoreInput.value;
                        sum += parseInt(strokes.textContent);
                        yardage.textContent = '400';
                        par.textContent = '4';
                        handicap.textContent = '1';
                        break;
                    }
                    if (i === 8) {
                        const strokesTotal = document.getElementById('back-strokes-10');
                        strokesTotal.textContent = sum
                        const yardageOut = document.getElementById('back-yardage-10');
                        yardageOut.textContent = '3600';
                        const parOut = document.getElementById('back-par-10');
                        parOut.textContent = '4';
                        const handicapOut = document.getElementById('back-handicap-10');
                        handicapOut.textContent = '1';
                        scoreInput.value = '';
                        backTotal = sum;
                        total.textContent = `Stroke Total: ${frontTotal + backTotal}`;
                    }
                }
            }
        });
        
    } else if (container2.innerHTML === '') {
        // Clear container2
        container2.innerHTML = '';
    
        // Create front and back containers dynamically if they don't exist
        const frontcontainer2 = document.createElement('div');
        frontcontainer2.id = 'frontcontainer2';
        frontcontainer2.style.display = 'block'; // Show the front side initially
        container2.appendChild(frontcontainer2);
    
        const backcontainer2 = document.createElement('div');
        backcontainer2.id = 'backcontainer2';
        backcontainer2.style.display = 'none'; // Hide the back side initially
        container2.appendChild(backcontainer2);
    
        // Player name and flip button
        const playerName = playerInput.value;
        const flipButton = document.createElement('button');
        flipButton.textContent = 'Flip Scorecard';
        container2.appendChild(flipButton); // Only append once to a shared container
    
        // Create scorecard tables
        const firstTableFront = new GolfTable('frontcontainer2', `${playerName}'s Scorecard`);
        const firstTableBack = new GolfTable('backcontainer2', `Back of ${playerName}'s Scorecard`);
    
        // Flip logic
        flipButton.addEventListener('click', () => {
            if (getComputedStyle(frontcontainer2).display === 'block') {
                frontcontainer2.style.display = 'none';
                backcontainer2.style.display = 'block';
            } else {
                frontcontainer2.style.display = 'block';
                backcontainer2.style.display = 'none';
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
        container2.appendChild(score);
        
        const frontTable = document.querySelector('#frontcontainer2 .table-container table #tableBody');
        frontTable.querySelectorAll('tr').forEach((row) => {
            row.querySelectorAll('td').forEach((cell) => {
                if (cell.id) {
                    cell.id = `front2-${cell.id}`;
                }
            });
        });

        const backTable = document.querySelector('#backcontainer2 .table-container table #tableBody');
        backTable.querySelectorAll('tr').forEach((row) => {
            row.querySelectorAll('td').forEach((cell) => {
                if (cell.id) {
                    cell.id = `back2-${cell.id}`;
                }
            });
        });
    
        let sum = 0;
        let frontTotal = 0;
        let backTotal = 0;

        let total = document.createElement('div');
        total.id = 'total';
        total.textContent = `Stroke Total: 0`;
        container2.appendChild(total);

        addScoreButton.addEventListener('click', () => {
            if (scoreInput.value === '') {
                alert('Please enter a score');
            } else if (frontcontainer2.style.display === 'block') {
                for (let i = 0; i < 9; i++) {
                    const strokes = document.getElementById(`front2-strokes-${i + 1}`);
                    const yardage = document.getElementById(`front2-yardage-${i + 1}`);
                    const par = document.getElementById(`front2-par-${i + 1}`);
                    const handicap = document.getElementById(`front2-handicap-${i + 1}`);
                    if (strokes.textContent === '') {
                        strokes.textContent = scoreInput.value;
                        sum += parseInt(strokes.textContent);
                        yardage.textContent = '400';
                        par.textContent = '4';
                        handicap.textContent = '1';
                        break;
                    }
                    if (i === 8) {
                        const strokesTotal = document.getElementById('front2-strokes-10');
                        strokesTotal.textContent = sum
                        const yardageOut = document.getElementById('front2-yardage-10');
                        yardageOut.textContent = '3600';
                        const parOut = document.getElementById('front2-par-10');
                        parOut.textContent = '4';
                        const handicapOut = document.getElementById('front2-handicap-10');
                        handicapOut.textContent = '1';
                        scoreInput.value = '';
                        frontTotal = sum;
                        total.textContent = `Stroke Total: ${frontTotal + backTotal}`;
                    }
                }
            }
            else if (backcontainer2.style.display === 'block') {
                for (let i = 0; i < 9; i++) {
                    const strokes = document.getElementById(`back2-strokes-${i + 1}`);
                    const yardage = document.getElementById(`back2-yardage-${i + 1}`);
                    const par = document.getElementById(`back2-par-${i + 1}`);
                    const handicap = document.getElementById(`back2-handicap-${i + 1}`);
                    if (strokes.textContent === '') {
                        strokes.textContent = scoreInput.value;
                        sum += parseInt(strokes.textContent);
                        yardage.textContent = '400';
                        par.textContent = '4';
                        handicap.textContent = '1';
                        break;
                    }
                    if (i === 8) {
                        const strokesTotal = document.getElementById('back2-strokes-10');
                        strokesTotal.textContent = sum
                        const yardageOut = document.getElementById('back2-yardage-10');
                        yardageOut.textContent = '3600';
                        const parOut = document.getElementById('back2-par-10');
                        parOut.textContent = '4';
                        const handicapOut = document.getElementById('back2-handicap-10');
                        handicapOut.textContent = '1';
                        scoreInput.value = '';
                        backTotal = sum;
                        total.textContent = `Stroke Total: ${frontTotal + backTotal}`;
                    }
                }
            }
        });
    } else if (container3.innerHTML === '') {
        // Clear container3
        container3.innerHTML = '';
    
        // Create front and back containers dynamically if they don't exist
        const frontcontainer3 = document.createElement('div');
        frontcontainer3.id = 'frontcontainer3';
        frontcontainer3.style.display = 'block'; // Show the front side initially
        container3.appendChild(frontcontainer3);
    
        const backcontainer3 = document.createElement('div');
        backcontainer3.id = 'backcontainer3';
        backcontainer3.style.display = 'none'; // Hide the back side initially
        container3.appendChild(backcontainer3);
    
        // Player name and flip button
        const playerName = playerInput.value;
        const flipButton = document.createElement('button');
        flipButton.textContent = 'Flip Scorecard';
        container3.appendChild(flipButton); // Only append once to a shared container
    
        // Create scorecard tables
        const firstTableFront = new GolfTable('frontcontainer3', `${playerName}'s Scorecard`);
        const firstTableBack = new GolfTable('backcontainer3', `Back of ${playerName}'s Scorecard`);
    
        // Flip logic
        flipButton.addEventListener('click', () => {
            if (getComputedStyle(frontcontainer3).display === 'block') {
                frontcontainer3.style.display = 'none';
                backcontainer3.style.display = 'block';
            } else {
                frontcontainer3.style.display = 'block';
                backcontainer3.style.display = 'none';
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
        container3.appendChild(score);
    
        const frontTable = document.querySelector('#frontcontainer3 .table-container table #tableBody');
        frontTable.querySelectorAll('tr').forEach((row) => {
            row.querySelectorAll('td').forEach((cell) => {
                if (cell.id) {
                    cell.id = `front3-${cell.id}`;
                }
            });
        });
        const backTable = document.querySelector('#backcontainer3 .table-container table #tableBody');
        backTable.querySelectorAll('tr').forEach((row) => {
            row.querySelectorAll('td').forEach((cell) => {
                if (cell.id) {
                    cell.id = `back3-${cell.id}`;
                }
            });
        });
    
        let sum = 0;
        let frontTotal = 0;
        let backTotal = 0;

        let total = document.createElement('div');
        total.id = 'total';
        total.textContent = `Stroke Total: 0`;
        container3.appendChild(total);

        addScoreButton.addEventListener('click', () => {
            if (scoreInput.value === '') {
                alert('Please enter a score');
            } else if (frontcontainer3.style.display === 'block') {
                for (let i = 0; i < 9; i++) {
                    const strokes = document.getElementById(`front3-strokes-${i + 1}`);
                    const yardage = document.getElementById(`front3-yardage-${i + 1}`);
                    const par = document.getElementById(`front3-par-${i + 1}`);
                    const handicap = document.getElementById(`front3-handicap-${i + 1}`);
                    if (strokes.textContent === '') {
                        strokes.textContent = scoreInput.value;
                        sum += parseInt(strokes.textContent);
                        yardage.textContent = '400';
                        par.textContent = '4';
                        handicap.textContent = '1';
                        break;
                    }
                    if (i === 8) {
                        const strokesTotal = document.getElementById('front3-strokes-10');
                        strokesTotal.textContent = sum
                        const yardageOut = document.getElementById('front3-yardage-10');
                        yardageOut.textContent = '3600';
                        const parOut = document.getElementById('front3-par-10');
                        parOut.textContent = '4';
                        const handicapOut = document.getElementById('front3-handicap-10');
                        handicapOut.textContent = '1';
                        scoreInput.value = '';
                        frontTotal = sum;
                        total.textContent = `Stroke Total: ${frontTotal + backTotal}`;
                    }
                }
            }
            else if (backcontainer3.style.display === 'block') {
                for (let i = 0; i < 9; i++) {
                    const strokes = document.getElementById(`back3-strokes-${i + 1}`);
                    const yardage = document.getElementById(`back3-yardage-${i + 1}`);
                    const par = document.getElementById(`back3-par-${i + 1}`);
                    const handicap = document.getElementById(`back3-handicap-${i + 1}`);
                    if (strokes.textContent === '') {
                        strokes.textContent = scoreInput.value;
                        sum += parseInt(strokes.textContent);
                        yardage.textContent = '400';
                        par.textContent = '4';
                        handicap.textContent = '1';
                        break;
                    }
                    if (i === 8) {
                        const strokesTotal = document.getElementById('back3-strokes-10');
                        strokesTotal.textContent = sum
                        const yardageOut = document.getElementById('back3-yardage-10');
                        yardageOut.textContent = '3600';
                        const parOut = document.getElementById('back3-par-10');
                        parOut.textContent = '4';
                        const handicapOut = document.getElementById('back3-handicap-10');
                        handicapOut.textContent = '1';
                        scoreInput.value = '';
                        backTotal = sum;
                        total.textContent = `Stroke Total: ${frontTotal + backTotal}`;
                    }
                }
            }
        });
    } else if (container4.innerHTML === '') {
        // Clear container4
        container4.innerHTML = '';
    
        // Create front and back containers dynamically if they don't exist
        const frontcontainer4 = document.createElement('div');
        frontcontainer4.id = 'frontcontainer4';
        frontcontainer4.style.display = 'block'; // Show the front side initially
        container4.appendChild(frontcontainer4);
    
        const backcontainer4 = document.createElement('div');
        backcontainer4.id = 'backcontainer4';
        backcontainer4.style.display = 'none'; // Hide the back side initially
        container4.appendChild(backcontainer4);
    
        // Player name and flip button
        const playerName = playerInput.value;
        const flipButton = document.createElement('button');
        flipButton.textContent = 'Flip Scorecard';
        container4.appendChild(flipButton); // Only append once to a shared container
    
        // Create scorecard tables
        const firstTableFront = new GolfTable('frontcontainer4', `${playerName}'s Scorecard`);
        const firstTableBack = new GolfTable('backcontainer4', `Back of ${playerName}'s Scorecard`);
    
        // Flip logic
        flipButton.addEventListener('click', () => {
            if (getComputedStyle(frontcontainer4).display === 'block') {
                frontcontainer4.style.display = 'none';
                backcontainer4.style.display = 'block';
            } else {
                frontcontainer4.style.display = 'block';
                backcontainer4.style.display = 'none';
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
        container4.appendChild(score);
    
        const frontTable = document.querySelector('#frontcontainer4 .table-container table #tableBody');
        frontTable.querySelectorAll('tr').forEach((row) => {
            row.querySelectorAll('td').forEach((cell) => {
                if (cell.id) {
                    cell.id = `front4-${cell.id}`;
                }
            });
        });
        const backTable = document.querySelector('#backcontainer4 .table-container table #tableBody');
        backTable.querySelectorAll('tr').forEach((row) => {
            row.querySelectorAll('td').forEach((cell) => {
                if (cell.id) {
                    cell.id = `back4-${cell.id}`;
                }
            });
        });
    
        let sum = 0;
        let frontTotal = 0;
        let backTotal = 0;

        let total = document.createElement('div');
        total.id = 'total';
        total.textContent = `Stroke Total: 0`;
        container4.appendChild(total);

        addScoreButton.addEventListener('click', () => {
            if (scoreInput.value === '') {
                alert('Please enter a score');
            } else if (frontcontainer4.style.display === 'block') {
                for (let i = 0; i < 9; i++) {
                    const strokes = document.getElementById(`front4-strokes-${i + 1}`);
                    const yardage = document.getElementById(`front4-yardage-${i + 1}`);
                    const par = document.getElementById(`front4-par-${i + 1}`);
                    const handicap = document.getElementById(`front4-handicap-${i + 1}`);
                    if (strokes.textContent === '') {
                        strokes.textContent = scoreInput.value;
                        sum += parseInt(strokes.textContent);
                        yardage.textContent = '400';
                        par.textContent = '4';
                        handicap.textContent = '1';
                        break;
                    }
                    if (i === 8) {
                        const strokesTotal = document.getElementById('front4-strokes-10');
                        strokesTotal.textContent = sum
                        const yardageOut = document.getElementById('front4-yardage-10');
                        yardageOut.textContent = '3600';
                        const parOut = document.getElementById('front4-par-10');
                        parOut.textContent = '4';
                        const handicapOut = document.getElementById('front4-handicap-10');
                        handicapOut.textContent = '1';
                        scoreInput.value = '';
                        frontTotal = sum;
                        total.textContent = `Stroke Total: ${frontTotal + backTotal}`;
                    }
                }
            }
            else if (backcontainer4.style.display === 'block') {
                for (let i = 0; i < 9; i++) {
                    const strokes = document.getElementById(`back4-strokes-${i + 1}`);
                    const yardage = document.getElementById(`back4-yardage-${i + 1}`);
                    const par = document.getElementById(`back4-par-${i + 1}`);
                    const handicap = document.getElementById(`back4-handicap-${i + 1}`);
                    if (strokes.textContent === '') {
                        strokes.textContent = scoreInput.value;
                        sum += parseInt(strokes.textContent);
                        yardage.textContent = '400';
                        par.textContent = '4';
                        handicap.textContent = '1';
                        break;
                    }
                    if (i === 8) {
                        const strokesTotal = document.getElementById('back4-strokes-10');
                        strokesTotal.textContent = sum
                        const yardageOut = document.getElementById('back4-yardage-10');
                        yardageOut.textContent = '3600';
                        const parOut = document.getElementById('back4-par-10');
                        parOut.textContent = '4';
                        const handicapOut = document.getElementById('back4-handicap-10');
                        handicapOut.textContent = '1';
                        scoreInput.value = '';
                        backTotal = sum;
                        total.textContent = `Stroke Total: ${frontTotal + backTotal}`;
                    }
                }
            } 
        });
    }
    else if (container4.innerHTML !== '') {
        alert('Four players is the maximum quantity');
        playerInput.value = '';
    }    
})

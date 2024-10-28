import GolfTable from '/Javascript/class.js';

async function getAvailableCourses() {
    const url = 'https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json';
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch courses: ' + response.status);
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
    details.innerHTML = ''; // Clear previous details

    for (const courseItem of courseSelect) {
        if (courseItem.dataset.id !== courseId.toString()) {
            courseItem.remove(); // Remove non-selected course items
        } else {
            const button = courseItem.querySelector('button');
            button.remove(); // Remove button from selected course item
            
            // Fetch course details
            try {
                const courseDetails = await getCourseDetails(courseId);
                const courseAddress = courseDetails.addr1; // Adjust based on your JSON structure
                const holeCount = courseDetails.holeCount;
                details.innerHTML = `<div>Address: ${courseAddress}</div>
                <br>
                <div>Hole Count: ${holeCount}</div>`;
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

// Player handling
const playerButton = document.getElementById('playerButton');
const playerInput = document.getElementById('playerInput');

const container1 = document.getElementById('container1');
export const container1Table = new GolfTable('container1', 'Scorecard', 'front');
export const container1BackTable = new GolfTable('container1', 'Back 9', 'back');
container1BackTable.hide();

playerButton.addEventListener('click', () => {
    const playerName = playerInput.value.trim();

    if (document.querySelector('.course-item') === null) {
        alert('Please select a course');
        playerInput.value = '';
    } else if (playerInput.value === '') {
        alert('Please enter a player name');
        playerInput.value = '';
    } else {
        container1Table.addPlayer({ name: playerName }); // Add player to front table
        playerInput.value = '';
    }
});

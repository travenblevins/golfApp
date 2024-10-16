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
            let currentId = courseId;
            console.log(courseItem.dataset.id); // Log the selected course ID
            console.log(currentId.toString()); // Store the selected course ID
            DisplayTeeBox(currentId); // Call DisplayTeeBox after a course is selected
        }
    });
}

async function getCourseDetails(currentID) {
    const url = `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses/${currentID}.json`;
    console.log('Fetching course details from URL:', url); // Log the URL for debugging
    const response = await fetch(url);

    if (!response.ok) {
        const errorText = await response.text(); // Get the response text for error handling
        throw new Error(`Network response failed: ${response.status} - ${errorText}`);
    }

    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not valid JSON');
    }

    try {
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error parsing JSON:', error);
        throw new Error('Error parsing JSON response');
    }
}

async function DisplayTeeBox(ID) {
    try {
        const teeBox = await getCourseDetails(ID);
        let teeBoxHtml = '';
        teeBox.forEach((tee) => {
            teeBoxHtml += `
            <div class="tee-item" data-id="${tee.id}">
                <span>${tee.tee}</span>
                <button id="tee-button-${tee.id}">Select</button>
            </div>`;
        });
        const courseDetails = document.getElementById('courseDetails');
        courseDetails.innerHTML = teeBoxHtml;

        // Add event listeners to the newly created tee buttons
        teeBox.forEach((tee) => {
            const button = document.getElementById(`tee-button-${tee.id}`);
            button.addEventListener('click', () => handleTeeButtonClick(tee.id)); // Ensure the correct ID is used
        });
    } catch (error) {
        console.error('Error displaying tee boxes:', error);
    }
}

// Handle tee button click
function handleTeeButtonClick(teeId) {
    const allTeeItems = document.querySelectorAll('.tee-item');
    allTeeItems.forEach((teeItem) => {
        if (teeItem.dataset.id !== teeId.toString()) {
            teeItem.remove(); // Remove non-selected tee items
        } else {
            const button = teeItem.querySelector('button');
            button.remove(); // Remove the button from the selected tee item
        }
    });
}

// Set up the event listener for the main "Select Course" button
const selectCourseButton = document.getElementById('course-button'); // Ensure this is the correct ID for the main button
selectCourseButton.addEventListener('click', async () => {
    await DisplayCourses(); // Call DisplayCourses when the "Select Course" button is clicked
});

// Assuming 'courseDetails' is a valid element in your HTML
const courseDetails = document.getElementById('courseDetails');
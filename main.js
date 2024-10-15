async function getAvailableCourses() {
    const url = 'https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json';
        const response = await fetch(url);
        const data = await response.json();
        return data;
}

async function DisplayCourses() {
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
    courses.forEach((course) => {
        const button = document.getElementById(`course-button-${course.id}`);
        button.addEventListener('click', () => handleButtonClick(course.id));
    });
}

const courseDetails = document.getElementById('course-details');

function handleButtonClick(courseId) {
    const courseSelect = document.querySelectorAll('.course-item');
    courseSelect.forEach((courseItem) => {
        // Check for data-id attribute to compare with courseId
        if (courseItem.dataset.id !== courseId.toString()) {
            courseItem.remove(); // Remove non-selected course items
        } else {
            // Remove button from selected course item
            const button = courseItem.querySelector('button');
            button.remove();
        }
    });
}

const courseButton = document.getElementById('course-button');


courseButton.addEventListener('click', async () => {
    DisplayCourses();
})

async function getCourseDetails(courseId) {
    const url = `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses/${courseId}.json`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response failed')
    }
    const data = await response.json()
    return data;
}


const courseApiUrl = 'http://localhost:3000/courses';
const teacherApiUrl = 'http://localhost:3000/teachers';

let editingCourseId = null; // To store the ID of the course being edited
let editingTeacherId = null; // To store the ID of the teacher being edited

const instructorSelect = document.getElementById('instructor');
const editCoursesList = document.getElementById('editCoursesList');
const editTeachersList = document.getElementById('editTeachersList');

// Tab Switching Logic
function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

// Populate instructors for course creation
async function populateInstructors() {
    const response = await fetch(teacherApiUrl);
    const teachers = await response.json();
    instructorSelect.innerHTML = '<option value="" disabled selected>Select Instructor</option>';
    teachers.forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher.name;
        option.textContent = `${teacher.name} (${teacher.subject})`;
        instructorSelect.appendChild(option);
    });
}

// Realtime search for courses
document.getElementById('courseSearch').addEventListener('input', async (e) => {
    const searchValue = e.target.value.trim();
    const url = searchValue ? `${courseApiUrl}?title=${encodeURIComponent(searchValue)}` : courseApiUrl;

    const response = await fetch(url);
    const courses = await response.json();
    editCoursesList.innerHTML = '';

    if (courses.length === 0) {
        editCoursesList.innerHTML = '<li>No courses found.</li>';
        return;
    }

    courses.forEach(course => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${course.title} - ${course.instructor}
            <button class="edit-btn" onclick="editCourse('${course._id}')">Edit</button>
            <button class="delete-btn" onclick="deleteCourse('${course._id}')">Delete</button>
        `;
        editCoursesList.appendChild(li);
    });
});

// Realtime search for teachers
document.getElementById('teacherSearch').addEventListener('input', async (e) => {
    const searchValue = e.target.value.trim();
    const url = searchValue ? `${teacherApiUrl}?name=${encodeURIComponent(searchValue)}` : teacherApiUrl;

    const response = await fetch(url);
    const teachers = await response.json();
    editTeachersList.innerHTML = '';

    if (teachers.length === 0) {
        editTeachersList.innerHTML = '<li>No teachers found.</li>';
        return;
    }

    teachers.forEach(teacher => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${teacher.name} - ${teacher.subject}
            <button class="edit-btn" onclick="editTeacher('${teacher._id}')">Edit</button>
            <button class="delete-btn" onclick="deleteTeacher('${teacher._id}')">Delete</button>
        `;
        editTeachersList.appendChild(li);
    });
});

// Add or Update Course
document.getElementById('courseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const courseData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        instructor: instructorSelect.value,
        duration: document.getElementById('duration').value,
    };

    if (editingCourseId) {
        // Update course
        await fetch(`${courseApiUrl}/${editingCourseId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseData),
        });
        editingCourseId = null;
    } else {
        // Add new course
        await fetch(courseApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseData),
        });
    }

    e.target.reset();
    document.getElementById('courseSearch').dispatchEvent(new Event('input'));
});

// Add or Update Teacher
document.getElementById('teacherForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const teacherData = {
        name: document.getElementById('teacherName').value,
        subject: document.getElementById('teacherSubject').value,
        experience: document.getElementById('teacherExperience').value,
        email: document.getElementById('teacherEmail').value,
    };

    if (editingTeacherId) {
        // Update teacher
        await fetch(`${teacherApiUrl}/${editingTeacherId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(teacherData),
        });
        editingTeacherId = null;
    } else {
        // Add new teacher
        await fetch(teacherApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(teacherData),
        });
    }

    e.target.reset();
    populateInstructors();
    document.getElementById('teacherSearch').dispatchEvent(new Event('input'));
});

// Edit Course
async function editCourse(id) {
    const response = await fetch(`${courseApiUrl}/${id}`);
    const course = await response.json();

    document.getElementById('title').value = course.title;
    document.getElementById('description').value = course.description;
    instructorSelect.value = course.instructor;
    document.getElementById('duration').value = course.duration;

    editingCourseId = id;
    showSection('newCourse');
}

// Edit Teacher
async function editTeacher(id) {
    const response = await fetch(`${teacherApiUrl}/${id}`);
    const teacher = await response.json();

    document.getElementById('teacherName').value = teacher.name;
    document.getElementById('teacherSubject').value = teacher.subject;
    document.getElementById('teacherExperience').value = teacher.experience;
    document.getElementById('teacherEmail').value = teacher.email;

    editingTeacherId = id;
    showSection('newTeacher');
}

// Delete Course
async function deleteCourse(id) {
    await fetch(`${courseApiUrl}/${id}`, { method: 'DELETE' });
    document.getElementById('courseSearch').dispatchEvent(new Event('input'));
}

// Delete Teacher
async function deleteTeacher(id) {
    await fetch(`${teacherApiUrl}/${id}`, { method: 'DELETE' });
    populateInstructors();
    document.getElementById('teacherSearch').dispatchEvent(new Event('input'));
}

// Initial Data Load
populateInstructors();
document.getElementById('courseSearch').dispatchEvent(new Event('input'));
document.getElementById('teacherSearch').dispatchEvent(new Event('input'));

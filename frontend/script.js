const API_URL = "http://127.0.0.1:8000";


// ===============================
// ADD STUDENT
// ===============================

async function addStudent() {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const course = document.getElementById("course").value;

    if (!name || !email || !course) {
        alert("Please fill all fields");
        return;
    }

    const response = await fetch(`${API_URL}/students`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            course: course
        })
    });

    const data = await response.json();

    alert(data.message);

    // Clear form
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("course").value = "";

    getStudents();
    updateDashboard();
}


// ===============================
// GET ALL STUDENTS
// ===============================

async function getStudents() {

    const response = await fetch(`${API_URL}/students`);

    const students = await response.json();

    const studentList = document.getElementById("studentList");

    studentList.innerHTML = "";

    if (students.length === 0) {
        studentList.innerHTML = "<p>No students found.</p>";
        return;
    }

    students.forEach(student => {

        studentList.innerHTML += `
            <div class="student-card">

                <strong>${student.name}</strong>

                <p>Email: ${student.email}</p>

                <p>Course: ${student.course}</p>

                <p>ID: ${student.id}</p>

                <button onclick="updateStudent(${student.id})">
                    Update
                </button>

                <button onclick="deleteStudent(${student.id})">
                    Delete
                </button>

            </div>
        `;
    });
}


// ===============================
// UPDATE STUDENT
// ===============================

async function updateStudent(id) {

    const name = prompt("Enter new name:");
    const email = prompt("Enter new email:");
    const course = prompt("Enter new course:");

    if (!name || !email || !course) {
        alert("All fields are required");
        return;
    }

    const response = await fetch(`${API_URL}/students/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            course: course
        })
    });

    const data = await response.json();

    alert(data.message);

    getStudents();
    updateDashboard();
}


// ===============================
// DELETE STUDENT
// ===============================

async function deleteStudent(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
        return;
    }

    const response = await fetch(`${API_URL}/students/${id}`, {
        method: "DELETE"
    });

    const data = await response.json();

    alert(data.message);

    getStudents();
    updateDashboard();
}


// ===============================
// SEARCH STUDENT
// ===============================

async function searchStudent() {

    const searchText = document
        .getElementById("search")
        .value
        .toLowerCase();

    const response = await fetch(`${API_URL}/students`);

    const students = await response.json();

    const studentList = document.getElementById("studentList");

    studentList.innerHTML = "";

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchText) ||
        student.email.toLowerCase().includes(searchText) ||
        student.course.toLowerCase().includes(searchText)
    );

    if (filteredStudents.length === 0) {
        studentList.innerHTML = "<p>No students found.</p>";
        return;
    }

    filteredStudents.forEach(student => {

        studentList.innerHTML += `
            <div class="student-card">

                <strong>${student.name}</strong>

                <p>Email: ${student.email}</p>

                <p>Course: ${student.course}</p>

                <p>ID: ${student.id}</p>

                <button onclick="updateStudent(${student.id})">
                    Update
                </button>

                <button onclick="deleteStudent(${student.id})">
                    Delete
                </button>

            </div>
        `;
    });
}


// ===============================
// DASHBOARD COUNT
// ===============================

async function updateDashboard() {

    const response = await fetch(`${API_URL}/students/count`);

    const data = await response.json();

    document.getElementById("totalStudents").innerText =
        data.total_students;
}


// ===============================
// LOAD DASHBOARD WHEN PAGE OPENS
// ===============================

updateDashboard();
function getStudentsFromStorage() {
  try {
    return JSON.parse(localStorage.getItem("students")) || [];
  } catch (e) {
    return [];
  }
}

function renderStudents() {
  const table = document.getElementById("studentTable");
  if (!table) return;

  // Keep the header row (row 0)
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  // Filter out empty records that may already exist in localStorage
  const students = getStudentsFromStorage().filter((s) => {
    const name = s?.name;
    const age = s?.age;
    const classs = s?.classs;
    const section = s?.section;
    const mark = s?.mark;

    const hasName = name != null && String(name).trim().length > 0;
    const hasClass = classs != null && String(classs).trim().length > 0;
    const hasSection = section != null && String(section).trim().length > 0;
    const hasAge = age != null && Number(age) > 0;
    const hasMark = mark != null && Number(mark) >= 0;

    return hasName && hasClass && hasSection && hasAge && hasMark;
  });

  for (const s of students) {
    const row = table.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);
    const cell6 = row.insertCell(5);

    cell1.innerHTML = s.name ?? "";
    cell2.innerHTML = s.age ?? "";
    cell3.innerHTML = s.classs ?? "";
    cell4.innerHTML = s.section ?? "";
    cell5.innerHTML = s.mark ?? "";
    cell6.innerHTML = `
      <button class="updateBtn" onclick="updateStudent(this)">Edit</button>
      <button class="deleteBtn" onclick="deleteStudent(this)">Delete</button>`;
  }
}

function addStudent() {
  let name = document.getElementById("name").value;
  let age = document.getElementById("age").value;
  let classs = document.getElementById("classstd").value;
  let section = document.getElementById("section").value;
  let mark = document.getElementById("mark").value;

  // Persist to localStorage
    let students = getStudentsFromStorage();

    // Prevent saving empty/invalid student entries
    if (!name || !String(name).trim()) return;
    if (!age || Number(age) <= 0) return;
    if (!classs || !String(classs).trim()) return;
    if (!section || !String(section).trim()) return;
    if (!mark && mark !== 0) return;
    if (Number(mark) < 0) return;

    students.push({ name, age, classs, section, mark });
    localStorage.setItem("students", JSON.stringify(students));

  // Render updated UI
  renderStudents();

  // Clear inputs
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  document.getElementById("classstd").value = "";
  document.getElementById("section").value = "";
  document.getElementById("mark").value = "";
}

// Basic navigation helpers
function goToReport() {
  window.location.href = "../report/report.html";
}

function goBackToManage() {
  window.location.href = "manage.html";
}

window.addEventListener("DOMContentLoaded", renderStudents);

function deleteStudent(button) {
  // Remove from localStorage by matching the row contents
  let row = button.parentNode.parentNode;
  let currentName = row.cells[0].innerHTML;
  let currentAge = row.cells[1].innerHTML;
  let currentClass = row.cells[2].innerHTML;
  let currentSection = row.cells[3].innerHTML;
  let currentMark = row.cells[4].innerHTML;

  let students = JSON.parse(localStorage.getItem("students")) || [];
  students = students.filter(
    (s) =>
      !(
        String(s.name) === String(currentName) &&
        String(s.age) === String(currentAge) &&
        String(s.classs) === String(currentClass) &&
        String(s.section) === String(currentSection) &&
        String(s.mark) === String(currentMark)
      )
  );
  localStorage.setItem("students", JSON.stringify(students));

  // Remove from UI
  row.remove();
}

function updateStudent(button) {
  let row = button.parentNode.parentNode;
  let currentName = row.cells[0].innerHTML;
  let currentAge = row.cells[1].innerHTML;
  let currentClass = row.cells[2].innerHTML;
  let currentSection = row.cells[3].innerHTML;
  let currentMark = row.cells[4].innerHTML;

  let newName = prompt("Edit Name", currentName);
  let newAge = prompt("Edit Age", currentAge);
  let newClass = prompt("Edit class", currentClass);
  let newSection = prompt("Edit section", currentSection);
  let newMark = prompt("Edit Mark", currentMark);

  // Apply to UI
  row.cells[0].innerHTML = newName;
  row.cells[1].innerHTML = newAge;
  row.cells[2].innerHTML = newClass;
  row.cells[3].innerHTML = newSection;
  row.cells[4].innerHTML = newMark;

  // Apply to localStorage by matching old values
  let students = JSON.parse(localStorage.getItem("students")) || [];
  let idx = students.findIndex(
    (s) =>
      String(s.name) === String(currentName) &&
      String(s.age) === String(currentAge) &&
      String(s.classs) === String(currentClass) &&
      String(s.section) === String(currentSection) &&
      String(s.mark) === String(currentMark)
  );

  if (idx !== -1) {
    students[idx] = {
      name: newName,
      age: newAge,
      classs: newClass,
      section: newSection,
      mark: newMark,
    };
    localStorage.setItem("students", JSON.stringify(students));
  }
}


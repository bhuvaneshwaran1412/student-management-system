function getStudentsFromStorage() {
  try {
    return JSON.parse(localStorage.getItem("students")) || [];
  } catch (e) {
    return [];
  }
}
function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
function computeStats(list) {
  if (!list.length) return null;
  const sum = list.reduce((a, b) => a + b, 0);
  const avg = sum / list.length;
  const highest = Math.max(...list);
  const lowest = Math.min(...list);
  return { total: list.length, avg, highest, lowest };
}
function renderGroupReport(students) {
  const container = document.getElementById("groupReport");
  if (!container) return;
  const groups = new Map();
  for (const s of students) {
    const classs = (s && s.classs != null ? String(s.classs) : "").trim();
    const section = (s && s.section != null ? String(s.section) : "").trim();
    const key = `${classs}||${section}`;
    const mark = toNumber(s && s.mark);
    if (mark === null) continue;
    if (!groups.has(key)) {
      groups.set(key, {
        classs,
        section,
        marks: [],
      });
    }
    groups.get(key).marks.push(mark);
  }
  const groupRows = Array.from(groups.values()).map((g) => {
    const st = computeStats(g.marks);
    if (!st) return null;
    return {
      classs: g.classs || "-",
      section: g.section || "-",
      ...st,
    };
  }).filter(Boolean);
  groupRows.sort((a, b) => {
    const ca = String(a.classs);
    const cb = String(b.classs);
    if (ca !== cb) return ca.localeCompare(cb, undefined, { numeric: true });
    return String(a.section).localeCompare(String(b.section), undefined, { numeric: true });
  });
  if (!groupRows.length) {
    container.innerHTML = `<div class="emptyState">No class/section data found.</div>`;
    return;
  }
  const table = document.createElement("table");
  table.className = "group-table";
  table.innerHTML = `
    <thead>
      <tr>
        <th>Class</th>
        <th>Section</th>
        <th>Total Students</th>
        <th>Average Mark</th>
        <th>Highest Mark</th>
        <th>Lowest Mark</th>
      </tr>
    </thead>
    <tbody>
      ${groupRows.map((r) => `
        <tr>
          <td>${r.classs}</td>
          <td>${r.section}</td>
          <td>${r.total}</td>
          <td>${r.avg.toFixed(2)}</td>
          <td>${r.highest}</td>
          <td>${r.lowest}</td>
        </tr>
      `).join("")}
    </tbody>
  `;

  container.innerHTML = "";
  container.appendChild(table);
}
function renderReport() {
  const students = getStudentsFromStorage();
  const marks = students
    .map((s) => toNumber(s && s.mark))
    .filter((n) => n !== null);
  const totalEl = document.getElementById("total");
  const avgEl = document.getElementById("average");
  const highEl = document.getElementById("highest");
  const lowEl = document.getElementById("lowest");
  const total = students.length;
  if (!marks.length) {
    totalEl.textContent = `Total Students: ${total}`;
    avgEl.textContent = "Average Mark: -";
    highEl.textContent = "Highest Mark: -";
    lowEl.textContent = "Lowest Mark: -";
  } else {
    const st = computeStats(marks);
    totalEl.textContent = `Total Students: ${total}`;
    avgEl.textContent = `Average Mark: ${st.avg.toFixed(2)}`;
    highEl.textContent = `Highest Mark: ${st.highest}`;
    lowEl.textContent = `Lowest Mark: ${st.lowest}`;
  }
  const validStudents = students.filter((s) => {
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

  renderGroupReport(validStudents);
}
window.addEventListener("DOMContentLoaded", renderReport);




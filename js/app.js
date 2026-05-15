// Data State
const state = {
    planner: JSON.parse(localStorage.getItem('teach_planner')) || [],
    projects: JSON.parse(localStorage.getItem('teach_projects')) || [],
    activities: JSON.parse(localStorage.getItem('teach_activities')) || [],
    students: JSON.parse(localStorage.getItem('teach_students')) || []
};

const motivationalMessages = [
    "Gran trabajo hoy ✨",
    "Sigues haciendo la diferencia 🌍",
    "Tus estudiantes tienen suerte de tenerte 💚",
    "Cada clase tuya es una semilla 🌿"
];

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    renderAll();
    initNotes();
    createLeaves();
});

// Navigation
function showSection(id, element) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    document.getElementById(id).classList.add('active');
    element.classList.add('active');

    if (window.innerWidth <= 768) {
        toggleMenu();
    }
}

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('mobile-overlay').classList.toggle('show');
}

// Toasts
function showToast(message, icon = "✨") {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

function showRandomMotivation() {
    const msg = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    setTimeout(() => showToast(msg, "🌟"), 1000);
}

// Generic Save
function saveData(key) {
    localStorage.setItem(`teach_${key}`, JSON.stringify(state[key]));
}

// --- MODULE 1: PLANNER ---
document.getElementById('planner-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newItem = {
        id: Date.now(),
        materia: document.getElementById('plan-materia').value,
        tema: document.getElementById('plan-tema').value,
        tipo: document.getElementById('plan-tipo').value,
        objetivo: document.getElementById('plan-objetivo').value,
        materiales: document.getElementById('plan-materiales').value,
        actividad: document.getElementById('plan-actividad').value,
        fecha: new Date().toLocaleDateString()
    };
    state.planner.unshift(newItem);
    saveData('planner');
    renderPlanner();
    e.target.reset();
    showToast("Hoy sembraste conocimiento 🌱", "🌱");
    showRandomMotivation();
});

function renderPlanner() {
    const list = document.getElementById('planner-list');
    list.innerHTML = '';
    state.planner.forEach(item => {
        list.innerHTML += `
            <div class="item-card">
                <span class="item-badge">${item.tipo}</span>
                <h3>${item.tema}</h3>
                <p><strong>Materia:</strong> ${item.materia}</p>
                <p><strong>Objetivo:</strong> ${item.objetivo}</p>
                <p><strong>Actividad:</strong> ${item.actividad}</p>
                <div class="item-actions">
                    <button class="btn btn-danger" onclick="deleteItem('planner', ${item.id})">Eliminar</button>
                </div>
            </div>
        `;
    });
}

// --- MODULE 2: PROJECTS ---
document.getElementById('project-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newItem = {
        id: Date.now(),
        nombre: document.getElementById('proj-nombre').value,
        desc: document.getElementById('proj-desc').value,
        etapa: document.getElementById('proj-etapa').value,
        estado: document.getElementById('proj-estado').value
    };
    state.projects.unshift(newItem);
    saveData('projects');
    renderProjects();
    e.target.reset();
    showToast("Proyecto registrado exitosamente", "📋");
});

function renderProjects() {
    const list = document.getElementById('projects-list');
    list.innerHTML = '';
    state.projects.forEach(item => {
        const isDone = item.estado === 'Finalizado';
        list.innerHTML += `
            <div class="item-card ${isDone ? 'project-done' : ''}">
                <span class="item-badge" style="background:${isDone ? '#e5e7eb' : '#bbf7d0'}">${item.estado}</span>
                <h3>${item.nombre}</h3>
                <p>${item.desc}</p>
                <p><strong>Etapa actual:</strong> ${item.etapa}</p>
                <div class="item-actions">
                    <button class="btn btn-outline" onclick="toggleProjectState(${item.id})">Cambiar Estado</button>
                    <button class="btn btn-danger" onclick="deleteItem('projects', ${item.id})">Eliminar</button>
                </div>
            </div>
        `;
    });
}

function toggleProjectState(id) {
    const proj = state.projects.find(p => p.id === id);
    if (proj) {
        proj.estado = proj.estado === 'En progreso' ? 'Finalizado' : 'En progreso';
        saveData('projects');
        renderProjects();
    }
}

// --- MODULE 3: ACTIVITIES ---
document.getElementById('activity-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newItem = {
        id: Date.now(),
        nombre: document.getElementById('act-nombre').value,
        materiales: document.getElementById('act-materiales').value,
        esperado: document.getElementById('act-esperado').value,
        real: document.getElementById('act-real').value
    };
    state.activities.unshift(newItem);
    saveData('activities');
    renderActivities();
    e.target.reset();
    showToast("Experimento guardado", "🧪");
});

function renderActivities() {
    const list = document.getElementById('activities-list');
    list.innerHTML = '';
    state.activities.forEach(item => {
        list.innerHTML += `
            <div class="item-card">
                <h3>${item.nombre}</h3>
                <p><strong>Materiales:</strong> ${item.materiales}</p>
                <p><strong>Resultado Esperado:</strong> ${item.esperado}</p>
                ${item.real ? `<p><strong>Observación Real:</strong> ${item.real}</p>` : ''}
                <div class="item-actions">
                    <button class="btn btn-danger" onclick="deleteItem('activities', ${item.id})">Eliminar</button>
                </div>
            </div>
        `;
    });
}

// --- MODULE 4: STUDENTS ---
document.getElementById('student-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newItem = {
        id: Date.now(),
        nombre: document.getElementById('stu-nombre').value,
        obs: document.getElementById('stu-obs').value,
        fecha: new Date().toLocaleDateString()
    };
    state.students.unshift(newItem);
    saveData('students');
    renderStudents();
    e.target.reset();
    showToast("Observación guardada", "✍️");
});

function renderStudents() {
    const list = document.getElementById('students-list');
    list.innerHTML = '';
    state.students.forEach(item => {
        list.innerHTML += `
            <div class="item-card">
                <h3>${item.nombre}</h3>
                <p><small>${item.fecha}</small></p>
                <p>${item.obs}</p>
                <div class="item-actions">
                    <button class="btn btn-danger" onclick="deleteItem('students', ${item.id})">Eliminar</button>
                </div>
            </div>
        `;
    });
}

// --- MODULE 5: NOTES ---
function initNotes() {
    const notesEl = document.getElementById('quick-notes');
    notesEl.value = localStorage.getItem('teach_notes') || '';

    notesEl.addEventListener('input', () => {
        localStorage.setItem('teach_notes', notesEl.value);
    });
}

// Generic Delete
function deleteItem(type, id) {
    if (confirm('¿Seguro que deseas eliminar este elemento?')) {
        state[type] = state[type].filter(item => item.id !== id);
        saveData(type);

        if (type === 'planner') renderPlanner();
        if (type === 'projects') renderProjects();
        if (type === 'activities') renderActivities();
        if (type === 'students') renderStudents();
    }
}

function renderAll() {
    renderPlanner();
    renderProjects();
    renderActivities();
    renderStudents();
}

// Special Button Logic
function openSecret() {
    const modal = document.getElementById('secret-modal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeSecret() {
    const modal = document.getElementById('secret-modal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Leaf Animation
function createLeaves() {
    const container = document.getElementById('leaves-container');
    const leafTypes = ['🌿', '🍃', '🌱', '🍂'];

    for (let i = 0; i < 15; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.textContent = leafTypes[Math.floor(Math.random() * leafTypes.length)];

        // Random properties
        leaf.style.left = `${Math.random() * 100}vw`;
        leaf.style.animationDuration = `${Math.random() * 10 + 10}s`;
        leaf.style.animationDelay = `${Math.random() * 5}s`;
        leaf.style.opacity = Math.random() * 0.2 + 0.1;
        leaf.style.fontSize = `${Math.random() * 1 + 1}rem`;

        container.appendChild(leaf);
    }
}

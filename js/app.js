/**
 * Teacher Dashboard - Environmental Sciences
 * Architecture: ES6 Module Pattern
 * Refactored for a professional portfolio.
 */

const App = {
    init() {
        Navigation.init();
        Planner.init();
        Projects.init();
        Experiments.init();
        Schedule.init();
        Students.init();
        Backup.init();
        Animations.init();
        SecretFeature.init();
        
        // Global Event Delegation for Delete Buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const key = e.target.getAttribute('data-type');
                const index = e.target.getAttribute('data-index');
                StorageManager.deleteItem(key, index);
            }
        });
    }
};

/**
 * Storage Manager
 * Handles local data persistence
 */
const StorageManager = {
    get(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    },
    set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    getRaw(key) {
        return localStorage.getItem(key);
    },
    setRaw(key, stringData) {
        localStorage.setItem(key, stringData);
    },
    deleteItem(key, index) {
        const arr = this.get(key);
        arr.splice(index, 1);
        this.set(key, arr);
        
        // Re-render the specific module
        if (key === 'ciencia_clases') Planner.render();
        if (key === 'ciencia_proyectos') Projects.render();
        if (key === 'ciencia_experimentos') Experiments.render();
        if (key === 'ciencia_estudiantes') Students.render();
    }
};

/**
 * Navigation Module
 */
const Navigation = {
    init() {
        const navItems = document.querySelectorAll('.nav-item');
        const modules = document.querySelectorAll('.module');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navItems.forEach(nav => nav.classList.remove('active'));
                modules.forEach(mod => mod.classList.remove('active'));
                item.classList.add('active');
                document.getElementById(item.getAttribute('data-target')).classList.add('active');
            });
        });
    }
};

/**
 * Planner Module (Classes)
 */
const Planner = {
    key: 'ciencia_clases',
    init() {
        this.render();
        document.getElementById('form-planificador').addEventListener('submit', (e) => this.handleSubmit(e));
    },
    render() {
        const clases = StorageManager.get(this.key);
        document.getElementById('lista-clases').innerHTML = clases.map((c, i) => `
            <div class="list-item">
                <div class="item-info">
                    <h4>📖 ${c.materia} - ${c.tema}</h4>
                    <span class="badge ${c.tipo}">${c.tipo.toUpperCase()}</span>
                    <p><strong>Objetivo:</strong> ${c.obj}</p>
                    ${c.mat ? `<p><strong>Materiales:</strong> ${c.mat}</p>` : ''}
                </div>
                <button class="btn btn-small delete-btn" data-type="${this.key}" data-index="${i}">X</button>
            </div>
        `).join('');
    },
    handleSubmit(e) {
        e.preventDefault();
        const obj = {
            materia: document.getElementById('plan-mat').value,
            tema: document.getElementById('plan-tema').value,
            tipo: document.getElementById('plan-tipo').value,
            mat: document.getElementById('plan-mat-req').value,
            obj: document.getElementById('plan-obj').value
        };
        const arr = StorageManager.get(this.key);
        arr.push(obj);
        StorageManager.set(this.key, arr);
        e.target.reset();
        this.render();
        
        // Show success animation
        const msg = document.getElementById('msg-plan');
        msg.classList.add('show');
        setTimeout(() => msg.classList.remove('show'), 3000);
    }
};

/**
 * Projects Module
 */
const Projects = {
    key: 'ciencia_proyectos',
    init() {
        this.render();
        document.getElementById('form-proyectos').addEventListener('submit', (e) => this.handleSubmit(e));
    },
    render() {
        const proyectos = StorageManager.get(this.key);
        document.getElementById('lista-proyectos').innerHTML = proyectos.map((p, i) => `
            <div class="list-item">
                <div class="item-info">
                    <h4>🌍 ${p.nombre}</h4>
                    <span class="badge ${p.estado}">${p.estado === 'progreso' ? 'EN PROGRESO' : 'COMPLETADO'}</span>
                    <p><strong>Duración:</strong> ${p.semanas} semanas</p>
                </div>
                <button class="btn btn-small delete-btn" data-type="${this.key}" data-index="${i}">X</button>
            </div>
        `).join('');
    },
    handleSubmit(e) {
        e.preventDefault();
        const obj = {
            nombre: document.getElementById('proj-nombre').value,
            semanas: document.getElementById('proj-sem').value,
            estado: document.getElementById('proj-est').value
        };
        const arr = StorageManager.get(this.key);
        arr.push(obj);
        StorageManager.set(this.key, arr);
        e.target.reset();
        this.render();
    }
};

/**
 * Experiments Module
 */
const Experiments = {
    key: 'ciencia_experimentos',
    init() {
        this.render();
        document.getElementById('form-experimentos').addEventListener('submit', (e) => this.handleSubmit(e));
    },
    render() {
        const experimentos = StorageManager.get(this.key);
        document.getElementById('lista-experimentos').innerHTML = experimentos.map((e, i) => `
            <div class="list-item">
                <div class="item-info">
                    <h4>🔬 ${e.nombre}</h4>
                    <p><strong>Materiales:</strong> ${e.mat}</p>
                    ${e.res ? `<p><strong>Resultado:</strong> ${e.res}</p>` : ''}
                    ${e.obs ? `<p><em>Obs: ${e.obs}</em></p>` : ''}
                </div>
                <button class="btn btn-small delete-btn" data-type="${this.key}" data-index="${i}">X</button>
            </div>
        `).join('');
    },
    handleSubmit(e) {
        e.preventDefault();
        const obj = {
            nombre: document.getElementById('exp-nombre').value,
            mat: document.getElementById('exp-mat').value,
            res: document.getElementById('exp-res').value,
            obs: document.getElementById('exp-obs').value
        };
        const arr = StorageManager.get(this.key);
        arr.push(obj);
        StorageManager.set(this.key, arr);
        e.target.reset();
        this.render();
    }
};

/**
 * Schedule Generator Module
 */
const Schedule = {
    key: 'ciencia_horario',
    init() {
        this.tbody = document.getElementById('tbody-horario');
        this.btnSave = document.getElementById('btn-guardar-horario');
        
        document.getElementById('form-horario').addEventListener('submit', (e) => this.generate(e));
        this.btnSave.addEventListener('click', () => this.save());
        
        this.load();
    },
    generate(e) {
        e.preventDefault();
        const inicio = document.getElementById('hora-inicio').value;
        const fin = document.getElementById('hora-fin').value;
        const duracion = parseInt(document.getElementById('hora-duracion').value);

        const timeToMins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
        const minsToTime = (m) => `${Math.floor(m / 60).toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}`;

        let minActual = timeToMins(inicio);
        const minFin = timeToMins(fin);
        let html = '';

        while (minActual < minFin) {
            html += `
                <tr>
                    <td class="time-col">${minsToTime(minActual)} - ${minsToTime(minActual + duracion)}</td>
                    <td contenteditable="true"></td><td contenteditable="true"></td>
                    <td contenteditable="true"></td><td contenteditable="true"></td>
                    <td contenteditable="true"></td>
                </tr>`;
            minActual += duracion;
        }
        this.tbody.innerHTML = html;
        this.btnSave.style.display = 'inline-flex';
    },
    save() {
        StorageManager.setRaw(this.key, this.tbody.innerHTML);
        const prev = this.btnSave.innerHTML;
        this.btnSave.innerHTML = '¡Guardado! 🌱';
        this.btnSave.style.background = '#4caf50';
        setTimeout(() => {
            this.btnSave.innerHTML = prev;
            this.btnSave.style.background = '';
        }, 2000);
    },
    load() {
        const saved = StorageManager.getRaw(this.key);
        if (saved) {
            this.tbody.innerHTML = saved;
            this.btnSave.style.display = 'inline-flex';
        }
    }
};

/**
 * Students Module
 */
const Students = {
    key: 'ciencia_estudiantes',
    init() {
        this.render();
        document.getElementById('form-estudiantes').addEventListener('submit', (e) => this.handleSubmit(e));
    },
    render() {
        const estudiantes = StorageManager.get(this.key);
        document.getElementById('lista-estudiantes').innerHTML = estudiantes.map((e, i) => `
            <div class="list-item">
                <div class="item-info">
                    <h4>👥 ${e.nombre}</h4>
                    ${e.obs ? `<p>${e.obs}</p>` : ''}
                </div>
                <button class="btn btn-small delete-btn" data-type="${this.key}" data-index="${i}">X</button>
            </div>
        `).join('');
    },
    handleSubmit(e) {
        e.preventDefault();
        const arr = StorageManager.get(this.key);
        arr.push({
            nombre: document.getElementById('est-nombre').value,
            obs: document.getElementById('est-obs').value
        });
        StorageManager.set(this.key, arr);
        e.target.reset();
        this.render();
    }
};

/**
 * Backup Module (Export / Import JSON)
 */
const Backup = {
    init() {
        document.getElementById('btn-exportar').addEventListener('click', () => this.exportData());
        document.getElementById('input-importar').addEventListener('change', (e) => this.importData(e));
    },
    exportData() {
        const backup = {
            ciencia_clases: StorageManager.get('ciencia_clases'),
            ciencia_proyectos: StorageManager.get('ciencia_proyectos'),
            ciencia_experimentos: StorageManager.get('ciencia_experimentos'),
            ciencia_horario: StorageManager.getRaw('ciencia_horario') || '',
            ciencia_estudiantes: StorageManager.get('ciencia_estudiantes')
        };
        
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup));
        const a = document.createElement('a');
        a.href = dataStr;
        a.download = "respaldo_ciencias_" + new Date().toLocaleDateString().replace(/\//g, '-') + ".json";
        document.body.appendChild(a);
        a.click();
        a.remove();
    },
    importData(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const backup = JSON.parse(event.target.result);
                if (backup.ciencia_clases) StorageManager.set('ciencia_clases', backup.ciencia_clases);
                if (backup.ciencia_proyectos) StorageManager.set('ciencia_proyectos', backup.ciencia_proyectos);
                if (backup.ciencia_experimentos) StorageManager.set('ciencia_experimentos', backup.ciencia_experimentos);
                if (backup.ciencia_horario) StorageManager.setRaw('ciencia_horario', backup.ciencia_horario);
                if (backup.ciencia_estudiantes) StorageManager.set('ciencia_estudiantes', backup.ciencia_estudiantes);
                
                alert('¡Copia de seguridad restaurada con éxito! La página se actualizará.');
                location.reload();
            } catch (err) {
                alert('Error al leer el archivo. Asegúrate de que sea un archivo de respaldo válido.');
            }
        };
        reader.readAsText(file);
    }
};

/**
 * Background Animations
 */
const Animations = {
    icons: ['🌱', '🌿', '✨', '🌍', '🤍'],
    container: null,
    
    init() {
        this.container = document.getElementById('hearts-container');
        setInterval(() => this.spawnIcon(), 3000);
    },
    spawnIcon() {
        if (!this.container) return;
        const el = document.createElement('div');
        el.classList.add('floating-heart');
        el.innerHTML = this.icons[Math.floor(Math.random() * this.icons.length)];
        el.style.left = Math.random() * 100 + 'vw';
        el.style.animationDuration = (Math.random() * 5 + 6) + 's';
        el.style.fontSize = (Math.random() * 0.8 + 1) + 'rem';
        this.container.appendChild(el);
        setTimeout(() => el.remove(), 12000);
    }
};

/**
 * Secret Feature
 */
const SecretFeature = {
    init() {
        const btn = document.getElementById('secret-btn');
        const modal = document.getElementById('secret-modal');
        const closeBtn = document.getElementById('close-modal');
        
        btn.addEventListener('click', () => {
            modal.classList.add('active');
            for (let i = 0; i < 15; i++) {
                setTimeout(() => Animations.spawnIcon(), i * 150);
            }
        });
        
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        modal.addEventListener('click', (e) => { 
            if (e.target === modal) modal.classList.remove('active'); 
        });
    }
};

// Bootstrap application
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// DOM Elements
const addNoteBtn = document.getElementById('addNoteBtn');
const notesList = document.getElementById('notesList');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const preview = document.getElementById('preview');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const deleteNoteBtn = document.getElementById('deleteNoteBtn');

// State
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentNoteId = null;

// Initialize marked.js options
marked.setOptions({
    breaks: true,
    gfm: true
});

// Event Listeners
addNoteBtn.addEventListener('click', createNewNote);
noteContent.addEventListener('input', updatePreview);
saveNoteBtn.addEventListener('click', saveNote);
deleteNoteBtn.addEventListener('click', deleteNote);
noteTitle.addEventListener('input', () => {
    if (currentNoteId) {
        updateNotesList();
    }
});

// Initialize app
function initializeApp() {
    renderNotesList();
    updatePreview();
    
    if (notes.length > 0) {
        selectNote(notes[0].id);
    } else {
        createNewNote();
    }
}

// Create new note
function createNewNote() {
    const note = {
        id: Date.now(),
        title: 'নতুন নোট',
        content: '',
        createdAt: new Date().toISOString()
    };
    
    notes.unshift(note);
    saveToLocalStorage();
    renderNotesList();
    selectNote(note.id);
}

// Select note
function selectNote(noteId) {
    currentNoteId = noteId;
    const note = notes.find(note => note.id === noteId);
    
    if (note) {
        noteTitle.value = note.title;
        noteContent.value = note.content;
        updatePreview();
        
        // Update active state in list
        document.querySelectorAll('.note-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.noteId === noteId.toString()) {
                item.classList.add('active');
            }
        });
    }
}

// Save note
function saveNote() {
    if (!currentNoteId) return;
    
    const noteIndex = notes.findIndex(note => note.id === currentNoteId);
    if (noteIndex !== -1) {
        notes[noteIndex] = {
            ...notes[noteIndex],
            title: noteTitle.value,
            content: noteContent.value,
            updatedAt: new Date().toISOString()
        };
        
        saveToLocalStorage();
        renderNotesList();
        showNotification('নোট সেভ করা হয়েছে!');
    }
}

// Delete note
function deleteNote() {
    if (!currentNoteId) return;
    
    if (confirm('আপনি কি এই নোটটি মুছে ফেলতে চান?')) {
        notes = notes.filter(note => note.id !== currentNoteId);
        saveToLocalStorage();
        renderNotesList();
        
        if (notes.length > 0) {
            selectNote(notes[0].id);
        } else {
            currentNoteId = null;
            noteTitle.value = '';
            noteContent.value = '';
            updatePreview();
        }
        
        showNotification('নোট মুছে ফেলা হয়েছে!');
    }
}

// Render notes list
function renderNotesList() {
    notesList.innerHTML = notes.map(note => `
        <div class="note-item ${note.id === currentNoteId ? 'active' : ''}" 
             data-note-id="${note.id}"
             onclick="selectNote(${note.id})">
            <div class="note-title">${note.title}</div>
            <div class="note-meta">
                ${new Date(note.createdAt).toLocaleDateString('bn-BD')}
            </div>
        </div>
    `).join('');
}

// Update preview
function updatePreview() {
    const markdownContent = noteContent.value;
    const htmlContent = marked(markdownContent);
    preview.innerHTML = htmlContent;
}

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Initialize the app when the page loads
initializeApp();

// Add notification styles
const style = document.createElement('style');
style.textContent = `
.notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: #2ecc71;
    color: white;
    border-radius: 4px;
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
`;
document.head.appendChild(style);
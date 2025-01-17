const notes = [];
const categories = [];

const noteTitleInput = document.getElementById('noteTitle');
const noteCategoryInput = document.getElementById('noteCategory');
const noteContentInput = document.getElementById('noteContent');
const previewElement = document.getElementById('preview');
const notesListElement = document.getElementById('notesList');
const categoryFilterElement = document.getElementById('categoryFilter');

const saveNoteBtn = document.getElementById('saveNoteBtn');
const deleteNoteBtn = document.getElementById('deleteNoteBtn');
const addNoteBtn = document.getElementById('addNoteBtn');
const manageCategoriesBtn = document.getElementById('manageCategoriesBtn');
const categoryModal = document.getElementById('categoryModal');
const closeCategoryModalBtn = document.getElementById('closeCategoryModal');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const newCategoryNameInput = document.getElementById('newCategoryName');
const newCategoryColorInput = document.getElementById('newCategoryColor');
const categoriesListElement = document.getElementById('categoriesList');

function renderPreview() {
    const markdownText = noteContentInput.value;
    previewElement.innerHTML = marked(markdownText);
}

function renderNotesList() {
    notesListElement.innerHTML = '';
    const filteredNotes = notes.filter(note => {
        if (categoryFilterElement.value === 'all') return true;
        return note.category === categoryFilterElement.value;
    });
    filteredNotes.forEach(note => {
        const noteItem = document.createElement('div');
        noteItem.classList.add('note-item');
        noteItem.textContent = note.title;
        noteItem.addEventListener('click', () => loadNote(note));
        notesListElement.appendChild(noteItem);
    });
}

function renderCategories() {
    noteCategoryInput.innerHTML = '<option value="">Select Category</option>';
    categoryFilterElement.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach(category => {
        const categoryOption = document.createElement('option');
        categoryOption.value = category.name;
        categoryOption.textContent = category.name;
        categoryOption.style.backgroundColor = category.color;
        noteCategoryInput.appendChild(categoryOption);

        const filterOption = categoryOption.cloneNode(true);
        categoryFilterElement.appendChild(filterOption);
    });
}

function saveNote() {
    const title = noteTitleInput.value;
    const category = noteCategoryInput.value;
    const content = noteContentInput.value;
    if (!title || !content) return alert('Title and content are required.');

    const existingNote = notes.find(note => note.title === title);
    if (existingNote) {
        existingNote.category = category;
        existingNote.content = content;
    } else {
        notes.push({ title, category, content });
    }
    renderNotesList();
    clearNoteEditor();
}

function deleteNote() {
    const title = noteTitleInput.value;
    const noteIndex = notes.findIndex(note => note.title === title);
    if (noteIndex !== -1) notes.splice(noteIndex, 1);
    renderNotesList();
    clearNoteEditor();
}

function clearNoteEditor() {
    noteTitleInput.value = '';
    noteCategoryInput.value = '';
    noteContentInput.value = '';
    renderPreview();
}

function loadNote(note) {
    noteTitleInput.value = note.title;
    noteCategoryInput.value = note.category;
    noteContentInput.value = note.content;
    renderPreview();
}

function toggleCategoryModal() {
    categoryModal.style.display = categoryModal.style.display === 'flex' ? 'none' : 'flex';
}

function addCategory() {
    const name = newCategoryNameInput.value;
    const color = newCategoryColorInput.value;
    if (!name) return alert('Category name is required.');

    if (categories.find(category => category.name === name)) {
        return alert('Category already exists.');
    }

    categories.push({ name, color });
    renderCategories();
    newCategoryNameInput.value = '';
    newCategoryColorInput.value = '#3498db';
}

addNoteBtn.addEventListener('click', clearNoteEditor);
manageCategoriesBtn.addEventListener('click', toggleCategoryModal);
closeCategoryModalBtn.addEventListener('click', toggleCategoryModal);
saveNoteBtn.addEventListener('click', saveNote);
deleteNoteBtn.addEventListener('click', deleteNote);
addCategoryBtn.addEventListener('click', addCategory);
noteContentInput.addEventListener('input', renderPreview);
categoryFilterElement.addEventListener('change', renderNotesList);

renderCategories();
renderNotesList();

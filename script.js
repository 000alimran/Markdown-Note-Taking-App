// Additional DOM Elements for Categories
const manageCategoriesBtn = document.getElementById('manageCategoriesBtn');
const categoryModal = document.getElementById('categoryModal');
const closeCategoryModal = document.getElementById('closeCategoryModal');
const newCategoryName = document.getElementById('newCategoryName');
const newCategoryColor = document.getElementById('newCategoryColor');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const categoriesList = document.getElementById('categoriesList');
const categoryFilter = document.getElementById('categoryFilter');
const noteCategory = document.getElementById('noteCategory');

// Extended State
let categories = JSON.parse(localStorage.getItem('categories')) || [
    { id: 'default', name: 'General', color: '#3498db' }
];

// Update notes structure to include category
let notes = JSON.parse(localStorage.getItem('notes')) || [];
notes = notes.map(note => ({
    ...note,
    categoryId: note.categoryId || 'default'
}));

// Category Management Event Listeners
manageCategoriesBtn.addEventListener('click', () => {
    categoryModal.classList.add('active');
    renderCategoriesList();
});

closeCategoryModal.addEventListener('click', () => {
    categoryModal.classList.remove('active');
});

addCategoryBtn.addEventListener('click', addCategory);
categoryFilter.addEventListener('change', renderNotesList);

// Category Management Functions
function addCategory() {
    const name = newCategoryName.value.trim();
    if (!name) return;

    const category = {
        id: Date.now().toString(),
        name: name,
        color: newCategoryColor.value
    };

    categories.push(category);
    saveCategories();
    renderCategoriesList();
    updateCategorySelects();
    
    newCategoryName.value = '';
    showNotification('ক্যাটাগরি যোগ করা হয়েছে!');
}

function deleteCategory(categoryId) {
    if (categoryId === 'default') {
        showNotification('ডিফল্ট ক্যাটাগরি মুছে ফেলা যাবে না!', 'error');
        return;
    }

    if (confirm('এই ক্যাটাগরি মুছে ফেলতে চান? এর সাথে যুক্ত নোটগুলো "General" ক্যাটাগরিতে চলে যাবে।')) {
        // Move notes to default category
        notes = notes.map(note => ({
            ...note,
            categoryId: note.categoryId === categoryId ? 'default' : note.categoryId
        }));

        categories = categories.filter(cat => cat.id !== categoryId);
        saveCategories();
        saveToLocalStorage();
        renderCategoriesList();
        updateCategorySelects();
        renderNotesList();
        showNotification('ক্যাটাগরি মুছে ফেলা হয়েছে!');
    }
}

function renderCategoriesList() {
    categoriesList.innerHTML = categories.map(category => `
        <div class="category-item">
            <div style="display: flex; align-items: center;">
                <div class="category-color-preview" style="background-color: ${category.color}"></div>
                ${category.name}
            </div>
            ${category.id !== 'default' ? `
                <button class="delete-category" onclick="deleteCategory('${category.id}')">
                    Delete
                </button>
            ` : ''}
        </div>
    `).join('');
}

function updateCategorySelects() {
    // Update category filter
    categoryFilter.innerHTML = `
        <option value="all">All Categories</option>
        ${categories.map(category => `
            <option value="${category.id}">${category.name}</option>
        `).join('')}
    `;

    // Update note category select
    noteCategory.innerHTML = categories.map(category => `
        <option value="${category.id}">${category.name}</option>
    `).join('');
}

// Override existing functions to include categories
function renderNotesList() {
    const selectedCategory = categoryFilter.value;
    const filteredNotes = selectedCategory === 'all' 
        ? notes 
        : notes.filter(note => note.categoryId === selectedCategory);

    notesList.innerHTML = filteredNotes.map(note => {
        const category = categories.find(cat => cat.id === note.categoryId) || categories[0];
        return `
            <div class="note-item ${note.id === currentNoteId ? 'active' : ''}" 
                 data-note-id="${note.id}"
                 onclick="selectNote(${note.id})">
                <div class="category-indicator" style="background-color: ${category.color}"></div>
                <div class="note-title">${note.title}</div>
                <div class="note-meta">
                    ${new Date(note.createdAt).toLocaleDateString('bn-BD')}
                </div>
            </div>
        `;
    }).join('');
}

function selectNote(noteId) {
    currentNoteId = noteId;
    const note = notes.find(note => note.id === noteId);
    
    if (note) {
        noteTitle.value = note.title;
        noteContent.value = note.content;
        noteCategory.value = note.categoryId;
        updatePreview();
        
        document.querySelectorAll('.note-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.noteId === noteId.toString()) {
                item.classList.add('active');
            }
        });
    }
}

function saveNote() {
    if (!currentNoteId) return;
    
    const noteIndex = notes.findIndex(note => note.id === currentNoteId);
    if (noteIndex !== -1) {
        notes[noteIndex] = {
            ...notes[noteIndex],
            title: noteTitle.value,
            content: noteContent.value,
            categoryId: noteCategory.value,
            updatedAt: new Date().toISOString()
        };
        
        saveToLocalStorage();
        renderNotesList();
        showNotification('নোট সেভ করা হয়েছে!');
    }
}

function createNewNote() {
    const note = {
        id: Date.now(),
        title: 'নতুন নোট',
        content: '',
        categoryId: 'default',
        createdAt: new Date().toISOString()
    };
    
    notes.unshift(note);
    saveToLocalStorage();
    renderNotesList();
    selectNote(note.id);
}

// Save categories to localStorage
function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Modified initialize function
function initializeApp() {
    updateCategorySelects();
    renderNotesList();
    updatePreview();
    
    if (notes.length > 0) {
        selectNote(notes[0].id);
    } else {
        createNewNote();
    }
}

// Initialize the app
initializeApp();
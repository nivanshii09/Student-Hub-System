// =============================================
// app.js — Frontend Logic
// All communication with the backend uses fetch()
// =============================================

// --- API Base URL ---
// When running locally: http://localhost:3000/api
const API_URL = '/api/students';

// =============================================
// DOM ELEMENT REFERENCES
// =============================================
const tableBody       = document.getElementById('studentsTableBody');
const emptyState      = document.getElementById('emptyState');
const loadingState    = document.getElementById('loadingState');
const totalCount      = document.getElementById('totalCount');
const searchInput     = document.getElementById('searchInput');
const clearSearch     = document.getElementById('clearSearch');
const toast           = document.getElementById('toast');

// Add/Edit Modal
const modalOverlay    = document.getElementById('modalOverlay');
const modalTitle      = document.getElementById('modalTitle');
const studentForm     = document.getElementById('studentForm');
const studentIdField  = document.getElementById('studentId');
const submitBtn       = document.getElementById('submitBtn');

// Form Fields
const nameInput       = document.getElementById('name');
const emailInput      = document.getElementById('email');
const courseInput     = document.getElementById('course');
const phoneInput      = document.getElementById('phone');

// Field Error Spans
const nameError       = document.getElementById('nameError');
const emailError      = document.getElementById('emailError');
const courseError     = document.getElementById('courseError');
const phoneError      = document.getElementById('phoneError');

// Delete Confirmation Modal
const deleteOverlay   = document.getElementById('deleteOverlay');
const deleteStudentName = document.getElementById('deleteStudentName');
const confirmDeleteBtn = document.getElementById('confirmDelete');

// Tracks which student ID is pending deletion
let pendingDeleteId = null;

// Debounce timer for search
let searchTimer = null;

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {'success'|'error'|'info'} type - The style/color
 */
function showToast(message, type = 'info') {
  toast.textContent = message;
  toast.className = `toast ${type} show`;

  // Auto-hide after 3 seconds
  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

/**
 * Get the first letter (initial) of a name for the avatar
 */
function getInitial(name) {
  return name ? name.charAt(0).toUpperCase() : '?';
}

/**
 * Show/hide the loading spinner
 */
function setLoading(isLoading) {
  loadingState.style.display = isLoading ? 'block' : 'none';
}

/**
 * Clear all form validation error messages
 */
function clearFormErrors() {
  [nameError, emailError, courseError, phoneError].forEach(el => el.textContent = '');
  [nameInput, emailInput, courseInput, phoneInput].forEach(el => el.classList.remove('error'));
}

/**
 * Show an error on a specific field
 */
function showFieldError(inputEl, errorEl, message) {
  inputEl.classList.add('error');
  errorEl.textContent = message;
}

// =============================================
// FORM VALIDATION
// =============================================

/**
 * Validates all form fields.
 * Returns true if valid, false if any error exists.
 */
function validateForm() {
  let isValid = true;
  clearFormErrors();

  const name   = nameInput.value.trim();
  const email  = emailInput.value.trim();
  const course = courseInput.value.trim();
  const phone  = phoneInput.value.trim();

  if (!name) {
    showFieldError(nameInput, nameError, 'Name is required.');
    isValid = false;
  } else if (name.length < 2) {
    showFieldError(nameInput, nameError, 'Name must be at least 2 characters.');
    isValid = false;
  }

  if (!email) {
    showFieldError(emailInput, emailError, 'Email is required.');
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    // Simple email regex check
    showFieldError(emailInput, emailError, 'Enter a valid email address.');
    isValid = false;
  }

  if (!course) {
    showFieldError(courseInput, courseError, 'Course is required.');
    isValid = false;
  }

  if (!phone) {
    showFieldError(phoneInput, phoneError, 'Phone number is required.');
    isValid = false;
  } else if (!/^\+?[\d\s\-()]{7,15}$/.test(phone)) {
    // Allows digits, spaces, dashes, parens, optional leading +
    showFieldError(phoneInput, phoneError, 'Enter a valid phone number (7–15 digits).');
    isValid = false;
  }

  return isValid;
}

// =============================================
// MODAL CONTROLS
// =============================================

/** Open the Add/Edit modal */
function openModal(mode = 'add', student = null) {
  clearFormErrors();
  studentForm.reset();
  studentIdField.value = '';

  if (mode === 'edit' && student) {
    // Pre-fill form with student data
    modalTitle.textContent = 'Edit Student';
    submitBtn.textContent  = 'Save Changes';
    studentIdField.value   = student.id;
    nameInput.value        = student.name;
    emailInput.value       = student.email;
    courseInput.value      = student.course;
    phoneInput.value       = student.phone;
  } else {
    modalTitle.textContent = 'Add Student';
    submitBtn.textContent  = 'Add Student';
  }

  modalOverlay.classList.add('open');
  nameInput.focus(); // Move cursor to first field
}

/** Close the Add/Edit modal */
function closeModal() {
  modalOverlay.classList.remove('open');
  clearFormErrors();
  studentForm.reset();
}

/** Open the delete confirmation modal */
function openDeleteModal(id, name) {
  pendingDeleteId = id;
  deleteStudentName.textContent = name;
  deleteOverlay.classList.add('open');
}

/** Close the delete confirmation modal */
function closeDeleteModal() {
  pendingDeleteId = null;
  deleteOverlay.classList.remove('open');
}

// =============================================
// RENDER STUDENTS TABLE
// =============================================

/**
 * Takes an array of student objects and renders table rows
 */
function renderStudents(students) {
  tableBody.innerHTML = ''; // Clear existing rows

  if (!students || students.length === 0) {
    emptyState.style.display = 'block';
    totalCount.textContent = '0';
    return;
  }

  emptyState.style.display = 'none';
  totalCount.textContent = students.length;

  students.forEach((student, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td><span class="row-num">${index + 1}</span></td>
      <td>
        <div class="student-name">
          <div class="avatar">${getInitial(student.name)}</div>
          <strong>${escapeHTML(student.name)}</strong>
        </div>
      </td>
      <td>${escapeHTML(student.email)}</td>
      <td><span class="course-badge">${escapeHTML(student.course)}</span></td>
      <td>${escapeHTML(student.phone)}</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon edit" onclick="handleEdit('${student.id}')">
            ✏️ Edit
          </button>
          <button class="btn-icon delete" onclick="handleDeleteClick('${student.id}', '${escapeHTML(student.name)}')">
            🗑️ Delete
          </button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

/**
 * Escape special HTML characters to prevent XSS
 */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// =============================================
// API CALLS (using fetch)
// =============================================

/**
 * Fetch all students from the server (with optional search)
 */
async function fetchStudents(searchTerm = '') {
  setLoading(true);
  emptyState.style.display = 'none';

  try {
    // Build URL — add ?search=... if needed
    const url = searchTerm ? `${API_URL}?search=${encodeURIComponent(searchTerm)}` : API_URL;

    const response = await fetch(url);
    const result   = await response.json();

    if (!result.success) throw new Error(result.message);

    renderStudents(result.data);
  } catch (error) {
    showToast('Failed to load students. Is the server running?', 'error');
    console.error('Fetch error:', error);
  } finally {
    setLoading(false);
  }
}

/**
 * Fetch a single student and open the edit modal
 */
async function handleEdit(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const result   = await response.json();

    if (!result.success) throw new Error(result.message);

    openModal('edit', result.data);
  } catch (error) {
    showToast('Could not load student data.', 'error');
  }
}

/**
 * Submit the Add or Edit form
 */
async function handleFormSubmit(event) {
  event.preventDefault(); // Don't reload the page

  // Run validation — stop if invalid
  if (!validateForm()) return;

  const id    = studentIdField.value;
  const isEdit = !!id; // If ID exists, it's an edit

  // Collect form data
  const studentData = {
    name:   nameInput.value.trim(),
    email:  emailInput.value.trim(),
    course: courseInput.value.trim(),
    phone:  phoneInput.value.trim(),
  };

  // Disable button to prevent double-submission
  submitBtn.disabled = true;
  submitBtn.textContent = isEdit ? 'Saving...' : 'Adding...';

  try {
    const url    = isEdit ? `${API_URL}/${id}` : API_URL;
    const method = isEdit ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });

    const result = await response.json();

    if (!result.success) throw new Error(result.message);

    showToast(result.message, 'success');
    closeModal();
    fetchStudents(searchInput.value.trim()); // Refresh list
  } catch (error) {
    showToast(error.message || 'Something went wrong.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = isEdit ? 'Save Changes' : 'Add Student';
  }
}

/**
 * Trigger delete confirmation modal
 */
function handleDeleteClick(id, name) {
  openDeleteModal(id, name);
}

/**
 * Actually delete the student after confirmation
 */
async function handleConfirmDelete() {
  if (!pendingDeleteId) return;

  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.textContent = 'Deleting...';

  try {
    const response = await fetch(`${API_URL}/${pendingDeleteId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!result.success) throw new Error(result.message);

    showToast(result.message, 'success');
    closeDeleteModal();
    fetchStudents(searchInput.value.trim()); // Refresh list
  } catch (error) {
    showToast(error.message || 'Delete failed.', 'error');
  } finally {
    confirmDeleteBtn.disabled = false;
    confirmDeleteBtn.textContent = 'Yes, Delete';
  }
}

// =============================================
// SEARCH WITH DEBOUNCE
// Waits 400ms after user stops typing before searching
// =============================================
function handleSearch() {
  const term = searchInput.value.trim();

  // Show/hide the clear button
  clearSearch.classList.toggle('visible', term.length > 0);

  // Cancel any previous timer
  clearTimeout(searchTimer);

  // Wait 400ms before firing the search
  searchTimer = setTimeout(() => {
    fetchStudents(term);
  }, 400);
}

// =============================================
// EVENT LISTENERS
// =============================================

// Open "Add Student" modal
document.getElementById('openAddModal').addEventListener('click', () => openModal('add'));

// Close modal buttons
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('cancelModal').addEventListener('click', closeModal);

// Close modal when clicking the dark overlay background
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Form submit (handles both add and edit)
studentForm.addEventListener('submit', handleFormSubmit);

// Delete modal controls
document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);
confirmDeleteBtn.addEventListener('click', handleConfirmDelete);

deleteOverlay.addEventListener('click', (e) => {
  if (e.target === deleteOverlay) closeDeleteModal();
});

// Search input
searchInput.addEventListener('input', handleSearch);

// Clear search button
clearSearch.addEventListener('click', () => {
  searchInput.value = '';
  clearSearch.classList.remove('visible');
  fetchStudents(); // Reload all students
  searchInput.focus();
});

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeDeleteModal();
  }
});

// =============================================
// INIT — Load students when page loads
// =============================================
fetchStudents();

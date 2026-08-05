// Default Avatar URL
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

// Load & Auto-Migrate Legacy Data (Purane data ko fix karne ke liye)
function loadAndNormalizeData() {
  let savedData = localStorage.getItem("allRegdata");
  let rawUsers = [];

  try {
    rawUsers = savedData ? JSON.parse(savedData) : [];
    if (!Array.isArray(rawUsers)) rawUsers = [];
  } catch (err) {
    rawUsers = [];
  }

  // Purane records jin me 'id' nahi thi unhe 'id' assign karein aur 'DOB' ko 'dob' me convert karein
  const normalizedUsers = rawUsers.map((user, idx) => ({
    id: user.id ? String(user.id) : (Date.now() + idx).toString(),
    name: user.name || "",
    email: user.email || "",
    mobile: user.mobile || "",
    dob: user.dob || user.DOB || "",
    password: user.password || "",
    profile:
      user.profile && !user.profile.includes("download.png")
        ? user.profile
        : DEFAULT_AVATAR,
  }));

  // Corrected data ko dobara LocalStorage me save kar dein
  localStorage.setItem("allRegdata", JSON.stringify(normalizedUsers));
  return normalizedUsers;
}

// State Management
let allUsers = loadAndNormalizeData();
let currentPage = 1;
const rowsPerPage = 5;
let currentProfileUrl = "";

// DOM Elements
const userForm = document.getElementById("userForm");
const userTableBody = document.getElementById("userTableBody");
const searchInput = document.getElementById("searchInput");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const openAddModalBtn = document.getElementById("openAddModalBtn");
const paginationContainer = document.getElementById("paginationContainer");
const totalRecordsText = document.getElementById("totalRecordsText");
const modalElement = document.getElementById("userModal");
const bsModal = new bootstrap.Modal(modalElement);

// Form Inputs
const userIdInput = document.getElementById("userId");
const userNameInput = document.getElementById("userName");
const userEmailInput = document.getElementById("userEmail");
const userMobileInput = document.getElementById("userMobile");
const userDOBInput = document.getElementById("userDOB");
const userPasswordInput = document.getElementById("userPassword");
const userProfileInput = document.getElementById("userProfile");
const modalTitle = document.getElementById("modalTitle");

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  render();
});

// File Reader for Profile Image
userProfileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      currentProfileUrl = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Main Render Function
function render() {
  const query = searchInput.value.trim().toLowerCase();

  // 1. Filter Data based on Search
  const filteredUsers = allUsers.filter((user) => {
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.mobile.includes(query)
    );
  });

  // 2. Pagination Calculations
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;

  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + rowsPerPage,
  );

  // 3. Render Rows in Table
  userTableBody.innerHTML = "";

  if (paginatedUsers.length === 0) {
    userTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-4 text-muted">
          <i class="fa-solid fa-folder-open fs-3 d-block mb-2"></i>
          No record found.
        </td>
      </tr>
    `;
  } else {
    paginatedUsers.forEach((user, index) => {
      const serialNum = startIndex + index + 1;
      userTableBody.innerHTML += `
        <tr>
          <td class="ps-3 fw-semibold">${serialNum}</td>
          <td>
            <img src="${user.profile || DEFAULT_AVATAR}" class="avatar" alt="Avatar" />
          </td>
          <td class="fw-medium">${escapeHtml(user.name)}</td>
          <td>${escapeHtml(user.email)}</td>
          <td>${user.dob}</td>
          <td>${escapeHtml(user.mobile)}</td>
          <td><span class="text-muted">••••••••</span></td>
          <td class="text-end pe-4">
            <button onclick="editUser('${user.id}')" class="btn btn-sm btn-outline-primary me-1" title="Edit">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="deleteUser('${user.id}')" class="btn btn-sm btn-outline-danger" title="Delete">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });
  }

  // 4. Update Footer Status & Pagination UI
  totalRecordsText.innerText = `Showing ${paginatedUsers.length} of ${totalItems} entries`;
  renderPagination(totalPages);
}

// Render Pagination Buttons
function renderPagination(totalPages) {
  paginationContainer.innerHTML = "";

  if (totalPages <= 1) return;

  // Previous Button
  paginationContainer.innerHTML += `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <button class="page-link" onclick="changePage(${currentPage - 1})"><i class="fa fa-angle-left"></i></button>
    </li>
  `;

  // Page Numbers
  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.innerHTML += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <button class="page-link" onclick="changePage(${i})">${i}</button>
      </li>
    `;
  }

  // Next Button
  paginationContainer.innerHTML += `
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <button class="page-link" onclick="changePage(${currentPage + 1})"><i class="fa fa-angle-right"></i></button>
    </li>
  `;
}

// Change Page Action
function changePage(page) {
  currentPage = page;
  render();
}

// Search Input Event
searchInput.addEventListener("input", () => {
  currentPage = 1;
  render();
});

// Open Add User Modal
openAddModalBtn.addEventListener("click", () => {
  resetForm();
  modalTitle.innerText = "Add New User";
  bsModal.show();
});

// Handle Form Submit (Add / Edit)
userForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = userIdInput.value;
  const name = userNameInput.value.trim();
  const email = userEmailInput.value.trim();
  const mobile = userMobileInput.value.trim();
  const dob = userDOBInput.value;
  const password = userPasswordInput.value;

  if (!name || !email || !mobile || !dob || (!id && !password)) {
    Swal.fire("Warning", "Please fill in all required fields!", "warning");
    return;
  }

  // Check Duplicate Email
  const isDuplicate = allUsers.some((u) => u.email === email && u.id !== id);
  if (isDuplicate) {
    Swal.fire(
      "Duplicate Email!",
      "This email is already registered.",
      "warning",
    );
    return;
  }

  if (id) {
    // Update existing user
    const userIndex = allUsers.findIndex((u) => u.id === id);
    if (userIndex !== -1) {
      allUsers[userIndex] = {
        ...allUsers[userIndex],
        name,
        email,
        mobile,
        dob,
        password: password || allUsers[userIndex].password,
        profile: currentProfileUrl || allUsers[userIndex].profile,
      };
      Swal.fire("Updated!", "User details updated successfully.", "success");
    }
  } else {
    // Add new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      mobile,
      dob,
      password,
      profile: currentProfileUrl || DEFAULT_AVATAR,
    };
    allUsers.push(newUser);
    Swal.fire("Success!", "New user added successfully.", "success");
  }

  saveData();
  bsModal.hide();
  resetForm();
  render();
});

// Edit User Action
function editUser(id) {
  const user = allUsers.find((u) => u.id === String(id));
  if (!user) return;

  userIdInput.value = user.id;
  userNameInput.value = user.name;
  userEmailInput.value = user.email;
  userMobileInput.value = user.mobile;
  userDOBInput.value = user.dob;
  userPasswordInput.value = ""; // Blank unless editing password
  currentProfileUrl = user.profile;

  modalTitle.innerText = "Edit User Details";
  bsModal.show();
}

// Delete Single User
function deleteUser(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "This record will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      allUsers = allUsers.filter((u) => u.id !== String(id));
      saveData();
      render();
      Swal.fire("Deleted!", "User has been deleted.", "success");
    }
  });
}

// Delete All Users
deleteAllBtn.addEventListener("click", () => {
  if (allUsers.length === 0) {
    Swal.fire("Info", "No users available to delete.", "info");
    return;
  }

  Swal.fire({
    title: "Delete All Users?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, delete all!",
  }).then((result) => {
    if (result.isConfirmed) {
      allUsers = [];
      saveData();
      render();
      Swal.fire("Cleared!", "All records have been cleared.", "success");
    }
  });
});

// Save Data to LocalStorage
function saveData() {
  localStorage.setItem("allRegdata", JSON.stringify(allUsers));
}

// Reset Form State
function resetForm() {
  userForm.reset();
  userIdInput.value = "";
  currentProfileUrl = "";
}

// Security: Prevent XSS
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

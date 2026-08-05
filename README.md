# 🚀 Modern User Management System (JS CRUD)

A professional, fully responsive, and lightweight **User Management Application** built with vanilla **JavaScript (ES6+)**, **Bootstrap 5**, and **LocalStorage**. 

It provides seamless CRUD (Create, Read, Update, Delete) capabilities with real-time search filtering, dynamic pagination, and automated data migration for legacy records.

---

## 📸 Preview
---
<img width="1276" height="496" alt="download" src="https://github.com/user-attachments/assets/c2213805-f300-478b-a954-db178c6bf372" />

---

## ✨ Features

- 👤 **Full CRUD Functionality:** Add, view, edit, and delete user records effortlessly.
- 🆔 **Unique ID Architecture:** Uses timestamp-based unique IDs (`Date.now()`) to prevent index mismatch issues during deletion/editing.
- 🔄 **Auto-Data Migration:** Automatically detects and converts legacy `LocalStorage` data structure to the updated schema.
- 🔍 **Real-time Search & Filter:** Instant search across user name, email, and mobile number.
- 📑 **Dynamic Pagination:** Automatically calculates pages based on filtered results.
- 📱 **Fully Responsive UI:** Built with Bootstrap 5 cards, responsive tables, and flex layout for mobile, tablet, and desktop views.
- 🔒 **Security & Clean UX:**
  - Password masking (`••••••••`) for privacy.
  - XSS Protection via HTML escaping.
  - Email duplicate validation.
  - Interactive alerts using **SweetAlert2**.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **CSS Framework:** [Bootstrap 5.3](https://getbootstrap.com/)
- **Icons:** [FontAwesome 6](https://fontawesome.com/)
- **Alerts:** [SweetAlert2](https://sweetalert2.github.io/)
- **Database/Storage:** Browser `localStorage`

---

## 📁 Project Structure

```text
├── index.html       # Main HTML UI & Modal structure
├── style.css        # Custom styles & responsiveness overrides
├── script.js        # Core JavaScript application logic
└── README.md        # Project documentation

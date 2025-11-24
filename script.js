let regForm = document.querySelector(".RegisterForm");
let regList = document.querySelector(".reg-list");
let allInput = regForm.querySelectorAll("input");
let closeBtn = document.querySelector(".btn-close");
let allRegdata = [];
let url = "";

// Safe LocalStorage loading  Prevents "forEach of null" & "find of null"
let savedData = localStorage.getItem("allRegdata");

try {
  allRegdata = savedData ? JSON.parse(savedData) : [];
  if (!Array.isArray(allRegdata)) allRegdata = [];
} catch (err) {
  allRegdata = [];
  localStorage.removeItem("allRegdata");
}

// submit form data
regForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let name = allInput[0].value.trim();
  let email = allInput[1].value.trim();

  let checkEmail = allRegdata.find((data) => data.email === email);

  if (!checkEmail) {
    allRegdata.push({
      name: allInput[0].value,
      email: allInput[1].value,
      mobile: allInput[2].value,
      DOB: allInput[3].value,
      password: allInput[4].value,
      profile: url === "" ? "images/download.png" : url,
    });

    localStorage.setItem("allRegdata", JSON.stringify(allRegdata));

    Swal.fire({
      title: "Data Inserted!",
      text: "Successfully!",
      icon: "success",
    });

    closeBtn.click();
    regForm.reset();
    url = "";
    getRegData();
  } else {
    Swal.fire({
      title: "Email Already Existed!",
      text: "Failed!",
      icon: "warning",
    });
  }
});

// add the data details
function getRegData() {
  regList.innerHTML = "";

  if (!Array.isArray(allRegdata)) return;
  allRegdata.forEach((data, index) => {
    regList.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td><img src="${data.profile}" width="30" alt="logo"></td>
        <td>${data.name}</td>
        <td>${data.email}</td>
        <td>${data.DOB}</td>
        <td>${data.mobile}</td>
        <td>${data.password}</td>
        <td>
          <button index="${index}" class="edit-btn btn p-1 px-2 btn-primary">
            <i class="fa fa-edit"></i>
          </button>
          <button index="${index}" class="del-btn btn p-1 px-2 btn-danger">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
}

// Safe File Reader
let fileInput = regForm.querySelector('input[type="file"]');
if (fileInput) {
  fileInput.onchange = () => {
    let fReader = new FileReader();
    fReader.readAsDataURL(fileInput.files[0]);
    fReader.onload = (e) => {
      url = e.target.result;
    };
  };
}




let regForm = document.querySelector(".RegisterForm");
let regList = document.querySelector(".reg-list");
let allInput = regForm.querySelectorAll("input");
let allBtn = regForm.querySelectorAll("button");
let addBtn = document.querySelector(".add-btn");
let closeBtn = document.querySelector(".btn-close");
let searchElem = document.querySelector(".search");
let delAllBtn = document.querySelector(".delete-all-btn");
let paginationBox = document.querySelector(".pagination-box");

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
    let dataStr = JSON.stringify(data);
    let finalData = dataStr.replace(/"/g, "'");
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
          <button data="${finalData}" index="${index}" class="edit-btn btn p-1 px-2 btn-primary">
            <i class="fa fa-edit"></i>
          </button>
          <button index="${index}" class="del-btn btn p-1 px-2 btn-danger">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });

  deleteData();
}

// delete All data coding
delAllBtn.onclick = async() => {
  let isConfirm = await confirmDelete();
  if (isConfirm) {
    allRegdata = [];
    localStorage.removeItem("allRegdata");
    getRegData();
  }
};

//  Delete safely
const deleteData = () => {
  let allDelBtn = regList.querySelectorAll(".del-btn");

  // delete coding
  allDelBtn.forEach((btn) => {
    btn.onclick = async () => {
      try {
        await confirmDelete();
        let index = btn.getAttribute("index");
        allRegdata.splice(index, 1);
        localStorage.setItem("allRegdata", JSON.stringify(allRegdata));
        getRegData();
      } catch (err) {
        console.log("Delete cancelled");
      }
    };

    // update coding
    let allEditBtn = regList.querySelectorAll(".edit-btn");

    allEditBtn.forEach((btn) => {
      btn.onclick = () => {
        let index = btn.getAttribute("index");
        addBtn.click();

        // get data from attribute
        let dataStr = btn.getAttribute("data");
        let data = JSON.parse(dataStr.replace(/'/g, '"'));

        // fill inputs
        allInput[0].value = data.name;
        allInput[1].value = data.email;
        allInput[2].value = data.mobile;
        allInput[3].value = data.DOB;
        allInput[4].value = data.password;
        url = data.profile;

        // buttons
        let allBtn = regForm.querySelectorAll("button");
        allBtn[0].disabled = false; // update
        allBtn[1].disabled = true; // submit

        // update click
        allBtn[0].onclick = () => {
          allRegdata[index] = {
            name: allInput[0].value,
            email: allInput[1].value,
            mobile: allInput[2].value,
            DOB: allInput[3].value,
            password: allInput[4].value,
            profile: url === "" ? "download.png" : url,
          };

          localStorage.setItem("allRegdata", JSON.stringify(allRegdata));

          Swal.fire({
            title: "Data Updated!",
            text: "Successfully!",
            icon: "success",
          });

          closeBtn.click();
          regForm.reset();
          getRegData();

          allBtn[0].disabled = true;
          allBtn[1].disabled = false;
        };
      };
    });
  });
};

getRegData(0, 5);

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

// delete coding
const confirmDelete = () => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        resolve(true);
        Swal.fire(
          "Deleted!",
          "Your imaginary file has been deleted!",
          "success"
        );
      } else {
        reject(false);
        Swal.fire("Cancelled", "Your imaginary file is safe!", "info");
      }
    });
  });
};

// searching data
searchElem.oninput = () => {
  search();
};

// coding for search field
const search = () => {
  let value = searchElem.value.toLowerCase();
  let tr = regList.querySelectorAll("tr");
  for (let i = 0; i < tr.length; i++) {
    let allTd = tr[i].querySelectorAll("td");
    let name = allTd[2].innerHTML;
    let email = allTd[3].innerHTML;
    let mobile = allTd[5].innerHTML;

    if (name.toLocaleLowerCase().indexOf(value) != -1) {
      tr[i].style.display = "";
    } else if (email.toLocaleLowerCase().indexOf(value) != -1) {
      tr[i].style.display = "";
    } else if (mobile.toLocaleLowerCase().indexOf(value) != -1) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
};



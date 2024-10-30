
//Change-Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");

if (buttonsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const confirmModal = document.querySelector("#confirm-modal");
  const confirmLockAccount = document.querySelector("#confirm-lock-account");
  const cancelLockAccount = document.querySelector("#cancel-lock-account");
  buttonsChangeStatus.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const newConfirmLockAccount = confirmLockAccount.cloneNode(true);
      confirmLockAccount.replaceWith(newConfirmLockAccount);
      const newCancelLockAccount = cancelLockAccount.cloneNode(true);
      cancelLockAccount.replaceWith(newCancelLockAccount);
      const statusCurrent = button.getAttribute("data-status");
      const statusChange = statusCurrent == "Kích hoạt" ? "inactive" : "active";
      if(statusCurrent == "Kích hoạt"){
        confirmModal.querySelector(".modal-body").textContent = "Bạn có chắc chắn muốn khóa tài khoản này không?";
        confirmModal.style.display = "block";

        console.log(confirmLockAccount)
        console.log(cancelLockAccount)
        newCancelLockAccount.addEventListener("click", (e) => {
          console.log("click cancel")
         e.stopPropagation(); 
          confirmModal.style.display = "none";
        });
        newConfirmLockAccount.addEventListener("click", () => {
          const id = button.getAttribute("id");
          const path = formChangeStatus.getAttribute("path");
          const action = path + `${statusChange}/${id}?_method=PATCH`;
          formChangeStatus.action = action;
          formChangeStatus.submit();
        });
      
        
      }else{
        console.log("click unlock")
        newConfirmLockAccount.setAttribute("id", "confirm-unlock-account");
        newCancelLockAccount.setAttribute("id", "cancel-unlock-account");
        newConfirmLockAccount.textContent = "Mở khóa tài khoản";
        newConfirmLockAccount.classList.remove("btn-danger");
        newConfirmLockAccount.classList.add("btn-success");
        newCancelLockAccount.textContent = "Hủy";
        confirmModal.querySelector(".modal-body").textContent = "Bạn có chắc chắn muốn mở khóa tài khoản này không?";
        confirmModal.style.display = "block";
        const confirmUnlockAccount = document.querySelector("#confirm-unlock-account");
        const cancelUnlockAccount = document.querySelector("#cancel-unlock-account");
        confirmUnlockAccount.addEventListener("click", () => {
          e.stopPropagation(); 
          const id = button.getAttribute("id");
          const path = formChangeStatus.getAttribute("path");
          const action = path + `${statusChange}/${id}?_method=PATCH`;
          formChangeStatus.action = action;
          formChangeStatus.submit();
          return;
        });
        cancelUnlockAccount.addEventListener("click", (e) => {
          e.stopPropagation(); 
          confirmModal.style.display = "none";
          return;
        });

      }
    });
  });
}

// End Change-Status

// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}
// End Upload Image

// Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = showAlert.getAttribute("data-time");
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  const closeAlert = document.querySelector("[close-alert]");
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End Show Alert

// Filter role
const buttonFilterRole = document.querySelectorAll("[button-filter]");

if (buttonFilterRole.length > 0) {
  const urlParams = new URLSearchParams(window.location.search);
  const filter = urlParams.get("filter");
  if (!filter) {
    const buttonAll = document.querySelector("[button-all]");
    buttonAll.classList.add("active");
  } else {
    document
      .querySelector(`a[href$="filter=${filter}"]`)
      .classList.add("active");
  }
  const currentUrl = window.location.href;
  const columnStatus = document.querySelector("[column-status]");
  const columnAction = document.querySelector("[column-action]");
  const rowStatus = document.querySelectorAll("[row-status]");
  const rowAction = document.querySelectorAll("[row-action]");
  if (currentUrl.includes("filter=admin")) {
    columnStatus.style.display = "none";
    columnAction.style.display = "none";
    rowStatus.forEach((row) => {
      row.style.display = "none";
    });
    rowAction.forEach((row) => {
      row.style.display = "none";
    });
  }
  if (buttonFilterRole) {
    buttonFilterRole.forEach((button) => {
      button.addEventListener("click", function () {
        buttonFilterRole.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }
}

// End Filter role

// Deleted Account
const formDelete = document.querySelector("#form-delete-account");
const buttonsDelete = document.querySelectorAll("[button-delete-account]");
if (formDelete) {
  var PATH = formDelete.getAttribute("PATH");
  buttonsDelete.forEach((button) => {
    button.addEventListener("click", () => {
      if (confirm("Bạn có chắn chắn muốn xóa tài khoản này không?")) {
        const id = button.getAttribute("id");
        PATH += id + "?_method=DELETE";
        formDelete.action = PATH;
        console.log(formDelete.action)
        formDelete.submit();
      } else {
        return;
      }
    });
  });
}
// End Deleted Account

const modalInfo = document.querySelector("#modal_info");
const mainWrapper = document.querySelector(".mainWrapper");
const imageModal = document.querySelector(".box-image img");
const btnRepair = document.querySelector(".repair");
const information = document.querySelector(".information");
// const btnSave = document.querySelector(".save");
// const btnReset = document.querySelector(".reset-password");
const btnsShowModal = document.querySelectorAll("#btn-show-modal");
btnsShowModal.forEach((btn) => {
  btn.addEventListener("click", () => {
    const accountID = btn.getAttribute("AccountID");
    showInfoModal(accountID);
  })
})
let account = null;
function showInfoModal(id) {
  // console.log(listUser)
  // modalInfo.style.height = "400px";
  // modalInfo.style.weight = "550px";
  btnRepair.style.display = "block";
  // btnReset.style.display = "block";
  // btnSave.style.display = "none";
  account = listUser.find((user) => user.AccountID === id);
  imageModal.src = account.Avatar;
  information.innerHTML = `
    <style>
      .account-info {
        max-height: 650px;
        padding: 20px;
        max-width: 850px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 -5px 20px rgba(0, 50, 100, 0.08);
      }

      .info-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        padding: 5px 10px;
        border-radius: 8px;
      }

      .label {
        font-weight: 600;
        min-width: 150px;
        color: #344767;
        font-size: 0.9rem;
        padding-right: 15px;
      }

      .value {
        flex: 1;
        color: #495057;
        font-size: 0.9rem;
        padding-left: 15px;
        border-left: 1px solid #dee2e6;
      }

      .value.active {
        color: #198754;
        font-weight: 500;
      }

      .value.inactive {
        color: #dc3545;
        font-weight: 500;
      }

      #modal_info {
        display: none;
        width: 1150px;
        height: auto;
        background-color: rgba(255, 255, 255, 0.95);
        border: 1px solid #ddd;
        border-radius: 10px;
        position: fixed;
        z-index: 9999;
        margin: 0 25%;
        padding: 30px;
        left: 6%;
        top: 14%;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      }

      .box-image {
        margin: 30px 18px 50px 28px;
        width: 300px;
        height: 300px;
        border-radius: 40px;
        overflow: hidden;
      }

      .box-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .repair {
        font-weight: 600;
        border-radius: 8px;
        width: 183px;
        background-color: #9CCDBC;
        color: #131212;
        margin: 20px 18px 0px 85px;
        font-size: 16px;
        height: 45px;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .repair:hover {
        background-color: #7fb3a1;
      }
      .div-information {
        background-color: rgba(255, 255, 255, 0.8);
        border: 2px solid white;
        border-radius: 10px;
        font-style: italic;
        font-weight: 600;
        padding: 15px;
      }
    </style>

    <div class="account-info">
      <h1 style="text-align: center; margin-bottom: 20px; color: #344767; font-size: 1.5rem;">Thông tin tài khoản</h1>
      
      <p class="info-row"><span class="label">ID</span> <span class="value">${account.AccountID}</span></p>
      <p class="info-row"><span class="label">Họ và Tên</span> <span class="value">${account.FullName}</span></p>
      <p class="info-row"><span class="label">Gender</span> <span class="value">${account.Gender}</span></p>
      <p class="info-row"><span class="label">Vai trò</span> <span class="value">${
        account.RoleID == "RL0001"
          ? "Admin"
          : account.RoleID == "RL0002"
          ? "Vet" 
          : account.RoleID == "RL0003"
          ? "Staff"
          : account.RoleID == "RL0004"
          ? "Customer"
          : account.RoleID
      }</span></p>
      ${
        account.RoleID == "RL0002" ? `
          <p class="info-row"><span class="label">Chuyên ngành</span> <span class="value">${account.Specialization}</span></p>
          <p class="info-row"><span class="label">Thành tựu</span> <span class="value">${account.Description}</span></p>
          <p class="info-row"><span class="label">Link Google Meet</span> <span class="value">${account.GoogleMeet}</span></p>
        ` : ""
      }
      <p class="info-row"><span class="label">Số điện thoại</span> <span class="value">${account.PhoneNumber}</span></p>
      <p class="info-row"><span class="label">Địa chỉ</span> <span class="value">${account.Address}</span></p>
      <p class="info-row"><span class="label">Birthday</span> <span class="value">${account.Birthday}</span></p>
      <p class="info-row"><span class="label">Trạng thái</span> <span class="value ${account.Status == "Kích hoạt" ? "active" : "inactive"}">${
        account.Status == "Kích hoạt" ? "Kích hoạt" : "Bị khóa"
      }</span></p>
    </div>
`;
  modalInfo.style.display = "block";
  mainWrapper.classList.add("blur");
  // btnSave.style.display = "none";
}
if (btnRepair) {
  btnRepair.addEventListener("click", () => {
    window.location.href = `/admin/account/edit/${account.AccountID}`;

    //   modalInfo.style.height = "600px";
    //   modalInfo.style.weight = "650px";
    //   information.innerHTML = ``;
    //   information.innerHTML = `
    //     <title>Your Page Title</title>
    //     <!-- Other head elements -->
    // </head>
    // <body>
    //     <div class="form-group">
    //     <label for="id"><b>Id</b></label>
    //     <input
    //         class="form-control custom-input"
    //         type="text"
    //         id="id"
    //         name="id"
    //         value="${account.id}"
    //         readonly
    //     />
    // </div>
    // <div class="form-group">
    //     <label for="fullName"><b>Họ Tên</b></label>
    //     <input
    //         class="form-control custom-input"
    //         type="text"
    //         id="fullName"
    //         name="fullName"
    //         value="${account.fullName}"
    //     />
    // </div>
    // <div class="form-group">
    //     <label for="phone"><b>Số điện thoại</b></label>
    //     <input
    //         class="form-control custom-input"
    //         type="text"
    //         id="phone"
    //         name="phone"
    //         value="${account.phone}"
    //     />
    // </div>
    // <div class="form-group">
    //     <label for="address"><b>Địa chỉ</b> </label>
    //     <input
    //         class="form-control custom-input"
    //         type="text"
    //         id="address"
    //         name="address"
    //         value="${account.address}"
    //     />
    // </div>
    // <div class="form-group">
    //     <label for="email"><b>Email</b></label>
    //     <input
    //         class="form-control custom-input"
    //         type="text"
    //         id="email"
    //         name="email"
    //         value="${account.email}"
    //     />
    // </div>
    // <label for="role_id">
    //     Phân Quyền
    //     <select class="form-control custom-input" name="role_id" id="role">
    //   <option value="">--- Lựa chọn ---</option>

    //   <option value="1" ${account.role_id == 1 ? "selected" : ""}>Admin</option>
    //   <option value="2" ${account.role_id == 2 ? "selected" : ""}>Bác sĩ</option>
    //   <option value="3" ${
    //     account.role_id == 3 ? "selected" : ""
    //   }>Nhân viên</option>
    //   <option value="4" ${
    //     account.role_id == 4 ? "selected" : ""
    //   }>Khách hàng</option>

    // </select>
    // </label>
    //   `;
    // btnRepair.style.display = "none";
    // btnReset.style.display = "none";
    // btnSave.style.display = "block";
  });
}

// Alert API
// function showAlert1(message, type) {
//   const alertContainer = document.getElementById("alert-container");
//   if (!alertContainer) {
//     console.error("Alert container not found");
//     return;
//   }
//   const alertDiv = document.createElement("div");
//   alertDiv.className = `alert alert-${type}`;
//   alertDiv.setAttribute("show-alert", "");
//   alertDiv.setAttribute("data-time", "5000");
//   alertDiv.innerHTML = `${message} <span close-alert>x</span>`;
//   alertContainer.appendChild(alertDiv);
//   setTimeout(() => {
//     alertDiv.classList.add("alert-hidden");
//     setTimeout(() => alertDiv.remove(), 500);
//   }, 5000);

//   // Close alert on click
//   alertDiv.querySelector("[close-alert]").addEventListener("click", () => {
//     alertDiv.classList.add("hidden"); // Add hidden class
//     setTimeout(() => alertDiv.remove(), 500); // Remove after transition
//   });
// }
// function showAlertFromStorage() {
//   const storedAlert = localStorage.getItem("alert");
//   if (storedAlert) {
//     const { message, type } = JSON.parse(storedAlert);
//     showAlert1(message, type);
//     localStorage.removeItem("alert");
//   }
// }
// showAlertFromStorage();

// // Alert API
// if (btnSave) {
//   btnSave.addEventListener("click", () => {
//     const id = information.querySelector("input[name='id']").value;
//     const fullName = information.querySelector("input[name='fullName']").value;
//     const phone = information.querySelector("input[name='phone']").value;
//     const address = information.querySelector("input[name='address']").value;
//     const email = information.querySelector("input[name='email']").value;
//     const role_id = information.querySelector("select[name='role_id']").value;

//     const updateInfo = {
//       id: id,
//       fullName: fullName,
//       phone: phone,
//       role_id: role_id,
//       address: address,
//       email: email,
//     };

//     fetch("/admin/account/edit", {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(updateInfo),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.success) {
//           localStorage.setItem(
//             "alert",
//             JSON.stringify({ message: data.message, type: "success" })
//           );
//         } else {
//           localStorage.setItem(
//             "alert",
//             JSON.stringify({ message: data.message, type: "danger" })
//           );
//         }
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//     modalInfo.style.display = "none";
//     mainWrapper.classList.remove("blur");
//     window.location.reload();
//   });
// }

window.onclick = function (event) {
  console.log(event);
  if (event.target == mainWrapper) {
    modalInfo.style.display = "none";
    mainWrapper.classList.remove("blur");
  }
};

// Logout
const btnLogout = document.querySelector("[button-logout]");
console.log(btnLogout);
btnLogout.addEventListener("click", () => {
  let url = new URL(window.location.href);
  const check = confirm("Bạn có chắc chắn muốn đăng xuất!");
  if (check) {
    window.location.href = "/auth/logout";
  } else {
    return;
  }
});

// End logout

//   Edit Doctor
function toggleDoctorFields() {
  var roleSelect = document.getElementById("RoleID");
  var doctorFields = document.getElementById("doctorFields");
  if (roleSelect.value === "RL0002") {
    doctorFields.style.display = "";
  } else {
    doctorFields.style.display = "none";
  }
}




// Edit Website Info
const formWebsiteInfo = document.querySelector("#form-website-info");
const btnWebsiteInfo = document.querySelector(".btn-website-info");
if (formWebsiteInfo) {
  btnWebsiteInfo.addEventListener("click", (e) => {
    e.preventDefault();
    formWebsiteInfo.submit();
  });
}
// End Edit Website Info



// Edit Social Network
const formSocialNetwork = document.querySelector("#form-social-network");
const btnSocialNetwork = document.querySelector(".btn-social-network");
if (formSocialNetwork) {
  console.log(formSocialNetwork)
  btnSocialNetwork.addEventListener("click", (e) => {
    formSocialNetwork.submit();
  });
}
// End Edit Social Network


// Edit Email Config
const formEmailConfig = document.querySelector("#form-email-config");
const btnEmailConfig = document.querySelector(".btn-email-config");
if (formEmailConfig) {
  btnEmailConfig.addEventListener("click", (e) => {
    formEmailConfig.submit();
  });
}
// End Edit Email Config




const listStopBtn = document.querySelectorAll('.stop-btn');
if(listStopBtn){
  const modalConfirmStop = document.querySelector("#modalDistance");
  const closeModal = document.querySelector("#closeModal");
  const confirmModal = document.querySelector("#confirmStop");
  const formStop = document.querySelector("#formStop");
  listStopBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceID = btn.getAttribute("serviceID");
      console.log(serviceID)  
        modalConfirmStop.style.display = "block"; 
        closeModal.addEventListener("click", () => {
          modalConfirmStop.style.display = "none";
        })
        confirmModal.addEventListener("click", () => {
          formStop.action += serviceID;
          console.log(formStop.action)
          formStop.submit();
          
        })
    });
  });
}


const listStartBtn = document.querySelectorAll(".start-btn");
if(listStartBtn){
  const formStart = document.querySelector("#formStart");
  const modalConfirmStart = document.querySelector("#modalDistance");
  const pElement = modalConfirmStart.querySelector("p");
  const iElemet = modalConfirmStart.querySelector("i");
  const closeModal = document.querySelector("#closeModal");
  const confirmModal = document.querySelector("#confirmStop");
  const modalIcon = document.querySelector(".modal-icon");
  listStartBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      pElement.textContent = "Bạn có chắn chắn muốn mở dịch vụ này không?";
      iElemet.classList.remove("fa-exclamation-triangle");
      iElemet.classList.add("fa-check-circle");
      modalIcon.style.color = "#07b857"
      e.preventDefault();
      const serviceID = btn.getAttribute("serviceID");
      modalConfirmStart.style.display = "block"; 
      closeModal.addEventListener("click", () => {
        modalConfirmStart.style.display = "none";
      })
      confirmModal.addEventListener("click", () => {
        formStart.action += serviceID;
        formStart.submit();
      })
    })
  })
}

  


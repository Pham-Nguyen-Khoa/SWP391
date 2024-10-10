
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

// Logout
const btnLogout = document.querySelector("[button-logout]");
if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    let url = new URL(window.location.href);
    const check = confirm("Bạn có chắc chắn muốn đăng xuất!");
    if (check) {
      window.location.href = "/auth/logout";
    } else {
      return;
    }
  });
}

// End logout



const selectSpecialization = document.querySelector("[Select-Specialization]");
const  selectDoctor = document.querySelector("[Select-Doctor]");
function addDoctorOption(value, text) {
  var option = document.createElement("option"); 
  option.value = value; 
  option.text = text; 
  option.innerHTML = `Bác sĩ ${text}`;
  selectDoctor.appendChild(option); 
}
function addDefaultDoctorOption() {
  var defaultOption = document.createElement("option");
  defaultOption.value = "Tự chọn";
  defaultOption.text = "Tự chọn bác sĩ";
  selectDoctor.appendChild(defaultOption);
}

  if(selectSpecialization){
    selectSpecialization.addEventListener("change",() => {
      selectDoctor.innerHTML ='<option selected disable> ---Chọn Bác Sĩ---</option>'
        const selectSpecializaValue =  selectSpecialization.value;
        listDoctor.forEach((doctor) => {
          if(doctor.Specialization == selectSpecializaValue){
              addDoctorOption(doctor.VetID,doctor.FullName)
          }
        })
        

    })
  }
  



  document.addEventListener('DOMContentLoaded', function() {
    const adminMessages = document.querySelectorAll('.admin-message');
    if(adminMessages){    
        adminMessages.forEach(message => {
            message.addEventListener('mouseover', () => {
            message.style.animation = 'pulse 1s infinite';
        });

        message.addEventListener('mouseout', () => {
            message.style.animation = 'none';
        });
    });
  }
  });

  
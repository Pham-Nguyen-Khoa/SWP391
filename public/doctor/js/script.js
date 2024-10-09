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
      // uploadImageInput.value = file;
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}
// End Upload Image



// Logout
const btnLogout = document.querySelector("[button-logout]");
console.log(btnLogout);
btnLogout.addEventListener("click", () => {
  console.log("click");
  let url = new URL(window.location.href);
  const check = confirm("Bạn có chắc chắn muốn đăng xuất!");
  if (check) {
    window.location.href = "/auth/logout";
  } else {
    return;
  }
});

// End logout





// Filter Sort Bác Sĩ ( Qía phê anh em ơi)

document.addEventListener('DOMContentLoaded', function() {
  const filterForm = document.getElementById('filterForm');
  if(filterForm){
    filterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const date = document.getElementById('dateFilter').value;
      const sort = document.getElementById('sortOrder').value;
      const path = filterForm.getAttribute('action');
      window.location.href = path + `?date=${date}&sort=${sort}`;
    });
  }
});
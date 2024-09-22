console.log("ok");

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

// console.log(listService);
console.log(doctorSchedules);
console.log(listAccount);
console.log(listDoctor);

//
const selectService = document.querySelector("#service");
const selectDoctor = document.querySelector("#select_doctor");
// document.querySelector('.doctor-info').style.visibility = 'hidden';
var doctorInfoElement = document.querySelector(".doctor-info");
const timeSlotsContainer = document.querySelector("#timeSlotsContainer");
const selectDate = document.querySelector("#select_date");
const notification = document.querySelector("#notification");

console.log(selectDoctor);
function clearDoctorOptions() {
  selectDoctor.innerHTML = "<option disabled selected>Chọn bác sĩ</option>";
}
function addDoctorOption(value, text) {
  var option = document.createElement("option"); // Tạo một thẻ option mới
  option.value = value; // Gán giá trị cho option
  option.text = text; // Gán text hiển thị
  // option.setAttribute('data-service', service); // Gán service cho option
  option.innerHTML = `Bác sĩ ${text}`;
  selectDoctor.appendChild(option); // Thêm option vào selectDoctor
}
function addDefaultDoctorOption() {
  var defaultOption = document.createElement("option");
  defaultOption.value = "Tự chọn";
  defaultOption.text = "Tự chọn bác sĩ";
  selectDoctor.appendChild(defaultOption);
}

// Chọn dịch vụ

if (selectService) {
  selectService.addEventListener("change", () => {
    notification.innerHTML = "";
    document.querySelector(".doctor-info").style.visibility = "hidden";
    clearDoctorOptions();
    addDefaultDoctorOption();
    doctorInfoElement.innerHTML = "";
    timeSlotsContainer.innerHTML = "";
    selectDate.value = "";
    var service = selectService.value;
    listDoctor.forEach((doctor) => {
      if (doctor.Specialization == service) {
        // const accountDoctor = listAccount.find(
        //   (account) => account.AccountID == doctor.AccountID
        // );
        addDoctorOption(`${doctor.VetID}`, `${doctor.FullName}`);
      }
    });
  });
}
// End Chọn dịch vụ

// Chọn bác sĩ
if (selectDoctor) {
  selectDoctor.addEventListener("change", () => {
    notification.innerHTML = "";
    doctorInfoElement.innerHTML = "";
    timeSlotsContainer.innerHTML = "";
    selectDate.value = "";
    if (selectDoctor.value === "Tự chọn") {
      doctorInfoElement.style.visibility = "hidden";
      return;
    }
    console.log(listAccount)
    console.log(listDoctor)
    const accountDoctor = listDoctor.find(
      (doctor) => doctor.VetID == selectDoctor.value
    );

    console.log(accountDoctor)

    // const doctorInfo = listDoctor.find(
    //   (doctor) => doctor.VetID == selectDoctor.value
    // );
 
    let arrayDescription = [];
    if (accountDoctor) {
      arrayDescription = accountDoctor.Description.split(", ");
    }
    console.log(arrayDescription)

    if (accountDoctor) {
      doctorInfoElement.innerHTML += `
        <img src="${accountDoctor.Avatar}" alt="Avatar của bác sĩ" class="avatar_doctor">
        <h3>Dr. ${accountDoctor.FullName}</h3>
        <div class="rating">★ ★ ★ ★ ☆</div>
        <p>Giới tính: Nam</p>
        <p>Ngày Sinh: 15/08/2004</p>
        <p>Địa chỉ: ${accountDoctor.Address}</p>
        <b>Kinh nghiệm làm việc: </b>

      `;
      arrayDescription.forEach((description) => {
        doctorInfoElement.innerHTML += `<p> • ${description}</p>`;
      });
      doctorInfoElement.style.visibility = "visible";
    }
  });
}
// End Chọn bác sĩ

function updateAvailableTimeSlots(selectedDoctor, selectedDate) {
  timeSlotsContainer.innerHTML = ""; // Xóa các ô giờ hiện tại
  notification.innerHTML = "";

  // Lấy các khung giờ trống dựa trên bác sĩ và ngày
  let availableSlots = [];
  if (selectedDoctor === "Tự chọn") {
    // Lấy các khung giờ trống của tất cả các bác sĩ
    listDoctor.forEach((doctor) => {
      const doctorSlots = doctorSchedules[doctor.AccountID][selectedDate];
      if (doctorSlots) {
        availableSlots = availableSlots.concat(doctorSlots);
      }
    });
    // Loại bỏ các khung giờ trùng lặp
    availableSlots = [...new Set(availableSlots)];
  } else {
    // Lấy các khung giờ trống dựa trên bác sĩ và ngày
    console.log(doctorSchedules)
    console.log(selectedDoctor)
    console.log(selectedDate)
   console.log("2")
    availableSlots = doctorSchedules[selectedDoctor][selectedDate];
  }
  if (availableSlots && availableSlots.length > 0) {
    // Danh sách khung giờ mặc định trong ngày
    var allSlots = ["7h-9h", "9h-11h", "13h-15h", "15h-17h"];

    allSlots.forEach(function (slot) {
      var timeSlotDiv = document.createElement("div");
      timeSlotDiv.className = "time-slot"; // Ensure this matches your CSS class
      timeSlotDiv.innerText = slot;

      // Nếu slot không nằm trong các giờ trống, disable nó
      if (!availableSlots.includes(slot)) {
        timeSlotDiv.classList.add("disabled"); // Ensure this matches your CSS class
      }

      // Thêm sự kiện khi người dùng click vào slot
      timeSlotDiv.addEventListener("click", function () {
        if (!timeSlotDiv.classList.contains("disabled")) {
          // Xóa class 'selected' từ các ô giờ khác
          document
            .querySelectorAll(".time-slot.selected")
            .forEach(function (el) {
              el.classList.remove("selected");
            });
          // Thêm class 'selected' vào ô giờ được chọn
          timeSlotDiv.classList.add("selected");
          document.getElementById("selectedTimeSlot").value = slot;
        }
      });

      // Thêm ô giờ vào container
      timeSlotsContainer.appendChild(timeSlotDiv);
    });
  } else {
    notification.innerHTML = `<h3>Hiện tại chưa có lịch</h3>`;
  }
}

if (selectDate) {
  selectDate.addEventListener("change", () => {
    var idDoctor = selectDoctor.value;
    var inputDateValue = selectDate.value;
    var selectedDate = new Date(inputDateValue);
    var currentDate = new Date();
    if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
      notification.innerHTML = `<h3>Vui lòng chọn lại ngày</h3>`;
      return;
    }
    // if (
    //   selectedDate.getFullYear() === currentDate.getFullYear() &&
    //   selectedDate.getMonth() === currentDate.getMonth() &&
    //   selectedDate.getDate() === currentDate.getDate()
    // ) {
    //   notification.innerHTML = `<h3>Đặt lịch hẹn trước 1 ngày</h3>`;
    //   timeSlotsContainer.innerHTML = ""; // Xóa các khung giờ hiện tại
    //   return;
    // }
    console.log("alo");
    if (idDoctor != null && inputDateValue != null) {
      console.log("1")
      updateAvailableTimeSlots(idDoctor, inputDateValue);
    }
  });
}

//

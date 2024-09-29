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
// console.log(doctorSchedules);
// console.log(listAccount);
// console.log(listDoctor);

//
const selectService = document.querySelector("#service");
const selectDoctor = document.querySelector("#select_doctor");
// document.querySelector('.doctor-info').style.visibility = 'hidden';
var doctorInfoElement = document.querySelector(".doctor-info");
const timeSlotsContainer = document.querySelector("#timeSlotsContainer");
const selectDate = document.querySelector("#select_date");
const notification = document.querySelector("#notification");

if (doctorInfoElement) {
  doctorInfoElement.innerHTML += `
<img src="/images/koi.jpg" alt="Avatar của bác sĩ" class="avatar_doctor">
<h3>Chăm Sóc Cá Koi </h3>
<div class="rating">★ ★ ★ ★ ☆</div>

`;
  doctorInfoElement.style.visibility = "visible";
}

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
function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}

// Hàm để format giá tiền
function formatCurrency(amount) {
  if (isNaN(amount)) {
    return "Giá trị không hợp lệ";
  }
  const formattedAmount = Math.abs(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (amount < 0 ? "-" : "") + formattedAmount + "đ";
}
// Hàm tạo chuỗi giống hàm generate trong helper
function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


// Chọn dịch vụ
const labelAddress = document.querySelector("#label-address");
const inputAddress = document.querySelector("#address");
const labelLocation = document.querySelector("#label-location");
const selectLocation = document.querySelector("#location");
if (selectService) {
  selectService.addEventListener("change", () => {
    const textareaDescription = document.querySelector(".textarea-description");
    if (selectService.value == "Tư Vấn Online") {
      textareaDescription.style.display ='none'
      labelLocation.style.display = "none";
      selectLocation.style.display = "none";
      labelAddress.style.display = "none";
      inputAddress.style.display = "none";
      clearDoctorOptions();
      addDefaultDoctorOption();
      listDoctor.forEach((doctor) => {
        if (doctor.Specialization == selectService.value) {
          addDoctorOption(`${doctor.VetID}`, `${doctor.FullName}`);
        }
      });
    } else {
      labelLocation.style.display = "block";
      selectLocation.style.display = "block";
      doctorInfoElement.innerHTML = `
      <img src="/images/koi.jpg" alt="Avatar của bác sĩ" class="avatar_doctor">
      <h3>Chăm Sóc Cá Koi </h3>
      <div class="rating">★ ★ ★ ★ ☆</div>
      
      `;
      doctorInfoElement.style.visibility = "visible";
      notification.innerHTML = "";
      // document.querySelector(".doctor-info").style.visibility = "hidden";
      clearDoctorOptions();
      addDefaultDoctorOption();
      // doctorInfoElement.innerHTML = "";
      timeSlotsContainer.innerHTML = "";
      selectDate.value = "";
      var service = selectService.value;
      listDoctor.forEach((doctor) => {
        if (doctor.Specialization == service) {
          addDoctorOption(`${doctor.VetID}`, `${doctor.FullName}`);
        }
      });
    }
    const priceServiceElement = document.querySelector("#priceService");
    console.log(priceServiceElement)
    if(priceService){
      const Service = listService.find((service) => service.Name === selectService.value);
      const priceService = Service.Price;
      const priceFormat = formatCurrency(priceService);
      if(selectService.value =="Tư Vấn Online"){
        priceServiceElement.innerHTML=`
      <h1 style="font-size: 24px; font-weight: bold; color: #333; display: inline-block;">Tiền dịch vụ:</h1>
      <span style="font-size: 28px; font-weight: bold; color: #dd9917; margin-left: 10px;padding-bottom: 8px;">${priceFormat}</span>
      `
      }else{
        
        if(textareaDescription){
          textareaDescription.style.display ='block'
        }
        priceServiceElement.innerHTML=`
        <h1 style="font-size: 24px; font-weight: bold; color: #333; display: inline-block;">Tiền dịch vụ:</h1>
        <span style="font-size: 28px; font-weight: bold; color: #dd9917; margin-left: 10px;padding-bottom: 8px;">${priceFormat}</span>
        <p style="font-size: 24px; font-weight: bold; color: #333;">(200k/Cá)</p>
        `
      }
      
      priceServiceElement.style.visibility ='visible';
    }
  });
}

// End Chọn dịch vụ

// Chọn nơi khám
if (selectLocation) {
  selectLocation.addEventListener("change", () => {
    if (selectLocation.value == "nha") {
      labelAddress.style.display = "block";
      inputAddress.style.display = "block";
    } else {
      labelAddress.style.display = "none";
      inputAddress.style.display = "none";
    }
  });
}

// Chọn bác sĩ
if (selectDoctor) {
  selectDoctor.addEventListener("change", () => {
    notification.innerHTML = "";
    doctorInfoElement.innerHTML = "";
    timeSlotsContainer.innerHTML = "";
    selectDate.value = "";
    if (selectDoctor.value === "Tự chọn") {
      doctorInfoElement.innerHTML = `
      <img src="/images/koi.jpg" alt="Avatar của bác sĩ" class="avatar_doctor">
      <h3>Chăm Sóc Cá Koi </h3>
      <div class="rating">★ ★ ★ ★ ☆</div>
      
      `;
      doctorInfoElement.style.visibility = "visible";
      return;
    }
    const accountDoctor = listDoctor.find(
      (doctor) => doctor.VetID == selectDoctor.value
    );

    // const doctorInfo = listDoctor.find(
    //   (doctor) => doctor.VetID == selectDoctor.value
    // );

    let arrayDescription = [];
    if (accountDoctor) {
      arrayDescription = accountDoctor.Description.split(", ");
    }

    if (accountDoctor) {
      const originalDate = accountDoctor.Birthday;
      const formattedDate = formatDate(originalDate);
      doctorInfoElement.innerHTML += `
        <img src="${accountDoctor.Avatar}" alt="Avatar của bác sĩ" class="avatar_doctor">
        <h3>Dr. ${accountDoctor.FullName}</h3>
        <div class="rating">★ ★ ★ ★ ☆</div>
        <p style="min-width: 50px"><b>Giới tính:   </b>      ${accountDoctor.Gender}</p>
        <p><b>Ngày Sinh:   </b>     ${formattedDate}</p>
        <p><b>Chuyên Ngành:   </b>   ${accountDoctor.Specialization}</p>
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
// console.log(doctorSchedules)
function updateAvailableTimeSlots(selectedDoctor, selectedDate) {
  timeSlotsContainer.innerHTML = ""; // Xóa các ô giờ hiện tại  
  notification.innerHTML = "";

  // Lấy các khung giờ trống dựa trên bác sĩ và ngày
  let availableSlots = [];
  if (selectedDoctor === "Tự chọn" && selectedDate != null) {
    // Lấy các khung giờ trống của tất cả các bác sĩ
    listDoctor.forEach((doctor) => {
      if (doctorSchedules[doctor.VetID] && doctorSchedules[doctor.VetID][selectedDate] && doctor.Specialization == selectService.value ) {
        const doctorSlots = doctorSchedules[doctor.VetID][selectedDate];
        availableSlots = availableSlots.concat(doctorSlots);
      }
    });
    // Loại bỏ các khung giờ trùng lặp
    availableSlots = [...new Set(availableSlots)];
    // console.log("--------")
    // console.log(availableSlots)
  } else {
    // Lấy các khung giờ trống dựa trên bác sĩ và ngày
    // availableSlots = doctorSchedules[selectedDoctor][selectedDate];
    availableSlots = doctorSchedules[selectedDoctor] && doctorSchedules[selectedDoctor][selectedDate] 
    ? doctorSchedules[selectedDoctor][selectedDate] 
    : [];
  }
  console.log(availableSlots)
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
      return;
  }
}

// function updateAvailableTimeSlots(selectedDoctor, selectedDate) {
//   timeSlotsContainer.innerHTML = ""; // Xóa các ô giờ hiện tại
//   notification.innerHTML = "";

//   // Lấy các khung giờ trống dựa trên bác sĩ và ngày
//   let availableSlots = [];
//   let doctorCount = {}; // Đếm số lượng bác sĩ cho từng khung giờ
//   let bookedSlots = {}; // Lưu trữ các khung giờ đã đặt lịch cho khách hàng không chọn bác sĩ

//   // Lấy các khung giờ trống của tất cả các bác sĩ
//   listDoctor.forEach((doctor) => {
//     if (doctorSchedules[doctor.VetID] && doctorSchedules[doctor.VetID][selectedDate]) {
//       const doctorSlots = doctorSchedules[doctor.VetID][selectedDate];
//       availableSlots = availableSlots.concat(doctorSlots);

//       // Đếm số lượng bác sĩ cho từng khung giờ trong ngày
//       doctorSlots.forEach(slot => {
//         doctorCount[slot] = (doctorCount[slot] || 0) + 1;
//       });

//       // Lưu trữ các khung giờ đã đặt lịch cho bác sĩ
//       bookedSlots[doctor.VetID] = bookedSlots[doctor.VetID] || [];
//       bookedSlots[doctor.VetID] = bookedSlots[doctor.VetID].concat(doctorSlots);
//     }
//   });

//   // Loại bỏ các khung giờ trùng lặp
//   availableSlots = [...new Set(availableSlots)];

//   // Nếu chọn "Tự chọn" và có ngày
//   if (selectedDoctor === "Tự chọn" && selectedDate != null) {
//     // Lọc các khung giờ mà ít nhất một bác sĩ còn trống
//     availableSlots = availableSlots.filter(slot => doctorCount[slot] > 0);

//     // Ẩn khung giờ nếu nó là ca cuối cùng của một khách hàng đã đặt lịch không chọn bác sĩ
//     availableSlots = availableSlots.filter(slot => {
//       return !Object.values(bookedSlots).some(slots => {
//         return slots.includes(slot) && slots.length === 1; // Nếu ca đó là ca cuối cùng của khách hàng không chọn bác sĩ
//       });
//     });

//     // Kiểm tra xem có bác sĩ nào còn lại cho khung giờ này không
//     availableSlots = availableSlots.filter(slot => {
//       return doctorCount[slot] > 1 || (doctorCount[slot] === 1 && bookedSlots[doctor.VetID].length > 1); // Chỉ giữ lại khung giờ nếu có hơn một bác sĩ
//     });
//   } else if (selectedDoctor) {
//     // Nếu người dùng đã chọn bác sĩ, chỉ lấy khung giờ của bác sĩ đó
//     availableSlots = doctorSchedules[selectedDoctor][selectedDate] || [];
    
//     // Kiểm tra xem khung giờ có phải là ca cuối cùng không
//     availableSlots = availableSlots.filter(slot => {
//       return !Object.values(bookedSlots).some(slots => {
//         return slots.includes(slot) && slots.length === 1; // Nếu ca đó là ca cuối cùng
//       });
//     });
//     availableSlots = availableSlots.filter(slot => {
//       return doctorCount[slot] > 1 ;
//     });
//   }


//   if (availableSlots && availableSlots.length > 0) {
//     // Danh sách khung giờ mặc định trong ngày
//     var allSlots = ["7h-9h", "9h-11h", "13h-15h", "15h-17h"];

//     allSlots.forEach(function (slot) {
//       var timeSlotDiv = document.createElement("div");
//       timeSlotDiv.className = "time-slot"; // Ensure this matches your CSS class
//       timeSlotDiv.innerText = slot;

//       // Nếu slot không nằm trong các giờ trống, disable nó
//       if (!availableSlots.includes(slot)) {
//         timeSlotDiv.classList.add("disabled"); // Ensure this matches your CSS class
//       }

//       // Thêm sự kiện khi người dùng click vào slot
//       timeSlotDiv.addEventListener("click", function () {
//         if (!timeSlotDiv.classList.contains("disabled")) {
//           // Xóa class 'selected' từ các ô giờ khác
//           document
//             .querySelectorAll(".time-slot.selected")
//             .forEach(function (el) {
//               el.classList.remove("selected");
//             });
//           // Thêm class 'selected' vào ô giờ được chọn
//           timeSlotDiv.classList.add("selected");
//           document.getElementById("selectedTimeSlot").value = slot;
//         }
//       });

//       // Thêm ô giờ vào container
//       timeSlotsContainer.appendChild(timeSlotDiv);
//     });
//   } else {
//     notification.innerHTML = `<h3>Hiện tại chưa có lịch</h3>`;
//   }
// }


// function updateAvailableTimeSlots(selectedDoctor, selectedDate) {
//   timeSlotsContainer.innerHTML = ""; // Xóa các ô giờ hiện tại
//   notification.innerHTML = "";

//   // Lấy các khung giờ trống dựa trên bác sĩ và ngày
//   let availableSlots = [];
//   let doctorCount = {}; // Đếm số lượng bác sĩ cho từng khung giờ
//   let bookedSlots = {}; // Lưu trữ các khung giờ đã đặt lịch cho bác sĩ

//   // Lấy các khung giờ trống của tất cả các bác sĩ
//   listDoctor.forEach((doctor) => {
//     if (doctorSchedules[doctor.VetID] && doctorSchedules[doctor.VetID][selectedDate]) {
//       const doctorSlots = doctorSchedules[doctor.VetID][selectedDate];
//       availableSlots = availableSlots.concat(doctorSlots);

//       // Đếm số lượng bác sĩ cho từng khung giờ trong ngày
//       doctorSlots.forEach(slot => {
//         doctorCount[slot] = (doctorCount[slot] || 0) + 2;
//       });

//       // Lưu trữ các khung giờ đã đặt lịch cho bác sĩ
//       bookedSlots[doctor.VetID] = bookedSlots[doctor.VetID] || [];
//       bookedSlots[doctor.VetID] = bookedSlots[doctor.VetID].concat(doctorSlots);
//     }
//   });

//   // Loại bỏ các khung giờ trùng lặp
//   availableSlots = [...new Set(availableSlots)];

//   // Nếu chọn "Tự chọn" và có ngày
//   if (selectedDoctor === "Tự chọn" && selectedDate != null) {
//     // Lọc các khung giờ mà ít nhất một bác sĩ còn trống
//     availableSlots = availableSlots.filter(slot => doctorCount[slot] > 0);

//     // Ẩn khung giờ nếu nó là ca cuối cùng của một khách hàng đã đặt lịch không chọn bác sĩ
//     availableSlots = availableSlots.filter(slot => {
//       return !Object.values(bookedSlots).some(slots => {
//         return slots.includes(slot) && slots.length === 1; // Nếu ca đó là ca cuối cùng của khách hàng không chọn bác sĩ
//       });
//     });
//     availableSlots = availableSlots.filter(slot => {
//       return doctorCount[slot] > 2 ;
//     });
//   } else if (selectedDoctor) {
//     // Nếu người dùng đã chọn bác sĩ, chỉ lấy khung giờ của bác sĩ đó
//     availableSlots = doctorSchedules[selectedDoctor][selectedDate] || [];

//     // Kiểm tra xem khung giờ có phải là ca cuối cùng không
//     availableSlots = availableSlots.filter(slot => {
//       return !Object.values(bookedSlots).some(slots => {
//         return slots.includes(slot) && slots.length === 1; // Nếu ca đó là ca cuối cùng
//       });
//     });

//     // Ẩn khung giờ nếu bác sĩ đó là bác sĩ cuối cùng
//     availableSlots = availableSlots.filter(slot => {
//       return doctorCount[slot] > 2 ;
//     });
//   }

//   if (availableSlots && availableSlots.length > 0) {
//     // Danh sách khung giờ mặc định trong ngày
//     var allSlots = ["7h-9h", "9h-11h", "13h-15h", "15h-17h"];

//     allSlots.forEach(function (slot) {
//       var timeSlotDiv = document.createElement("div");
//       timeSlotDiv.className = "time-slot"; // Ensure this matches your CSS class
//       timeSlotDiv.innerText = slot;

//       // Nếu slot không nằm trong các giờ trống, disable nó
//       if (!availableSlots.includes(slot)) {
//         timeSlotDiv.classList.add("disabled"); // Ensure this matches your CSS class
//       }

//       // Thêm sự kiện khi người dùng click vào slot
//       timeSlotDiv.addEventListener("click", function () {
//         if (!timeSlotDiv.classList.contains("disabled")) {
//           // Xóa class 'selected' từ các ô giờ khác
//           document
//             .querySelectorAll(".time-slot.selected")
//             .forEach(function (el) {
//               el.classList.remove("selected");
//             });
//           // Thêm class 'selected' vào ô giờ được chọn
//           timeSlotDiv.classList.add("selected");
//           document.getElementById("selectedTimeSlot").value = slot;
//         }
//       });

//       // Thêm ô giờ vào container
//       timeSlotsContainer.appendChild(timeSlotDiv);
//     });
//   } else {
//     notification.innerHTML = `<h3>Hiện tại chưa có lịch</h3>`;
//   }
// }



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
    if (
      selectedDate.getFullYear() === currentDate.getFullYear() &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getDate() === currentDate.getDate()
    ) {
      notification.innerHTML = `<h3>Đặt lịch hẹn trước 1 ngày</h3>`;
      timeSlotsContainer.innerHTML = ""; // Xóa các khung giờ hiện tại
      return;
    }
    if (idDoctor != null && inputDateValue != null) {
      updateAvailableTimeSlots(idDoctor, inputDateValue);
    }
  });
}

// Confirm Submit
const buttonSubmitAppointment = document.querySelector(".confirm-btn");
const confirmAppointment = document.querySelector(".confirm-appointment");
const confirmSuccessAppointment = confirmAppointment.querySelector(
  "#confirm-success-appointment"
);
if (buttonSubmitAppointment) {
  const cancleAppointment = confirmAppointment.querySelector(
    "#confirm-cancle-appointment"
  );
  buttonSubmitAppointment.addEventListener("click", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const service = document.getElementById("service").value;
    const location = document.getElementById("location").value;
    const doctor = document.getElementById("select_doctor").value;
    const date = document.getElementById("select_date").value;
    const koiHealth = document.getElementById("description-koi-health").value;
    const selectedTimeSlot = document.getElementById("selectedTimeSlot").value; 
    if (service === "Tư Vấn Online") {
      console.log("Neronmen")
      if (!name || !phone || !service || !doctor || !selectedTimeSlot) {
        document.getElementById("modalMessage").innerText =
          "Vui lòng điền đầy đủ thông tin trước khi xác nhận!";
        document.getElementById("confirmationModal").style.display = "block";
        return;
      } else {
        confirmAppointment.style.display = "block";
      }
    } else {
      // Check for all fields if the service is not "Tư Vấn Online"
      if (!name || !phone || !service || !location || !doctor || !date || !koiHealth || !selectedTimeSlot) {
        document.getElementById("modalMessage").innerText =
          "Vui lòng điền đầy đủ thông tin trước khi xác nhận!";
        document.getElementById("confirmationModal").style.display = "block";
        return;
      } else {
        confirmAppointment.style.display = "block";
      }
    }
    // if (
    //   !name ||
    //   !phone ||
    //   !service ||
    //   !location ||
    //   !doctor ||
    //   !date ||
    //   !koiHealth ||
    //   !selectedTimeSlot
    // ) {
    //   document.getElementById("modalMessage").innerText =
    //     "Vui lòng điền đầy đủ thông tin trước khi xác nhận!";
    //   document.getElementById("confirmationModal").style.display = "block";
    //   return;
    // } else {
    //   confirmAppointment.style.display = "block";
    // }
  });

  cancleAppointment.addEventListener("click", () => {
    confirmAppointment.style.display = "none";
  });

  confirmSuccessAppointment.addEventListener("click", () => {
    if (selectService == "Tư Vấn Online") {
      confirmAppointment.style.display = "none";
    }
  });
}


let MY_BANK = {
  BANK_ID: "MB",
  ACCOUNT_NO: "0001674486670",
};
const paidAppointment = document.querySelector(".paid-appointment");
const paidAppointmentContent = document.querySelector(
  ".content-paid-appointment"
);
document.addEventListener("DOMContentLoaded", () => {
  if (confirmSuccessAppointment) {
    confirmSuccessAppointment.addEventListener("click", () => {
      if (selectService.value == "Tư Vấn Online") {
        const Service = listService.find((service) => service.Name === selectService.value);
        // const priceService = Service.Price;
        const priceService = 10000
        const priceFormat = formatCurrency(priceService);
        const generateRandomText = generateRandomString(6);
        let QR = `https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-qr_only.png?amount=${priceService}&addInfo=${generateRandomText}`;
        paidAppointmentContent.innerHTML = `
        <img src="${QR}"/>
        <h1> Mã QR thanh toán tự động </h1>
        <p>Dịch vụ: ${Service.Name}</p>
        <p>Số tiền: ${priceFormat} </p> 
        <p> Nội dung (bắt buộc): <span>${generateRandomText}</span> </p> 
        <p> Người thụ hưởng: PHẠM NGUYÊN KHOA  </p> 
      `;
        paidAppointment.style.display = "block";
        confirmAppointment.style.display = "none";
        var timeLeft = 600;
        var countdownElement = document.getElementById("countdown");
        var progressElement = document.getElementById("progress");

        if (countdownElement) {
          var countdownTimer = setInterval(function () {
            var minutes = Math.floor(timeLeft / 60);
            var seconds = timeLeft % 60;

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            countdownElement.textContent = minutes + ":" + seconds;

            var progressPercentage = (timeLeft / 600) * 100;
            progressElement.style.width = progressPercentage + "%";

            timeLeft--;

            if (timeLeft < 0) {
              clearInterval(countdownTimer);
              paidAppointment.style.display = "none";
            }
          }, 1000);
        }
        // nếu thanh toán thành công

        // setTimeout(() => {
        //   const intervalId = setInterval(() => {
        //     checkPaid(priceService, generateRandomText, intervalId);
        //   }, 1000);    
        // }, 15000);
        const formAppointment = document.querySelector(".form_appointment");
        formAppointment.submit();
      } else {
        const formAppointment = document.querySelector(".form_appointment");
        formAppointment.submit();
      }
    });
  }
});

async function checkPaid(priceService, generateRandomText, intervalId) {
  try {
    const response = await fetch(
      "https://script.googleusercontent.com/macros/echo?user_content_key=KRz2t8n3mSWU8rW12nLE5ITSrVU3X8MH8aXYgkBQ2JZ8Ud4s9KCErMEolE10lxPjGVSOCVKZquXvaQ_S8Q-JK1Bvvga3wXvom5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnF-VlfXyiFosF7yZ1TldbwXYBzvn4FrH__59jSgp-4XWD4KyyJtCKvPCOZKMfNsWAjlyM5Q5STa8ENCrSkfZxwmMOCPR9YD5_dz9Jw9Md8uu&lib=MswcOMHqmVpLDjtk3rosXuZBY_5xkvqkP"
    );
    const data = await response.json();
    const lastPaid = data.data[data.data.length - 1];
    const lastContent = lastPaid["Mô tả"];
    const lastPrice = lastPaid["Giá trị"];
    if (lastPrice >= priceService && lastContent.includes(generateRandomText)) {
      paidAppointment.style.display = "none";
      const successModal = document.getElementById("successModal");
      successModal.style.display = "block";
      // Đếm ngược thời gian khi mà cái modal thanh toán thành công nó xuất hiện làm cái đếm ngược 5s
      let countdown = 5; 
      const countdownText = document.getElementById("countdownText");
      const interval = setInterval(() => {
        countdownText.textContent = `Tiếp tục sau ${countdown}s`; // Hiển thị số giây trong vòng tròn

        if (countdown <= 0) {
          clearInterval(interval);
        }
        countdown--;
      }, 1000);
      window.onclick = function (event) {
        if (event.target == successModal) {
          successModal.style.display = "none";
        }
      };
      setTimeout(() => {
        const formAppointment = document.querySelector(".form_appointment");
        formAppointment.submit();
      }, 5000);

      clearInterval(intervalId);
    } else {
      console.log("Không thành công! ");
    }
  } catch (error) {
    console.error("Lỗi");
  }
}

const closeModalButton = document.getElementById("closeModalMessage");
if (closeModalButton) {
  closeModalButton.addEventListener("click", function () {
    document.getElementById("confirmationModal").style.display = "none";
  });
} else {
  console.error('Element with ID "closeModal" not found.');
}

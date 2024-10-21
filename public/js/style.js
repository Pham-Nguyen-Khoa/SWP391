
//Remember Password 
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
  var c = ca[i];
  while (c.charAt(0) == " ") {
  c = c.substring(1);
  }
  if (c.indexOf(name) == 0) {
  return c.substring(name.length, c.length);
  }
  }
  return "";
}

const loginBtnForm = document.querySelector(".login-button");
if(loginBtnForm){
  const loginForm = document.querySelector(".login-form");
  console.log(loginForm)
  loginBtnForm.addEventListener("click", (e)=>{
    e.preventDefault();
    const rememberInput = document.querySelector(".remember-utilities input[name=RememberMe]");
    if(rememberInput){
    if(rememberInput.checked){
      const email = document.querySelector(".login-element[name=Email]").value;
      const password = document.querySelector(".login-element[name=Password]").value;
      document.cookie = "user=" + email + "; path=/auth/login";
      document.cookie = "password=" + password + "; path=/auth/login";
    }else{
      document.cookie = "user=; path=/auth/login";
      document.cookie = "password=; path=/auth/login";
    }
    loginForm.submit(); 
  }
  })
  }

window.onload = function() {
  if(window.location.pathname == "/auth/login"){
    const user = getCookie("user");
    const password = getCookie("password");
    if (user) {
      document.querySelector(".login-element[name=Email]").value = user;
    }
    if (password) {
      document.querySelector(".login-element[name=Password]").value = password;
    }
  }
}
// End Remember Password 







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
    <div class="koi-care-box" style=" border-radius: 10px;  width: 100%;height: 533px; text-align: center;">
      <img src="/images/koi.jpg" alt="Chăm Sóc Cá Koi" style="width: 177px; height: 182px; object-fit: cover; margin-bottom: 10px;    border: 2px solid black;">
      <h3 style="color: #00796b; font-size: 24px; margin: 10px 0;">Trung Tâm Chăm Sóc Cá Koi</h3>
      <div class="rating">★ ★ ★ ★ ★</div>
      <p style="color: #004d40; font-size: 17px; margin-bottom: 10px;">Chúng tôi tự hào là trung tâm chăm sóc cá Koi hàng đầu với hơn 20 năm kinh nghiệm. Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng mang đến dịch vụ tốt nhất cho những chú cá Koi yêu quý của bạn.</p>
      <p style="color: #004d40; font-size: 17px; margin-bottom: 10px;">Dịch vụ chăm sóc toàn diện, từ kiểm tra sức khỏe định kỳ đến cải thiện môi trường sống, đảm bảo cá Koi của bạn luôn khỏe mạnh và rực rỡ.</p>
    </div>
      

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
const closeModalButton = document.getElementById("closeModalMessage");
if (closeModalButton) {

  closeModalButton.addEventListener("click", function () {
    console.log("Neronmen")
    document.getElementById("confirmationModal").style.display = "none";
  });
} else {
  console.error('Element with ID "closeModal" not found.');
}


console.log("okkk")

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
      if(selectService.value != "Cải Thiện Môi Trường"){
        selectLocation.style.display = "block";
      }else{
        labelLocation.style.display = "none";
        selectLocation.style.display = "none";
        textareaDescription.style.display ='none';
        labelAddress.style.display = "block";
        inputAddress.style.display = "block";
      }
      doctorInfoElement.innerHTML = `
      <div class="koi-care-box" style=" border-radius: 10px;  width: 100%;height: 533px; text-align: center;">
      <img src="/images/koi.jpg" alt="Chăm Sóc Cá Koi" style="width: 177px; height: 182px; object-fit: cover; margin-bottom: 10px;    border: 2px solid black;">
      <h3 style="color: #00796b; font-size: 24px; margin: 10px 0;">Trung Tâm Chăm Sóc Cá Koi</h3>
      <div class="rating">★ ★ ★ ★ ★</div>
      <p style="color: #004d40; font-size: 17px; margin-bottom: 10px;">Chúng tôi tự hào là trung tâm chăm sóc cá Koi hàng đầu với hơn 20 năm kinh nghiệm. Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng mang đến dịch vụ tốt nhất cho những chú cá Koi yêu quý của bạn.</p>
      <p style="color: #004d40; font-size: 17px; margin-bottom: 10px;">Dịch vụ chăm sóc toàn diện, từ kiểm tra sức khỏe định kỳ đến cải thiện môi trường sống, đảm bảo cá Koi của bạn luôn khỏe mạnh và rực rỡ.</p>
    </div>
      
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
      <span style="font-size: 28px; font-weight: bold; color: #cba510; margin-left: 10px;padding-bottom: 8px;">${priceFormat}</span>
      `
      }else if(selectService.value =="Cải Thiện Môi Trường"){
        priceServiceElement.innerHTML=`
        <h1 style="font-size: 24px; font-weight: bold; color: #333; display: inline-block;">Tiền dịch vụ:</h1>
        <span style="font-size: 28px; font-weight: bold; color: #cba510; margin-left: 10px;padding-bottom: 8px;">${priceFormat}</span>
        <p style="font-size: 24px; font-weight: bold; color: #333;">(200K/Hồ)</p>
        `
      }else{
        
        if(textareaDescription){
          textareaDescription.style.display ='block'
        }
        priceServiceElement.innerHTML=`
        <h1 style="font-size: 24px; font-weight: bold; color: #333; display: inline-block;">Tiền dịch vụ:</h1>
        <span style="font-size: 28px; font-weight: bold; color: #cba510; margin-left: 10px;padding-bottom: 8px;">${priceFormat}</span>
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
      inputAddress.setSelectionRange(inputAddress.value.length, inputAddress.value.length);
      inputAddress.focus();
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
    <div class="koi-care-box" style=" border-radius: 10px;  width: 100%;height: 533px; text-align: center;">
      <img src="/images/koi.jpg" alt="Chăm Sóc Cá Koi" style="width: 177px; height: 182px; object-fit: cover; margin-bottom: 10px;    border: 2px solid black;">
      <h3 style="color: #00796b; font-size: 24px; margin: 10px 0;">Trung Tâm Chăm Sóc Cá Koi</h3>
      <div class="rating">★ ★ ★ ★ ★</div>
      <p style="color: #004d40; font-size: 17px; margin-bottom: 10px;">Chúng tôi tự hào là trung tâm chăm sóc cá Koi hàng đầu với hơn 20 năm kinh nghiệm. Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng mang đến dịch vụ tốt nhất cho những chú cá Koi yêu quý của bạn.</p>
      <p style="color: #004d40; font-size: 17px; margin-bottom: 10px;">Dịch vụ chăm sóc toàn diện, từ kiểm tra sức khỏe định kỳ đến cải thiện môi trường sống, đảm bảo cá Koi của bạn luôn khỏe mạnh và rực rỡ.</p>
    </div>
      
      
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
if(confirmAppointment){
const confirmSuccessAppointment = confirmAppointment.querySelector("#confirm-success-appointment");
}
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
    const locationInput = document.getElementById("address").value;
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
    } else if(service == "Cải Thiện Môi Trường"){
      console.log(locationInput.value)
      if (!name || !phone || !service || !doctor || !date || !selectedTimeSlot || !locationInput)  {
        document.getElementById("modalMessage").innerText =
          "Vui lòng điền đầy đủ thông tin trước khi xác nhận!";
        document.getElementById("confirmationModal").style.display = "block";
        return;
      } else {
        confirmAppointment.style.display = "block";
      }
    }else{

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
  // if(confirmSuccessAppointment){
    const confirmSuccessAppointment = confirmAppointment.querySelector("#confirm-success-appointment");
    confirmSuccessAppointment.addEventListener("click", () => {
      if (selectService == "Tư Vấn Online") {
      confirmAppointment.style.display = "none";
    }
  });
// }
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
  const confirmSuccessAppointment = confirmAppointment.querySelector("#confirm-success-appointment");
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

        setTimeout(() => {
          const intervalId = setInterval(() => {
            checkPaid(priceService, generateRandomText, intervalId);
          }, 1000);    
        }, 15000);
        // const formAppointment = document.querySelector(".form_appointment");
        // formAppointment.submit();
      } else {
        const addressInput = document.getElementById("address").value
        let distanceAutoCustomer= 0;
        if(addressInput != null){
          const originAddress = settingGeneral.Address
          const destinationAddress = addressInput;
          console.log(destinationAddress);
          
          Promise.all([
              fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(originAddress)}&key=5f86e5613fca4318a89493ef1f4053da`),
              fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(destinationAddress)}&key=5f86e5613fca4318a89493ef1f4053da`)
          ])
          .then(responses => {
              if (!responses[0].ok || !responses[1].ok) {
                  throw new Error('Yêu cầu đến API không thành công.');
              }
              return Promise.all(responses.map(res => res.json()));
          })
          .then(data => {
              const originResult = data[0].results[0];
              const destinationResult = data[1].results[0];

              if (originResult && destinationResult) {
                  const originCoords = originResult.geometry;
                  const destinationCoords = destinationResult.geometry;

                  if (originCoords && destinationCoords) {
                      const origin = `${originCoords.lng},${originCoords.lat}`;
                      const destination = `${destinationCoords.lng},${destinationCoords.lat}`;

                      return fetch(`http://router.project-osrm.org/route/v1/driving/${origin};${destination}?overview=false`);
                  } else {
                      console.log('Không tìm thấy tọa độ cho một trong các địa chỉ.');
                  }
              } else {
                  console.log('Không tìm thấy kết quả cho một trong các địa chỉ.');
              }
          })
          .then(response => {
              if (!response.ok) {
                  throw new Error('Không thể lấy dữ liệu lộ trình.');
              }
              return response.json();
          })
          .then(data => {
              if (data && data.routes && data.routes.length > 0) {
                   distanceAuto = data.routes[0].distance;
                   distanceAutoCustomer = (distanceAuto / 1000).toFixed(2);
                   if (distanceAutoCustomer > 50) {
                    const modalDistance = document.getElementById("modalDistance");
                  modalDistance.style.display = "block"; 
                  console.log("Neronmen")
                  console.log(document.getElementById("closeModalDistance"))
                  confirmAppointment.style.display = "none";
                  document.getElementById("closeModalDistance").addEventListener("click", () => {
                      // window.location.reload();
                      modalDistance.style.display = "none"; 
                      
                  });
                    return;
                }
                  const formAppointment = document.querySelector(".form_appointment");
                formAppointment.submit();
              } else {
                  console.log('Không tìm thấy lộ trình hoặc dữ liệu không hợp lệ.');
              }
          })
          .catch(error => console.error('Error:', error));
        }
        console.log("----------")
        console.log(distanceAutoCustomer)
       
        // const formAppointment = document.querySelector(".form_appointment");
        // formAppointment.submit();
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





const marquee = document.querySelector('.marquee');
let index = 0;

function scrollText() {
  const lines = marquee.querySelectorAll('p');
  lines.forEach((line, i) => {
    line.style.display = i === index ? 'block' : 'none';
  });
  index = (index + 1) % lines.length;
}

setInterval(scrollText, 5000); 

console.log("Neronmen")
function initializeSlider() {
  const slide = document.querySelector('.review-slide');
  const groups = document.querySelectorAll('.review-group');
  if(slide && groups){
      let currentIndex = 0;
      function nextSlide() {
        currentIndex = (currentIndex + 1) % groups.length;
        slide.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  
    setInterval(nextSlide,4000);
  
  }
}

document.addEventListener('DOMContentLoaded', initializeSlider);









// Tư vấn AI

document.addEventListener('DOMContentLoaded', function() {
  const chatButton = document.getElementById('ai-chat-button');
  const chatbox = document.getElementById('ai-chatbox');
  const closeChat = document.getElementById('close-chat');
  const sendMessage = document.getElementById('send-message');
  const messageInput = document.querySelector('.ai-chatbox-input input');
  const messagesContainer = document.querySelector('.ai-chatbox-messages');

  chatButton.addEventListener('click', function() {
    const messageElement = document.createElement('div');
    messageElement.setAttribute('data-sender', 'AI');
    messageElement.textContent = 'Xin chào, tôi là trợ lý AI của Healthy Koi. Tôi có thể giúp gì cho bạn hôm nay?';
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    chatbox.style.display = 'block';
  });

  closeChat.addEventListener('click', function() {
    chatbox.style.display = 'none';
  });

  sendMessage.addEventListener('click', sendMessageToAI);
  messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessageToAI();
    }
  });

  const koiCareQA = {
    // Chào hỏi và thông tin cơ bản
    "xin chào": "Healthy Koi xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
    "bạn là ai": "Tôi là trợ lý AI của Healthy Koi, được tạo ra để hỗ trợ khách hàng với các câu hỏi về chăm sóc cá Koi.",
    "địa chỉ của trung tâm": "Healthy Koi tọa lạc tại Vinhome GrandPark Quận 9, Thành Phố Thủ Đức",
    "số điện thoại liên hệ": "Bạn có thể liên hệ với chúng tôi qua số điện thoại: 0382417490",
    "giờ làm việc": "Chúng tôi mở cửa từ  07:00 - 17:00 Từ T2 đến T6. Chúng tôi nghỉ vào Chủ Nhật và các ngày lễ.",
  
    // Thông tin chung về cá Koi
    "cá koi là gì": "Cá Koi là một loài cá chép được lai tạo, nổi tiếng với màu sắc đẹp và giá trị văn hóa cao, đặc biệt ở Nhật Bản.",
    "tuổi thọ của cá koi": "Cá Koi có thể sống rất lâu, thường từ 25-35 năm, nhưng có những con đã sống hơn 200 năm.",
    "kích thước trung bình của cá koi": "Cá Koi trưởng thành thường có kích thước từ 60-90 cm, nhưng có thể lớn hơn trong điều kiện tốt.",
  
    // // Chăm sóc và nuôi dưỡng
    // "làm thế nào để cho cá koi ăn": "Cho cá Koi ăn 2-4 lần mỗi ngày, với lượng thức ăn vừa đủ để cá có thể ăn hết trong vòng 5 phút.",
    // "thức ăn tốt nhất cho cá koi": "Thức ăn tốt nhất cho cá Koi là thức ăn cân bằng dinh dưỡng dành riêng cho cá Koi, bao gồm protein, chất béo, vitamin và khoáng chất.",
    // "nhiệt độ nước lý tưởng cho cá koi": "Nhiệt độ nước lý tưởng cho cá Koi là từ 15°C đến 25°C.",
    // "làm sạch hồ cá koi như thế nào": "Làm sạch hồ cá Koi bằng cách thay 10-15% nước mỗi tuần, loại bỏ cặn bẩn và kiểm tra bộ lọc thường xuyên.",
    // "tần suất thay nước cho hồ cá koi": "Nên thay 10-15% nước hồ cá Koi mỗi tuần để duy trì chất lượng nước tốt.",
    // "dấu hiệu cá koi khỏe mạnh": "Cá Koi khỏe mạnh có màu sắc tươi sáng, bơi lội linh hoạt, ăn uống tốt và không có dấu hiệu bệnh tật trên cơ thể.",
  
    // // Bệnh lý và điều trị
    // "các bệnh phổ biến ở cá koi": "Các bệnh phổ biến ở cá Koi bao gồm bệnh nấm, ký sinh trùng, và các bệnh do vi khuẩn gây ra.",
    // "cách phòng bệnh cho cá koi": "Phòng bệnh cho cá Koi bằng cách duy trì chất lượng nước tốt, cho ăn đúng cách, và kiểm tra sức khỏe cá thường xuyên.",
    // "dấu hiệu cá koi bị bệnh": "Dấu hiệu cá Koi bị bệnh bao gồm ăn ít, bơi lội bất thường, màu sắc nhợt nhạt, hoặc có các vết thương trên cơ thể.",
  
    // // Thiết kế và bảo trì hồ cá
    // "kích thước hồ cá koi lý tưởng": "Kích thước hồ cá Koi lý tưởng phụ thuộc vào số lượng cá, nhưng thông thường nên có ít nhất 1000 lít nước cho mỗi con cá trưởng thành.",
    // "hệ thống lọc nước cho hồ cá koi": "Hệ thống lọc nước cho hồ cá Koi nên bao gồm lọc cơ học, lọc sinh học và UV sterilizer để đảm bảo nước sạch và an toàn cho cá.",
    // "cách tạo môi trường tự nhiên trong hồ cá koi": "Tạo môi trường tự nhiên trong hồ cá Koi bằng cách thêm thực vật thủy sinh, đá tự nhiên và tạo các khu vực nước nông và sâu.",
  
    // // Các vấn đề khác
    // "cách phân biệt cá koi đực và cái": "Phân biệt cá Koi đực và cái dựa trên hình dáng cơ thể, kích thước vây ngực và hành vi trong mùa sinh sản.",
    // "thời gian sinh sản của cá koi": "Cá Koi thường sinh sản vào mùa xuân khi nhiệt độ nước tăng lên khoảng 18°C.",
    // "cách vận chuyển cá koi an toàn": "Vận chuyển cá Koi an toàn bằng cách sử dụng túi chuyên dụng có oxy, giữ nhiệt độ ổn định và hạn chế thời gian vận chuyển.",
  
    // Câu hỏi về dịch vụ
    "các dịch vụ chăm sóc cá koi": `Tại Healthy Koi, chúng tôi tự hào cung cấp một loạt các dịch vụ \
chăm sóc cá Koi chuyên nghiệp và toàn diện, bao gồm: \n
1. Tư vấn Online: Giải đáp mọi thắc mắc về chăm sóc cá Koi từ xa. \n
2. Khám bệnh cho cá: Dịch vụ khám, chẩn đoán và điều trị bệnh tận nơi. \n
3. Cải thiện môi trường hồ: Tối ưu hóa chất lượng nước và môi trường sống.`,
    "chi phí dịch vụ": "Chi phí các dịch vụ chăm sóc cá Koi của chúng tôi thay đổi tùy theo loại dịch vụ. Vui lòng liên hệ trực tiếp để được báo giá cụ thể.",
    "đặt lịch hẹn": "Để đặt lịch hẹn, bạn có thể sử dụng form đặt lịch trên website của chúng tôi.",
  
    "default": "Xin lỗi, tôi không có thông tin về câu hỏi này. Bạn có thể hỏi về cách chăm sóc cá Koi, bệnh lý, hoặc các dịch vụ của chúng tôi không?"
  };
  const keywords = {
    "dịch vụ": ["dịch vụ", "chăm sóc", "hỗ trợ"],
    "chi phí": ["chi phí", "giá", "phí"],
    "đặt lịch": ["đặt lịch", "hẹn", "lịch hẹn"],
    "xin chào": ["chào", "hello", "hi", "xin chào"],
    "bạn là ai": ["bạn là ai", "ai vậy", "giới thiệu"],
    "địa chỉ": ["địa chỉ", "ở đâu", "chỗ nào", "tọa lạc"],
    "số điện thoại": ["số điện thoại", "liên hệ", "gọi"],
    "giờ làm việc": ["giờ làm việc", "mở cửa", "đóng cửa"],
    // "cá koi": ["cá koi", "koi", "cá chép"],
    // "tuổi thọ": ["tuổi thọ", "sống bao lâu", "thọ"],
    // "kích thước": ["kích thước", "to", "lớn"],
    // "cho ăn": ["cho ăn", "thức ăn", "ăn uống", "dinh dưỡng"],
    // "nhiệt độ": ["nhiệt độ", "nóng lạnh", "ấm"],
    // "làm sạch": ["làm sạch", "vệ sinh", "dọn dẹp", "thay nước"],
    // "dấu hiệu khỏe mạnh": ["dấu hiệu khỏe mạnh", "khỏe", "sức khỏe"],
    // "bệnh": ["bệnh", "ốm", "không khỏe", "bệnh tật"],
    // "phòng bệnh": ["phòng bệnh", "ngừa bệnh", "bảo vệ"],
    // "hồ cá": ["hồ cá", "bể cá", "ao"],
    // "lọc nước": ["lọc nước", "hệ thống lọc", "làm sạch nước"],
    // "môi trường tự nhiên": ["môi trường tự nhiên", "tự nhiên", "sinh thái"],
    // "phân biệt đực cái": ["phân biệt đực cái", "giới tính", "đực cái"],
    // "sinh sản": ["sinh sản", "đẻ trứng", "mùa sinh sản"],
    // "vận chuyển": ["vận chuyển", "di chuyển", "đưa đi"],

  };
  function getAIResponse(userMessage) {
    const lowerCaseMessage = userMessage.toLowerCase();
    console.log(lowerCaseMessage)
    let matchedAnswers = [];
   for (const [key, keywordList] of Object.entries(keywords)) {
    if (keywordList.some(keyword => lowerCaseMessage.includes(keyword.toLowerCase()))) {
        console.log(key)
      for (const [question, answer] of Object.entries(koiCareQA)) {
        if (question.includes(key)) {
          console.log(answer)
          matchedAnswers.push(answer);
        }
      }
    }
  }
    
  if (matchedAnswers.length > 1) {
    return matchedAnswers.reduce((best, current) => 
      Math.abs(current.length - lowerCaseMessage.length) > Math.abs(best.length - lowerCaseMessage.length) ? current : best
    );

  } else if (matchedAnswers.length === 1) {
    return matchedAnswers[0];
  }

    return getGeneralAIResponse(userMessage);
  }



  async function getGeneralAIResponse(message) {
    try {
      const response = await fetch('http://localhost:7777/koi/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message })
      });
      console.log(response)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau hoặc liên hệ trực tiếp với trung tâm để được hỗ trợ.";
    }
  }
  

  async function sendMessageToAI() {
    const message = messageInput.value.trim();
    if (message) {
      addMessageToChat('Bạn', message);
      messageInput.value = '';
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'typing-indicator';
      typingIndicator.textContent = 'AI đang trả lời...';
      messagesContainer.appendChild(typingIndicator);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      try {
        const aiResponse = await getAIResponse(message);
        messagesContainer.removeChild(typingIndicator);
        addMessageToChat('AI', aiResponse);
      } catch (error) {
        messagesContainer.removeChild(typingIndicator);
        addMessageToChat('AI', 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
    }
  }

  function addMessageToChat(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.setAttribute('data-sender', sender);
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
});



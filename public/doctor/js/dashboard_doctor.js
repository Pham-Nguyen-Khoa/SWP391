const ctx2 = document.getElementById("chartContainer2").getContext("2d");
if (ctx2) {
  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: ["5 sao", "4 sao", "3 sao", "2 sao", "1 sao"],
      datasets: [
        {
          label: "Phân bố đánh giá",
          data: [star.star5, star.star4, star.star3, star.star2, star.star1], // Replace with actual data
          backgroundColor: [
            "rgba(0, 200, 0, 0.8)", // 5 stars - Green
            "rgba(100, 200, 0, 0.8)", // 4 stars - Light green
            "rgba(200, 200, 0, 0.8)", // 3 stars - Yellow
            "rgba(255, 150, 0, 0.8)", // 2 stars - Orange
            "rgba(255, 50, 0, 0.8)", // 1 star - Red
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Số lượng đánh giá",
            font: {
              size: 14,
            },
          },
          ticks: {
            font: {
              size: 12,
            },
          },
        },
        x: {
          title: {
            display: true,
            text: "Số sao",
            font: {
              size: 14,
            },
          },
          ticks: {
            font: {
              size: 12,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Thống kê Feedback khách hàng",
          font: {
            size: 18,
          },
        },
      },
    },
  });
}
const modalFeedBack = document.getElementById("openFeedbackModal");
if (modalFeedBack) {
  modalFeedBack.addEventListener("click", function () {
    $("#feedbackModal").modal("show");
  });
}
const monthArray = [];
for (let i = 1; i <= 12; i++) {
  monthArray.push(i.toString()); // Chuyển số thành chuỗi và thêm vào mảng
}

let appointmentLineChart;
let appointmentLineChartCtx = document
  .getElementById("appointmentLineChart")
  .getContext("2d");
const filterByMonth = document.getElementById("filterByMonth");

if (filterByMonth) {
  filterByMonth.addEventListener("click", function () {
    filterByMonth.classList.add("active");
    filterByDay.classList.remove("active");
    filterByYear.classList.remove("active");
    appointmentLineChart.destroy();
    updateChart(monthArray, appointmentDataMonthCount);
  });
}
window.onload = updateChart(monthArray, appointmentDataMonthCount);
function updateChart(type, data) {
  appointmentLineChart = new Chart(appointmentLineChartCtx, {
    type: "line", // Định dạng biểu đồ là đường
    data: {
      labels: type, // Nhãn cho trục x
      datasets: [
        {
          label: "Số lượng lịch hẹn", // Nhãn cho tập dữ liệu
          data: data, // Sử dụng dữ liệu được truyền vào
          borderColor: "rgba(75, 192, 192, 1)", // Màu đường
          backgroundColor: "rgba(75, 192, 192, 0.2)", // Màu nền
          fill: true, // Điền màu dưới đường
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Thêm dòng này để cho phép điều chỉnh kích thước
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Số lượng",
          },
        },
        x: {
          title: {
            display: true,
            text: "Tháng",
          },
        },
      },
      plugins: {
        legend: {
          display: true,
        },
        title: {
          display: true,
          text: "Biểu đồ lịch hẹn theo thời gian",
        },
      },
    },
  });
  appointmentLineChart.update();
}

const filterByDay = document.getElementById("filterByDay");
if (filterByDay) {
  let dayArray = [];
  for (let i = 1; i <= 31; i++) {
    dayArray.push(i.toString());
  }

  let appointmentDataDayCount = new Array(31).fill(0);
  appointmentData.forEach((appointment) => {
    const date = new Date(appointment.Date);
    const day = date.getDate() - 1;

    if (day >= 0 && day < 31) {
      appointmentDataDayCount[day] += 1;
    }
  });
  console.log(appointmentDataDayCount);

  filterByDay.addEventListener("click", function () {
    filterByDay.classList.add("active");
    filterByMonth.classList.remove("active");
    filterByYear.classList.remove("active");
    appointmentLineChart.destroy();
    updateChart(dayArray, appointmentDataDayCount);
    appointmentLineChart.update();
  });
}

const filterByYear = document.getElementById("filterByYear");
if (filterByYear) {
  let yearArray = [];
  const yearCurrent = new Date().getFullYear();
  console.log(yearCurrent);
  for (let i = 5; i >= 0; i--) {
    yearArray.push(yearCurrent - i);
  }
  console.log(yearArray);
  let appointmentDataYearCount = new Array(6).fill(0);
  appointmentData.forEach((appointment, index) => {
    const date = new Date(appointment.Date);
    const year = date.getFullYear();
    const yearIndex = yearCurrent - year + 5;
    if (year >= yearCurrent - 5 && year <= yearCurrent) {
      appointmentDataYearCount[yearIndex] += 1;
    }
  });
  console.log(appointmentDataYearCount);
  filterByYear.addEventListener("click", function () {
    filterByYear.classList.add("active");
    filterByMonth.classList.remove("active");
    filterByDay.classList.remove("active");
    appointmentLineChart.destroy();
    updateChart(yearArray, appointmentDataYearCount);
    appointmentLineChart.update();
  });
}

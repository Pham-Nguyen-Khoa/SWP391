// fetch("/admin/dashboard/testAPI")
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data);
//     const { servicesByDay, servicesByMonth, totalByDay, totalByMonth } = data;

    let chart;
    const currentMonthValue = new Date().getMonth() + 1;

    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];
    
    const days = Array.from({ length: 31 }, (_, i) => `Ngày ${i + 1}`);

    // Cấu hình biểu đồ ban đầu theo tháng
    const info = {
      labels: months,
      datasets: [
        {
          label: "Tổng doanh thu",
          data: data.totalByMonth.totalAmount,
          borderColor: "#FF0000",
          backgroundColor: "rgba(255, 0, 0, 0.5)",
        },
      ],
    };

    const config = {
      type: "line",
      data: info,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Bảng thống kê doanh thu",
          },
        },
      },
    };

    const canvas = document.getElementById("test");
    if (canvas.chart) {
      canvas.chart.destroy();
    }
    chart = new Chart(canvas, config);

    function updateChart() {
      const time = document.querySelector('input[name="time"]:checked').value;
      const unit = document.querySelector('input[name="unit"]:checked').value;
      const kind = document.querySelector('input[name="kind"]:checked').value;

      console.log(time, unit, kind);

      if (chart) {
        // Case 1: Month, Amount, Total
        if (time === "month" && unit === "amount" && kind === "total") {
          chart.config.data = {
            labels: months,
            datasets: [{
              label: "Tổng doanh thu",
              data: data.totalByMonth.totalAmount,
              borderColor: "#FF0000",
              backgroundColor: "rgba(255, 0, 0, 0.5)",
            }],
          };
        }
        
        // Case 2: Month, Amount, Separate
        else if (time === "month" && unit === "amount" && kind === "separate") {
          chart.config.data = {
            labels: months,
            datasets: [
              {
                label: "Khám sức khỏe",
                data: data.servicesByMonth["DV0001"].totalAmount,
                borderColor: "#FF0000",
                backgroundColor: "rgba(255, 0, 0, 0.5)",
              },
              {
                label: "Cải thiện hồ cá",
                data: data.servicesByMonth["DV0002"].totalAmount,
                borderColor: "#0000FF",
                backgroundColor: "rgba(0, 0, 255, 0.5)",
              },
              {
                label: "Tư vấn online",
                data: data.servicesByMonth["DV0003"].totalAmount,
                borderColor: "#00FF00",
                backgroundColor: "rgba(0, 255, 0, 0.5)",
              },
            ],
          };
        }
        
        // Case 3: Month, Orders, Total
        else if (time === "month" && unit === "orders" && kind === "total") {
          chart.config.data = {
            labels: months,
            datasets: [{
              label: "Tổng số đơn hàng",
              data: data.totalByMonth.totalOrders,
              borderColor: "#FF0000",
              backgroundColor: "rgba(255, 0, 0, 0.5)",
            }],
          };
        }
        
        // Case 4: Month, Orders, Separate
        else if (time === "month" && unit === "orders" && kind === "separate") {
          chart.config.data = {
            labels: months,
            datasets: [
              {
                label: "Khám sức khỏe",
                data: data.servicesByMonth["DV0001"].totalOrders,
                borderColor: "#FF0000",
                backgroundColor: "rgba(255, 0, 0, 0.5)",
              },
              {
                label: "Cải thiện hồ cá",
                data: data.servicesByMonth["DV0002"].totalOrders,
                borderColor: "#0000FF",
                backgroundColor: "rgba(0, 0, 255, 0.5)",
              },
              {
                label: "Tư vấn online",
                data: data.servicesByMonth["DV0003"].totalOrders,
                borderColor: "#00FF00",
                backgroundColor: "rgba(0, 255, 0, 0.5)",
              },
            ],
          };
        }
        
        // Case 5: Day, Amount, Total
        else if (time === "day" && unit === "amount" && kind === "total") {
          chart.config.data = {
            labels: days,
            datasets: [{
              label: "Tổng doanh thu hàng ngày",
              data: data.totalByDay.totalAmount,
              borderColor: "#FF0000",
              backgroundColor: "rgba(255, 0, 0, 0.5)",
            }],
          };
        }
        
        // Case 6: Day, Amount, Separate
        else if (time === "day" && unit === "amount" && kind === "separate") {
          chart.config.data = {
            labels: days,
            datasets: [
              {
                label: "Khám sức khỏe",
                data: data.servicesByDay["DV0001"].totalAmount,
                borderColor: "#FF0000",
                backgroundColor: "rgba(255, 0, 0, 0.5)",
              },
              {
                label: "Cải thiện hồ cá",
                data: data.servicesByDay["DV0002"].totalAmount,
                borderColor: "#0000FF",
                backgroundColor: "rgba(0, 0, 255, 0.5)",
              },
              {
                label: "Tư vấn online",
                data: data.servicesByDay["DV0003"].totalAmount,
                borderColor: "#00FF00",
                backgroundColor: "rgba(0, 255, 0, 0.5)",
              },
            ],
          };
        }
        
        // Case 7: Day, Orders, Total
        else if (time === "day" && unit === "orders" && kind === "total") {
          chart.config.data = {
            labels: days,
            datasets: [{
              label: "Tổng số đơn hàng hàng ngày",
              data: data.totalByDay.totalOrders,
              borderColor: "#FF0000",
              backgroundColor: "rgba(255, 0, 0, 0.5)",
            }],
          };
        }
        
        // Case 8: Day, Orders, Separate
        else if (time === "day" && unit === "orders" && kind === "separate") {
          chart.config.data = {
            labels: days,
            datasets: [
              {
                label: "Khám sức khỏe",
                data: data.servicesByDay["DV0001"].totalOrders,
                borderColor: "#FF0000",
                backgroundColor: "rgba(255, 0, 0, 0.5)",
              },
              {
                label: "Cải thiện hồ cá",
                data: data.servicesByDay["DV0002"].totalOrders,
                borderColor: "#0000FF",
                backgroundColor: "rgba(0, 0, 255, 0.5)",
              },
              {
                label: "Tư vấn online",
                data: data.servicesByDay["DV0003"].totalOrders,
                borderColor: "#00FF00",
                backgroundColor: "rgba(0, 255, 0, 0.5)",
              },
            ],
          };
        }

        chart.options.plugins.title.text = `Bảng thống kê ${unit === 'amount' ? 'doanh thu' : 'đơn hàng'} ${kind === 'total' ? 'tổng' : 'theo dịch vụ'} ${time === 'month' ? 'theo tháng' : 'theo ngày'}`;
        chart.update();
      } else {
        console.error("Chart is not initialized yet.");
      }
    }

    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.addEventListener("change", updateChart);
    });
  // })
  // .catch((error) => console.error("Error fetching data:", error));

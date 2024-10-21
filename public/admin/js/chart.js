fetch("/admin/dashboard/testAPI")
  .then(response => response.json())
  .then(data => {
    console.log(data);
    const { servicesByDay, servicesByMonth, totalByDay, totalByMonth } = data;

    let chart;
    const currentMonthValue = new Date().getMonth() + 1;

    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5',
      'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9',
      'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    const days = Array.from({ length: 31 }, (_, i) => `Ngày ${i + 1}`);

    // Cấu hình biểu đồ ban đầu theo tháng
    const info = {
      labels: months,
      datasets: [
        {
          label: 'Khám sức khỏe',
          data: servicesByMonth['DV0001']?.totalAmount , // Chọn doanh thu
          borderColor: '#FF0000',
          backgroundColor: 'rgba(255, 0, 0, 0.5)',
          },
        {
          label: 'Cải thiện hồ cá',
          data: servicesByMonth['DV0002']?.totalAmount, // Chọn doanh thu
          borderColor: '#0000FF',
          backgroundColor: 'rgba(0, 0, 255, 0.5)',
        },
        {
          label: 'Tư vấn online',
          data: servicesByMonth['DV0003']?.totalAmount , // Chọn doanh thu
          borderColor: '#00FF00',
          backgroundColor: 'rgba(0, 255, 0, 0.5)',
        },
      ]
    };
    

    const config = {
      type: 'line',
      data: info,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Bảng thống kê doanh thu từng dịch vụ'
          }
        },
      },
    };

    const canvas = document.getElementById('test');
    if (canvas.chart) {
      canvas.chart.destroy();
    }
    chart = new Chart(canvas, config);

    // Hàm cập nhật biểu đồ theo ngày
    function updateFinanceDate() {
      if (chart) {
        chart.config.data = {
          labels: days.slice(0, totalByDay.length), // Chỉ lấy ngày có dữ liệu
          datasets: [
            {
              label: 'Khám sức khỏe',
              data: servicesByDay['DV0001']?.totalAmount , // Chọn doanh thu theo ngày
              borderColor: '#FF0000',
              backgroundColor: 'rgba(255, 0, 0, 0.5)',
            },
            {
              label: 'Cải thiện hồ cá',
              data: servicesByDay['DV0002']?.totalAmount , // Chọn doanh thu theo ngày
              borderColor: '#0000FF',
              backgroundColor: 'rgba(0, 0, 255, 0.5)',
            },
            {
              label: 'Tư vấn online',
              data: servicesByDay['DV0003']?.totalAmount , // Chọn doanh thu theo ngày
              borderColor: '#00FF00',
              backgroundColor: 'rgba(0, 255, 0, 0.5)',
            }
          ]
        };
        chart.options.plugins.title.text = `Bảng thống kê doanh thu của dịch vụ tháng ${currentMonthValue}`;
        chart.update();
      } else {
        console.error("Chart is not initialized yet.");
      }
    }
    

    // Hàm cập nhật biểu đồ theo tháng
    function updateFinanceMonth() {
      if (chart) {
        chart.config.data = info;
        chart.update();
      } else {
        console.error("Chart is not initialized yet.");
      }
    }

    // Gán sự kiện cho các nút
    document.getElementById('date').addEventListener('click', updateFinanceDate);
    document.getElementById('month').addEventListener('click', updateFinanceMonth);

  })
  .catch(error => console.error('Error fetching data:', error));

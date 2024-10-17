
fetch("/admin/dashboard/testAPI")
.then(response => response.json())
.then(data => {
  console.log(data)
  const {day1, day2, day3, month1, month2, month3} = data;

let chart;
const months = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 
  'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 
  'Tháng 10', 'Tháng 11', 'Tháng 12'
];
const days = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'
];

const info = {
  labels: months,
  datasets: [
    {
      label: 'Khám sức khỏe',
      data: month1,
      borderColor: '#FF0000', 
      backgroundColor: 'rgba(255, 0, 0, 0.5)', 
    },
    {
      label: 'Cải thiện hồ cá',
      data: month2,
      borderColor: '#0000FF', 
      backgroundColor: 'rgba(0, 0, 255, 0.5)', 
    },
    {
      label: 'Tư vấn online',
      data: month3,
      borderColor: '#00FF00',
      backgroundColor: 'rgba(0, 255, 0, 0.5)', 
    }
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
        text: 'Bảng thống kê doanh thu từng dịch vụ '
      }
    }
  },
};

  const canvas = document.getElementById('test')
  if(canvas.chart){
    canvas.chart.destroy();
  }
  chart = new Chart(
    document.getElementById('test'),config
  );

function updateFinanceDate() {
  if (chart) {
    chart.config.data = {
        labels: days,
        datasets: [
          {
            label: 'Khám sức khỏe',
            data: day1,
            borderColor: '#FF0000', 
            backgroundColor: 'rgba(255, 0, 0, 0.5)', 
          },
          {
            label: 'Cải thiện hồ cá',
            data: day2,
            borderColor: '#0000FF', 
            backgroundColor: 'rgba(0, 0, 255, 0.5)', 
          },
          {
            label: 'Tư vấn online',
            data: day3,
            borderColor: '#00FF00',
            backgroundColor: 'rgba(0, 255, 0, 0.5)', 
          }
        ]
    }
    chart.update();
  } else {
    console.error("Chart is not initialized yet.");
  }
}

function updateFinanceMonth() {
  if (chart) {
    chart.config.data = {
        labels: months,
        datasets: [
          {
            label: 'Khám sức khỏe',
            data: month1,
            borderColor: '#FF0000', 
            backgroundColor: 'rgba(255, 0, 0, 0.5)', 
          },
          {
            label: 'Cải thiện hồ cá',
            data: month2,
            borderColor: '#0000FF', 
            backgroundColor: 'rgba(0, 0, 255, 0.5)', 
          },
          {
            label: 'Tư vấn online',
            data: month3,
            borderColor: '#00FF00',
            backgroundColor: 'rgba(0, 255, 0, 0.5)', 
          }
        ]
    }
    chart.update();
  } else {
    console.error("Chart is not initialized yet.");
  }
}

  // document.getElementById('finance').addEventListener('click');
  // document.getElementById('rating').addEventListener('click');
  document.getElementById('date').addEventListener('click', updateFinanceDate);
  document.getElementById('month').addEventListener('click',updateFinanceMonth);

})

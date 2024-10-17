
fetch("/admin/dashboard/testAPI")
.then(response => response.json())
.then(data => {
  console.log(data)
  const {month1, month2, month3} = data;


const months = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 
  'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 
  'Tháng 10', 'Tháng 11', 'Tháng 12'
];

const labels = months;
const info = {
  labels: labels,
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
  const char = new Chart(
    document.getElementById('test'),config
  );


 
})

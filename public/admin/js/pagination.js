

document.getElementById('reset-filter').addEventListener('click', function() {
    //- document.getElementById('date-filter').value = '';
    //- document.getElementById('search-filter').value = '';
    //- document.getElementById('star-filter').value = '';
    window.location.href = '/admin/feedback';
});
const buttonPagination = document.querySelectorAll('.btn-secondary');
buttonPagination.forEach(button => {
    button.addEventListener('click', function() {
        const url = new URL(window.location.href);
        let currentPage = url.searchParams.get('page') || 1;
        if(this.id === 'prev-page'){
            url.searchParams.set('page', parseInt(currentPage) - 1);
        }
        else if(this.id === 'next-page'){
            url.searchParams.set('page', parseInt(currentPage) + 1);
        }
        else{
            url.searchParams.set('page', button.textContent);
        }
        window.location.href = url.toString();
    });
});


let chartExisted;

 const currentPage = new URL(window.location.href).searchParams.get('page') || 1;
 const pagination = document.querySelector('.pagination');
const btnPages = pagination.querySelectorAll('.btnPage');
const currentPageButton = btnPages[currentPage - 1]; 
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
if (currentPageButton) {
    currentPageButton.classList.add('btn-primary');
    currentPageButton.classList.remove('btn-secondary');
    if(currentPage === '1'){
        if(prevPageButton){
            prevPageButton.style.display = 'none'; 
        }
    }
    console.log(currentPage);
    if(parseInt(currentPage) === totalPages){
        if(nextPageButton){
            nextPageButton.style.display = 'none'; 
        }
    }
}
    const spinnerContainer = document.querySelector('.spinner-container');

       document.getElementById('analyzeBtn').addEventListener('click', function() {
    const modal = document.getElementById('analyzeModal');
    const overlay = document.getElementById('overlay');
    modal.style.display = "block";
     overlay.style.display = "block";
        if (chartExisted) {
        chartExisted.destroy();
    }
    

    document.getElementById('chartContainer').innerHTML = '';
    setTimeout(() => {
        fetch('/admin/feedback/analyze')
        .then(response => response.json())
        .then(data => {
            spinnerContainer.style.display = 'none';
            console.log(data);
        document.getElementById('analysisContent').innerHTML = `
               <p><i class="fas fa-star"></i> <strong>Số sao trung bình: ${data.averageStar}</strong></p>
                <p><i class="fas fa-comments"></i> <strong 60px;>Tổng số feedback: ${data.countFeedback}</strong></p>
                <p><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i> <b> ${data.star5Count}</b></p>
                <p><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i> <b> ${data.star4Count}</b></p>
                <p><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i> <b> ${data.star3Count}</b></p>
                <p><i class="fas fa-star"></i><i class="fas fa-star"></i> <b> ${data.star2Count}</b></p>
                <p><i class="fas fa-star"></i> <b> ${data.star1Count}</b></p>
            `;



            const ctx = document.createElement('canvas');
            document.getElementById('chartContainer').appendChild(ctx);
          chartExisted =  new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['5 sao', '4 sao', '3 sao', '2 sao', '1 sao'],
            datasets: [{
                label: 'Phân bố Feedback',
                data: [data.star5Count, data.star4Count, data.star3Count, data.star2Count, data.star1Count],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
        })
    .catch(error => {
        console.error('Error:', error);
    });
    }, 1000);
});

document.querySelector('.close').addEventListener('click', function() {
    closeModal();
});

window.addEventListener('click', function(event) {
    const modal = document.getElementById('analyzeModal');
    const overlay = document.getElementById('overlay');
    if (event.target === modal || event.target === overlay) {
        closeModal();
    }
});


function closeModal() {
    const modal = document.getElementById('analyzeModal');
    const overlay = document.getElementById('overlay');
    modal.style.display = "none";
    overlay.style.display = "none";
    document.body.classList.remove('modal-open');
}

const formFeedback = document.getElementById("feedbackForm");
var starSelect = document.getElementById("starSelect");
const btnSuccessFeedback =  document.getElementById('btn-success-feedback');
if(btnSuccessFeedback){
    document.getElementById('btn-success-feedback').addEventListener('click', (e) => {
    e.preventDefault();
    if(!starSelect.value){
            alert('Vui lòng chọn số sao đánh giá');
    }else{
        alert('Cảm ơn bạn đã gửi đánh giá!');
    $('#feedbackModal').modal('hide');
    formFeedback.submit();
    }
    
});
}

const btnUpdateFeedBack = document.getElementById("btn-update-feedback");
if(btnUpdateFeedBack){
    
    btnUpdateFeedBack.addEventListener('click', (e) => {
        e.preventDefault();
        const starRating = document.querySelector(".star-rating");
        const countStarUpdate = starRating.querySelectorAll(".active").length;
        starSelect.value = countStarUpdate;
        alert('Cảm ơn bạn đã cập nhật đánh giá!');
        $('#feedbackModal').modal('hide');
        formFeedback.submit();
    })
}


const stars = document.querySelectorAll('.star');
if(stars){    
        const starSelect = document.getElementById('starSelect');
stars.forEach(star => {
star.addEventListener('click', () => {
        const rating = star.getAttribute('data-value');
        starSelect.value = rating;
        stars.forEach(s => {
            s.classList.remove('selected');
        });

        star.classList.add('selected');
        highlightStars(rating);
});

star.addEventListener('mouseover', () => {
        const rating = star.getAttribute('data-value');
        highlightStars(rating);
});

star.addEventListener('mouseout', () => {
        highlightStars(selectedRating);
});
});
}

if(feedBack && feedBack.Content != null){
    const starOld=feedBack.Star;

    highlightStars(starOld);
    
    
}



function highlightStars(rating) {
    stars.forEach(star => {
        if (star.getAttribute('data-value') <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

document.getElementById('feedbackBtn').addEventListener('click', function() {
    $('#feedbackModal').modal('show');
});
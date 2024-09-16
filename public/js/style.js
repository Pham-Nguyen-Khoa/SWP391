
console.log("ok")

// Show Alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert){
  const time = showAlert.getAttribute("data-time");
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }
  ,time)


  const closeAlert = document.querySelector("[close-alert]");
  closeAlert.addEventListener("click",() =>{
    showAlert.classList.add("alert-hidden");
  })
}
// End Show Alert 



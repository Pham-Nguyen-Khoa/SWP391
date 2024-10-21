
  const buttonPagination = document.querySelectorAll(".btn-secondary");
  buttonPagination.forEach((button) => {
    button.addEventListener("click", function () {
      const url = new URL(window.location.href);
      let currentPage = url.searchParams.get("page") || 1;
      if (this.id === "prev-page") {
        url.searchParams.set("page", parseInt(currentPage) - 1);
      } else if (this.id === "next-page") {
        url.searchParams.set("page", parseInt(currentPage) + 1);
      } else {
        url.searchParams.set("page", button.textContent);
      }
      window.location.href = url.toString();
    });
  });

  let chartExisted;

  const currentPage =
    new URL(window.location.href).searchParams.get("page") || 1;
  const pagination = document.querySelector(".pagination");
  const btnPages = pagination.querySelectorAll(".btnPage");
  const currentPageButton = btnPages[currentPage - 1];
  const prevPageButton = document.getElementById("prev-page");
  const nextPageButton = document.getElementById("next-page");
  if (currentPageButton) {
    currentPageButton.classList.add("btn-primary");
    currentPageButton.classList.remove("btn-secondary");
    if (currentPage === "1") {
      if (prevPageButton) {
        prevPageButton.style.display = "none";
      }
    }
    console.log(currentPage);
    if (parseInt(currentPage) === totalPages) {
      if (nextPageButton) {
        nextPageButton.style.display = "none";
      }
    }
  }


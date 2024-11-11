document.addEventListener('DOMContentLoaded', function () {
    const allButton = document.querySelectorAll('.searchBtn')
    const searchBar = document.querySelector('.searchBar')
    const searchInput = document.getElementById('searchInput')
    const searchhClose = document.getElementById('searchClose')

    for (var i = 0; i < allButton.length; i++) {
        allButton[i].addEventListener('click', function () {
            searchBar.style.visibility = 'visible';
            searchBar.classList.add('open')
            this.setAttribute('aria-expanded', "true")
            searchInput.focus();

        })
    }

    searchClose.addEventListener('click', function () {
        searchBar.style.visibility = 'hidden'
        searchBar.classList.remove('open');
        this.setAttribute('aria-expanded', false);

    })

})



const scrollProgress = document.getElementById("scroll-progress");
const height =
    document.documentElement.scrollHeight - document.documentElement.clientHeight;





window.addEventListener("scroll", () => {
    const scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;
    scrollProgress.style.width = `${(scrollTop / height) * 100}%`;
});
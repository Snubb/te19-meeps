function search() {
    const keyword = document.getElementById('searchKeyword').value;
    const url = "/meeps?keyword=" + keyword;
    window.location.replace(url)
}

window.addEventListener('load', () => {
    console.log('Loaded window')
});
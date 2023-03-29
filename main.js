const apiKey = "eDBhfPWIwB0bvgloNU0KrGISblfj3RmsXi0StEUpVlWmniWhkdvmtMOW";
const perPage = 15;
let currentPage = 1;
let searchTemp = null;

const imageWrapper = document.querySelector('.images');
const loadMoreBtn= document.querySelector(".load-more");
const searchBtn = document.querySelector(".search input");
const lightBox = document.querySelector(".light-box");
const closeBtn = lightBox.querySelector(".fa-times");
const downloadBtn = lightBox.querySelector(".fa-download");
console.log(closeBtn);



const downloadIMG = (imgURL) => {
    fetch(imgURL)
    .then(response => response.blob())
    .then(file => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file)
        a.download = new Date().getTime();
        a.click();
    })
}


const showLightBox = (author, picture) => {
    lightBox.querySelector("img").src = picture;
    lightBox.querySelector("span").innerText = author;
    downloadBtn.setAttribute("data-img", picture);
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";

}

const generateHTML = (images) => {
     imageWrapper.innerHTML += images
       .map(
         (img) =>
           `
         <li class="card" onclick="showLightBox('${img.photographer}','${img.src.large2x}')">
                <img src="${img.src.large2x}" alt="">
                <div class="details">
                    <div class="photographer">
                        <i class="fa-sharp fa-solid fa-camera"></i>
                        <span>${img.photographer}</span>
                    </div>
                    <button onclick="downloadIMG('${img.src.large2x}')">
                        <i class="fa-solid fa-download"></i>
                    </button>
                </div>
            </li>
    `
       )
       .join("");
}


const getImage = (apiURL) => {
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");
    fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");
    })
}


const loadMoreImage = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    getImage(apiURL);
}   

const loadSearchImage = (e) =>  {
    if (e.target.value === "") {
        return searchTerm = null;
    }
    if(e.key === 'Enter') {
        currentPage = 1;
        searchTemp = e.target.value;
        imageWrapper.innerHTML = '';
        getImage(`https://api.pexels.com/v1/search?query=${searchTemp}?page=${currentPage}&per_page=${perPage}`);
    }
}

loadMoreBtn.addEventListener('click',loadMoreImage) 
searchBtn.addEventListener("keyup", loadSearchImage);
closeBtn.addEventListener("click", e => {
    lightBox.classList.remove('show');
    document.body.style.overflow = "auto";
})

downloadBtn.addEventListener("click", (e) => {
    downloadIMG(e.target.dataset.img);
})
getImage(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
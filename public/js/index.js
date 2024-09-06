
document.addEventListener("DOMContentLoaded", function () {
    // Slideshow
    let slideIndex = 0;
    showSlides();

    function showSlides() {
        let slides = document.getElementsByClassName("slide");
        let dots = document.getElementsByClassName("dot");

        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
        }

        slideIndex++;
        if (slideIndex > slides.length) { slideIndex = 1 }    

        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        slides[slideIndex-1].style.display = "block";  
        dots[slideIndex-1].className += " active";
        setTimeout(showSlides, 3000); // Change image every 3 seconds
    }

    // Fetch and display products from respective pages
    const categories = ["cocacola", "pepsi"];
    categories.forEach(category => {
        fetch(`${category}.html`)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const products = doc.querySelectorAll(".product-card");

                const productContainer = document.getElementById(`${category}-products`);
                products.forEach((product, index) => {
                    if (index < 3) { // Show only the first 3 products
                        productContainer.appendChild(product.cloneNode(true));
                    }
                });
            });
    });

    // Fetch and display happy customer reviews dynamically
    // Assuming the backend provides an API endpoint or a similar mechanism for fetching reviews
    fetch('reviews.json')
        .then(response => response.json())
        .then(data => {
            const reviewsContainer = document.getElementById('customer-reviews');
            data.reviews.forEach(review => {
                const reviewCard = document.createElement('div');
                reviewCard.className = 'customer-card';
                reviewCard.innerHTML = `
                    <h3>${review.name}</h3>
                    <p>${review.comment}</p>
                    <p>Rating: ${'★'.repeat(review.rating)}</p>
                `;
                reviewsContainer.appendChild(reviewCard);
            });
        });
});
// Slideshow functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.display = (i === index) ? 'block' : 'none';
        dots[i].classList.toggle('active', i === index);
    });
    currentSlide = index;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Auto slide change
setInterval(nextSlide, 3000);

// Add-to-cart button functionality
const cartButton = document.getElementById('cart-button');
let cartCount = 0;

document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', () => {
        cartCount++;
        cartButton.innerText = `Cart (${cartCount})`;
    });
});

// Quantity controller
document.querySelectorAll('.product-card').forEach(card => {
    const decreaseButton = card.querySelector('.decrease-quantity');
    const increaseButton = card.querySelector('.increase-quantity');
    const quantityDisplay = card.querySelector('.quantity');
    let quantity = 1;

    decreaseButton.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantityDisplay.innerText = quantity;
        }
    });

    increaseButton.addEventListener('click', () => {
        quantity++;
        quantityDisplay.innerText = quantity;
    });
});

let slideIndex = 0;
showSlides();


        showSlides();

        function showSlides() {
            const slides = document.querySelectorAll('.slide');
            const dots = document.querySelectorAll('.dot');
            slides.forEach(slide => slide.style.display = 'none');
            dots.forEach(dot => dot.classList.remove('active'));

            slideIndex++;
            if (slideIndex > slides.length) slideIndex = 1;

            slides[slideIndex - 1].style.display = 'block';
            dots[slideIndex - 1].classList.add('active');
            setTimeout(showSlides, 5000);
        }
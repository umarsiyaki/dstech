document.addEventListener("DOMContentLoaded", function () {
  // Slideshow Functionality
  document.addEventListener("DOMContentLoaded", function () {
    let slideIndex = 0;  // Start with the first slide
    showSlides();

    function showSlides() {
        let slides = document.getElementsByClassName("slide");
        let dots = document.getElementsByClassName("dot");

        // Hide all slides
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "block";  
        }

        slideIndex++;
        if (slideIndex > slides.length) { 
            slideIndex = 1; // Reset to the first slide if the index exceeds the total
        }

        // Deactivate all dots
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        // Show the current slide and activate the corresponding dot
        if (slides[slideIndex - 1]) {
            slides[slideIndex - 1].style.display = "block"; // Show the slide
        }
        if (dots[slideIndex - 1]) {
            dots[slideIndex - 1].className += " active"; // Activate the dot
        }

        setTimeout(showSlides, 3000); // Change slide every 3 seconds
    }
});

  // Fetch and display products from respective HTML pages
  const categories = ["cocacola", "pepsi", "viju", "bigi", "maltina", "climax", "slim", "holandia"];
  categories.forEach(category => {
      fetch(`${category}.html`)
          .then(response => response.text())
          .then(data => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(data, 'text/html');
              const products = doc.querySelectorAll(".product-card");

              const productContainer = document.getElementById(`${category}-products`);
              if (productContainer) {
                  products.forEach((product, index) => {
                      if (index < 3) { // Show only the first 3 products
                          productContainer.appendChild(product.cloneNode(true));
                      }
                  });
              } else {
                  console.error(`Product container for ${category} not found`);
              }
          })
          .catch(error => console.error(`Error fetching ${category} products:`, error));
  });

  // Fetch and display happy customer reviews dynamically
  fetch('reviews.json')
      .then(response => response.json())
      .then(data => {
          const reviewsContainer = document.getElementById('customer-reviews');
          if (reviewsContainer) {
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
          } else {
              console.error('Reviews container not found');
          }
      })
      .catch(error => console.error('Error fetching customer reviews:', error));

  // Revenue Chart
  const canvas = document.getElementById('revenueChart');
  if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
          new Chart(ctx, {
              type: 'bar',
              data: {
                  labels: ['January', 'February', 'March', 'April', 'May'],
                  datasets: [{
                      label: 'Revenue',
                      data: [12000, 19000, 3000, 5000, 20000],
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 1
                  }]
              },
              options: {
                  scales: {
                      y: {
                          beginAtZero: true
                      }
                  }
              }
          });
      } else {
          console.error('Canvas context not available');
      }
  } else {
      console.error('Revenue chart canvas not found');
  }

  // Display real-time product data (hardcoded)
  const newProducts = [
      { name: 'viju apple fruit milk', size: '500ml', price: '3,456', img: 'bigi-cola.jpeg', rating: 3 },
      { name: 'v Cool orange', size: '50cl', price: '9,500', img: 'bigi-cola.jpeg', rating: 3 },
      { name: 'pepsi Cola', size: '40cl', price: '3850', img: 'papsi.jpeg', rating: 3 },
      { name: 'coke', size: '50cl', price: '3850', img: 'bigi-cola.jpeg', rating: 3 },
  ];

  const newProductsContainer = document.getElementById('new-products-container');
  if (newProductsContainer) {
      newProducts.forEach(product => {
          const productCard = document.createElement('div');
          productCard.className = 'product-card';
          productCard.innerHTML = `
              <img src="${product.img}" alt="${product.name}">
              <h3>${product.name}</h3>
              <p>Size: ${product.size}</p>
              <p>Price: ${product.price}</p>
              <p>Rating: ${'★'.repeat(product.rating)}</p>
          `;
          newProductsContainer.appendChild(productCard);
      });
  } else {
      console.error('New products container not found');
  }

  // Review form submission handling
  const reviewForm = document.getElementById('review-form');
  if (reviewForm) {
      reviewForm.addEventListener('submit', function(event) {
          event.preventDefault();
      
          const name = document.getElementById('name').value;
          const comment = document.getElementById('comment').value;
          const rating = document.getElementById('rating').value;
      
          fetch('/api/reviews', { 
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ name, comment, rating })
          })
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  alert('Review submitted successfully!');
                  // Optionally, clear the form or update the UI
              } else {
                  alert('Failed to submit review. Please try again.');
              }
          })
          .catch(error => console.error('Error:', error));
      });
  } else {
      console.error('Review form not found');
  }
});

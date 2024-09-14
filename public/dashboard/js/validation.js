
const validateForm = (formData) => {
const errors = {};

if (!formData.name || formData.name.trim() === '') {
errors.name = 'Name is required';
}

if (!formData.email || formData.email.trim() === '') {
errors.email = 'Email is required';
} else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
errors.email = 'Invalid email address';
}

if (!formData.data || formData.data.trim() === '') {
errors.data = 'Data is required';
}

return errors;
};
const { check, validationResult } = require('express-validator');

app.post(
  '/api/reviews',
  [
    check('name').notEmpty().withMessage('Name is required'),
    check('comment').notEmpty().withMessage('Comment is required'),
    check('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, comment, rating } = req.body;
    try {
      const review = new Review({ name, comment, rating });
      await review.save();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);


document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name === "" || email === "" || message === "") {
        alert("All fields are required!");
    } else {
        alert("Form submitted successfully!");
        e.target.submit();
    }
});

function validateReviewForm() {
    const name = document.getElementById('name').value.trim();
    const comment = document.getElementById('comment').value.trim();
    const rating = document.getElementById('rating').value;
  
    if (!name || !comment || !rating) {
      alert("All fields are required.");
      return false;
    }
  
    if (rating < 1 || rating > 5) {
      alert("Rating must be between 1 and 5.");
      return false;
    }
  
    return true;
  }
  
module.exports = validateForm;
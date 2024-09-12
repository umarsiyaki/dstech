
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


module.exports = validateForm;
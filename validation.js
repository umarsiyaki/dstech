
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

module.exports = validateForm;
// Add dropdown toggle behavior for mobile screens
document.querySelectorAll('.nav-item.dropdown').forEach(function(dropdown) {
    dropdown.addEventListener('click', function (event) {
        event.stopPropagation();
        dropdown.classList.toggle('show');
    });
});

document.addEventListener('click', function (event) {
    // Close dropdowns when clicking outside
    document.querySelectorAll('.nav-item.dropdown').forEach(function(dropdown) {
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    });
});

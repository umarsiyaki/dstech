// Get modal elements
const inboxModal = document.getElementById('inboxModal');
const addRecipientModal = document.getElementById('addRecipientModal');
const spamModal = document.getElementById('spamModal');
const replyModal = document.getElementById('replyModal');
const recipientDetailsModal = document.getElementById('recipientDetailsModal');

// Get buttons to open modals
const openInbox = document.getElementById('openInbox');
const openAddRecipient = document.getElementById('openAddRecipient');
const openSpam = document.getElementById('openSpam');
const openReply = document.getElementById('replyButton');
const openRecipientDetails = document.getElementById('recipient');

// Get elements to close modals
const closeModalButtons = document.querySelectorAll('.close-modal');

// Function to open a modal
function openModal(modal) {
    modal.style.display = 'block';
}

// Function to close a modal
function closeModal(modal) {
    modal.style.display = 'none';
}

// Open inbox modal
openInbox.addEventListener('click', () => openModal(inboxModal));

// Open add recipient modal
openAddRecipient.addEventListener('click', () => openModal(addRecipientModal));

// Open spam modal
openSpam.addEventListener('click', () => openModal(spamModal));

// Open reply modal
openReply.addEventListener('click', () => openModal(replyModal));

// Open recipient details modal
openRecipientDetails.addEventListener('click', () => openModal(recipientDetailsModal));

// Close modal when the close button is clicked
closeModalButtons.forEach(button => {
    button.addEventListener('click', function () {
        const modal = this.closest('.modal');
        closeModal(modal);
    });
});

// Close modal when clicking outside of the modal content
window.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

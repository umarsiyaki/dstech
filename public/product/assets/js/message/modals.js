// JavaScript for Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get modals
    const inboxModal = document.getElementById('inbox-modal');
    const recipientModal = document.getElementById('recipient-modal');
    const spamModal = document.getElementById('spam-modal');
    
    // Get open modal buttons (assuming you have buttons in your HTML to open each modal)
    const openInboxModalBtn = document.getElementById('open-inbox-btn');
    const openRecipientModalBtn = document.getElementById('open-recipient-btn');
    const openSpamModalBtn = document.getElementById('open-spam-btn');
    
    // Get close buttons
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Function to open modal
    function openModal(modal) {
        modal.style.display = 'block';
    }

    // Function to close modal
    function closeModal(modal) {
        modal.style.display = 'none';
    }

    // Open Inbox Modal
    openInboxModalBtn.addEventListener('click', function() {
        openModal(inboxModal);
    });

    // Open Recipient Modal
    openRecipientModalBtn.addEventListener('click', function() {
        openModal(recipientModal);
    });

    // Open Spam Modal
    openSpamModalBtn.addEventListener('click', function() {
        openModal(spamModal);
    });

    // Close Modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeModal(this.parentElement.parentElement); // Close parent modal
        });
    });

    // Close modals when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });

    // Inbox Modal Logic (e.g., Read/Unread/Reply)
    const readMessagesLink = document.getElementById('read-messages');
    const unreadMessagesLink = document.getElementById('unread-messages');
    const filterMessagesLink = document.getElementById('filter-messages');
    const recipientMessagesLink = document.getElementById('recipient-messages');
    const replyMessagesLink = document.getElementById('reply-messages');
    
    // Example: Toggle between read and unread messages
    readMessagesLink.addEventListener('click', function() {
        // Logic to display read messages
        console.log('Showing read messages');
    });

    unreadMessagesLink.addEventListener('click', function() {
        // Logic to display unread messages
        console.log('Showing unread messages');
    });

    // Reply logic (you can expand this to include a form submission)
    const replyButtons = document.querySelectorAll('.reply-btn');
    replyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const replyBox = this.parentElement.querySelector('.reply-box');
            if (replyBox) {
                replyBox.style.display = 'block'; // Show reply box
            } else {
                console.log('Replying to message...');
            }
        });
    });

    // Add Recipient Modal Logic
    const recipientSearchInput = document.getElementById('recipient-search');
    const availableRecipients = document.querySelectorAll('.available-recipients li');

    // Search recipients by name
    recipientSearchInput.addEventListener('keyup', function() {
        const searchValue = this.value.toLowerCase();
        availableRecipients.forEach(recipient => {
            const recipientName = recipient.textContent.toLowerCase();
            if (recipientName.includes(searchValue)) {
                recipient.style.display = 'block';
            } else {
                recipient.style.display = 'none';
            }
        });
    });

    // Select recipient (logic to handle sending to Admin/Support teams)
    availableRecipients.forEach(recipient => {
        recipient.addEventListener('click', function() {
            console.log(`Sending message to: ${recipient.textContent}`);
            // Logic to send a message to the selected recipient
        });
    });

    // Spam Modal Logic
    const spamItems = document.querySelectorAll('.spam-item');
    spamItems.forEach(item => {
        // You could add functionality to delete or mark spam items here
        item.addEventListener('click', function() {
            console.log('Spam item clicked');
        });
    });
});

// Handle media upload
document.getElementById('mediaUpload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('media', file);
  
    // Send media to the server
    fetch('/messages/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Media uploaded:', data);
        displayMedia(data.mediaUrl);  // Implement displayMedia()
      } else {
        console.error('Media upload failed:', data.error);
      }
    })
    .catch(error => console.error('Error:', error));
  });
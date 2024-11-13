document.getElementById('sell-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const bookName = document.getElementById('book-name').value;
    const author = document.getElementById('author').value;
    const city = document.getElementById('city-dropdown').value;
    const price = document.getElementById('price').value;

    // Simulate storing data in the database (you'll need to implement actual database logic)
    console.log(`Name: ${name}, Phone: ${phone}, Book: ${bookName}, Author: ${author}, City: ${city}, Price: ${price}`);

    // Show success message
    const message = document.getElementById('message');
    message.innerText = 'Your book has been submitted successfully!';
    message.style.color = '#28a745'; // Green success message

    // Clear form fields
    this.reset();
});

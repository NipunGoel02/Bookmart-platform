// Handle city selection and show manual city input if "Others" is selected
document.getElementById('city-dropdown').addEventListener('change', function() {
    const selectedCity = this.value;
    const manualCityInput = document.getElementById('manual-city-input');
    
    // Check if the selected value is "Others"
    if (selectedCity === 'Others') {
        // Show the manual city input field
        manualCityInput.style.display = 'block';
    } else {
        // Hide the manual city input field
        manualCityInput.style.display = 'none';
        
        // Display books for the selected city
        displayBooksForCity(selectedCity);
    }
});

// Listen for input in the manual city input field
document.getElementById('manual-city').addEventListener('input', function() {
    const manualCity = this.value.trim();
    if (manualCity) {
        // Display books for the manually entered city
        displayBooksForCity(manualCity);
    }
});

// Function to display books for the selected or manually entered city
function displayBooksForCity(cityName) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = ''; // Clear previous books

    // Placeholder data (replace this with actual data)
    const books = {
        'Mumbai': [
            { title: 'Book A', author: 'Author A' },
            { title: 'Book B', author: 'Author B' }
        ],
        'Delhi': [
            { title: 'Book C', author: 'Author C' },
            { title: 'Book D', author: 'Author D' }
        ]
        // Add more cities and books here
    };

    const booksInCity = books[cityName] || [];

    // Display books dynamically
    booksInCity.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.innerHTML = `
            <h2 class="book-title">${book.title}</h2>
            <p>Author: ${book.author}</p>
        `;
        bookList.appendChild(bookCard);
    });

    // If no books are available for the city
    if (booksInCity.length === 0) {
        bookList.innerHTML = `<p>No books available for ${cityName}</p>`;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const sellForm = document.getElementById("sellForm");

    sellForm.addEventListener("submit", function(e) {
        e.preventDefault(); // Prevent form submission to keep the page from refreshing

        // Fetch the price and name from the form
        const name = document.getElementById("name").value;
        const price = document.getElementById("price").value;

        // Check if price and name are provided
        if (name && price) {
            // Normally, you would generate the QR dynamically, but here we will use a static image URL
            const qrImageUrl = "/images/upiqr.png"; // Replace with the path to your QR code image

            // Create a new div to hold the QR code and reference number field
            const qrContainer = document.createElement("div");
            qrContainer.id = "qrContainer";
            qrContainer.innerHTML = `
                 
                <img src="${qrImageUrl}" alt="QR Code" id="qrCodeImage" style="width: 150px; height: 150px;"> <!-- Smaller QR code -->
                <div class="form-group">
                    <input type="text" id="referenceNo" name="referenceNo" required>
                    <label for="referenceNo">Reference No</label>
                  <a href = "/home" <button type="button" id="finalizeBtn">Finalize</button></a>
                          <div style="height: 100px; margin-top: 10px; margin-bottom: 10px;"></div>
                </div>

        
            `;

            // Append the QR code and Reference No. input field after the form
            sellForm.insertAdjacentElement("afterend", qrContainer);

            // Display the finalize button
            document.getElementById("finalizeBtn").addEventListener("click", function() {
                const referenceNo = document.getElementById("referenceNo").value;
                if (referenceNo) {
                    alert(`Book added successfully with Reference No: ${referenceNo}`);
                    // Optionally, you can submit the form data to the server here or store it locally.
                } else {
                    alert("Please enter a Reference No.");
                }
            });
        } else {
            alert("Please fill in the price and name before generating the QR code.");
        }
    });
});

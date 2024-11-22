// Get seller and buyer IDs from EJS
const sellerId = "<%= sellerId %>";
const buyerId = "<%= buyerId %>";

// Function to send a new message
async function sendMessage() {
  const messageInput = document.getElementById("messageInput").value.trim();
  if (!messageInput) return; // Don't send if the input is empty

  try {
    const response = await fetch("/api/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_id: sellerId,
        receiver_id: buyerId,
        message: messageInput,
      }),
    });

    if (response.ok) {
      document.getElementById("messageInput").value = ''; // Clear input field
      window.location.reload(); // Reload the page to get the new message
    } else {
      console.error("Error sending message:", await response.text());
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

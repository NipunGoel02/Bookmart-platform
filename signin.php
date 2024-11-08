<?php
// Database credentials
ini_set('display_errors', 1);
error_reporting(E_ALL);
$host = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbname = "bookmart";

// Create a new MySQLi connection
$conn = new mysqli($host, $dbUsername, $dbPassword, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Collect data from the form
$Username = $_POST['username'];
$Password = $_POST['password'];

// Check if the form fields are not empty
if (!empty($Username) && !empty($Password)) {
    $SELECT = "SELECT * FROM signup WHERE username = ? AND password = ?";

    $stmt = $conn->prepare($SELECT);
    $stmt->bind_param("ss", $Username, $Password);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if a matching record is found
    if ($result->num_rows > 0) {
        header("Location: After Login.html");
        // Here, you could also start a session or redirect the user
    } else {
        echo "Invalid username or password.";
    }

    $stmt->close();
    $conn->close();
} else {
    echo "Please enter both username and password!";
    die();
}
?>

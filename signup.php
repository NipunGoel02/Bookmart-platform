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
$Username = $_POST['nusername'];
$Email = $_POST['email'];
$Password = $_POST['npassword'];

// Check if the form fields are not empty
if (!empty($Username) && !empty($Email) && !empty($Password)) {
    // Check if the email already exists in the database
    $SELECT = "SELECT email FROM signup WHERE email = ? LIMIT 1";
    $INSERT = "INSERT INTO signup (username, email, password) VALUES (?, ?, ?)";

    $stmt = $conn->prepare($SELECT);
    $stmt->bind_param("s", $Email);
    $stmt->execute();
    $stmt->store_result();
    $rnum = $stmt->num_rows;

    if ($rnum == 0) {
        $stmt->close();

        // Insert the new user record
        $stmt = $conn->prepare($INSERT);
        $stmt->bind_param("sss", $Username, $Email, $Password);
        $stmt->execute();
        echo "You have registered successfully!";
        echo '<br><a href="signup page.html"  style="display: inline-block; background-color: black; color: white; padding: 5px 10px; text-decoration: none; font-size: 20px; border-radius: 3px;">Click Here To Login</a>';
    } else {
        echo "This email is already registered.";
        echo '<br><a href="signup page.html"  style="display: inline-block; background-color: black; color: white; padding: 5px 10px; text-decoration: none; font-size: 20px; border-radius: 3px;">Click Here To Login</a>';
    }

    $stmt->close();
    $conn->close();
} else {
    echo "All fields are required!";
    die();
}
?>

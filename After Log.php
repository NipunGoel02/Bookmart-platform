<?php
session_start(); // Start the session

// Check if the user is logged in
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    // If not logged in, redirect to login page
    header("Location: signin.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Bookmart</title>
    <link rel="stylesheet" href="After Log.css">
</head>
<body>
    <div class="container">
    <div class="welcome">
    <h1>Welcome to Bookmart, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h1>
    </div>
    <div class="buttons">
            <a href="Buy.html" class="button">Buy</a>
            <a href="Sell.html" class="button">Sell</a>
        </div>
    </div>
    <a href="logout.php">Logout</a>
</body>
</html>

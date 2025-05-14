<?php
// Start session
session_start();

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Check if user is logged in
if(isset($_SESSION['user_id'])) {
    // User is logged in, return session data
    echo json_encode([
        'loggedIn' => true,
        'userId' => $_SESSION['user_id'],
        'username' => $_SESSION['username'],
        'email' => $_SESSION['email']
    ]);
} else {
    // User is not logged in
    echo json_encode([
        'loggedIn' => false
    ]);
}
?> 

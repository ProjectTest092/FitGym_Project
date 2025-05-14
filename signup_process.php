<?php
// Start session
session_start();

// Set content type to JSON
header('Content-Type: application/json');

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log the start of the process
error_log("Signup process started");

// Connect to database
$conn = new mysqli("localhost", "root", "", "fitgym_db");

// Check connection
if ($conn->connect_error) {
    error_log("Database connection failed: " . $conn->connect_error);
    echo json_encode([
        'success' => false,
        'message' => "Database connection failed: " . $conn->connect_error
    ]);
    exit;
}

// Process form data
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get and validate form data
    $username = isset($_POST['username']) ? trim($_POST['username']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';
    
    // Log data
    error_log("Received data - Username: $username, Email: $email");
    
    // Basic validation
    if (empty($username) || empty($email) || empty($password)) {
        echo json_encode([
            'success' => false,
            'message' => "All fields are required"
        ]);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'success' => false,
            'message' => "Invalid email format"
        ]);
        exit;
    }
    
    // Check if username or email exists
    $check_sql = "SELECT * FROM users WHERE username = ? OR email = ?";
    $stmt = $conn->prepare($check_sql);
    $stmt->bind_param("ss", $username, $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode([
            'success' => false,
            'message' => "Username or email already exists"
        ]);
        exit;
    }
    
    // Hash password and insert user
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $insert_sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($insert_sql);
    $stmt->bind_param("sss", $username, $email, $hashed_password);
    
    if ($stmt->execute()) {
        // Get the new user ID
        $user_id = $stmt->insert_id;
        
        // Set session variables
        $_SESSION['user_id'] = $user_id;
        $_SESSION['username'] = $username;
        $_SESSION['email'] = $email;
        
        error_log("User created successfully - ID: $user_id, Username: $username, Email: $email");
        
        // Return success response
        echo json_encode([
            'success' => true,
            'message' => "Account created successfully!",
            'redirect' => "Project.html"
        ]);
    } else {
        error_log("Error creating user: " . $stmt->error);
        echo json_encode([
            'success' => false,
            'message' => "Error creating account: " . $stmt->error
        ]);
    }
    
    // Close statement
    $stmt->close();
} else {
    echo json_encode([
        'success' => false,
        'message' => "Invalid request method"
    ]);
}

// Close connection
$conn->close();
?> 
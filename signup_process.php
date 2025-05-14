<?php
// Prevent any output before headers
ob_start();

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Function to send JSON response
function sendJsonResponse($success, $message) {
    ob_clean(); // Clear any previous output
    echo json_encode([
        'success' => $success,
        'message' => $message
    ]);
    exit;
}

// Log the raw POST data
error_log("Raw POST data: " . file_get_contents('php://input'));
error_log("POST array: " . print_r($_POST, true));
error_log("Request method: " . $_SERVER['REQUEST_METHOD']);

try {
    // Test database connection
    $conn = new mysqli("localhost", "root", "", "fitgym_db");
    
    if ($conn->connect_error) {
        error_log("Database connection failed: " . $conn->connect_error);
        sendJsonResponse(false, "Database connection failed: " . $conn->connect_error);
    }
    
    error_log("Database connection successful");
    
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Get form data
        $username = isset($_POST['username']) ? trim($_POST['username']) : '';
        $email = isset($_POST['email']) ? trim($_POST['email']) : '';
        $password = isset($_POST['password']) ? trim($_POST['password']) : '';
        
        // Log received data
        error_log("Received data - Username: $username, Email: $email");
        
        // Validate input
        if (empty($username) || empty($email) || empty($password)) {
            sendJsonResponse(false, "All fields are required");
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendJsonResponse(false, "Invalid email format");
        }
        
        // Check if username or email already exists
        $stmt = $conn->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
        if (!$stmt) {
            error_log("Prepare statement failed: " . $conn->error);
            sendJsonResponse(false, "Database error: " . $conn->error);
        }
        
        $stmt->bind_param("ss", $username, $email);
        if (!$stmt->execute()) {
            error_log("Execute statement failed: " . $stmt->error);
            sendJsonResponse(false, "Database error: " . $stmt->error);
        }
        
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            sendJsonResponse(false, "Username or email already exists");
        }
        
        // Hash password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert new user
        $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        if (!$stmt) {
            error_log("Prepare insert statement failed: " . $conn->error);
            sendJsonResponse(false, "Database error: " . $conn->error);
        }
        
        $stmt->bind_param("sss", $username, $email, $hashed_password);
        
        if (!$stmt->execute()) {
            error_log("Execute insert statement failed: " . $stmt->error);
            sendJsonResponse(false, "Error creating account: " . $stmt->error);
        }
        
        error_log("User successfully created");
        sendJsonResponse(true, "Account created successfully!");
        
    } else {
        error_log("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
        sendJsonResponse(false, "Invalid request method");
    }
    
} catch (Exception $e) {
    error_log("Signup error: " . $e->getMessage());
    sendJsonResponse(false, $e->getMessage());
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?> 
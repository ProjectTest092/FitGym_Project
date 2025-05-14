<?php
require_once 'config.php';

header('Content-Type: text/plain');

echo "Testing Database Connection...\n\n";

// Test database connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Database connection successful!\n\n";

// Check if database exists
$result = $conn->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'fitgym_db'");
if ($result->num_rows == 0) {
    echo "Database 'fitgym_db' does not exist!\n";
    echo "Creating database...\n";
    
    if ($conn->query("CREATE DATABASE fitgym_db")) {
        echo "Database created successfully!\n";
        $conn->select_db("fitgym_db");
    } else {
        die("Error creating database: " . $conn->error);
    }
} else {
    echo "Database 'fitgym_db' exists!\n";
    $conn->select_db("fitgym_db");
}

// Check if users table exists
$result = $conn->query("SHOW TABLES LIKE 'users'");
if ($result->num_rows == 0) {
    echo "\nTable 'users' does not exist!\n";
    echo "Creating users table...\n";
    
    $sql = "CREATE TABLE users (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(30) NOT NULL,
        email VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    if ($conn->query($sql)) {
        echo "Table 'users' created successfully!\n";
    } else {
        die("Error creating table: " . $conn->error);
    }
} else {
    echo "\nTable 'users' exists!\n";
}

// Show table structure
echo "\nTable Structure:\n";
$result = $conn->query("DESCRIBE users");
while ($row = $result->fetch_assoc()) {
    echo $row['Field'] . " - " . $row['Type'] . "\n";
}

$conn->close();
?> 
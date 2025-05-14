<?php
require_once 'config.php';

echo "Testing database connection...<br>";

if ($conn) {
    echo "Successfully connected to the database!<br>";
    echo "Database name: " . $database . "<br>";
    
    // Test query
    $result = $conn->query("SHOW TABLES");
    if ($result) {
        echo "Tables in the database:<br>";
        while ($row = $result->fetch_array()) {
            echo "- " . $row[0] . "<br>";
        }
    } else {
        echo "Error executing query: " . $conn->error;
    }
} else {
    echo "Failed to connect to the database!";
}

$conn->close();
?> 
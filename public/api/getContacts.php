<?php
    header("Content-Type: application/json; charset=UTF-8");

    $inData = json_decode(file_get_contents('php://input'), true);

    // Use the same DB credentials as in login.php/register.php
    $dbUser = "root";
    $dbPass = "kVIuL:H/t4P8";
    $dbName = "ContactManager";

    $userId = intval($inData['userId']);

    // Database connection
    $conn = new mysqli("localhost", $dbUser, $dbPass, $dbName);
    if ($conn->connect_error) {
        echo json_encode(["error" => $conn->connect_error]);
        exit();
    }

    // Prepared statement for security
    $stmt = $conn->prepare("SELECT id, firstName, lastName, email, number FROM Contacts WHERE userId = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();

    $result = $stmt->get_result();
    $contacts = [];
    while ($row = $result->fetch_assoc()) {
        $contacts[] = $row;
    }

    // Return contacts as JSON
    echo json_encode(["results" => $contacts]);

    $stmt->close();
    $conn->close();
?>

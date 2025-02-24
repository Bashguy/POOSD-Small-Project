<?php
// Set CORS headers (same as login.php/register.php)
header("Access-Control-Allow-Origin: http://smallproject.cjanua.xyz");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$inData = getRequestInfo();

// Debugging: Log the received data
error_log("Received data: " . json_encode($inData));

// Use the same DB credentials as in login.php/register.php
$dbUser = "root";
$dbPass = "kVIuL:H/t4P8";
$dbName = "ContactManager";

$conn = new mysqli("localhost", $dbUser, $dbPass, $dbName);
if ($conn->connect_error) {
    returnWithError("Connection failed: " . $conn->connect_error);
} else {
    $stmt = $conn->prepare("SELECT * FROM contacts WHERE IDnum = ?");
    if (!$stmt) {
        returnWithError("Prepare failed: " . $conn->error);
    } else {
        $stmt->bind_param("i", $inData["IDnum"]);
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                $contacts = [];
                while ($row = $result->fetch_assoc()) {
                    $contacts[] = $row;
                }
                sendResultInfoAsJson($contacts);
            } else {
                returnWithError("User does not have any contacts.");
            }
        } else {
            returnWithError("Error executing locate: " . $stmt->error);
        }
        $stmt->close();
    }
    $conn->close();
}

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo json_encode($obj);
}

function returnWithError($err) {
    $retValue = ["error" => $err];
    sendResultInfoAsJson($retValue);
}
?>

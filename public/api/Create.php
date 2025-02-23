<?php
// Set CORS headers (same as login.php/register.php)
header("Access-Control-Allow-Origin: http://smallproject.cjanua.xyz");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


$inData = getRequestInfo();

// Use the same DB credentials as in login.php/register.php
$dbUser = "root";
$dbPass = "kVIuL:H/t4P8";
$dbName = "ContactManager";

$conn = new mysqli("localhost", $dbUser, $dbPass, $dbName);
if ($conn->connect_error) {
    returnWithError("Connection failed: " . $conn->connect_error);
} else {
    $stmt = $conn->prepare("INSERT INTO contacts (IDnum, FirstName, LastName, Email, PhoneNumber) VALUES (?, ?, ?, ?, ?)");
    if (!$stmt) {
        returnWithError("Prepare failed: " . $conn->error);
    } else {
        $timeNow = date("Y-m-d H:i:s");
        $stmt->bind_param("isssi", $inData["IDnum"], $inData["FirstName"], $inData["LastName"], $inData["Email"], $inData["PhoneNumber"]);
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                returnWithMessage("Contact inserted successfully.");
            } else {
                returnWithError("Could not insert contact.");
            }
        } else {
            returnWithError("Error executing insert: " . $stmt->error);
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

function returnWithMessage($message) {
    $retValue = ["message" => $message];
    sendResultInfoAsJson($retValue);
}
?>
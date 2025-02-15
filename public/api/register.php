<?php
header("Access-Control-Allow-Origin: http://smallproject.cjanua.xyz");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$inData = getRequestInfo();

// Initialize all variables to prevent null values
$firstName = isset($inData["firstName"]) ? $inData["firstName"] : "";
$lastName = isset($inData["lastName"]) ? $inData["lastName"] : "";
$username = isset($inData["username"]) ? $inData["username"] : "";
$password = isset($inData["password"]) ? $inData["password"] : "";

// Validate required fields
if (empty($firstName) || empty($lastName) || empty($username) || empty($password)) {
    returnWithError("All fields are required");
    exit();
}

$dbUser = "root";
$dbPass = "kVIuL:H/t4P8";
$dbName = "ContactManager";

$conn = new mysqli("localhost", $dbUser, $dbPass, $dbName);
if ($conn->connect_error) {
    error_log("Connection failed: " . $conn->connect_error);
    returnWithError($conn->connect_error);
    exit();
}

// Check if username already exists
$stmt = $conn->prepare("SELECT ID FROM logins WHERE Logged=?");
if (!$stmt) {
    error_log("Prepare failed: " . $conn->error);
    returnWithError($conn->error);
    $conn->close();
    exit();
}

$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    returnWithError("Username already exists");
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

// Insert new user
$stmt = $conn->prepare("INSERT INTO logins (FirstName, LastName, Logged, Pass) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    error_log("Prepare failed: " . $conn->error);
    returnWithError($conn->error);
    $conn->close();
    exit();
}

$stmt->bind_param("ssss", $firstName, $lastName, $username, $password);

if ($stmt->execute()) {
    $id = $conn->insert_id;
    returnWithInfo($firstName, $lastName, $id);
} else {
    error_log("Execute failed: " . $stmt->error);
    returnWithError($stmt->error);
}

$stmt->close();
$conn->close();

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo json_encode($obj);
}

function returnWithError($err)
{
    $retValue = array("id" => 0, "firstName" => "", "lastName" => "", "error" => $err);
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($firstName, $lastName, $id)
{
    $retValue = array("id" => $id, "firstName" => $firstName, "lastName" => $lastName, "error" => "");
    sendResultInfoAsJson($retValue);
}
?>
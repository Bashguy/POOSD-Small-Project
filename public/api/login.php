<?php
header("Access-Control-Allow-Origin: http://smallproject.cjanua.xyz");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$inData = getRequestInfo();

$id = 0;
$firstName = "";
$lastName = "";

$dbUser = "root";
$dbPass = "kVIuL:H/t4P8";
$dbName = "ContactManager";

$conn = new mysqli("localhost", $dbUser, $dbPass, $dbName); 	
if( $conn->connect_error )
{
	error_log("Connection failed: " . $conn->connect_error);
	returnWithError( $conn->connect_error );
}
else
{
	$stmt = $conn->prepare("SELECT ID, FirstName, LastName FROM logins WHERE Logged=? AND Pass=?");
	if (!$stmt) {
		error_log("Prepare failed: " . $conn->error);
		returnWithError( $conn->error );
		exit();
	}
	$stmt->bind_param("ss", $inData["login"], $inData["password"]);
	$stmt->execute();
	$result = $stmt->get_result();

	if( $row = $result->fetch_assoc()  )
	{
		returnWithInfo( $row['FirstName'], $row['LastName'], $row['ID'] );
	}
	else
	{
		returnWithError("No Records Found");
	}

	$stmt->close();
	$conn->close();
}

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
	header('Content-type: application/json');
	echo json_encode($obj);
}

function returnWithError( $err )
{
	$retValue = array("id" => 0, "firstName" => "", "lastName" => "", "error" => $err);
	sendResultInfoAsJson( $retValue );
}

function returnWithInfo( $firstName, $lastName, $id )
{
	$retValue = array("id" => $id, "firstName" => $firstName, "lastName" => $lastName, "error" => "");
	sendResultInfoAsJson( $retValue );
}

?>

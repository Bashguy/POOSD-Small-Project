<?php
    $inData = getRequestInfo();

    $id = 0;
    $firstName = "";
	$lastName = "";

    $conn = new mysqli("localhost", "root", "", "ContactManager");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        

    }
?>
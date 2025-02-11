<?php
session_start();

function isLoggedIn() {
    return isset($_SESSION['user_id']) ? true : false;
}

switch ($_SERVER['REQUEST_URI']) {
    case '/':
        if (!isLoggedIn()) {
            header('Location: /login.html');
            exit();
        }
        break;
}

// Your other code here

?>
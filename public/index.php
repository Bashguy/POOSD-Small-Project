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
    case '/login':
        if (!isLoggedIn()) {
            header('Location: /login.html');
            exit();
        }
        break;
    case '/register':
        if (!isLoggedIn()) {
            header('Location: /register.html');
            exit();
        }
        break;
}

// Your other code here

?>
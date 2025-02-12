<?php
session_start();
require_once 'config.php'; // Database connection file

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstName = trim($_POST['FirstName']);
    $lastName = trim($_POST['LastName']);
    $email = trim($_POST['Email']);
    $username = trim($_POST['Logged']);
    $password = password_hash($_POST['Pass'], PASSWORD_DEFAULT); // Hash the password

    try {
        $pdo = new PDO(DB_DSN, DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Check if username or email already exists
        $stmt = $pdo->prepare("SELECT * FROM logins WHERE Logged = :username OR Email = :email");
        $stmt->execute(['username' => $username, 'email' => $email]);
        if ($stmt->rowCount() > 0) {
            echo "<script>alert('Username or Email already exists.'); window.location.href='register.html';</script>";
            exit();
        }

        // Insert new user
        $stmt = $pdo->prepare("INSERT INTO logins (FirstName, LastName, Logged, Pass) VALUES (:first_name, :last_name, :username, :password)");
        $stmt->execute([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'username' => $username,
            'password' => $password
        ]);

        // Retrieve user ID and set session
        $userID = $pdo->lastInsertId();
        $_SESSION['user_id'] = $userID;
        
        echo "<script>alert('Registration successful! Please log in.'); window.location.href='login.html';</script>";
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>


<?php
session_start();
$email = $_POST['email'];
$password = $_POST['password'];

require "connect.php";

$stmt = $dbh->prepare(
    "SELECT * FROM users 
    INNER JOIN logincredentials ON users.UserId = logincredentials.UserId
    WHERE users.Email = ? AND logincredentials.Password = ?");
$stmt->bindParam(1, $email);
$stmt->bindParam(2, $password);
$stmt->execute();

if ($row = $stmt->fetch()) {
    /*Login succeeded*/
    $_SESSION['userId'] = $row['UserId'];
    $_SESSION['firstName'] = $row['FirstName'];
    $_SESSION['lastName'] = $row['LastName'];
    $_SESSION['email'] = $row['Email'];
    $_SESSION['accessLevel'] = $row['AccessLevel'];
    
    /*Redirect to other page with success*/
    header('location: ../../frontend/php/index.php');
} else {
    /*Redirect to other page with error*/
    $_SESSION['errMsg'] = 'Invalid username or password';
    header('location: ../../frontend/php/login.php');
}

/*Close connection*/
$dbh = null;
?>
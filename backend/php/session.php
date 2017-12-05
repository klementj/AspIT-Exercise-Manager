<?php
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
    session_start();
    $_SESSION['userId'] = $row['UserId'];
    $_SESSION['firstName'] = $row['FirstName'];
    $_SESSION['lastName'] = $row['LastName'];
    $_SESSION['email'] = $row['Email'];
    $_SESSION['accessLevel'] = $row['AccessLevel'];
    
    /*Redirect to other page with success*/
} else {
    /*Redirect to other page with error*/
}

/*Close connection*/
$dbh = null;
?>
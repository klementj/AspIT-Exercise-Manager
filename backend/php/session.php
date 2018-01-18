<?php
session_start();
$email = $_POST['email'];
$password = $_POST['password'];

require ((dirname(__FILE__)) . '/connect.php');

/*Retrieve password from database*/
$stmt = $dbh->prepare(
    "SELECT * FROM users 
    INNER JOIN logincredentials ON users.UserId = logincredentials.UserId
    WHERE users.Email = ?"
);
$stmt->bindParam(1, $email);
$stmt->execute();

if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    /*Verify password*/
    if (password_verify($password, $row['Password'])) {
        /*Login succeeded*/
        $_SESSION['userId'] = $row['UserId'];
        $_SESSION['firstName'] = $row['FirstName'];
        $_SESSION['lastName'] = $row['LastName'];
        $_SESSION['email'] = $row['Email'];
        $_SESSION['accessLevel'] = $row['AccessLevel'];

        /*Redirect to other page with success*/
        header('location: ../../index.php');
    } else {
        /*Redirect to other page with error*/
        $_SESSION['errMsg'] = 'Invalid username or password';
        header('location: ../../login.php');
    }
} else {
    /*Redirect to other page with error*/
    $_SESSION['errMsg'] = 'Invalid username or password';
    header('location: ../../login.php');
}

/*Close connection*/
$dbh = null;
?>
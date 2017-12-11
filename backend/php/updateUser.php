<?php
session_start();

/*Get form values*/
$oldPassword = $_POST['oldPassword'];
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$email = $_POST['email'];
$password = $_POST['password'];
$repassword = $_POST['repassword'];

/*Validate user logged in*/
if (isset($_SESSION['userId'])) {
    /*Validate old password*/
    require "connect.php";
    
    $userId = $_SESSION['userId'];
    
    /*Validate user's old password before updating*/
    $stmt = $dbh->prepare(
        "SELECT UserId FROM loginCredentials 
        WHERE UserId = ? AND Password = ?;"
    );
    $stmt->bindParam(1, $userId);
    $stmt->bindParam(2, $oldPassword);
    $stmt->execute();
    
    /*If old password is correct, begin update*/
    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $statement = $dbh->prepare(
            "BEGIN;

            UPDATE users
            SET FirstName = ?, LastName = ?, Email = ?, AccessLevel = ?
            WHERE UserId = ?;

            UPDATE loginCredentials
            SET Password = ?
            WHERE UserId = ?;

            COMMIT;"
        );
        $statement->bindParam(1, $firstName);
        $statement->bindParam(2, $lastName);
        $statement->bindParam(3, $email);
        $statement->bindParam(4, $accessLevel);
        $statement->bindParam(5, $userId);
        $statement->bindParam(6, $password);
        $statement->bindParam(7, $userId);
        $statement->execute();

        /*Close connection*/
        $dbh = null;

        /*Redirect to other page with success*/
    } else {
        /*error old password incorrect*/
        $dbh = null;
        throw new Exception('Wrong password');
    }
    
} else {
    /*error user not logged in*/
    $dbh = null;
    throw new Exception('User not logged in');
}
?>
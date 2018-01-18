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
    require ((dirname(__FILE__)) . '/connect.php');
    
    $userId = $_SESSION['userId'];
    
    /*Validate user's old password before updating*/
    $stmt = $dbh->prepare(
        "SELECT Password FROM loginCredentials 
        WHERE UserId = ?;"
    );
    $stmt->bindParam(1, $userId);
    $stmt->execute();
    
    /*Fetch results*/
    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        /*Verify password*/
        if (password_verify($oldPassword, $row['Password'])) {
            
            /*SQL:
            1: Begins transaction
            2: Updates user
            3: Updates logincredential
            4: Commits transaction*/
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
        }
        
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
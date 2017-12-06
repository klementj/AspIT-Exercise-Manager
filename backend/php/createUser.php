<?php
session_start();

/*Get form values*/
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$email = $_POST['email'];
$password = $_POST['password'];
$repassword = $_POST['repassword'];
$_SESSION['isRegistering'] = true;
$emptyFields = false;

foreach ($_POST as $item) {
    if (empty($item)) {
        $emptyFields = true;
    }
}

if ($emptyFields) {
    $_SESSION['errMsg'] = 'Fields cannot be empty';
    header("location: ../../frontend/php/login.php?firstName=$firstName&lastName=$lastName&email=$email");
} /*Check if password and repassword match*/ 
else if ($password != $repassword) {
    
    $_SESSION['errMsg'] = "Passwords do not match";
    header("location: ../../frontend/php/login.php?firstName=$firstName&lastName=$lastName&email=$email");
    
} else {
    require "connect.php";
    
    /*Find duplicate emails in database*/
    $stmt = $dbh->prepare("SELECT * FROM users WHERE Email = ?");
    $stmt->bindParam(1, $email);
    $stmt->execute();
    
    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        /*Redirect to other page with error message*/
    } else {
        /*Insert user and login credential into database*/
        $statement = $dbh->prepare(
            "BEGIN;
            INSERT INTO users(FirstName, LastName, Email) 
            VALUES(?, ?, ?); 
            
            SET @Id = LAST_INSERT_ID();
            
            INSERT INTO logincredentials(UserId, Password) 
            VALUES(@Id, ?);
            
            COMMIT;"
        );
        $statement->bindParam(1, $firstName);
        $statement->bindParam(2, $lastName);
        $statement->bindParam(3, $email);
        $statement->bindparam(4, $password);
        $statement->execute();
        
        require "session.php";
        
        /*Redirect to other page with success*/
        header("location: ../../frontend/html/index.html");
    }
}

/*Close connection*/
$dbh = null;
?>
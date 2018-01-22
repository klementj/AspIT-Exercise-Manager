<?php
session_start();

/*Get form values*/
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$email = $_POST['email'];
$password = $_POST['password'];
$repassword = $_POST['repassword'];

/*Make sure register form is displayed even on reload*/
$_SESSION['isRegistering'] = true;

/*Boolean to check for empty fields*/
$emptyFields = false;

// Loop through POST to look for empty fields
foreach ($_POST as $item) {
    if (empty($item)) {
        $emptyFields = true;
    }
}

/*If any fields are empty return error*/
if ($emptyFields) {
    
    $_SESSION['errMsg'] = 'Fields cannot be empty';
    header("location: ../login.php?firstName=$firstName&lastName=$lastName&email=$email");
    
}

/*Check if password and repassword match*/ 
else if ($password != $repassword) {
    
    $_SESSION['errMsg'] = "Passwords do not match";
    header("location: ../login.php?firstName=$firstName&lastName=$lastName&email=$email");
    
}

/*Check for valid email*/
else if (!preg_match('/^[^@]+@[^@]+\.[^@]+$/', $email)) {
    
    $_SESSION['errMsg'] = 'Invalid email';
    header("location: ../login.php?firstName=$firstName&lastName=$lastName&email=$email");
    
}
else {
    require ((dirname(__FILE__)) . "/connect.php");
    
    /*Find duplicate emails in database*/
    $stmt = $dbh->prepare("SELECT * FROM users WHERE Email = ?");
    $stmt->bindParam(1, $email);
    $stmt->execute();
    
    // If email already exists in database
    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        /*Redirect to other page with error message*/
        $_SESSION['errMsg'] = 'Email already in use';
        header("location: ../login.php?firstName=$firstName&lastName=$lastName&email=$email");
    } else {
        /*Hash and salt password*/
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        
        /*SQL:
        1: Begins transaction
        2: Inserts into users
        3: Saves the newly created id of the inserted user
        4: Inserts into logincredentials
        5: Commits transaction*/
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
        $statement->bindparam(4, $passwordHash);
        $statement->execute();
        
        /*Allow the login form to display when login.php loads again*/
        unset($_SESSION['isRegistering']);
        /*Redirect to login.php*/
        header("location: ../login.php");
    }
}

/*Close connection*/
$dbh = null;
?>
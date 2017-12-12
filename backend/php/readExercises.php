<?php
/*Validate user logged in*/
if (isset($_SESSION['userId'])) {
    /*Get exercises from database*/
    $sql = "SELECT * FROM exercises \n";
    if ($_SESSION['accessLevel' < 2]) {
        $sql += "WHERE AccessLevel = 1 "
    }
    $stmt = $dbh->prepare(
        "SELECT * FROM exercises 
        WHERE AccessLevel = 2"
    );
}
?>
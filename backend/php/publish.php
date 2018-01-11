<?php
/*Validate user logged in*/
if (isset($_SESSION['userId'])) {
    $accessLevel = $_POST['accessLevel'];
    $exerciseId = $_POST['exerciseId'];
    $userId = $_SESSION['userId'];
    
    /*Validate access level*/
    if ($accessLevel >=0 && $accessLevel <=2) {
        /*Validate user is latest author of exercise*/
        if (GetLatestAuthorId($exerciseId) == $userId) {
            require 'connect.php';

            $stmt = $dbh->prepare(
                "UPDATE exercises
                SET AccessLevel = ?
                WHERE ExerciseId = ?;"
            );
            $stmt->bindParam(1, $accessLevel);
            $stmt->bindParam(2, $exerciseId);
            $stmt->execute();
            
            /*Close connection*/
            $dbh = null;
        } else {
            /*Error user is not latest author and does not have permission to publish*/
            echo 'You do not have permission to publish this exercise';
        }
    } else {
        /*Error invalid access level*/
        echo 'Invalid access level';
    }
} else {
    /*Error user not logged in*/
    echo 'You must be logged in to publish an exercise';
}
?>
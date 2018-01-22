<?php
session_start();

/*Import function*/
require ((dirname(__FILE__)) . "/getLatestAuthorId.php");

/*Validate user logged in*/
if (isset($_SESSION['userId'])) {
    $exerciseId = $_POST['exerciseId'];
    $userId = $_SESSION['userId'];
    
    /*Validate user is latest author of exercise*/
    if (GetLatestAuthorId($exerciseId) == $userId) {
        require ((dirname(__FILE__)) . '/connect.php');
        
        /*SQL:
        1: Delete all authors belonging to exercise to be deleted
        2: Delete exercise*/
        $stmt = $dbh->prepare(
            "DELETE from authors WHERE ExerciseId = ?;
            DELETE from exercises WHERE ExerciseId = ?;"
        );
        $stmt->bindParam(1, $exerciseId);
        $stmt->bindParam(2, $exerciseId);
        $stmt->execute();
        
        /*Close connection*/
        $dbh = null;
    } else {
        /*Error user is not latest author and does not have permission to delete*/
        echo 'You do not have permission to delete this exercise';
    }
} else {
    /*Error user not logged in*/
    echo 'You must be logged in to delete an exercise';
}
?>
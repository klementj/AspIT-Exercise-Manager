<?php
session_start();

/*Validate user logged in*/
if (isset($_SESSION['userId'])) {
    /*Find current user's version of the updated exercise*/
    require "connect.php";
    
    $statement = $dbh->prepare(
        "BEGIN;
        
        UPDATE exercises
        SET SubjectId = ?, Title = ?, Content = ?
        WHERE ExerciseId = ?;
        
        INSERT INTO authors(UserId, ExerciseId) 
        VALUES(?, ?);
        
        COMMIT;"
    );
    $statement->bindParam(1, $subjectId);
    $statement->bindParam(2, $title);
    $statement->bindParam(3, $content);
    $statement->bindParam(4, $exerciseId);
    $statement->bindParam(5, $userId);
    $statement->bindParam(6, $exerciseId);
    $statement->execute();
    
    /*Close connection*/
    $dbh = null;
    
    /*Redirect to other page with success*/
} else {
    /*error user not logged in*/
    $dbh = null;
    throw new Exception('User not logged in');
}
?>
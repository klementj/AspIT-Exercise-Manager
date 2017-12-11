<?php
/*Validate user logged in*/
if (isset($_SESSION['userId'])) {
    /*Insert new exercise into database*/
    require "connect.php";

    $stmt = $dbh->prepare(
        "BEGIN; 
        INSERT INTO exercises(SubjectId, Title, Content) 
        VALUES(?, ?, ?);

        SET @Id = LAST_INSERT_ID();

        INSERT INTO authors(UserId, ExerciseId)
        VALUES(?, @Id);

        COMMIT;"
    );
    $stmt->bindParam(1, $subjectId);
    $stmt->bindParam(2, $title);
    $stmt->bindParam(3, $content);
    $stmt->bindParam(4, $_SESSION['userId']);
    $stmt->execute();

    /*Close connection*/
    $dbh = null;
    
    /*Redirect to other page with success*/
//    header('location: ../../frontend/php/index.php');
} else {
    /*error user not logged in*/
    $dbh = null;
    throw new Exception('User not logged in');
}
?>
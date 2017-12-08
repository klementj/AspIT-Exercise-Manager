<?php
session_start();

/*Validate user logged in*/
if (isset($_SESSION['userId'])) {
    /*Insert new exercise into database*/
    require "connect.php";
    
    /*Select all authors of original exercise*/
    $stmt = dbh->prepare(
        "SELECT UserId, Timestamp FROM authors WHERE ExerciseId = ?;"
    );
    $stmt->bindParam(1, $exerciseId);
    $stmt->execute();
    
    /*Prepare array of author data*/
    $authors = array();
    
    /*Insert author data into array*/
    while ($author = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($authors, array($author['UserId'], $author['Timestamp']));
    }
    
    /*Prepare insertion sql statement*/
    $sql = "BEGIN; 
    
        INSERT INTO exercises(SubjectId, Title, Content) 
        VALUES(?, ?, ?);

        SET @ExId = LAST_INSERT_ID();
        
        INSERT INTO authors(UserId, ExerciseId, Timestamp)";
    
    /*Insert previous version's author list as new exercise's author list*/
    if (sizeof($authors) > 0) {
        for ($i = 0; $i < sizeof($authors); $i++) {
            $sql += "
            VALUES(" + $authors[$i][0] + ", @ExId, " + $authors[$i][1] + "),";
        }
    }
    
    /*Insert current user in author list*/
    /*DEBUGGING NOTE: OMITTED TIMESTAMP*/
    $sql += "
    VALUES(" + $_SESSION['userId'] + ", @ExId);
    
    COMMIT;";

    $statement->prepare($sql);
    $statement->bindParam(1, $subjectId);
    $statement->bindParam(2, $title);
    $statement->bindParam(3, $content);
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
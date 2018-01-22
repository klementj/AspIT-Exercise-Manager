<?php
/*Validate user logged in*/
if (isset($_SESSION['userId'])) {
    require ((dirname(__FILE__)) . '/connect.php');

    /*SQL:
    1: Begins transaction
    2: Updates the exercise in question
    3: Insert current user into authors
    4: Commit transaction*/
    $stmt = $dbh->prepare(
        "BEGIN;
        
        UPDATE exercises
        SET SubjectId = ?, Title = ?, Content = ?, LastUpdated = NOW()
        WHERE ExerciseId = ?;
        
        INSERT INTO authors(UserId, ExerciseId) 
        VALUES(?, ?);
        
        COMMIT;"
    );
    $stmt->bindParam(1, $subjectId);
    $stmt->bindParam(2, $title);
    $stmt->bindParam(3, $content);
    $stmt->bindParam(4, $exerciseId);
    $stmt->bindParam(5, $_SESSION['userId']);
    $stmt->bindParam(6, $exerciseId);
    $stmt->execute();
    
    /*Close connection*/
    $dbh = null;
    
    /*Return updated exercise id*/
    echo $exerciseId;
    
} else {
    /*error user not logged in*/
    $dbh = null;
    throw new Exception('User not logged in');
}
?>
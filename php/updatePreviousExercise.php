<?php
/*Validate user logged in*/
if (isset($_SESSION['userId'])) {
    /*Find current user's version of the updated exercise*/
    require ((dirname(__FILE__)) . '/connect.php');
    
    $stmt = $dbh->prepare(
        "BEGIN; 
        
        SELECT @Timestamp = FIRST_VALUE(Timestamp) FROM authors 
        WHERE UserId = ? AND ExerciseId = ? 
        ORDER BY Timestamp DESC 
        LIMIT 1; 
        
        SELECT ExerciseId FROM exercises
        INNER JOIN authors ON exercises.LastUpdated=authors.Timestamp
        LIMIT 1;
        
        COMMIT;"
    );
    $stmt->bindParam(1, $_SESSION['userId']);
    $stmt->bindParam(2, $exerciseId);
    $stmt->execute();
    
    if ($oldExercise = $stmt->fetch(PDO::FETCH_ASSOC)) {
        /*Older version of exercise was found, update it in database*/
        $oldExerciseId = $oldExercise['ExerciseId'];
        
        $statement = $dbh->prepare(
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
        $stmt->bindParam(4, $oldExerciseId);
        $stmt->bindParam(5, $userId);
        $stmt->bindParam(6, $oldExerciseId);
        $statement->execute();

        /*Close connection*/
        $dbh = null;
        
        /*Return updated exercise id*/
        echo $oldExerciseId;
        
    } else {
        /*error older version of exercise not found*/
        $dbh = null;
        throw new Exception('Exercise not found');
    }
    
    /*Redirect to other page with success*/
} else {
    /*error user not logged in*/
    $dbh = null;
    throw new Exception('User not logged in');
}
?>
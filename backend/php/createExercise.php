<?php
/*Validate user logged in*/
if (isset($_SESSION['userId'])) {
    /*Insert new exercise into database*/
    require ((dirname(__FILE__)) . "/connect.php");
    
    /*SQL:
    1: Begins a transaction
    2: Inserts into exercises
    3: Saves the newly created id of the inserted exercise
    4: Inserts into authors
    5: Selects the id of the inserted exercise
    6: Commits transaction*/
    $stmt = $dbh->prepare(
        "BEGIN;
        
        INSERT INTO exercises(SubjectId, Title, Content) 
        VALUES(?, ?, ?);
        
        SET @Id = LAST_INSERT_ID();
        
        INSERT INTO authors(UserId, ExerciseId)
        VALUES(?, @Id);
        
        SELECT @Id;
        
        COMMIT;"
    );
    $stmt->bindParam(1, $subjectId);
    $stmt->bindParam(2, $title);
    $stmt->bindParam(3, $content);
    $stmt->bindParam(4, $_SESSION['userId']);
    $stmt->execute();
    
    /*Cycle through result sets to reach the SELECT statement*/
    $stmt->nextRowset();
    $stmt->nextRowset();
    $stmt->nextRowset();
    $stmt->nextRowset();
    
    /*Fetch results*/
    if ($row = $stmt->fetch(PDO::FETCH_NUM)) {
        $exerciseId = $row[0];
    }

    /*Close connection*/
    $dbh = null;
    
    /*Return inserted exercise id*/
    echo $exerciseId;
    
} else {
    /*error user not logged in*/
    $dbh = null;
    throw new Exception('User not logged in');
}
?>
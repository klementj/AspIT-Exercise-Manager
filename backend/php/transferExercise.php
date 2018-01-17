<?php
/*Validate user logged in*/
if (isset($_SESSION['userId'])) {
    /*Insert new exercise into database*/
    require "connect.php";
    
    /*Select all authors of original exercise*/
    $stmt = $dbh->prepare(
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
    
    /*SQL:
    1: Begins transaction
    2: Inserts into exercises
    3: Saves the newly created id of the inserted exercise
    4: Selects that id
    5: Prepare to insert into authors*/
    $sql = "BEGIN; 
    
        INSERT INTO exercises(SubjectId, Title, Content) 
        VALUES(?, ?, ?);

        SET @ExId = LAST_INSERT_ID();
        
        SELECT @ExId;
        
        INSERT INTO authors(UserId, ExerciseId, Timestamp) VALUES";
    
    /*Insert previous version's author list as new exercise's author list*/
    if (sizeof($authors) > 0) {
        for ($i = 0; $i < sizeof($authors); $i++) {
            $sql .= "
            ('" . $authors[$i][0] . "', @ExId, '" . $authors[$i][1] . "'),";
        }
    }
    
    /*Insert current user in author list and then commit transaction*/
    $sql .= "('" . $_SESSION['userId'] . "', @ExId, NOW());
    
    COMMIT;";
    
    $statement = $dbh->prepare($sql);
    $statement->bindParam(1, $subjectId);
    $statement->bindParam(2, $title);
    $statement->bindParam(3, $content);
    $statement->execute();
    
    /*Cycle through result sets to the select statement*/
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
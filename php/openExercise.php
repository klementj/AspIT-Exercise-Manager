<?php
session_start();

/*Import functions*/
require ((dirname(__FILE__)) . '/getOriginalAuthorId.php');
require ((dirname(__FILE__)) . '/getLatestAuthorId.php');

/*Validate user logged in*/
if (isset($_SESSION['userId'])) {
    $exerciseId = $_POST['exerciseId'];
    $userId = $_SESSION['userId'];
    
    /*Declare boolean for accessibility of exercise*/
    $isAccessible = false;
    
    require ((dirname(__FILE__)) . '/connect.php');
    
    /*Retrieve access level of requested exercise*/
    $stmt = $dbh->prepare("SELECT AccessLevel FROM exercises WHERE ExerciseId = ?");
    $stmt->bindParam(1, $exerciseId);
    $stmt->execute();
    
    /*Evaluate access level*/
    if ($exercise = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $accessLevel = $exercise['AccessLevel'];
        switch ($accessLevel) {
            case 0:
                /*Exercise is private, and user must be latest author to view*/
                if ($userId == GetLatestAuthorId($exerciseId)) {
                    $isAccessible = true;
                }
                break;
            
            case 1:
                /*Exercise is visible only to teacher-level access levels, and user access level must be of that level or higher to view*/
                if ($_SESSION['accessLevel'] < 2) {
                    $isAccessible = true;
                }
                break;
                
            case 2:
                /*Exercise is public, and all users can access exercise*/
                $isAccessible = true;
                break;
                
            default:
                /*Error unrecognized access level*/
                $dbh = null;
                throw new Exception('Unrecognized access level');
                break;
        }
        
        if ($isAccessible) {
            /*Declare arrays for exercise and authors*/
            $result = [];
            $authors = [];
            
            $statement = $dbh->prepare(
                /*Select exercise data*/
                "SELECT ExerciseId, SubjectId, Title, Content, CreationDate, LastUpdated, Accesslevel 
                FROM exercises
                WHERE ExerciseId = ?;" .
                
                /*Select original author*/
                "SELECT users.FirstName, users.LastName
                FROM authors
                JOIN users ON authors.UserId = users.UserId
                WHERE authors.ExerciseId = ?
                ORDER BY authors.Timestamp ASC
                LIMIT 1;" .
                
                /*Select original author and save their id*/
                "SELECT authors.UserId INTO @OrigAuthId
                FROM authors
                WHERE authors.ExerciseId = ?
                ORDER BY authors.Timestamp ASC
                LIMIT 1;" .
                
                /*Create a temporary table of authors sorted after newest timestamp*/
                "CREATE TEMPORARY TABLE t1 AS 
                SELECT *
                FROM authors
                ORDER BY Timestamp DESC;" .

                /*Select all unique users (GROUP BY) that are authors belonging to the exercise in question and that are not the original author*/
                "SELECT users.FirstName, users.LastName
                FROM t1
                JOIN users ON t1.UserId = users.UserId
                WHERE t1.ExerciseId = ? AND t1.UserId != @OrigAuthId
                GROUP BY t1.UserId;");
            $statement->bindParam(1, $exerciseId);
            $statement->bindParam(2, $exerciseId);
            $statement->bindParam(3, $exerciseId);
            $statement->bindParam(4, $exerciseId);
            $statement->execute();
            
            /*Close connection*/
            $dbh = null;
            
            /*Fetch exercise data*/
            if ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
                array_push($result, $row);
            }
            
            /*Fetch original author*/
            $statement->nextRowset();
            if ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
                array_push($result, $row);
            }
            
            /*Fetch author list*/
            $statement->nextRowset();
            $statement->nextRowset();
            $statement->nextRowset();
            while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
                array_push($authors, $row);
            }
            
            /*Push author list into the rest of the result array*/
            array_push($result, $authors);
            
            /*Echo json encoded result array*/
            echo json_encode($result);
            
        } else {
            /*Error inaccessible exercise*/
            echo 'Innaccessible exercise';
        }
    } else {
        /*Error exercise not found*/
        echo 'Exercise not found';
        
    }
} else {
    /*Error user not logged in*/
    echo 'You must be logged in to open an exercise';

}
?>
<?php
session_start();

require 'getLatestAuthorId.php';
/*Validate user logged in*/
if (isset($_SESSION['userId'])) {
    /*Get exercises from database*/
    $sql = 
        "CREATE TEMPORARY TABLE t1 AS 
        SELECT * 
        FROM authors 
        ORDER BY Timestamp DESC;

        SELECT exercises.ExerciseId, users.UserId, exercises.Title, subjects.SubjectName, users.FirstName, users.LastName, exercises.AccessLevel, DATE_FORMAT(exercises.LastUpdated, '%e-%c-%Y %H:%i') AS 'Date'
        FROM exercises
        LEFT JOIN t1 ON exercises.ExerciseId = t1.ExerciseId
        LEFT JOIN subjects ON exercises.SubjectId = subjects.SubjectId
        LEFT JOIN users ON users.UserId = t1.UserId ";
    
    if ($_SESSION['accessLevel'] < 2) {
        /*Select all exercises with access level above 0 or with latest author equal to current user*/
        $sql .= "WHERE exercises.AccessLevel > 0 OR users.UserId = ? ";
    } else {
        /*Select all exercises with access level above 1 or with latest author equal to current user*/
        $sql .= "WHERE exercises.AccessLevel > 1 OR users.UserId = ? ";
    }
    
    $sql .= 
        "GROUP BY exercises.ExerciseId
        ORDER BY exercises.LastUpdated DESC;";
    
    require 'connect.php';
    
    $stmt = $dbh->prepare($sql);
    $stmt->bindParam(1, $_SESSION['userId']);
    $stmt->execute();
    $stmt->nextRowset();
    
    /*Declare result array*/
    $result = [];
    
    /*Loop through all exercises*/
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        
        /*Filter all exercises that slip through the WHERE/GROUP BY clause*/
        /*Each exercise is selected multiple times, and access level filter is applied before latest author filter in the sql*/
        if ($row['UserId'] == GetLatestAuthorId($row['ExerciseId'])) {
            
            /*Declare html for each table row*/
            $htmlString = 
                '<tr>
                    <td class="tTitle">
                        <a href="#" data-id="' . $row['ExerciseId'] . '">' . $row['Title'];

            if ($row['AccessLevel'] == 0) {
                $htmlString .= '<i class="fa fa-lock" aria-hidden="true" title="This exercise is private. Only you can see it."></i>';
            }
            
            $htmlString .=
                        '</a>
                    </td>
                    <td class="tAuthor">' . $row['FirstName'] . ' ' . $row['LastName'] . '</td>
                    <td class="tSubject">' . $row['SubjectName'] . '</td>
                    <td class="tDate"' . $row['Date'] . '</td>
                </tr>';
            
            /*Push html to array*/
            array_push($result, $htmlString);
            
        }
    }
    
    /*Encode array*/
    echo json_encode($result);
    
} else {
    /*Error user not logged in*/
    echo 'Must be logged in';
}
?>
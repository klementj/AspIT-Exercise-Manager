<?php
require "getOriginalAuthorId.php";
require "getLatestAuthorId.php";

/*Validate user logged in*/
if (isset($_SESSION['userId'])) {
    $exerciseId = $_POST['ExerciseId'];
    $userId = $_SESSION['userId'];
    $isAccessible = false;
    
    /*Retrieve access level of requested exercise*/
    require 'connect.php';
    
    $stmt = $dbh->prepare("SELECT AccessLevel FROM exercises WHERE ExerciseId = ?");
    $stmt->bindParam(1, $exerciseId);
    $stmt->execute();
    
    /*Evaluate access level*/
    if ($exercise = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $exerciseId = $exercise['AccessLevel'];
        switch () {
            case 0:
                /*Exercise is private, and user must be latest author to view*/
                if ($userId == GetLatestAuthorId($exerciseId)) {
                    $isAccessible = true;
                }
                break;
            
            case 1:
                /*Exercise is visible only to teacher-level access levels, and user access level must be of that level or higher, or they must be latest author*/
                if ($userId == GetLatestAuthorId($exerciseId) || $userId > 2) {
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
            /*Read entire exercise*/
            $statement = $dbh->prepare(
                "SELECT ExerciseId, SubjectId, Title, Content, CreationDate, LastUpdated, Accesslevel 
                FROM exercises 
                WHERE ExerciseId = ?;");
            $statement->bindParam(1, $exerciseId);
            $statement->execute();
        } else {
            /*Error inaccessible exercise*/
        }
    } else {
        /*Error exercise not found*/
    }
} else {
    /*Error user not logged in*/
}
?>
<?php
/*Import functions and session variables*/
require "isAuthor.php";
require "getLatestAuthorId.php";
session_start();

/*Validate user accessLevel*/
if ($_SESSION['accessLevel'] > 1) {
    
    /*Close connection*/
    $dbh = null;
    
} else {
    
    /*Get form values*/
    $exerciseId = $_POST['exerciseId'];
    $subjectId = $_POST['subjectId'];
    $title = $_POST['title'];
    $content = $_POST['content'];
    
    try {
        if (empty($exerciseId)) {
            /*If there is no exercise id, the exercise is completely new*/
            require "createExercise.php";
        }
        else {
            if (!IsAuthor($exerciseId, $_SESSION['userId'])) {
                /*If current user is not on the author list, new exercise is added and user is added as latest author*/
                require "transferExercise.php";
            } else {
                if (GetLatestAuthorId($exerciseId) == $_SESSION['userId']) {
                    /*If current user is latest author, simply update the exercise*/
                    require "updateThisExercise.php";
                } else {
                    /*If current user is not latest author but is on the author list, new exercise is added and user is added as latest author*/
                    require "transferExercise.php";
                }
            }
        }
    } catch(Exception $e) {
        echo 'Error submitting post ';
        echo $e;
    }
}
?>
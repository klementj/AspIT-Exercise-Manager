<?php
/*Import functions and session variables*/
require "isAuthor.php";
require "getLatestAuthorId.php";
session_start();

/*Validate user accessLevel*/
if ($_SESSION['accessLevel'] > 1) {
    /*Close connection*/
    $dbh = null;
    
    /*Redirect to other page with error*/
} else {
    /*Get form values*/
    $exerciseId = $_POST['exerciseId'];
    $subjectId = $_POST['subjectId'];
    $title = $_POST['title'];
    $content = $_POST['content'];
    
    try {
        if (empty($exerciseId)) {
            require "createExercise.php";
        }
        else {
            if (!IsAuthor($exerciseId, $_SESSION['userId'])) {
                require "transferExercise.php";
            } else {
                if (GetLatestAuthorId($exerciseId) == $_SESSION['userId']) {
                    require "updateThisExercise.php";
                } else {
                    require "updatePreviousExercise.php";
                }
            }
        }
    } catch(Exception $e) {
        echo 'Error submitting post ';
        echo $e;
    }
}
?>
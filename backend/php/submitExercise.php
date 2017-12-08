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
    $exerciseId = $_GET['exerciseId'];
    $subjectId = $_GET['subjectId'];
    $title = $_GET['title'];
    $content = $_GET['content'];
    
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
    } catch {
        /*Return error to user*/
    }
}
?>
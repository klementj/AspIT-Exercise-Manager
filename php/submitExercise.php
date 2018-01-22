<?php
/*Import functions and session variables*/
require ((dirname(__FILE__)) . '/isAuthor.php');
require ((dirname(__FILE__)) . '/getLatestAuthorId.php');
require ((dirname(__FILE__)) . '/hasSameTitle.php');
session_start();

/*Validate user accessLevel*/
if ($_SESSION['accessLevel'] > 1) {
    
    /*Close connection*/
    $dbh = null;
    
} else {
    
    /*Get form values*/
    $exerciseId = $_POST['exerciseId'];
    $subjectId = $_POST['subjectId'];
    $content = $_POST['content'];
    /*Trim whitespace from both ends of title string*/
    $title = preg_replace('/^\s*(.*?)\s*$/', '$1', $_POST['title']);
    
    try {
        if (empty($exerciseId)) {
            /*If there is no exercise id, the exercise is completely new*/
            if (HasSameTitle($_SESSION['userId'], $title)) {
                /*Error another exercise has the same title*/
            } else {
                require ((dirname(__FILE__)) . '/createExercise.php');
            }
        }
        else if (GetLatestAuthorId($exerciseId) == $_SESSION['userId'])) {
            /*If current user is latest author, simply update the exercise*/
            require ((dirname(__FILE__)) . '/updateExercise.php');
        }
        else {
            /*If current user is not latest author, exercise is added as a new exercise and previous version's authors are added to new exercise's list*/
            if (HasSameTitle($_SESSION['userId'], $title)) {
                /*Error another exercise has the same title*/
                
            } else {
                require ((dirname(__FILE__)) . '/updateThisExercise.php');
            }
        }
    } catch(Exception $e) {
        echo 'Error submitting post ';
        echo $e;
    }
}
?>
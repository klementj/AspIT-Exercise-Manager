<?php
/*Import functions and session variables*/
require ((dirname(__FILE__)) . '/isAuthor.php');
require ((dirname(__FILE__)) . '/getLatestAuthorId.php');
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
            require ((dirname(__FILE__)) . '/createExercise.php');
        }
        else {
            if (!IsAuthor($exerciseId, $_SESSION['userId'])) {
                /*If current user is not on the author list, new exercise is added and user is added as latest author*/
                require ((dirname(__FILE__)) . '/transferExercise.php');
            } else {
                if (GetLatestAuthorId($exerciseId) == $_SESSION['userId']) {
                    /*If current user is latest author, simply update the exercise*/
                    require ((dirname(__FILE__)) . '/updateThisExercise.php');
                } else {
                    /*If current user is not latest author but is on the author list, new exercise is added and user is added as latest author*/
                    require ((dirname(__FILE__)) . '/transferExercise.php');
                }
            }
        }
    } catch(Exception $e) {
        echo 'Error submitting post ';
        echo $e;
    }
}
?>
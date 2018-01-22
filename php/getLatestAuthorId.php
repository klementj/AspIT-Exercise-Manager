<?php
function GetLatestAuthorId($exerciseId) {
    /*If exercise has an id that is a number*/
    if (isset($exerciseId)) {
        if (is_numeric($exerciseId)) {
            require ((dirname(__FILE__)) . '/connect.php');
            
            /*Find the latest author to the exercise*/
            /*SQL:
            Select UserId from the authors table
            Only authors that belong to the exercise in question
            Order the authors by newest timestamp first
            Only select the first (newest) author*/
            $stmt = $dbh->prepare(
                "SELECT UserId FROM authors 
                WHERE ExerciseId = ? 
                ORDER BY Timestamp DESC 
                LIMIT 1;"
            );
            $stmt->bindParam(1, $exerciseId);
            $stmt->execute();

            /*Fetch results*/
            if ($author = $stmt->fetch(PDO::FETCH_ASSOC)) {
                /*Close connection and return result*/
                $dbh = null;
                return $author['UserId'];
            } else {
                /*error no author found*/
                $dbh = null;
                throw new Exception('Authors not found');
            }
        } else {
            /*error not a number*/
            throw new Exception('Invalid argument type');
        }
    } else {
        /*error null argument*/
        throw new Exception('Argument null');
    }
}

if (isset($_POST['jsPath'])) {
    $exerciseId = $_POST['exerciseId'];
    
    echo GetLatestAuthorId($exerciseId);
}
?>
<?php
function GetOriginalAuthorId($exerciseId) {
    /*If exercise has an id that is a number*/
    if (isset($exerciseId)) {
        if (is_numeric($exerciseId)) {
            require ((dirname(__FILE__)) . '/connect.php');

            /*Find the first author to the exercise, which is the original author*/
            /*SQL:
            Select UserId from the authors table
            Only authors that belong to the exercise in question
            Order the authors by oldest timestamp first
            Only select the first (oldest) author*/
            $stmt = $dbh->prepare(
                "SELECT UserId FROM authors 
                WHERE ExerciseId = ? 
                ORDER BY Timestamp ASC 
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
            $dbh = null;
            throw new Exception('Invalid argument type');
        }
    } else {
        /*error null argument*/
        $dbh = null;
        throw new Exception('Argument null');
    }
}
?>
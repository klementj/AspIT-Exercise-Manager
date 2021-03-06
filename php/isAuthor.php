<?php
function IsAuthor($exerciseId, $userId) {
    /*If exercise and user have ids that are numbers*/
    if (isset($exerciseId) && isset($userId)) {
        if (is_numeric($exerciseId) && is_numeric($userId)) {
            require ((dirname(__FILE__)) . '/connect.php');
            
            /*Find user id in list of authors*/
            /*SQL:
            Select all columns from authors that match both the exercise and user*/
            $stmt = $dbh->prepare(
                "SELECT * FROM authors
                WHERE ExerciseId = ? AND UserId = ?;"
            );
            $stmt->bindParam(1, $exerciseId);
            $stmt->bindParam(2, $userId);
            $stmt->execute();

            /*Fetch results*/
            if ($author = $stmt->fetch(PDO::FETCH_ASSOC)) {
                /*Close connection and return result*/
                $dbh = null;
                return !empty($author);
            } else {
                /*Close connection and return result*/
                $dbh = null;
                return false;
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
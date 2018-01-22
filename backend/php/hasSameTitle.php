<?php
function HasSameTitle($userId, $inputTitle) {
    /*If exercise has an id that is a number*/
    if (isset($userId)) {
        if (is_numeric($userId)) {
            /*Declare boolean to register duplicate titles*/
            $bool = true;
            
            require ((dirname(__FILE__)) . '/connect.php');
            
            /*SQL:
            1: Create temporary table of authors sorted by newest timestamp
            2: Create temporary table of last table, but with unique exercise ids only
            3: Select title belonging to exercise associated with each latest author where author user id is equal to user's id*/
            $stmt = $dbh->prepare(
                "CREATE TEMPORARY TABLE t1 AS 
                SELECT * 
                FROM authors 
                ORDER BY Timestamp DESC;
                
                CREATE TEMPORARY TABLE t2 AS
                SELECT *
                FROM t1
                GROUP BY ExerciseId;
                
                SELECT Title
                FROM t2
                LEFT JOIN exercises ON t2.ExerciseId = exercises.ExerciseId
                WHERE UserId = ?;"
            );
            $stmt->bindParam(1, $userId);
            $stmt->execute();
            
            /*Declare result array*/
            $resultArray = array();
            
            /*Fetch results*/
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                /*Push result to array*/
                array_push($resultArray, $row['Title']);
            }
            
            /*For each title in array, check against input title*/
            foreach ($title as $resultArray) {
                if ($inputTitle == $title) {
                    $bool = false;
                }
            }
            
            /*Return boolean*/
            return $bool;
            
        } else {
            /*error not a number*/
            throw new Exception('Invalid argument type');
        }
    } else {
        /*error null argument*/
        throw new Exception('Argument null');
    }
}
?>
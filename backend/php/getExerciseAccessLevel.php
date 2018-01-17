<?php
$exerciseId = $_POST['exerciseId'];

/*If exercise has an id that is a number*/
if (isset($exerciseId)) {
    if (is_numeric($exerciseId)) {
        
        require "connect.php";
        /*Find the accesslevel of the exercise*/
        $stmt = $dbh->prepare(
        "SELECT AccessLevel FROM exercises
        WHERE ExerciseId = ?;"
        );
        $stmt->bindParam(1, $exerciseId);
        $stmt->execute();
        
        if ($accesslevel = $stmt->fetch(PDO::FETCH_ASSOC)) {
            /*Close connection and return result*/
            $dbh = null;
            echo $accesslevel['AccessLevel'];
        } else {
            /*error accesslevel not found*/
            $dbh = null;
            throw new Exception('Accesslevel not found');
        }
        
    } else {
        /*error not a number*/
        throw new Exception('Invalid argument type');
    }
} else {
    /*error null argument*/
    throw new Exception('Argument null');
}
?>
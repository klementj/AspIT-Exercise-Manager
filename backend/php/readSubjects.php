<?php
require 'connect.php';

/*Select all subjects and sort by name*/
$stmt = $dbh->prepare("SELECT * FROM subjects ORDER BY SubjectName;");
$stmt->execute();

/*Fetch results*/
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    ?>
    <option value="<?php echo $row['SubjectId']; ?>"><?php echo $row['SubjectName']; ?></option>
    <?php
}

/*Close connection*/
$dbh = null;
?>
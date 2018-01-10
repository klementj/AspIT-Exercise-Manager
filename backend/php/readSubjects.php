<?php
require 'connect.php';

$stmt = $dbh->prepare("SELECT * FROM subjects ORDER BY SubjectName;");
$stmt->execute();

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    ?>
    <option value="<?php echo $row['SubjectId']; ?>"><?php echo $row['SubjectName']; ?></option>
    <?php
}

/*Close connection*/
$dbh = null;
?>
<?php

/*Declare database access variables*/
$host = "localhost";
$dbName = "aspit-exercise-manager";
$dbUsername = "root";
$dbPassword = "";

/*Establish connection*/
try {
    $dbh = new PDO("mysql:dbname=$dbName;host=$host;charset=utf8", $dbUsername, $dbPassword, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8") );
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Error connecting to database.";
    echo $e->getMessage();
}
?>
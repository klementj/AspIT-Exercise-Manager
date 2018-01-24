<?php

function GetCurrentUri() {
    
    $basepath = implode('/', array_slice(explode('/', $_SERVER['SCRIPT_NAME']), 0, -1)) . '/';
    $uri = substr($_SERVER['REQUEST_URI'], strlen($basepath));
    if (strstr($uri, '?')) {
        $uri = substr($uri, 0, strpos($uri, '?'));
    }
    $uri = '/' . trim($uri, '/');
    return $uri;
}

$base_url = GetCurrentUri();
$routes = array();
$temp_routes = explode('/', $base_url);

foreach($temp_routes as $route) {
    
    if (trim($route) != '') {
        array_push($routes, $route);
    }
    
}

$exerciseId = null;

if (sizeof($routes) == 2) {
    /*Use teacher name ($routes[0]) and exercise title ($routes[1]) to find exerciseId*/
    
    $name = $routes[0];
    $title = $routes[1];
    
    require ((dirname(__FILE__)) . '/connect.php');
    
    $stmt = $dbh->prepare(
        "CREATE TEMPORARY TABLE t1 AS
        SELECT authors.ExerciseId, users.FirstName
        FROM authors
        LEFT JOIN users ON authors.UserId = users.UserId
        ORDER BY TimeStamp DESC;
        
        CREATE TEMPORARY TABLE t2 AS
        SELECT *
        FROM t1
        GROUP BY ExerciseId;
        
        SELECT t2.ExerciseId
        FROM t2
        LEFT JOIN exercises ON t2.ExerciseId = exercises.ExerciseId
        WHERE t2.FirstName = ? AND exercises.Title = ?;"
    );
    $stmt->bindParam(1, $name);
    $stmt->bindParam(2, $title);
    
    $stmt->execute();
    
    $stmt->nextRowset();
    $stmt->nextRowset();
    
    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        
        $exerciseId = $row['ExerciseId'];
    }
}
?>
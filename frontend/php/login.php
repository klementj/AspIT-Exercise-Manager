<?php
session_start();

$firstName = '';
$lastName = '';
$email = '';

if (!empty($_GET['firstName'])) {
    $firstName = $_GET['firstName'];
}
if (!empty($_GET['lastName'])) {
    $lastName = $_GET['lastName'];
}
if (!empty($_GET['email'])) {
    $email = $_GET['email'];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Log in | AspIT Exercise Manager</title>
    <link rel="icon" href="../../img/aspitlogo.png">
    <link rel="stylesheet" href="../css/login.css">
    <link rel="stylesheet" href="../fa/font-awesome-4.7.0/css/font-awesome.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="../js/login.js"></script>
</head>
<body>
    <main>
        <form action="../../backend/php/session.php" method="post" id="login" <?php if (isset($_SESSION['isRegistering'])) { echo 'style="display: none;"'; } ?>>
            <div class="inputContainer">
                <input type="text" name="email" placeholder="AspIT email">
                <i class="fa fa-user" aria-hidden="true"></i>
            </div>
            <div class="inputContainer">
                <input type="password" name="password" placeholder="Password">
                <i class="fa fa-lock" aria-hidden="true"></i>
            </div>
            <p class="errorMsg">
                <?php
                if (!empty($_SESSION['errMsg'])) {
                    if ($_SESSION['errMsg'] == 'Invalid username or password') 
                    {
                        echo $_SESSION['errMsg'];
                        unset($_SESSION['errMsg']);
                    }
                }
                ?>
            </p>
            <button type="submit" id="loginBtn" class="proceedBtn">Login</button>
            <div>
                Don't have an account? <a id="registerFormShow" href="#">Register!</a>
            </div>
        </form>
        <form action="../../backend/php/createUser.php" method="post" id="register" <?php if (isset($_SESSION['isRegistering'])) { echo 'style="display: block;"'; unset($_SESSION['isRegistering']); } ?>>
            <div class="inputContainer">
                <input type="text" name="firstName" placeholder="First name" value="<?php echo $firstName ?>">
                <i class="fa fa-user" aria-hidden="true"></i>
            </div>
            <div class="inputContainer">
                <input type="text" name="lastName" placeholder="Last name" value="<?php echo $lastName ?>">
                <i class="fa fa-user" aria-hidden="true"></i>
            </div>
            <div class="inputContainer">
                <input type="email" name="email" placeholder="AspIT email" value="<?php echo $email ?>">
                <i class="fa fa-user" aria-hidden="true"></i>
            </div>
            <div class="inputContainer">
                <input type="password" name="password" placeholder="Password">
                <i class="fa fa-lock" aria-hidden="true"></i>
            </div>
            <div class="inputContainer">
                <input type="password" name="repassword" placeholder="Re-type password">
                <i class="fa fa-lock" aria-hidden="true"></i>
            </div>
            <p class="errorMsg">
               <?php
                if (!empty($_SESSION['errMsg'])) {
                    if ($_SESSION['errMsg'] == 'Fields cannot be empty' || $_SESSION['errMsg'] == 'Passwords do not match' || $_SESSION['errMsg'] == 'Email already in use') 
                    {
                        echo $_SESSION['errMsg'];
                        unset($_SESSION['errMsg']);
                    }
                }
                ?>
            </p>
            <button type="submit" id="registerBtn" class="proceedBtn">Register</button>
            <div>
                Already have an account? <a id="loginFormShow" href="#">Login!</a>
            </div>
        </form>
    </main>
</body>
</html>
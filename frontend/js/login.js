$(document).ready(function() {
    
    $login = $('#login');
    $register = $('#register');
    
    $('#registerFormShow').click(function() {
        $login.slideUp(400, function() {
            $register.slideDown(400);
        });
    });
    
    $('#loginFormShow').click(function() {
        $register.slideUp(400, function() {
            $login.slideDown(400);
        });
    });
    
});
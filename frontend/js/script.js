$(document).ready(function() {
    
    $('.dropdown').hover(function() {
        $('.dropdownMenu').slideDown(200);
    }, function() {
        $('.dropdownMenu').slideUp(200);
    });
    
});
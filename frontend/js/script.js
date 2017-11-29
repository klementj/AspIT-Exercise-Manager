$(document).ready(function() {
    
    $('body').on('click', '[data-editable]', function() {
        
        const $element = $(this);
        
        // Reading relevant css properties from element, so input can be visually similar to element
        const $width = $element.width();
        const $height = $element.height();
        const $fontFamily = $element.css('font-family');
        const $fontSize = $element.css('font-size');
        const $fontWeight = $element.css('font-weight');
        const $marginBottom = $element.css('margin-bottom');
        
        // Getting elememt tag, so we can restore the original element
        const $tag = $element.prop("tagName");
        
        // Creating the input element that will be inserted
        const $input = $('<input spellcheck="false"/>').val($element.text());
        
        // Applying relevant css to the input element
        $input.width($width);
        $input.height($height);
        $input.css('font-family', $fontFamily);
        $input.css('font-size', $fontSize);
        $input.css('font-weight', $fontWeight);
        $input.css('margin-bottom', $marginBottom);
        
        // Replaces the original element with the input
        $element.replaceWith($input);
        
        // Restores the original element with the input text
        const save = function() {
            const $prevEl = $('<' + $tag + ' data-editable/>').text($input.val());
            $input.replaceWith($prevEl);
        };
        
        // Run the save function on input blur. Blur is when an input field loses focus
        $input.one('blur', save).focus();
    });
    
});
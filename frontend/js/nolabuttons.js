$(document).ready(function() {
    
    $('#headerBig').click(function(){
        InsertText('# ', '', '', true);
    });
    
    $('#headerMedium').click(function(){
        InsertText('## ', '', '', true);
    });
    
    $('#headerSmall').click(function(){
        InsertText('### ', '', '', true);
    });
    
    $('#list').click(function(){
        InsertText('* ', '', '', true);
    });
    
    $('#codeblock').click(function(){
        InsertText(';; ', '', '', true);
    });
    
    $('#footnote').click(function(){
        InsertText('', '$$', '$$', false);
    });
    
    $('#italic').click(function(){
        InsertText('', '*', '*', false);
    });
    
    $('#bold').click(function(){
        InsertText('', '**', '**', false);
    });
    
    $('#textColor').click(function() {
        InsertText('#{Black', '{', '}}', false); 
    });
    
    $('#inlineCode').click(function(){
        InsertText('', '[[', ']]', false);
    });
    
    $('#link').click(function(){
        InsertText('', '{{', '}Link}', false);
    });
    
    $('#image').click(function(){
        InsertText('!! ', 'https://source.unsplash.com/random/400x400 ', 'left', true);
    });
    
    // Textarea we will be editing in
    var $element = $('.editor')[0];
    
    // Inserts given LML syntax into textarea
    function InsertText(prefix, wrapStart, wrapEnd, isLineStarter) {
        
        $selStart = $element.selectionStart;
        $selEnd = $element.selectionEnd;
        
        // Variable used for setting cursor selection
        $newSelection = $selEnd + prefix.length + wrapStart.length + wrapEnd.length;
        
        // Check if a text selection is present, and if syntax needs to be inserted at the start of a line
        if (($selStart || $selStart == '0') && isLineStarter == false) {
            // New string based on current text selected
            let $newText = GetTextSelection();
            
            // Adding relevant prefix/wrap to the selected text
            $newText = prefix + wrapStart + $newText + wrapEnd;
            
            // Insert new text into textarea
            AppendTextArea($newText);
            
            $element.focus();
            $element.selectionStart = $newSelection;
            $element.selectionEnd = $newSelection;
            
        }
        else if (($selStart || $selStart == '0') && isLineStarter == true) {
            
            // Identifier used for checking which line we are on - We need to add the current text selection to avoid losing the selected text
            let identifier = GetTextSelection() + '፨ᕫᪿ˩Ͽ֎';
            
            // Insert identifier into textarea
            AppendTextArea(identifier);
            
            // Fills new array with each line from the textarea
            const $splitContent = $('.editor').val().split('\n');
            
            // String used for storing the new textarea value
            let newValue = "";
            
            // Loop through each line in textarea
            $splitContent.forEach(function(item, index) {
                
                // Check if item contains our identifier
                if (item.includes('፨ᕫᪿ˩Ͽ֎')) {
                    
                    // Removes identifier
                    item = item.replace('፨ᕫᪿ˩Ͽ֎', '');
                    
                    // Adds prefix and wrap to the start/end of the line
                    item = prefix + wrapStart + item + wrapEnd;
                    
                }
                
                // Ensuring we avoid inserting linebreak on the last line
                if (index == $splitContent.length - 1) {
                    newValue += item;
                } else {
                    // Insert linebreak into item, and add it to the new value
                    newValue += item + '\n';
                }
                
            });
            
            // Inserts our new value into textarea
            $element.value = newValue;
            
            $element.focus();
            $element.selectionStart = $newSelection;
            $element.selectionEnd = $newSelection;
            
        }
        // If no text selection is present
        else {
            
            // Adds prefix and wrap to the end of the textarea
            $element.value = $element.value + prefix + wrapStart + wrapEnd;
            
        }
    }
    
    // Insert text at current selection in textarea
    function AppendTextArea(textToInsert) {
        
        // DO NOT REMOVE
        const $elementContent = $element.value;
        
        // Get the index of the first selected character
        const $start = $element.selectionStart;
        
        // Get the index of the last selected character
        const $finish = $element.selectionEnd;
        
        // Get all content before our selection
        const $contentStart = $elementContent.substr(0, $start);
     
        // Get all content after our selection
        const $contentEnd = $elementContent.substr($finish, $elementContent.length - $finish);
        
        // Restore element value to its previous state with the new text added
        $element.value = $contentStart + textToInsert + $contentEnd;
    }
    
    // Gets text selection of textarea
    function GetTextSelection() {
        
        // Get the index of the first selected character
        const $start = $element.selectionStart;
        
        // Get the index of the last selected character
        const $finish = $element.selectionEnd;
        
        // Get the selected text
        const $selection = $element.value.substr($start, $finish - $start);
        
        return $selection;
    }
    
});
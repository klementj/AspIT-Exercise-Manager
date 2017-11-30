$(document).ready(function() {
    
    $('#headerBig').click(function(){
        InsertSyntax('# ', '', '', true);
    });
    
    $('#headerMedium').click(function(){
        InsertSyntax('## ', '', '', true);
    });
    
    $('#headerSmall').click(function(){
        InsertSyntax('### ', '', '', true);
    });
    
    $('#list').click(function(){
        InsertSyntax('* ', '', '', true);
    });
    
    $('#codeblock').click(function(){
        InsertSyntax('', ';; csharp\n\n;;', '', true);
    });
    
    $('#footnote').click(function(){
        InsertSyntax('', '$$', '$$', false, 2);
    });
    
    $('#italic').click(function(){
        InsertSyntax('', '*', '*', false, 1);
    });
    
    $('#bold').click(function(){
        InsertSyntax('', '**', '**', false, 2);
    });
    
    $('#textColor').click(function() {
        InsertSyntax('#{Black', '{', '}}', false, 8); 
    });
    
    $('#inlineCode').click(function(){
        InsertSyntax('', '[[', ']]', false, 2);
    });
    
    $('#link').click(function(){
        InsertSyntax('@', '<http://www.aspit.dk/<', '>>', false, 23);
    });
    
    $('#image').click(function(){
        InsertSyntax('!! ', 'https://source.unsplash.com/random/400x400 ', 'left', true);
    });
    
    // Textarea we will be editing in
    var $element = $('.editor')[0];
    
    // Inserts given LML syntax into textarea
    function InsertSyntax(prefix, wrapStart, wrapEnd, isLineStarter, selectionLength) {
        
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
            
            // Preserving our original selection by setting the new selection to the same as the original selection + length of the text we added on
            $element.selectionStart = $selStart + selectionLength;
            $element.selectionEnd = $selEnd + selectionLength;
            
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
                if (item.includes(identifier)) {
                    
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
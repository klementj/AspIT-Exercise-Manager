function ImgUploadFade(fadeIn) {
    
    const overlay = $('#overlay');
    const modal = $('#imgUploadModal');
    
    if (fadeIn) {
        
        overlay.css('display', 'block');
        modal.css('display', 'block');
        
        overlay.animate({
            opacity: 1
        }, 100);
        
        modal.animate({
            opacity: 1
        }, 100);
        
    } else {
        
        overlay.animate({
            opacity: 0
        }, 100, function() {
            overlay.css('display', 'none');
        });
        
        modal.animate({
            opacity: 0
        }, 100, function() {
            modal.css('display', 'none');
        });
        
    }
    
}

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
        InsertSyntax(';; csharp\n\n;;', '', '', true);
    });
    
    $('#footnote').click(function(){
        InsertSyntax('', '$$', '$$', false, 2);
    });
    
    $('#italic').click(function(){
        InsertSyntax('', '||', '||', false, 2);
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
        InsertSyntax('', '[](', ')', false, 1);
    });
    
    $('#image').click(function(){
        InsertSyntax('!! https://source.unsplash.com/random/400x400 left\n\n', '', '', true);
    });
    
    $('#imageUpload').click(function() {
        ImgUploadFade(true);
    });
    
    $('#overlay').click(function() {
        ImgUploadFade(false);
    });
    
    $('#imgUploadBtn').click(function() {
        /*Validate that file input has a value*/
        if ($('#imgUploadModal input').val().length) {
            
            var file_data = $('#imgUploadModal input').prop('files')[0];
            var form_data = new FormData();
            form_data.append('fileToUpload', file_data);
            
            $.ajax({
                
                url: 'php/uploadImage.php',
                dataType: 'text',
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,
                type: 'POST',
                success: function(response) {
                    if (response.split(' ')[0] == 'Error:') {
                        /*On error, alert error*/
                        alert(response);
                    } else {
                        /*On success, insert image in editor*/
                        InsertSyntax('!! ' + response + ' left\n\n', '', '', true);
                        ImgUploadFade(false);
                    }
                },
                error: function(response) {
                    alert(response);
                }
                
            });
        }
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
            $element.selectionStart = $selStart + selectionLength;
            $element.selectionEnd = $selEnd + selectionLength;
            
        }
        else if (($selStart || $selStart == '0') && isLineStarter == true) {
            
            // Textarea value split into an array on each newline character
            const $lines = $element.value.split('\n');
            
            // Line number of the line that caret is currently on
            const $selectedLine = GetLine();
            
            // New value to be inserted into textarea later
            let newValue = '';
            
            $lines.forEach(function(line, index) {
                
                // Add syntax prefix to the line if we are at the selected index
                if (index == $selectedLine - 1) {
                    line = prefix + line;
                }
                
                // Ensuring we avoid inserting newline into the last line in the textarea
                if ($lines.length - 1 == index) {
                    newValue += line;
                } else {
                    newValue += line + '\n';
                }
                
            });
            
            // Setting textarea value to our new value with the prefix inserted
            $element.value = newValue;
            
            $element.focus();
            $element.selectionStart = $selStart + prefix.length;
            $element.selectionEnd = $selEnd + prefix.length;
            
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
    
    // Gets line number for the line that caret is on currently
    function GetLine()
    {
        var $element = $("textarea")[0];
        
        return $element.value.substr(0, $element.selectionStart).split("\n").length;
    }
    
});
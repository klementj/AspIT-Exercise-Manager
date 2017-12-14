$(document).ready(function() {
    
    $title = '';
    $content = '';
    
    $('#saveBtn').click(function() {
        
        // Get values from HTML
        $title = $('#titleInput').val();
        $content = $('#LMLeditor').val();
        $form = $('#saveForm');
        
        // Create our input fields to be inserted into our form
        let exerciseId = $('<input>').attr('type', 'hidden').attr('name', 'exerciseId').val('');
        let subjectInput = $('<input>').attr('type', 'hidden').attr('name', 'subjectId').val('1');
        let titleInput = $('<input>').attr('type', 'hidden').attr('name', 'title').val( $title );
        let contentInput = $('<input>').attr('type', 'hidden').attr('name', 'content').val( $content );
        
        // Insert input fields into form
        $form.append($(exerciseId));
        $form.append($(subjectInput));
        $form.append($(titleInput));
        $form.append($(contentInput));
        
        $.ajax({
            
            type: 'POST',
            url: '../../backend/php/submitExercise.php',
            data: $form.serialize(),
            processData: true,
            success: function() {
                alert('det virk');
            }
            
        });
        
    });
    
    $('#publishBtn').click(function() {
        console.log('jnsdg');
    });
    
});
function FadeOut() {
    
    const overlay = $('#overlay');
    const modal = $('#openModal');

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

$(document).ready(function() {
    
    var $title = '';
    var $content = '';
    var $exerciseId;
    
    $('#openNewExercise').click(function() {
        
        const overlay = $('#overlay');
        const modal = $('#openModal');
        
        overlay.css('display', 'block');
        modal.css('display', 'flex');
        
        overlay.animate({
            opacity: 1
        }, 100);
        
        modal.animate({
            opacity: 1
        }, 100);
        
    });
    
    $('#overlay').click(FadeOut);
    
    $('#saveBtn').click(function() {
        
        // Get values from HTML
        $title = $('#titleInput').val();
        $content = $('#LMLeditor').val();
        var $form = $('#saveForm');
        
        // Create our input fields to be inserted into our form
        let exerciseId = $('<input>').attr('type', 'hidden').attr('name', 'exerciseId').val('36');
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
    
    $('.tTitle a').click(function() {
        
        event.preventDefault();
        
        $.ajax({
            
            type: 'POST',
            url: '../../backend/php/openExercise.php',
            datatype: 'text',
            data: {
                'exerciseId' : $(this).attr('data-id')
            },
            success: function(response) {
                if (response === 'Innaccessible exercise' || response === 'Exercise not found' || response === 'You must be logged in to open an exercise') {
                    
                    alert(response);
                    
                } else {
                    
                    let responseArr = $.parseJSON(response);
                    console.log(responseArr);
                    $('#mainContent').text( '' );
                    
                    $('#titleInput').val( responseArr[0]['Title'] );
                    $('#subjectSelect').val( responseArr[0]['SubjectId'] );
                    $('#author').text( 'Created: ' + responseArr[0]['CreationDate'] + ' by ' + responseArr[1]['FirstName'] + ' ' + responseArr[1]['LastName'] );
                    $('#LMLeditor').val( responseArr[0]['Content'] );
                    $exerciseId = responseArr[0]['ExerciseId'];
                    FadeOut();
                    $('#preview').click();
                    
                }
            }
            
        });
        
    });
    
});
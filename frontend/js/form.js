function OpenExerciseFade(fadeIn) {
    
    const overlay = $('#overlay');
    const modal = $('#openModal');
    
    if (fadeIn) {
        
        overlay.css('display', 'block');
        modal.css('display', 'flex');
        
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
    
    var $title = '';
    var $content = '';
    var $subject = '';
    var $exerciseId = null;
    
    // Making sure the right elements are displayed based on user accesslevel
    if (parseInt(accessLevel) < 2) {
        
        $('#preview').css('display', 'inline-block');
        $('#exerciseCreationContainer').css('display', 'block');
        $('#preview').animate({
            opacity: 1
        }, 1000);
        $('#exerciseCreationContainer').animate({
            opacity: 1
        }, 1000);
        
    } else {
        
        $('#overlay').css({
            'display': 'flex',
            'opacity': '1'
        });
        $('#openModal').css({
            'display': 'flex',
            'opacity': '1'
        });
        
    }
    
    $('#openNewExercise').click(function() {
        
        $('#tableContainer').children('table').children('tbody').html('');
        
        $.ajax({
        
            type: 'POST',
            url: '../../backend/php/readExercises.php',
            datatype: 'text',
            success: function(response) {
                if (false) {
                    
                    
                    
                } else {
                    let responseArr = $.parseJSON(response);
                    
                    $tableBody = $('#tableContainer').children('table').children('tbody');
                    
                    for (i = 0; i < responseArr.length; i++) {
                        
                        $tableBody.append(responseArr[i]);
                        
                    }
                    
                }
            }
            
        });
        
        OpenExerciseFade(true);
    });
    
    $('#overlay').click(function() {
        OpenExerciseFade(false);
    });
    
    $('#saveBtn').click(function() {
        
        // Set title based on text in the title input field, or as 'Untitled' if the title input field is empty
        if ( $.trim($('#titleInput').val()) == '' ) {
            $title = 'Untitled';
        } else {
            $title = $('#titleInput').val();
        }
        
        // Get values from HTML
        $content = $('#LMLeditor').val();
        $subject = $('#subjectSelect').val();
        var $form = $('#saveForm');
        
        // Create our input fields to be inserted into our form
        let exerciseId = $('<input>').attr('type', 'hidden').attr('name', 'exerciseId').val( $exerciseId );
        let subjectInput = $('<input>').attr('type', 'hidden').attr('name', 'subjectId').val( $subject );
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
            success: function(response) {
                if (/^\d+$/.test(response)) {
                    $exerciseId = response;
                    
                    const now = new Date();
                    const hour = ( '0' + now.getHours() ).slice(-2);
                    const minutes = ( '0' + now.getMinutes() ).slice(-2);
                    
                    $('#lastUpdated').css('display', 'block');
                    $('#lastUpdated').text( 'Last updated: ' + now.getFullYear() + '-' + now.getMonth() + 1 + '-' + now.getDate() + ' ' + hour + ':' + minutes );
                    
                    //TODO Save animation
                    
                } else {
                    alert(response);
                }
            }
            
        });
        
    });
    
    $('#deleteBtn').click(function() {
        
        const confirmation = confirm('Are you sure you want to delete "' + $('#titleInput').val() + '"?');
        
        if (confirmation && $exerciseId != null) {
            
            $.ajax({
                
                type: 'POST',
                url: '../../backend/php/deleteExercise.php',
                data: {
                    'exerciseId' : $exerciseId,
                },
                success: function(response) {
                    $('#createNewExercise').click();
                    // TODO Delete animation
                }
                
            })
            
        }
        
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
                    let authorString = '';
                    
                    responseArr[0]['CreationDate'] = responseArr[0]['CreationDate'].slice(0, -3);
                    responseArr[0]['LastUpdated'] = responseArr[0]['LastUpdated'].slice(0, -3);
                    
                    for (var i = 0; i < responseArr[2].length; i++) {
                        authorString += ', ' + responseArr[2][i]['FirstName'] + ' ' + responseArr[2][i]['LastName'];
                    }
                    
                    $('#mainContent').text('');
                    
                    $('#titleInput').val( responseArr[0]['Title'] );
                    $('#subjectSelect').val( responseArr[0]['SubjectId'] );
                    $('#author').text( 'Created: ' + responseArr[0]['CreationDate'] + ' by ' + responseArr[1]['FirstName'] + ' ' + responseArr[1]['LastName'] + authorString);
                    $('#author').css('display', 'block');
                    $('#lastUpdated').css('display', 'block');
                    $('#lastUpdated').text( 'Last updated: ' + responseArr[0]['LastUpdated'] );
                    $('#LMLeditor').val( responseArr[0]['Content'] );
                    $exerciseId = responseArr[0]['ExerciseId'];
                    OpenExerciseFade(false);
                    $('#preview').click();
                    
                }
            }
            
        });
        
    });
    
    $('#createNewExercise').click(function() {
        
        if ($('#preview').css('display') == 'none') {
            $('#edit').click();
        }
        
        $('#titleInput').val('');
        $('#subjectSelect')[0].selectedIndex = 0;
        $('#author').text(userName);
        $('#lastUpdated').css('display', 'none');
        $('#lastUpdated').text('');
        $('.editor').val('');
        $exerciseId = null;
        
    });
    
});
// Exercise related variables
let $title;
let $content;
let $subject;
let $exerciseId;

// Modals
let $openModal;
let $imgUploadModal;
let $publishModal;
let $deleteModal;
let $syntaxModal;
let $newExerciseConfirmationModal;

// Modal array
let $modalArr;

// Buttons
let $newBtn;
let $openBtn;
let $saveBtn;
let $publishBtn;
let $deleteBtn;
let $syntaxBtn;

// Classes used on the buttons
let $confirm;
let $danger;
let $safe;

// Overlay
let $overlay;

// Fades specified modal in or out
function ModalFade(fadeIn, modal) {
    
    const $fadeSpeed = 200;
    
    if (fadeIn) {
        
        $overlay.show();
        modal.show();
        
        $overlay.animate({
            opacity: 1
        }, $fadeSpeed);
        
        modal.animate({
            opacity: 1
        }, $fadeSpeed);
        
    } else {
        
        $overlay.animate({
            opacity: 0
        }, $fadeSpeed, function() {
            $overlay.hide();
        });
        
        modal.animate({
            opacity: 0
        }, $fadeSpeed, function() {
            modal.hide();
        });
        
    }
    
}

// Displays message to user
// Only used for save at the moment
function MessageAnimation(element) {
    
    $animTime = 250;
    
    $(element).css({
        'opacity': 1
    });
    $(element).animate({
        top: '33px'
    }, $animTime, 'swing', function() {
        $(element).animate({
            opacity: 0 
        }, $animTime, 'swing', function() {
            $(element).css('top', '17px');
        });
    });
    
}

// Prepares interface for the creation of a new exercise
function NewExercise() {
    
    if ($('#preview').css('display') == 'none') {
        $('#edit').click();
    }
    
    $publishBtn.hide();
    $deleteBtn.hide();
    $('#titleInput').val('Untitled');
    $('#subjectSelect')[0].selectedIndex = 0;
    $('#author').text(userName);
    $('#lastUpdated').hide();
    $('#lastUpdated').text('');
    $('.editor').val('');
    $exerciseId = null;
    
}

// Opens exercise
// This function uses ajax and communicates with the database
function OpenExercise() {
    
    // Empty the contents of the table so we avoid showing duplicate exercises
    $openModal.find('tbody').html('');
    
    // Ajax call to retrieve exercises from the database and insert them into our table
    $.ajax({
        
        type: 'POST',
        url: 'php/readExercises.php',
        datatype: 'text',
        success: function(response) {
            
            // Array containing our response from the PHP file
            let responseArr = $.parseJSON(response);
            
            // Table body that we will be inserting into
            $tableBody = $openModal.find('tbody');
            
            // Loop through the response array
            for (i = 0; i < responseArr.length; i++) {
                // Insert each item into the table
                $tableBody.append(responseArr[i]);
            }
            
            // Each exercise inserted contains a link for opening the exercise
            // This event fires when said link is clicked
            $('.tTitle a').click(function(event) {
                
                // Prevents the default a-tag event
                event.preventDefault();
                
                // Ajax call to retrieve the relevant exercise information and insert it into our interface
                $.ajax({
                    
                    type: 'POST',
                    url: 'php/openExercise.php',
                    datatype: 'text',
                    data: {
                        // data-id attribute of the a-tag that was clicked is sent to get the correct exercise
                        'exerciseId' : $(this).attr('data-id')
                    },
                    success: function(response) {
                        // Alert error message if we get one
                        if (response === 'Innaccessible exercise' || response === 'Exercise not found' || response === 'You must be logged in to open an exercise') {
                            
                            alert(response);
                            
                        } else {
                            
                            // Array containing our response from the PHP file
                            let responseArr = $.parseJSON(response);
                            
                            // String that we use to display all authors on the exercise
                            let authorString = '';
                            
                            // Slicing seconds off the dates
                            responseArr[0]['CreationDate'] = responseArr[0]['CreationDate'].slice(0, -3);
                            responseArr[0]['LastUpdated'] = responseArr[0]['LastUpdated'].slice(0, -3);
                            
                            // Looping through the author list
                            for (var i = 0; i < responseArr[2].length; i++) {
                                authorString += ', ' + responseArr[2][i]['FirstName'] + ' ' + responseArr[2][i]['LastName'];
                            }
                            
                            // Setting exercise ID to the ID of the exercise we opened
                            $exerciseId = responseArr[0]['ExerciseId'];
                            
                            // Clearing maincontent
                            $('#mainContent').text('');
                            
                            // Setting the different labels to the correct values from the exercise we opened
                            $('#titleInput').val( responseArr[0]['Title'] );
                            $('#subjectSelect').val( responseArr[0]['SubjectId'] );
                            $('#author').text( 'Created: ' + responseArr[0]['CreationDate'] + ' by ' + responseArr[1]['FirstName'] + ' ' + responseArr[1]['LastName'] + authorString);
                            $('#author').show();
                            $('#lastUpdated').show();
                            $('#lastUpdated').text( 'Last updated: ' + responseArr[0]['LastUpdated'] );
                            $('#LMLeditor').val( responseArr[0]['Content'] );
                            
                            // Ajax call to check whether user is latest author on the opened exercise
                            // Show visibility button if they are, and hide it if they are not
                            $.ajax({
                                
                                type: 'POST',
                                url: 'php/getLatestAuthorId.php',
                                data: {'jsPath' : 'true', 'exerciseId' : $exerciseId},
                                success: function(response) {
                                    if (userId == response) {
                                        $('#publishBtn').show();
                                        $('#deleteBtn').show();
                                    } else {
                                        $('#publishBtn').hide();
                                        $('#deleteBtn').hide();
                                    }
                                }
                                
                            });
                            
                            ModalFade(false, $openModal);
                            $('#preview').click();
                            
                        }
                    }
                    
                });
                
            });
        }
        
    });
    
    ModalFade(true, $openModal);
    
}

// Saves exercise
// This function uses ajax and communicates with the database
function SaveExercise(newExercisePath) {
    
    // Set title based on text in the title input field, or as 'Untitled' if the title input field is empty
    if ( $.trim($('#titleInput').val()) == '' ) {
        $title = 'Untitled';
    } else {
        $title = $('#titleInput').val();
    }
    
    // Get values from HTML
    $content = $('#LMLeditor').val();
    $subject = $('#subjectSelect').val();
    
    // Ajax call to send the exercise information to a PHP file that then saves it in the database
    $.ajax({
        
        type: 'POST',
        url: 'php/submitExercise.php',
        data: {
            'exerciseId' : $exerciseId,
            'subjectId' : $subject,
            'content' : $content,
            'title' : $title
        },
        processData: true,
        success: function(response) {
            // Regex to check if response is a number
            if (/^\d+$/.test(response)) {
                $exerciseId = response;
                
                const now = new Date();
                
                // Slicing seconds off our date
                const hour = ( '0' + now.getHours() ).slice(-2);
                const minutes = ( '0' + now.getMinutes() ).slice(-2);
                
                // Unhiding the relevant buttons and labels
                $publishBtn.show();
                $deleteBtn.show();
                $('#lastUpdated').show();
                
                // Updating the lastUpdated label with the current time
                $('#lastUpdated').text( 'Last updated: ' + now.getFullYear() + '-' + now.getMonth() + 1 + '-' + now.getDate() + ' ' + hour + ':' + minutes );
                
                // NewExercisePath is used to see whether the new exercise interface should show after saving
                if (newExercisePath) {
                    NewExercise();
                    ModalFade(false, $newExerciseConfirmationModal);
                }
                
                // Message to show the user that their exercise was saved
                MessageAnimation($saveBtn.find('span'));
                
            } else {
                alert(response);
            }
        }
        
    });
    
}

// Gets exercise accesslevel and ticks the appropriate radiobutton
// This function uses ajax and communicates with the database
function GetExerciseAccessLevel() {
    
    if ($exerciseId != null) {
        
        // Ajax call to retrieve the exercise accesslevel
        $.ajax({
            
            type: 'POST',
            url: 'php/getExerciseAccessLevel.php',
            data: {
                'exerciseId' : $exerciseId,
            },
            success: function(response) {
                
                const exerciseAccessLevel = response;
                
                // Check the corresponding radio button
                $publishModal.find('input[value=' + exerciseAccessLevel + ']').prop('checked', 'true');
                
            },
            error: function(response) {
                alert(response);
            }
            
        });
        
    } else {
        $publishModal.find('input[value=0]').prop('checked', 'true');
    }
    
}

// Updates exercise accesslevel
// This function uses ajax and communicates with the database
function UpdateExerciseAccesslevel() {
    
    if ($exerciseId != null) {
    
    // Read the desired new accesslevel based on what radio button is checked
    const exerciseAccessLevel = $('#publishModal input:checked').val();
    
    // Ajax call to update the exercises accesslevel
    $.ajax({
        
        type: 'POST',
        url: 'php/publish.php',
        data: {
            'accessLevel' : exerciseAccessLevel,
            'exerciseId' : $exerciseId,
        },
        success: function(response) {
            if (response === 'You do not have permission to publish this exercise. You must be the latest author to change visibility state.' || response === 'Invalid access level' || response === 'You must be logged in to publish an exercise') {
                alert(response);
            }
            ModalFade(false, $publishModal);
        },
        error: function(response) {
            alert(response);
        }
    
    });
    
    } else {
        alert('You must save an exercise before changing its visibility state.');
    }
    
}

// Deletes exercise
// This function uses ajax and communicates with the database
function DeleteExercise() {
    
    // Updating the message in the modal to dynamically show title for the exercise that is open
    $deleteModal.find('p').text('Are you sure you want to delete "' + $('#titleInput').val() + '"?');
    
    ModalFade(true, $deleteModal);
    
    // Click event for the actual deletion of the exercise
    $deleteModal.find('.danger').click(function() {
        
        if ($exerciseId != null) {
            
            // Ajax call to delete the exercise
            $.ajax({
                
                type: 'POST',
                url: 'php/deleteExercise.php',
                data: {
                    'exerciseId' : $exerciseId,
                },
                success: function(response) {
                    
                    // Preparing interface for new exercise
                    NewExercise();
                    ModalFade(false, $deleteModal);
                }
                
            })
            
        }
        
    });
    
    // Click event for the cancel button
    $deleteModal.find('.safe').click(function() {
        ModalFade(false, $deleteModal);
    });
    
}

$(document).ready(function() {
    
    // Exercise related variables
    $title = '';
    $content = '';
    $subject = '';
    $exerciseId = null;
    
    // Modals
    $openModal = $('#openModal');
    $publishModal = $('#publishModal');
    $imgUploadModal = $('#imgUploadModal');
    $syntaxModal = $('#syntaxModal');
    $deleteModal = $('#deleteModal');
    $newExerciseConfirmationModal = $('#newExerciseConfirmationModal');
    
    // Modal array
    $modalArr = [$openModal, $publishModal, $imgUploadModal, $syntaxModal, $deleteModal, $newExerciseConfirmationModal];
    
    // Buttons
    $newBtn = $('#createNewExerciseBtn');
    $openBtn = $('#openNewExerciseBtn');
    $saveBtn = $('#saveBtn');
    $publishBtn = $('#publishBtn');
    $deleteBtn = $('#deleteBtn');
    $syntaxBtn = $('#syntaxHelp');
    
    // Confirm is not a button per se, but it is the default button class used by most modals confirm changes
    $confirm = '.confirm';
    $danger = '.danger';
    $safe = '.safe';
    
    // Overlay
    $overlay = $('#overlay');
    
    $newBtn.click(function() {
        
        const $editor = $('#LMLeditor');
        
        if ($editor.val()) {
            // Fade in the confirmation modal if there is text in the textarea
            ModalFade(true, $newExerciseConfirmationModal);
        } else {
            // Prepare interface for new exercise if there is no text in the textarea
            NewExercise();
        }
    });
    
    $newExerciseConfirmationModal.find($safe).click(function() {
        SaveExercise(true);
    });
    
    $newExerciseConfirmationModal.find($danger).click(function() {
        NewExercise();
        ModalFade(false, $newExerciseConfirmationModal);
    });
    
    $openBtn.click(function() {
        OpenExercise();
    });
    
    $saveBtn.click(function() {
        SaveExercise();
    });
    
    $publishBtn.click(function() {
        GetExerciseAccessLevel();
        ModalFade(true, $publishModal);
    });
    
    $publishModal.find($confirm).click(function() {
        UpdateExerciseAccesslevel();
    });
    
    $deleteBtn.click(function() {
        DeleteExercise();
    });
    
    $overlay.click(function() {
        //Loop through the modal array to fade out all the modals that are being displayed
        for (i = 0; i < $modalArr.length; i++) {
            if ($modalArr[i].css('display') == 'block') {
                ModalFade(false, $modalArr[i]);
            }
        }
    });
    
    $syntaxBtn.click(function() {
        ModalFade(true, $syntaxModal);
    });
    
    // Ctrl + S keybind functionality
    $(document).keydown(function(event) {
        // Keycode for S is 83
        if ((event.ctrlKey || event.metaKey) && event.which == 83) {
            SaveExercise();
            event.preventDefault();
        }
    });
    
    // Making sure the right elements are displayed based on user accesslevel
    if (parseInt(accessLevel) < 2) {
        
        const $preview = $('#preview');
        const $container = $('#exerciseCreationContainer');
        
        $preview.show();
        $container.show();
        $preview.animate({
            opacity: 1
        }, 1000);
        $container.animate({
            opacity: 1
        }, 1000);
        
    } else {
        $openBtn.click();
    }
    
});
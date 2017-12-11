$(document).ready(function() {
    
    $content = '';
    
    $('#LMLeditor').change(function() {
        $content = $('#LMLeditor').val();
    });
    
    $('#saveBtn').click(function() {
        
        $form = $('#saveForm');
        
        let titleInput = $('<input>').attr('type', 'hidden').attr('name', 'title').val( $('#title').text() );
        let contentInput = $('<input>').attr('type', 'hidden').attr('name', 'content').val( $content );
        let subjectInput = $('<input>').attr('type', 'hidden').attr('name', 'subjectId').val( '1' );
        
        $form.append($(titleInput));
        $form.append($(contentInput));
        $form.append($(subjectInput));
        
    });
    
    $('#publishBtn').click(function() {
        
        console.log($('#subjectSelect').val());
        
    });
    
});
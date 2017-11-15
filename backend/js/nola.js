function LMLTranslate() {
    textarea = document.getElementById("LMLeditor");
    input = textarea.value;
    lines = input.split(/\n/g);
    
    for (i = 0; i < lines.length; i++) {
        switch(lines[i].split(' ')[0]) {
            case '#':
                lines[i] = '<h2>' + lines[i].slice(2) + '</h2>';
                break;
            case '##':
                lines[i] = '<h2>' + lines[i].slice(2) + '</h2>';
                break;
            case '###':
                lines[i] = '<h2>' + lines[i].slice(2) + '</h2>';
                break;
            case ';;':
                
                break;
            case '!!':
                
                break;
            case '??':
                
                break;
            case '*':
                
                break;
            default:
                break;
        }
    }
}
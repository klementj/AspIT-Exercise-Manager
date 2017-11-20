function LMLTranslate() {
    textarea = document.getElementById("LMLeditor");
    input = textarea.value;
    output = "";
    inputLines = input.split(/\n/g);
    outputLines = Array(inputLines.length);
    
    for (i = 0; i < inputLines.length; i++) {
        switch(inputLines[i].split(' ')[0]) {
            case '#':
                outputLines[i] = '<h2>' + inputLines[i].slice(2) + '</h2>';
                break;
                
            case '##':
                outputLines[i] = '<h3>' + inputLines[i].slice(3) + '</h3>';
                break;
                
            case '###':
                outputLines[i] = '<h4>' + inputLines[i].slice(4) + '</h4>';
                break;
                
            case ';;':
                if (i == 0){
                    if (i == inputLines.length - 1) {
                        outputLines[i] = '<p class="codeblock">' + inputLines[i].slice(3) + '</p>';
                    }
                    else {
                        outputLines[i] = '<p class="codeblock">' + inputLines[i].slice(3);
                        if (inputLines[i + 1].split(' ')[0] != ';;') {
                            outputLines[i] += '</p>';
                        }
                    }
                }
                else if (i == inputLines.length - 1) {
                    if (inputLines[i - 1].split(' ')[0] != ';;') {
                        outputLines[i] = '<p class="codeblock">' + inputLines[i].slice(3) + '</p>';
                    }
                    else {
                        outputLines[i] = '<br>' + inputLines[i].slice(3) + '</p>';
                    }
                }
                else if (i > 0 && i < inputLines.length - 1){
                    if (inputLines[i - 1].split(' ')[0] != ';;') {
                        if (inputLines[i + 1].split(' ')[0] != ';;'){
                            outputLines[i] = '<p class="codeblock">' + inputLines[i].slice(3) + '</p>'
                        }
                        else {
                            outputLines[i] = '<p class="codeblock">' + inputLines[i].slice(3);
                        }
                    }
                    else if (inputLines[i + 1].split(' ')[0] != ';;') {
                        outputLines[i] = '<br>' + inputLines[i].slice(3) + '</p>';
                    }
                    else {
                        outputLines[i] = '<br>' + inputLines[i].slice(3);
                    }
                }
                break;
                
            case '!!':
                tags = inputLines[i].split(' ');
                link = "";
                size = "left";
                text = "";
                if (tags.length > 1) {
                    link = tags[1];
                    if (tags.length > 2) {
                        if (tags[2] == 'left' || tags[2] == 'right' || tags[2] == 'big') {
                            size = tags[2];
                            if (tags.length > 3) {
                                for (j = 3; j < tags.length; j++) {
                                if (j == 3) { text += tags[j]; }
                                else { text += ' ' + tags[j]; }
                            }
                            }
                        }
                        else {
                            for (j = 2; j < tags.length; j++) {
                                if (j == 2) { text += tags[j]; }
                                else { text += ' ' + tags[j]; }
                            }
                        }
                    }
                }
                outputLines[i] = '<img class="' + size + '-img" url="' + link + '" alt="' + text + '">';
                break;
                
            case '??':
                tags = inputLines[i].split(' ');
                link = "";
                if (tags.length > 1) {
                    link = tags[1];
                }
                outputLines[i] =
                '<figure class="iframe-wrapper">' +
                    '<iframe src="' + link + '" frameborder="0" allowfullscreen></iframe>' +
                '</figure>';
                break;
                
            case '*':
                if (i == 0){
                    if (i == inputLines.length - 1) {
                        outputLines[i] = '<ul><li>' + inputLines[i].slice(2) + '</li></ul>';
                    }
                    else {
                        outputLines[i] = '<ul><li>' + inputLines[i].slice(2) + '</li>';
                        if (inputLines[i + 1].split(' ')[0] != '*') {
                            outputLines[i] += '</ul>';
                        }
                    }
                }
                else if (i == inputLines.length - 1) {
                    if (inputLines[i - 1].split(' ')[0] != '*') {
                        outputLines[i] = '<ul><li>' + inputLines[i].slice(3) + '</li></ul>';
                    }
                    else {
                        outputLines[i] = '<li>' + inputLines[i].slice(3) + '</li></ul>';
                    }
                }
                else if (i > 0 && i < inputLines.length - 1){
                    if (inputLines[i - 1].split(' ')[0] != '*') {
                        if (inputLines[i + 1].split(' ')[0] != '*'){
                            outputLines[i] = '<ul><li>' + inputLines[i].slice(2) + '</li></ul>'
                        }
                        else {
                            outputLines[i] = '<ul><li>' + inputLines[i].slice(2) + '</li>';
                        }
                    }
                    else if (inputLines[i + 1].split(' ')[0] != '*') {
                        outputLines[i] = '<li>' + inputLines[i].slice(2) + '</li></ul>';
                    }
                    else {
                        outputLines[i] = '<li>' + inputLines[i].slice(2) + '</li>';
                    }
                }
                break;
                
            default:
                outputLines[i] = '<p>' + inputLines[i] + '</p>';
                break;
        }
        output += outputLines[i] + '\n';
    }
    
    output = output.replace(/\*\*(.*)\*\*/g, function(a, b) {
        return '<strong>' + b + '</strong>';
    });
    
    output = output.replace(/\*(.*)\*/g, function(a, b) {
        return '<en>' + b + '</en>';
    });
    
    output = output.replace(/\[\[(.*)\]\]/g, function(a, b) {
        return '<code>' + b + '</code>';
    });
    
    output = output.replace(/\{\{(.*)\}(.*)\}/g, function(a, b, c) {
        return '<a href="' + c + '">' + b + '</a>';
    });
    
    output = output.replace(/\$\$(.*)\$\$/g, function(a, b) {
        return '<sup><span class="footnote">' + b + '</span></sup>';
    });
    
    output = output.replace(/\#\{(.+)\{(.*)\}\}/g, function(a, b, c) {
        return '<i style="color:' + b + '">' + c + '</i>';
    });
    
    console.log(output);
}
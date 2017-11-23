var inputLines;
var leftOutputLines;
var leftOutput;
var rightOutputLines;
var rightOutput;

const header1Syntax = '#';
const header2Syntax = '##';
const header3Syntax = '###';
const codeblockSyntax = ';;';
const imageSyntax = '!!';
const iframeSyntax = '??';
const listSyntax = '*';

function LMLTranslate() {
    textarea = document.getElementById("LMLeditor");
    input = textarea.value;
    leftOutput = "";
    rightOutput = "";
    inputLines = input.split(/\n/g);
    leftOutputLines = Array(inputLines.length);
    rightOutputLines = [];
    
    for (i = 0; i < inputLines.length; i++) {
        switch(inputLines[i].split(' ')[0]) {
            case header1Syntax:
                Header1(i);
                break;
                
            case header2Syntax:
                Header2(i);
                break;
                
            case header3Syntax:
                Header3(i);
                break;
                
            case codeblockSyntax:
                Codeblock(i);
                break;
                
            case imageSyntax:
                Image(i);
                break;
                
            case iframeSyntax:
                Iframe(i);
                break;
                
            case listSyntax:
                List(i);
                break;
                
            default:
                Paragraph(i);
                break;
        }
        leftOutput += leftOutputLines[i] + '\n';
    }
    
    LeftOutputFormatting();
    
    for (i = 0; i < rightOutputLines.length; i++) {
        rightOutput += rightOutputLines[i] + '\n';
    }
    
    RightOutputFormatting();
    
    console.log(leftOutput);
    console.log(rightOutput);
}


function Header1(i) {
    leftOutputLines[i] = '<h2>' + inputLines[i].slice(header1Syntax.length + 1) + '</h2>';
}

function Header2(i) {
    leftOutputLines[i] = '<h3>' + inputLines[i].slice(header2Syntax.length + 1) + '</h3>';
}

function Header3(i) {
    leftOutputLines[i] = '<h4>' + inputLines[i].slice(header3Syntax.length + 1) + '</h4>';
}

function Codeblock(i) {
    if (i == 0){
        if (i == inputLines.length - 1) {
            leftOutputLines[i] = '<p class="codeblock">' + inputLines[i].slice(codeblockSyntax.length + 1) + '</p>';
        }
        else {
            leftOutputLines[i] = '<p class="codeblock">' + inputLines[i].slice(codeblockSyntax.length + 1);
            if (inputLines[i + 1].split(' ')[0] != ';;') {
                leftOutputLines[i] += '</p>';
            }
        }
    }
    else if (i == inputLines.length - 1) {
        if (inputLines[i - 1].split(' ')[0] != ';;') {
            leftOutputLines[i] = '<p class="codeblock">' + inputLines[i].slice(codeblockSyntax.length + 1) + '</p>';
        }
        else {
            leftOutputLines[i] = '<br>' + inputLines[i].slice(codeblockSyntax.length + 1) + '</p>';
        }
    }
    else if (i > 0 && i < inputLines.length - 1){
        if (inputLines[i - 1].split(' ')[0] != ';;') {
            if (inputLines[i + 1].split(' ')[0] != ';;'){
                leftOutputLines[i] = '<p class="codeblock">' + inputLines[i].slice(codeblockSyntax.length + 1) + '</p>'
            }
            else {
                leftOutputLines[i] = '<p class="codeblock">' + inputLines[i].slice(codeblockSyntax.length + 1);
            }
        }
        else if (inputLines[i + 1].split(' ')[0] != ';;') {
            leftOutputLines[i] = '<br>' + inputLines[i].slice(codeblockSyntax.length + 1) + '</p>';
        }
        else {
            leftOutputLines[i] = '<br>' + inputLines[i].slice(codeblockSyntax.length + 1);
        }
    }
}

function Image(i) {
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
    if (size == 'right') {
        leftOutputLines[i] = '<figure class="right-img-anchor" id="img-anchor-' + i + '">';
        rightOutputLines.push('<img class="' + size + '-img" url="' + link + '" alt="' + text + '">');
    }
    else {
        leftOutputLines[i] = '<img class="' + size + '-img" url="' + link + '" alt="' + text + '">';
    }
}

function Iframe(i) {
    tags = inputLines[i].split(' ');
    link = "";
    if (tags.length > 1) {
        link = tags[1];
    }
    leftOutputLines[i] =
    '<figure class="iframe-wrapper">\n' +
        '<iframe src="' + link + '" frameborder="0" allowfullscreen></iframe>\n' +
    '</figure>';
}

function List(i) {
    if (i == 0){
        if (i == inputLines.length - 1) {
            leftOutputLines[i] = '<ul>\n<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n</ul>';
        }
        else {
            leftOutputLines[i] = '<ul>\n<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>';
            if (inputLines[i + 1].split(' ')[0] != '*') {
                leftOutputLines[i] += '\n</ul>';
            }
        }
    }
    else if (i == inputLines.length - 1) {
        if (inputLines[i - 1].split(' ')[0] != '*') {
            leftOutputLines[i] = '<ul>\n<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n</ul>';
        }
        else {
            leftOutputLines[i] = '<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n</ul>';
        }
    }
    else if (i > 0 && i < inputLines.length - 1){
        if (inputLines[i - 1].split(' ')[0] != '*') {
            if (inputLines[i + 1].split(' ')[0] != '*'){
                leftOutputLines[i] = '<ul>\n<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n</ul>'
            }
            else {
                leftOutputLines[i] = '<ul>\n<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>';
            }
        }
        else if (inputLines[i + 1].split(' ')[0] != '*') {
            leftOutputLines[i] = '<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n</ul>';
        }
        else {
            leftOutputLines[i] = '<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>';
        }
    }
}

function Paragraph(i) {
    leftOutputLines[i] = '<p>' + inputLines[i] + '</p>';
}


function LeftOutputFormatting() {
    n = 1;
    leftOutput = leftOutput.replace(/\$\$(.*)\$\$/g, function(a, b) {
        rightOutputLines.push('<p class="footnote" id="footnote-' + n + '"><sup>' + n + '</sup>' + b + '</p>');
        return '<sup id="footnoteRef-' + n + '">' + n++ + '</sup>';
    });
    
    leftOutput = leftOutput.replace(/\*\*([^\*]*)\*\*/g, function(a, b) {
        return '<strong>' + b + '</strong>';
    });
    
    leftOutput = leftOutput.replace(/\*([^\*]*)\*/g, function(a, b) {
        return '<en>' + b + '</en>';
    });
    
    leftOutput = leftOutput.replace(/\[\[(.*)\]\]/g, function(a, b) {
        return '<code>' + b + '</code>';
    });
    
    leftOutput = leftOutput.replace(/\{\{(.*)\}(.*)\}/g, function(a, b, c) {
        return '<a href="' + c + '">' + b + '</a>';
    });
    
    leftOutput = leftOutput.replace(/\#\{(.+)\{(.*)\}\}/g, function(a, b, c) {
        return '<i style="color:' + b + '">' + c + '</i>';
    });
}

function RightOutputFormatting() {
    rightOutput = rightOutput.replace(/\*\*([^\*]*)\*\*/g, function(a, b) {
        return '<strong>' + b + '</strong>';
    });
    
    rightOutput = rightOutput.replace(/\*([^\*]*)\*/g, function(a, b) {
        return '<en>' + b + '</en>';
    });
    
    rightOutput = rightOutput.replace(/\[\[(.*)\]\]/g, function(a, b) {
        return '<code>' + b + '</code>';
    });
    
    rightOutput = rightOutput.replace(/\{\{(.*)\}(.*)\}/g, function(a, b, c) {
        return '<a href="' + c + '">' + b + '</a>';
    });
    
    rightOutput = rightOutput.replace(/\#\{(.+)\{(.*)\}\}/g, function(a, b, c) {
        return '<i style="color:' + b + '">' + c + '</i>';
    });
}
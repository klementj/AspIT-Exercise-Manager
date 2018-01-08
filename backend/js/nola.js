$(document).ready(function() {
    
    var inputLines;
    var outputLines;
    var output;
    var rightOutputLines;
    var rightOutput;

    const header1Syntax = '#';
    const header2Syntax = '##';
    const header3Syntax = '###';
    const codeblockSyntax = ';;';
    const imageSyntax = '!!';
    const listSyntax = '*';
    
    var codeblocking = false;
    var htmlCodeBlocking = false;

    function LMLTranslate() {
        textarea = document.getElementById("LMLeditor");
        input = textarea.value;
        output = "";
        inputLines = input.split(/\n/g);
        outputLines = Array(inputLines.length);

        for (i = 0; i < inputLines.length; i++) {
            if (!codeblocking) {
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

                    case listSyntax:
                        List(i);
                        break;
                        
                    case '':
                        outputLines[i] = inputLines[i];
                        break;

                    default:
                        Paragraph(i);
                        break;
                }
            }
            else {
                switch(inputLines[i].split(' ')[0]) {
                    case codeblockSyntax:
                        Codeblock(i);
                        break;
                    default:
                        if (htmlCodeBlocking) {
                            outputLines[i] = inputLines[i].replace(/\</g, '&lt') + '\n';
                        }
                        else {
                            outputLines[i] = inputLines[i] + '\n';
                        }
                        break;
                }
            }
            
            output += outputLines[i];
        }

        outputFormatting();

        $('#mainContent').html( $('#mainContent').html() + output );
    }
    
    function Header1(i) {
        outputLines[i] = '<h2>' + inputLines[i].slice(header1Syntax.length + 1) + '</h2>\n';
    }

    function Header2(i) {
        outputLines[i] = '<h3>' + inputLines[i].slice(header2Syntax.length + 1) + '</h3>\n';
    }

    function Header3(i) {
        outputLines[i] = '<h4>' + inputLines[i].slice(header3Syntax.length + 1) + '</h4>\n';
    }

    function Codeblock(i) {
        if (codeblocking) {
            outputLines[i] = '</code></pre>\n';
            codeblocking = false;
            
            if (htmlCodeBlocking) {
                htmlCodeBlocking = false;
            }
        }
        
        else {
            language = inputLines[i].split(' ')[1].toLowerCase();
            outputLines[i] = '<pre class="language-' + language + '"><code class="language-' + language + '">';
            codeblocking = true;
            if (language == 'html') { htmlCodeBlocking = true; }
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
                if (tags[2].toLowerCase() == 'left' || tags[2].toLowerCase() == 'right' || tags[2].toLowerCase() == 'big') {
                    size = tags[2].toLowerCase();
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
        outputLines[i] = '<img class="' + size + '-img" src="' + link + '" alt="' + text + '">\n';
    }

    function List(i) {
        if (i == 0){
            if (i == inputLines.length - 1) {
                outputLines[i] = '<ul>\n<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n</ul>\n';
            }
            else {
                outputLines[i] = '<ul>\n<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n';
                if (inputLines[i + 1].split(' ')[0] != '*') {
                    outputLines[i] += '\n</ul>\n';
                }
            }
        }
        else if (i == inputLines.length - 1) {
            if (inputLines[i - 1].split(' ')[0] != '*') {
                outputLines[i] = '<ul>\n<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n</ul>\n';
            }
            else {
                outputLines[i] = '<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n</ul>\n';
            }
        }
        else if (i > 0 && i < inputLines.length - 1){
            if (inputLines[i - 1].split(' ')[0] != '*') {
                if (inputLines[i + 1].split(' ')[0] != '*'){
                    outputLines[i] = '<ul>\n<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n</ul>\n'
                }
                else {
                    outputLines[i] = '<ul>\n<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n';
                }
            }
            else if (inputLines[i + 1].split(' ')[0] != '*') {
                outputLines[i] = '<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n</ul>\n';
            }
            else {
                outputLines[i] = '<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n';
            }
        }
    }

    function Paragraph(i) {
        outputLines[i] = '<p class="content">' + inputLines[i] + '</p>\n';
    }

    function outputFormatting() {
        output = output.replace(/\$\$(.*)\$\$/g, function(a, b) {
            return '<label for="sidenote" class="sidenoteCounter"></label>\n'
                + '<span class="sidenote">' + b + '</span>';
        });

        output = output.replace(/\*\*([^\*]*)\*\*/g, function(a, b) {
            return '<strong>' + b + '</strong>';
        });

        output = output.replace(/\|\|(.*)\|\|/g, function(a, b) {
            return '<em>' + b + '</em>';
        });

        output = output.replace(/\[\[(.*)\]\]/g, function(a, b) {
            return '<code>' + b + '</code>';
        });

        output = output.replace(/\@\<(.*)\<(.*)\>\>/g, function(a, b, c) {
            return '<a href="' + b + '">' + c + '</a>';
        });

        output = output.replace(/\#\{(.+)\{(.*)\}\}/g, function(a, b, c) {
            return '<i style="color:' + b + '">' + c + '</i>';
        });
    }
    
    var $editBtn = $('#edit');
    var $previewBtn = $('#preview');
    var $prevContent;
    var $prevLeftHTML;
    var $prevRightHTML;
    
    function Preview() {
        // Gets current HTML and textarea value so we can restore them later
        $prevContent = $('#LMLeditor').val();
        $prevLeftHTML = $('#mainContent').html();

        // Hides text editor
        $('.editor-wrapper').css('display', 'none');

        // Translates text in textarea from syntax to HTML elements
        LMLTranslate();

        // Converts title to an input
        $('#titleInput').css('display', 'none');
        $('#title').css('display', 'inline-block');
        $('#title').text( $('#titleInput').val() );

        // Swaps which button is shown
        $previewBtn.css('display', 'none');
        $editBtn.css('display', 'inline-block');

        Prism.highlightAll();
    }

    function Edit() {
        // Restores HTML to what it was previous to preview
        $('#mainContent').html($prevLeftHTML);

        $('#title').css('display', 'none');
        $('#titleInput').css('display', 'inline-block');

        // Unhides textarea
        $('.editor-wrapper').css('display', 'block');

        // Sets textarea content to what it was previous to preview
        $('#LMLeditor').val($prevContent);

        // Swaps which button is shown
        $previewBtn.css('display', 'inline-block');
        $editBtn.css('display', 'none');
    }
    
    $previewBtn.click(Preview);
    
    $editBtn.click(Edit);
});
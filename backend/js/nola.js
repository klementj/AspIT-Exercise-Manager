$(document).ready(function() {
    
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
//    const iframeSyntax = '??';
    const listSyntax = '*';
    
    var codeblocking = false;

    function LMLTranslate() {
        textarea = document.getElementById("LMLeditor");
        input = textarea.value;
        leftOutput = "";
        rightOutput = "";
        inputLines = input.split(/\n/g);
        leftOutputLines = Array(inputLines.length);
        rightOutputLines = [];

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

    //                case iframeSyntax:
    //                    Iframe(i);
    //                    break;

                    case listSyntax:
                        List(i);
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
                        leftOutputLines[i] = inputLines[i];
                        break;
                }
            }
            leftOutput += leftOutputLines[i] + '\n';
        }

        LeftOutputFormatting();

        for (i = 0; i < rightOutputLines.length; i++) {
            rightOutput += rightOutputLines[i] + '\n';
        }

        RightOutputFormatting();

        $('#mainContent').html( $('#mainContent').html() + leftOutput );
        $('#right').html( $('#right').html() + rightOutput);
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
        if (codeblocking) {
            leftOutputLines[i] = '</xmp></code></pre>';
        }
        
        else {
            language = inputLines[i].split(' ')[1].toLowerCase();
            leftOutputLines[i] = '<pre class="language-' + language + '"><code class="language-' + language + '"><xmp>';
            codeblocking = true;
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
        if (size == 'right') {
            leftOutputLines[i] = '<figure class="right-img-anchor" id="img-anchor-' + i + '">';
            rightOutputLines.push('<img class="' + size + '-img" src="' + link + '" alt="' + text + '">');
        }
        else {
            leftOutputLines[i] = '<img class="' + size + '-img" src="' + link + '" alt="' + text + '">';
        }
    }

//    function Iframe(i) {
//        tags = inputLines[i].split(' ');
//        link = "";
//        if (tags.length > 1) {
//            link = tags[1];
//        }
//        leftOutputLines[i] =
//            '<iframe src="' + link + '" frameborder="0" allowfullscreen></iframe>\n'
//    }

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
            rightOutputLines.push('<p class="footnote" id="footnote-' + n + '" data-footnote="' + n + '"><a href="#footref-' + n + '"><sup>' + n + '</sup></a>' + b + '</p>');
            return '<a href="#footnote-' + n + '"><sup class="footref" id="footref-' + n + '" data-footref="' + n + '">' + n++ + '</sup></a>';
        });

        leftOutput = leftOutput.replace(/\*\*([^\*]*)\*\*/g, function(a, b) {
            return '<strong>' + b + '</strong>';
        });

        leftOutput = leftOutput.replace(/\*([^\*]*)\*/g, function(a, b) {
            return '<em>' + b + '</em>';
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
    
    var $editBtn = $('#edit');
    var $previewBtn = $('#preview');
    var $prevContent;
    var $prevLeftHTML;
    var $prevRightHTML;
    
    $previewBtn.click(function() {
        
        // Gets current HTML and textarea value so we can restore them later
        $prevContent = $('#LMLeditor').val();
        $prevLeftHTML = $('#mainContent').html();
        $prevRightHTML = $('#right').html();
        
        // Removes the data-editable attribute from title and author
        $('#title').removeAttr('data-editable');
        $('#author').removeAttr('data-editable');
        
        // Hides text editor
        $('.editor-wrapper').css('display', 'none');
        
        // Translates text in textarea from syntax to HTML elements
        LMLTranslate();
        
        // Swaps which button is shown
        $previewBtn.css('display', 'none');
        $editBtn.css('display', 'inline-block');
        
    });
    
    $editBtn.click(function() {
        
        // Restores data-editable attribute on title and author
        $('#title').attr('data-editable', '');
        $('#author').attr('data-editable', '');
        
        // Restores HTML to what it was previous to preview
        $('#mainContent').html($prevLeftHTML);
        $('#right').html($prevRightHTML);
        
        // Unhides textarea
        $('.editor-wrapper').css('display', 'block');
        
        // Sets textarea content to what it was previous to preview
        $('#LMLeditor').val($prevContent);
        
        // Swaps which button is shown
        $previewBtn.css('display', 'inline-block');
        $editBtn.css('display', 'none');
        
    });
});
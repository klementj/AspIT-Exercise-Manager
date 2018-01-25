$(document).ready(function() {
    
    /*Declare array of input split after newlines for line-level LML translation*/
    var inputLines;
    
    /*Declare array of lines from inputLines that have undergone line-level LML translation*/
    var outputLines;
    
    /*Declare single-string output for inline-level LML translation*/
    var output;
    
    /*Declare line-level LML syntax*/
    const header1Syntax = '#';
    const header2Syntax = '##';
    const header3Syntax = '###';
    const codeblockSyntax = ';;';
    const imageSyntax = '!!';
    const tableSyntax = '|';
    const listSyntax = '*';
    const orderedListSyntax = /\d\./;
    
    /*Declare booleans that allow for special processing of codeblocks and tables*/
    var codeblocking = false;
    var htmlCodeBlocking = false;
    var tabling = false;
    var tablingColumns = 0;

    /*Begin translation*/
    function LMLTranslate() {
        
        /*Get input of textarea to be translated*/
        textarea = document.getElementById("LMLeditor");
        input = textarea.value;
        /*To prevent weird html bahavior, replace '<' with the equivalent '&lt' (may cause issues inside codeblocks that rely on '<'. Dunno)*/
        input = input.replace(/\</g, '&lt');
        
        /*Assign values to inputLines, declare length of outputLines, and assign output*/
        inputLines = input.split(/\n/g);
        outputLines = Array(inputLines.length);
        output = "";
        
        /*Begin line-level LML translation*/
        for (i = 0; i < inputLines.length; i++) {
            
            /*Check if outside a codeblock*/
            if (!codeblocking) {
                
                /*For each line in inputLines, based on the first word of that line, identify possible LML syntax and apply proper html tags. Then output to corresponding line in outputLines*/
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

                    case tableSyntax:
                        Table(i);
                        break;
                        
                    case listSyntax:
                        List(i);
                        break;
                        
                    case orderedListSyntax:
                        OrderedList(i);
                        break;
                        
                    case '':
                        outputLines[i] = inputLines[i];
                        break;

                    default:
                        /*Regular expressions don't work with switch cases, so ordered list syntax is identified here*/
                        if (inputLines[i].split(' ')[0].match(orderedListSyntax)) {
                            
                            OrderedList(i);
                            
                        } else {
                            
                            Paragraph(i);
                            
                        }
                        break;
                }
            }
            else {
                
                /*For each line in inputLines while inside a codeblock, check first word for end-of-codeblock statement while ignoring all other syntax*/
                switch(inputLines[i].split(' ')[0]) {
                    case codeblockSyntax:
                        /*In case of codeblock syntax, run Codeblock function to end codeblock*/
                        Codeblock(i);
                        break;
                    default:
                        
                        /*In case of no codeblock syntax, run default behavior*/
                        if (htmlCodeBlocking) {
                            
                            /*To prevent weird html bahavior, replace '<' with the equivalent '&lt'*/
                            /*Regex:
                            '\<' targets '<'
                            'g' after the closing slash tells regex to keep searching the string instead of stopping at first match*/
                            outputLines[i] = inputLines[i].replace(/\</g, '&lt') + '\n';
                        }
                        else {
                            outputLines[i] = inputLines[i] + '\n';
                        }
                        break;
                }
            }
            
            /*For each line in inputLines, add the corresponding outputLines line to output*/
            output += outputLines[i];
        }
        
        /*Run inline LML translation*/
        outputFormatting();
        
        /*Insert translated text into main content container*/
        $('#mainContent').html( $('#mainContent').html() + output );
    }
    
    /**/
    /*Line-level translation functions*/
    /**/
    
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
            
            /*If already inside a codeblock, end the codeblock and set codeblock booleans to false*/
            outputLines[i] = '</code></pre>\n';
            codeblocking = false;
            
            if (htmlCodeBlocking) {
                htmlCodeBlocking = false;
            }
        }
        
        else {
            
            /*If not inside a codeblock, begin the codeblock and set codeblock booleans to true*/
            
            /*Get codeblock's language from second word in line*/
            language = inputLines[i].split(' ')[1].toLowerCase();
            
            /*Insert pre and code tags in accordance with Prism functionality*/
            outputLines[i] = '<pre class="language-' + language + '"><code class="language-' + language + '">';
            
            /*Set codeblocking boolean to true. If the codeblock is html, set that boolean to true as well*/
            codeblocking = true;
            if (language == 'html') { htmlCodeBlocking = true; }
        }
    }

    function Image(i) {
        
        /*Declare tags, an array of each word in the line*/
        tags = inputLines[i].split(' ');
        
        /*Declare image url, image size/position (default left), and image alt text*/
        link = "";
        size = "left";
        text = "";
        
        if (tags.length > 1) {
            
            /*If there is more than the initial image syntax tag, next tag must be image url*/
            link = tags[1];
            
            if (tags.length > 2) {
                
                if (tags[2].toLowerCase() == 'left' || tags[2].toLowerCase() == 'right' /*|| tags[2].toLowerCase() == 'big'*/) {
                    
                    /*If the next tag is left, right, or big, the tag defines the image size/position*/
                    size = tags[2].toLowerCase();
                    if (tags.length > 3) {
                        
                        /*If there are more tags, they are added together to form the image's alt text*/
                        for (j = 3; j < tags.length; j++) {
                            if (j == 3) { text += tags[j]; }
                            else { text += ' ' + tags[j]; }
                        }
                    }
                }
                else {
                    
                    /*If the next tag is not left, right, or big, image size reverts to default and the rest of the tags are added together to form the image's alt text*/
                    for (j = 2; j < tags.length; j++) {
                        if (j == 2) { text += tags[j]; }
                        else { text += ' ' + tags[j]; }
                    }
                }
            }
        }
        
        /*Return finished img element as output*/
        outputLines[i] = '<img class="' + size + '-img" src="' + link + '" alt="' + text + '">\n';
    }
    
    function Table(i) {
        
        /*Check if in the middle of processing table*/
        if (!tabling) {
            /*Current line is a head row, provided it has correct syntax*/
            
            console.log("Start tabling");
            
            /*Count number of columns in head row*/
            /*Regex:
            Parantheses with '?:' at the beginning specifies that this is a non-capturing group
            '\|' matches '|'
            '\s' matches whitespace characters
            '+?' matches preceding target 1 to unlimited times, as few times as possible
            '.' targets any character
            '|' inside parantheses specify expression to the right of '|' OR to the left of '|'*/
            let inputColumns = inputLines[i].match(/(?:\|\s+?.+?\s+?\||\s+?.+?\s+?\|)/g).length;
            
            console.log("Columns = " + inputColumns);
            
            /*Check if there are lines after head row*/
            if (i != inputLines.length - 1) {
                
                console.log("There are lines after header row")
            
                /*Check if current line matches table head syntax and if next line matches table divide syntax*/
                /*Regex:
                '^' anchors search to start of string
                '*?' matches preceding target 0 to unlimited times, as few times as possible
                '$' anchors search to end of string*/
                /*First expression checks syntax of head row, second expression checks syntax of divide row, third expression checks that number of columns in divide row are the same as head row*/
                if (inputLines[i].match(/^\s*?\|(?:\s+?.+?\s+?\|)+\s*?$/) && 
                    inputLines[i + 1].match(/^\s*?\|(?:\s+?-+?\s+?\|)+\s*?$/) && 
                    inputLines[i + 1].match(/(?:\|\s+?.+?\s+?\||\s+?.+?\s+?\|)/g).length == inputColumns) {

                    console.log("Header row and divide row both check out")
                    
                    /*Replace LML syntax with HTML tags*/
                    /*Regex:
                    Parantheses specify a capturing group, to be targeted by replace function with variable 'b'
                    '+' matches preceding target 1 to unlimited times*/
                    outputLines[i] = inputLines[i].replace(/\s*?\|\s+(.+)\s+\|\s*?/, function(a, b) {
                        return '<table><thead><tr><th>' + b.replace(/\s+\|\s+/g, '</th><th>') + '</th></tr></thead>';
                    });
                    
                    console.log("After replacement, output is now: " + outputLines[i]);
                    
                    /*Set table variables for rest of the table*/
                    tabling = true;
                    tablingColumns = inputColumns;
                    
                    /*Check if there are lines after table divide row*/
                    if (i + 1 != inputLines.length - 1) {
                        
                        /*Check if line after table divide does not match table syntax*/
                        if (inputLines[i + 2].match(/(?:\|\s+?.+?\s+?\||\s+?.+?\s+?\|)/g).length != tablingColumns || 
                            !inputLines[i + 2].match(/^\s*?\|(?:\s+?.+?\s+?\|)+\s*?$/)) {

                            /*If line is not another table row, end table now*/
                            outputLines[i] += '</table>'
                            tabling = false;
                            tablingColumns = 0;

                        }
                        
                    } else {
                        /*Input ends after divide row, so table ends as well*/
                        outputLines[i] += '</table>'
                        tabling = false;
                        tablingColumns = 0;
                    }

                } else {
                    /*No proper table head present, return unmodified input*/
                    outputLines[i] = inputLines[i];
                }
            
            } else {
                /*No proper table head present, return unmodified input*/
                outputLines[i] = inputLines[i];
            }

        } else {
            /*Table is currently being processed*/
            
            console.log("Continue tabling")
            
            /*Check if previous line is table header*/
            if (outputLines[i - 1].match(/^<table><thead><tr><th>/)) {
                /*Current line is the divide row, and should be ignored*/
                
                outputLines[i] = '';
            
            } else {
                /*Current line is a normal table row, and syntax has already been checked*/
                
                /*Replace LML syntax with HTML syntax*/
                outputLines[i] = inputLines[i].replace(/\s*?\|\s+(.+)\s+\|\s*?/, function(a, b) {
                    return '<tr><td>' + b.replace(/\s+\|\s+/g, '</td><td>') + '</td></tr>';
                });

                console.log("After replacement, output is now: " + outputLines[i]);

                /*Check if there are lines after current row*/
                if (i != inputLines.length - 1) {

                    /*Check if next line does not match table syntax*/
                    if (inputLines[i + 1].match(/(?:\|\s+?.+?\s+?\||\s+?.+?\s+?\|)/g).length != tablingColumns || 
                        !inputLines[i + 1].match(/^\s*?\|(?:\s+?.+?\s+?\|)+\s*?$/)) {

                        /*If next line is not another table row, end table*/
                        outputLines[i] += '</table>'
                        tabling = false;
                        tablingColumns = 0;

                    }

                } else {
                    /*Input ends after current row, so table ends as well*/
                    outputLines[i] += '</table>'
                    tabling = false;
                    tablingColumns = 0;
                }
            
            }
            
        }
        
        /*Add linebreak no matter what*/
        outputLines[i] += '\n';
        
    }

    function List(i) {
        
        /*If at the first index of inputLines*/
        if (i == 0){
            
            if (i == inputLines.length - 1) {
                
                /*If current line is input's first and last line, begin and complete ul at current line*/
                outputLines[i] = '<ul>\n<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n</ul>\n';
            }
            else {
                
                /*If current line is input's first line, begin ul*/
                outputLines[i] = '<ul>\n<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n';
                if (inputLines[i + 1].split(' ')[0] != '*') {
                    
                    /*If next line does not have list syntax, end ul at current line*/
                    outputLines[i] += '\n</ul>\n';
                }
            }
        }
        
        /*If at the last index of inputLines*/
        else if (i == inputLines.length - 1) {
            
            if (inputLines[i - 1].split(' ')[0] != '*') {
                
                /*If current line is input's last line and previous line does not have list syntax, begin and complete ul at current line*/
                outputLines[i] = '<ul>\n<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n</ul>\n';
            }
            else {
                
                /*If current line is input's last line and previous line has list syntax, complete ul at current line*/
                outputLines[i] = '<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n</ul>\n';
            }
        }
        
        /*If neither at the first or last indexes of inputLines*/
        else if (i > 0 && i < inputLines.length - 1){
            
            if (inputLines[i - 1].split(' ')[0] != '*') {
                if (inputLines[i + 1].split(' ')[0] != '*'){
                    
                    /*If previous line and next line do not have list syntax, begin and complete ul at current line*/
                    outputLines[i] = '<ul>\n<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n</ul>\n'
                }
                else {
                    
                    /*If previous line does not have list syntax but next line does, begin ul at current line*/
                    outputLines[i] = '<ul>\n<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n';
                }
            }
            else if (inputLines[i + 1].split(' ')[0] != '*') {
                
                /*If previous line has list syntax but next line does not, complete ul at current line*/
                outputLines[i] = '<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n</ul>\n';
            }
            else {
                
                /*If previous line and next line both have list syntax, simply insert as list item*/
                outputLines[i] = '<li>' + inputLines[i].slice(listSyntax.length + 1) + '</li>\n';
            }
        }
    }
    
    function OrderedList(i) {
        
        let listValue = inputLines[i].match(/^\d+/);
        
        /*If at the first index of inputLines*/
        if (i == 0){
            
            if (i == inputLines.length - 1) {
                
                /*If current line is input's first and last line, begin and complete ol at current line*/
                outputLines[i] = '<ol>\n<li value="' + listValue + '">' + inputLines[i].slice(listValue.length + 2) + '</li>\n</ol>\n';
            }
            else {
                
                /*If current line is input's first line, begin ol*/
                outputLines[i] = '<ol>\n<li value="' + listValue + '">' + inputLines[i].slice(listSyntax.length + 2) + '</li>\n';
                if (!inputLines[i + 1].split(' ')[0].match(/^\d+/)) {
                    
                    /*If next line does not have list syntax, end ol at current line*/
                    outputLines[i] += '\n</ol>\n';
                }
            }
        }
        
        /*If at the last index of inputLines*/
        else if (i == inputLines.length - 1) {
            
            if (!inputLines[i - 1].split(' ')[0].match(/^\d+/)) {
                
                /*If current line is input's last line and previous line does not have list syntax, begin and complete ol at current line*/
                outputLines[i] = '<ol>\n<li value="' + listValue + '">' + inputLines[i].slice(listSyntax.length + 2) + '</li>\n</ol>\n';
            }
            else {
                
                /*If current line is input's last line and previous line has list syntax, complete ol at current line*/
                outputLines[i] = '<li value="' + listValue + '">' + inputLines[i].slice(listSyntax.length + 2) + '</li>\n</ol>\n';
            }
        }
        
        /*If neither at the first or last indexes of inputLines*/
        else if (i > 0 && i < inputLines.length - 1){
            
            if (!inputLines[i - 1].split(' ')[0].match(/^\d+/)) {
                if (!inputLines[i + 1].split(' ')[0].match(/^\d+/)){
                    
                    /*If previous line and next line do not have list syntax, begin and complete ol at current line*/
                    outputLines[i] = '<ol>\n<li value="' + listValue + '">' + inputLines[i].slice(listSyntax.length + 2) + '</li>\n</ol>\n'
                }
                else {
                    
                    /*If previous line does not have list syntax but next line does, begin ol at current line*/
                    outputLines[i] = '<ol>\n<li value="' + listValue + '">' + inputLines[i].slice(listSyntax.length + 2) + '</li>\n';
                }
            }
            else if (!inputLines[i + 1].split(' ')[0].match(/^\d+/)) {
                
                /*If previous line has list syntax but next line does not, complete ol at current line*/
                outputLines[i] = '<li value="' + listValue + '">' + inputLines[i].slice(listSyntax.length + 2) + '</li>\n</ol>\n';
            }
            else {
                
                /*If previous line and next line both have list syntax, simply insert as list item*/
                outputLines[i] = '<li value="' + listValue + '">' + inputLines[i].slice(listSyntax.length + 2) + '</li>\n';
            }
        }
    }

    function Paragraph(i) {
        outputLines[i] = '<p class="content">' + inputLines[i] + '</p>\n';
    }
    
    /**/
    /*Inline-level translation function*/
    /**/
    
    function outputFormatting() {
        
        /*Sidenote translation*/
        /*Regex:
        '\$' targets '$'
        parantheses group their content to allow the function to target that content specifically
        '.' targets any character
        '*?' matches preceding target 0 to unlimited times, as few times as possible (this ensures that the Regex doesn't simply tag the beginning of the first match and the end of the last match, but instead properly tag each match)
        'g' after the closing slash tells regex to keep searching the string instead of stopping at first match*/
        /*Function: parameter b is the content of the first set of parantheses*/
        output = output.replace(/\$\$(.*?)\$\$/g, function(a, b) {
            return '<label for="sidenote" class="sidenoteCounter"></label>\n'
                + '<span class="sidenote">' + b + '</span>';
        });
        
        /*Bold translation*/
        /*Regex:
        '\*' targets '*'*/
        output = output.replace(/\*\*(.*?)\*\*/g, function(a, b) {
            return '<strong>' + b + '</strong>';
        });
        
        /*Italics translation*/
        /*Regex:
        '\|' targets '|'*/
        output = output.replace(/\|\|(.*?)\|\|/g, function(a, b) {
            return '<em>' + b + '</em>';
        });

        /*Inline code translation*/
        /*Regex:
        '\[' targets '['
        '\]' targets ']'*/
        output = output.replace(/\[\[(.*?)\]\]/g, function(a, b) {
            return '<code>' + b + '</code>';
        });

        /*Link translation*/
        /*Regex:
        '\@' targets '@'
        '\<' targets '<'
        '\>' targets '>'*/
        /*Function: parameter b is the content of the first set of parantheses (url) and c is the second set (link text)*/
        output = output.replace(/\[(.*?)\]\((.*?)\)/g, function(a, b, c) {
            return '<a href="' + c + '">' + b + '</a>';
        });

        /*Colored text translation*/
        /*Regex:
        '\#' targets '#'
        '\{' targets '{'
        '\}' targets '}'*/
        /*Function: parameter b is the color, parameter c is the text to be colored*/
        output = output.replace(/\#\{(.*?)\{(.*?)\}\}/g, function(a, b, c) {
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
        
        // Shows exercise creation container so the children can be displayed
        $('#exerciseCreationContainer').css({
            opacity: 1,
            display: 'block'
        });
        
        // Hides text editor
        $('.editor-wrapper').css('display', 'none');
        
        // Translates text in textarea from syntax to HTML elements
        LMLTranslate();
        
        // Hides title input field and shows title h1
        $('#titleInput').css('display', 'none');
        $('#title').css('display', 'inline-block');
        $('#title').text( $('#titleInput').val() );
        
        // Hides subject selection box and shows subject as text instead
        $('#subjectSelect').css('display', 'none');
        $('#subject').text( $('#subjectSelect option:selected').text() );
        $('#subject').css('display', 'block');
        
        
        if (accessLevel < 2) {
            
            // Swaps which button is shown
            $previewBtn.css('display', 'none');
            $editBtn.css('display', 'inline-block');
            
        }
        
        Prism.highlightAll();
    }

    function Edit() {
        if (accessLevel < 2) {
            
            // Restores HTML to what it was previous to preview
            $('#mainContent').html($prevLeftHTML);
            
            // Hides title h1 and shows title input field
            $('#title').css('display', 'none');
            $('#titleInput').css('display', 'inline-block');
            
            // Hides subject text and shows subject selection box
            $('#subjectSelect').css('display', 'inline-block');
            $('#subject').css('display', 'none');
            
            // Unhides textarea
            $('.editor-wrapper').css('display', 'block');
            
            // Sets textarea content to what it was previous to preview
            $('#LMLeditor').val($prevContent);
            
            // Swaps which button is shown
            $previewBtn.css('display', 'inline-block');
            $editBtn.css('display', 'none');
            
        }
    }
    
    $previewBtn.click(Preview);
    
    $editBtn.click(Edit);
});
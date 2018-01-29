<?php
session_start();

if (!isset($_SESSION["userId"])) {
    header('location: login.php');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AspIT Exercise Manager</title>
    <link rel="icon" href="img/aspitlogo.png">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/prism.css">
    <script type="text/javascript">
        var accessLevel = '<?php echo $_SESSION['accessLevel'] ?>';
        var userName = '<?php echo $_SESSION['firstName'] . ' ' . $_SESSION['lastName'] ?>';
        var userId = '<?php echo $_SESSION['userId'] ?>';
    </script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="js/prism.js"></script>
    <script src="js/nola.js"></script>
    <script src="js/script.js"></script>
    <script src="js/nolabuttons.js"></script>
    <script src="js/form.js"></script>
</head>
<body>
    <header>
        <nav>
            <div>
                <b><?php echo $_SESSION['firstName'] ?></b>
                <a href="php/logout.php">Log out</a>
            </div>
        </nav>
    </header>
    <main>
        <article id="left">
            <nav>
                <i class="fa fa-pencil-square-o fa-2x" id="edit" aria-hidden="true">
                    <span class="faTooltip disable-select">Back to editor</span>
                </i>
                <i class="fa fa-eye fa-2x" id="preview" aria-hidden="true">
                    <span class="faTooltip disable-select">Preview mode</span>
                </i>
                <div class="buttonContainer">
                    <?php 
                        if ($_SESSION['accessLevel'] < 2) {
                            echo 
                                '<button id="createNewExerciseBtn" class="safe">New</button>';
                        }
                            echo
                                '<button id="openNewExerciseBtn" class="action">Open</button>';
                        if ($_SESSION['accessLevel'] < 2) {
                            echo
                                '<form id="saveForm">
                                    <button type="button" id="saveBtn" class="neutral">Save<span>Saved!</span></button>
                                </form>
                                <button id="publishBtn" class="neutral">Visibility</button>
                                <button id="deleteBtn" class="danger">Delete</button>';
                        }
                    ?>
                </div>
            </nav>
            <div id="exerciseCreationContainer">
                <h1 id="title"></h1>
                <input type="text" id="titleInput" spellcheck="false" placeholder="Title" tabindex="1" value="Untitled">
                <p id="subject"></p>
                <section class="editor-wrapper">
                    <div class="toolbar">
                        <button id="headerBig" class="editor-button" tabindex="-1">
                            <i class="fa fa-header" aria-hidden="true"></i>1
                            <span class="tooltiptext disable-select">Big header</span>
                        </button>
                        <button id="headerMedium" class="editor-button" tabindex="-1">
                                <i class="fa fa-header" aria-hidden="true"></i>2
                                <span class="tooltiptext disable-select">Medium header</span>
                        </button>
                        <button id="headerSmall" class="editor-button" tabindex="-1">
                                <i class="fa fa-header" aria-hidden="true"></i>3
                                <span class="tooltiptext disable-select">Small header</span>
                        </button>
                        <button id="bold" class="editor-button" tabindex="-1">
                                <i class="fa fa-bold" aria-hidden="true"></i>
                                <span class="tooltiptext disable-select">Bold</span>
                        </button>
                        <button id="italic" class="editor-button" tabindex="-1">
                                <i class="fa fa-italic" aria-hidden="true"></i>
                                <span class="tooltiptext disable-select">Italic</span>
                        </button>
                        <button id="inlineCode" class="editor-button" tabindex="-1">
                                <span id="code">C</span>
                                <span class="tooltiptext disable-select">Inline code</span>
                        </button>
                        <button id="textColor" class="editor-button" tabindex="-1">
                            <i class="fa fa-paint-brush" aria-hidden="true"></i>
                            <span class="tooltiptext disable-select">Text color</span>
                        </button>
                        <button id="list" class="editor-button" tabindex="-1">
                                <i class="fa fa-list" aria-hidden="true"></i>
                                <span class="tooltiptext disable-select">List</span>
                        </button>
                        <button id="table" class="editor-button" tabindex="-1">
                                <i class="fa fa-table" aria-hidden="true"></i>
                                <span class="tooltiptext disable-select">Table</span>
                        </button>
                        <button id="footnote" class="editor-button" tabindex="-1">
                                <i class="fa fa-sticky-note" aria-hidden="true"></i>
                                <span class="tooltiptext disable-select">Footnote</span>
                        </button>
                        <button id="codeblock" class="editor-button" tabindex="-1">
                                <i class="fa fa-code" aria-hidden="true"></i>
                                <span class="tooltiptext disable-select">Codeblock</span>
                        </button>
                        <button id="link" class="editor-button" tabindex="-1">
                                <i class="fa fa-external-link" aria-hidden="true"></i>
                                <span class="tooltiptext disable-select">Link</span>
                        </button>
                        <button id="image" class="editor-button" tabindex="-1">
                                <i class="fa fa-file-image-o" aria-hidden="true"></i>
                                <span class="tooltiptext disable-select">Image url</span>
                        </button>
                        <button id="imageUpload" class="editor-button" tabindex="-1">
                                <i class="fa fa-upload" aria-hidden="true"></i>
                                <span class="tooltiptext disable-select">Upload image</span>
                        </button>
                        <button id="syntaxHelp" class="editor-button" tabindex="-1">
                                <i class="fa fa-question" aria-hidden="true"></i>
                                <span class="tooltiptext disable-select">Syntax help</span>
                        </button>
                    </div>
                    <textarea class="editor" id="LMLeditor" spellcheck="false" placeholder="Description..." tabindex="2"></textarea>
                </section>
                <select name="subject" id="subjectSelect">
                    <?php require 'php/readSubjects.php'; ?>
                </select>
                <h5 id="author"><?php echo $_SESSION['firstName'] . ' ' . $_SESSION['lastName'] ?></h5>
                <h6 id="lastUpdated"></h6>
            </div>
            <article id="mainContent"></article>
        </article>
    </main>
    <footer>
        <p>Created by Lasse Hels and Noah Bro-Jørgensen - 2018</p>
        <div id="overlay"></div>
        <div id="openModal">
            <div id="inputContainer">
                <input type="text" name="search" placeholder="Search...">
                <i class="fa fa-search" aria-hidden="true"></i>
            </div>
            <div id="tableContainer">
                <table>
                    <thead>
                        <tr>
                            <th class="tTitle">Title <i class="fa fa-sort" aria-hidden="true"></i></th>
                            <th class="tAuthor">Author <i class="fa fa-sort" aria-hidden="true"></i></th>
                            <th class="tSubject">Subject <i class="fa fa-sort" aria-hidden="true"></i></th>
                            <th class="tDate">Last updated <i class="fa fa-sort" aria-hidden="true"></i></th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
        <div id="publishModal">
            <h1>Select who can view your exercise:</h1>
            <div>
                <input type="radio" name="visibility" value="0"><b>Private</b><br> Only you can view and edit your exercise.
            </div>
            <div>
                <input type="radio" name="visibility" value="1"><b>Protected</b><br> All teachers can view and edit your exercise.
            </div>
            <div>
                <input type="radio" name="visibility" value="2"><b>Public</b><br> All students can view but not edit your exercise. All teachers can view and edit your exercise.
            </div>
            <button class="confirm">Ok</button>
        </div>
        <div id="imgUploadModal">
            <input type="file" name="fileToUpload">
            <button id="imgUploadBtn" class="confirm">Ok</button>
        </div>
        <div id="syntaxModal">
            <table>
                <thead>
                    <tr>
                        <th>You type</th>
                        <th>You get</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="youType"># Big header</td>
                        <td class="youSee"><h2>Big header</h2></td>
                    </tr>
                    <tr>
                        <td class="youType">## Medium header</td>
                        <td class="youSee"><h3>Medium header</h3></td>
                    </tr>
                    <tr>
                        <td class="youType">### Small header</td>
                        <td class="youSee"><h4>Small header</h4></td>
                    </tr>
                    <tr>
                        <td class="youType">**bold**</td>
                        <td class="youSee"><b>bold</b></td>
                    </tr>
                    <tr>
                        <td class="youType">||italic||</td>
                        <td class="youSee"><em>italic</em></td>
                    </tr>
                    <tr>
                        <td class="youType">[[code]]</td>
                        <td class="youSee code">code</td>
                    </tr>
                    <tr>
                        <td class="youType">#{Blue{colored text}}</td>
                        <td class="youSee blue">colored text</td>
                    </tr>
                    <tr>
                        <td class="youType">
                            * List item<br>
                            * List item<br>
                            * List item
                       </td>
                        <td class="youSee">
                            <ul>
                                <li>List item</li>
                                <li>List item</li>
                                <li>List item</li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td class="youType">
                            1. List item<br>
                            2. List item<br>
                            3. List item
                       </td>
                        <td class="youSee">
                            <ol>
                                <li>List item</li>
                                <li>List item</li>
                                <li>List item</li>
                            </ol>
                        </td>
                    </tr>
                    <tr>
                        <td class="youType">Sidenote $$text text$$</td>
                        <td class="youSee"><span class="sidenote">Sidenote</span><span class="sidenoteText">text text</span></td>
                    </tr>
                    <tr>
                        <td class="youType">
                            ;; html <br>
                            &lt;div&gt;&lt;/div&gt;<br>
                            ;;
                        </td>
                        <td class="youSee">
                            <pre class="language-html">
                                <code class="language-html">
        &lt;div&gt;&lt;/div&gt;
                                </code>
                            </pre>
                        </td>
                    </tr>
                    <tr>
                        <td class="youType">[Link text](www.google.dk/)</td>
                        <td class="youSee"><a href="https://www.google.dk/">Link text</a></td>
                    </tr>
                    <tr>
                        <td class="youType">
                            !! https://i.imgur.com/eOSai4B.png left
                            <br>
                            <br>
                            <b>Left</b> positions the image to the left.
                            <br>
                            <b>Right</b> positions the image to the right.
                        </td>
                        <td class="youSee">
                            <img src="https://i.imgur.com/eOSai4B.png" alt="example image">
                        </td>
                    </tr>
                </tbody>
            </table>
            <button class="confirm">Ok</button>
        </div>
        <div id="deleteModal">
            <b><p>Are you sure you want to delete</p></b>
            <button class="danger">Delete</button>
            <button class="safe">Cancel</button>
        </div>
    </footer>
</body>
</html>
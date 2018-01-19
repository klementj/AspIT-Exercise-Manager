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
    <link rel="stylesheet" href="frontend/css/style.css">
    <link rel="stylesheet" href="frontend/css/nola.css">
    <link rel="stylesheet" href="frontend/fa/font-awesome-4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="frontend/prism/prism.css">
    <script type="text/javascript">
        var accessLevel = '<?php echo $_SESSION['accessLevel'] ?>';
        var userName = '<?php echo $_SESSION['firstName'] . ' ' . $_SESSION['lastName'] ?>';
        var userId = '<?php echo $_SESSION['userId'] ?>';
    </script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="frontend/prism/prism.js"></script>
    <script src="backend/js/nola.js"></script>
    <script src="frontend/js/script.js"></script>
    <script src="frontend/js/nolabuttons.js"></script>
    <script src="frontend/js/form.js"></script>
</head>
<body>
    <header>
        <nav>
            <div>
                <b><?php echo $_SESSION['firstName'] ?></b>
                <a href="backend/php/logout.php">Logout</a>
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
                                '<button id="createNewExercise">
                                    <a href="#">New</a>
                                </button>';
                        }
                            echo
                                '<button id="openNewExercise">
                                    <a href="#">Open</a>
                                </button>';
                        if ($_SESSION['accessLevel'] < 2) {
                            echo
                                '<form id="saveForm">
                                    <button type="button" id="saveBtn">Save</button>
                                </form>
                                <button id="publishBtn">Visibility</button>
                                <button id="deleteBtn">Delete</button>';
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
                        </button>
                    </div>
                    <textarea class="editor" id="LMLeditor" spellcheck="false" placeholder="Description..." tabindex="2"></textarea>
                </section>
                <select name="subject" id="subjectSelect">
                    <?php require 'backend/php/readSubjects.php'; ?>
                </select>
                <h5 id="author"><?php echo $_SESSION['firstName'] . ' ' . $_SESSION['lastName'] ?></h5>
                <h6 id="lastUpdated"></h6>
            </div>
            <article id="mainContent"></article>
        </article>
    </main>
    <footer></footer>
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
    <button>Ok</button>
</div>
<div id="imgUploadModal">
    <input type="file" name="fileToUpload">
    <button id="imgUploadBtn">Ok</button>
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
                <td># Big header</td>
                <td></td>
            </tr>
            <tr>
                <td>## Medium header</td>
                <td></td>
            </tr>
            <tr>
                <td>### Small header</td>
                <td></td>
            </tr>
            <tr>
                <td>**bold**</td>
                <td></td>
            </tr>
            <tr>
                <td>||italic||</td>
                <td></td>
            </tr>
            <tr>
                <td>[[inline code]]</td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>
    <button>Ok</button>
</div>
</body>
</html>
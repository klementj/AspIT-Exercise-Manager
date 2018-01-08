<?php
session_start();

foreach($_SESSION as $item) {
    if (!isset($item)) {
        header('location: login.php');
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AspIT Exercise Manager</title>
    <link rel="icon" href="../../img/aspitlogo.png">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/nola.css">
    <link rel="stylesheet" href="../fa/font-awesome-4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="../prism/prism.css">
    <script type="text/javascript">var accessLevel = '<?php echo $_SESSION['accessLevel'] ?>'</script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="../prism/prism.js"></script>
    <script src="../../backend/js/nola.js"></script>
    <script src="../js/script.js"></script>
    <script src="../js/nolabuttons.js"></script>
    <script src="../js/form.js"></script>
</head>
<body>
    <header>
        <nav>
            <div>
                <ul>
                    <li class="dropdown"><b><?php echo $_SESSION['firstName'] ?></b><i class="fa fa-chevron-down" aria-hidden="true"></i>
                    <div class="dropdownMenu">
                        <a href="../../backend/php/logout.php">Logout</a>
                    </div>
                    </li>
                </ul>
            </div>
            <img src="../../img/aspitlogo.png" alt="AspIT logo">
            <div></div>
        </nav>
    </header>
    <main>
        <article id="left">
            <nav>
                <i class="fa fa-pencil-square-o fa-2x" id="edit" aria-hidden="true">
                    <span class="faTooltip disable-select">Back to editor</span>
                </i>
                <i class="fa fa-file-text fa-2x" id="preview" aria-hidden="true">
                    <span class="faTooltip disable-select">Preview mode</span>
                </i>
                <button id="openNewExercise">
                    <a href="#">Open</a>
                </button>
            </nav>
            <h1 id="title"></h1>
            <input type="text" id="titleInput" spellcheck="false" placeholder="Title" tabindex="1">
            <select name="subject" id="subjectSelect">
                <option value="1">T1</option>
                <option value="2">V1</option>
                <option value="3">S1</option>
            </select>
            <h5 id="author">Lasse Hels</h5>
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
                    <button id="list" class="editor-button" tabindex="-1">
                            <i class="fa fa-list" aria-hidden="true"></i>
                            <span class="tooltiptext disable-select">List</span>
                    </button>
                    <button id="codeblock" class="editor-button" tabindex="-1">
                            <i class="fa fa-code" aria-hidden="true"></i>
                            <span class="tooltiptext disable-select">Codeblock</span>
                    </button>
                    <button id="footnote" class="editor-button" tabindex="-1">
                            <i class="fa fa-sticky-note" aria-hidden="true"></i>
                            <span class="tooltiptext disable-select">Footnote</span>
                    </button>
                    <button id="italic" class="editor-button" tabindex="-1">
                            <i class="fa fa-italic" aria-hidden="true"></i>
                            <span class="tooltiptext disable-select">Italic</span>
                    </button>
                    <button id="bold" class="editor-button" tabindex="-1">
                            <i class="fa fa-bold" aria-hidden="true"></i>
                            <span class="tooltiptext disable-select">Bold</span>
                    </button>
                    <button id="textColor" class="editor-button" tabindex="-1">
                        <i class="fa fa-paint-brush" aria-hidden="true"></i>
                        <span class="tooltiptext disable-select">Text color</span>
                    </button>
                    <button id="inlineCode" class="editor-button" tabindex="-1">
                            <span id="code">C</span>
                            <span class="tooltiptext disable-select">Inline code</span>
                    </button>
                    <button id="link" class="editor-button" tabindex="-1">
                            <i class="fa fa-external-link" aria-hidden="true"></i>
                            <span class="tooltiptext disable-select">Link</span>
                    </button>
                    <button id="image" class="editor-button" tabindex="-1">
                            <i class="fa fa-file-image-o" aria-hidden="true"></i>
                            <span class="tooltiptext disable-select">Image</span>
                    </button>
                </div>
                <textarea class="editor" id="LMLeditor" placeholder="Description..." tabindex="2"></textarea>
            </section>
            <article id="mainContent" ></article>
        </article>
        <aside id="right">
            <?php 
                if ($_SESSION['accessLevel'] < 2) {
                    echo 
                        '<div>
                            <form id="saveForm">
                                <button type="button" id="saveBtn">Save</button>
                            </form>
                            <button id="publishBtn">Publish</button>
                        </div>
                        <div>
                            <button id="deleteBtn">Delete</button>
                        </div>';
                }
            ?>
        </aside>
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
                <?php require '../../backend/php/readExercises.php' ?>
            </tbody>
        </table>
    </div>
</div>
</body>
</html>
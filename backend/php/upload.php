<?php
/*Declare target directory, file, and file extension*/
$target_dir = "../../img/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

/*Check submission*/
if (isset($_POST["submit"])) {
    
    /*Check if file is an image*/
    $check = getimagesize($_FILES["fileToUpload"]["name"]);
    if ($check != false) {
        
        /*Check if file is jpg, jpeg, png, gif*/
        if ($imageFileType == "jpg" || $imageFileType == "jpeg" || $imageFileType == "png" || $imageFileType == "gif" || ) {
            
            /*Check if file already exists*/
            if (!file_exists($target_file)) {
                
                /*Check if filesize is greater than 5Mb*/
                if ($_FILES["fileToUpload"]["size"] <= 5000000) {
                    
                    
                    
                } else {
                    /*Error file greater than 5Mb*/
                }

            } else {
                /*Error file already exists*/
            }
        } else {
            /*Error invalid image format*/
        }
    } else {
        /*Error file is not an image*/
    }
} else {
    /*Error no submission*/
}
?>
<?php
/*Declare target directory, file, and file extension*/
$target_dir = "../../img/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

/*Check submission*/
if (isset($_POST["submit"])) {
    
    /*Check if file is an image*/
    $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    if ($check != false) {
        
        /*Check if file is jpg, jpeg, png, gif*/
        if ($imageFileType == "jpg" || $imageFileType == "jpeg" || $imageFileType == "png" || $imageFileType == "gif" ) {
            
            /*Check if file already exists*/
            if (!file_exists($target_file)) {
                
                /*Check if filesize is greater than 5Mb*/
                if ($_FILES["fileToUpload"]["size"] <= 5000000) {
                    
                    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                        echo "Succes";
                    } else {
                        /*Error file transfer failed*/
                        echo 6;
                    }
                    
                } else {
                    /*Error file greater than 5Mb*/
                    echo 5;
                }

            } else {
                /*Error file already exists*/
                echo 4;
            }
        } else {
            /*Error invalid image format*/
            echo 3;
        }
    } else {
        /*Error file is not an image*/
        echo 2;
    }
} else {
    /*Error no submission*/
    echo 1;
}
?>
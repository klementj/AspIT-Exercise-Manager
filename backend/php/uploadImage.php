<?php
/*Declare target directory, file, and file extension*/
$target_dir = "../../img/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

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
                    /*Successful upload*/
                    echo $target_file;
                } else {
                    /*Error file transfer failed*/
                    echo 'Error: File transfer failed';
                }

            } else {
                /*Error file greater than 5Mb*/
                echo 'Error: File cannot be greater than 5Mb';
            }

        } else {
            /*Error file already exists*/
            echo 'Error: File of this name already exists';
        }
    } else {
        /*Error invalid image format*/
        echo 'Error: Invalid image format';
    }
} else {
    /*Error file is not an image*/
    echo 'Error: File is not an image';
}
?>
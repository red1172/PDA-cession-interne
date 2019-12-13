<?php
    session_start();  
    session_unset();  
    session_destroy();  
    setcookie('login', '');
    setcookie('pass', '');	
    header('Location:index.php');  
    exit();  
    ?> 
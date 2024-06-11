<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userType = $_POST["userType"];
    // Redirect to the appropriate dashboard based on user type
    header("Location: " . ($userType === "employee" ? "employee_dashboard.php" : "employer_dashboard.php"));
    exit();
}
?>
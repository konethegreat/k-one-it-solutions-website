<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Sanitize input
  $name = filter_var(trim($_POST['name']), FILTER_SANITIZE_STRING);
  $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
  $message = filter_var(trim($_POST['message']), FILTER_SANITIZE_STRING);

  // Basic validation
  if (empty($name) || empty($email) || empty($message)) {
    die('Please fill in all required fields.');
  }

  // Prepare the email
  $to = 'erictshivhinda@gmail.com'; // Replace with your email address
  $subject = 'New Contact Form Submission';
  $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
  $headers = "From: $email\r\n" .
             "Reply-To: $email\r\n" .
             "X-Mailer: PHP/" . phpversion();

  // Attempt to send the email
  if (mail($to, $subject, $body, $headers)) {
    echo "Thank you for contacting us!";
  } else {
    echo "There was an error sending your message. Please try again later.";
  }
}
?>
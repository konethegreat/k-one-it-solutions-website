<?php
// filepath: /c:/wamp64/www/KONE_IT_SOLUTIONS_Website/submit.php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Sanitize input
  $name = filter_var(trim($_POST['name']), FILTER_SANITIZE_FULL_SPECIAL_CHARS);
  $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
  $message = filter_var(trim($_POST['message']), FILTER_SANITIZE_FULL_SPECIAL_CHARS);

  // Basic validation
  if (empty($name) || empty($email) || empty($message)) {
    die('Please fill in all required fields.');
  }

  // Prepare the email
  $mail = new PHPMailer(true);
  try {
    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'erictshivhinda@gmail.com'; // Replace with your email address
    $mail->Password = 'Ilovemy2018_thegreat'; // Replace with your email password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Recipients
    $mail->setFrom($email, $name);
    $mail->addAddress('erictshivhinda@gmail.com'); // Replace with your email address

    // Content
    $mail->isHTML(false);
    $mail->Subject = 'New Contact Form Submission';
    $mail->Body = "Name: $name\nEmail: $email\n\nMessage:\n$message";

    $mail->send();
    echo 'Thank you for contacting us!';
  } catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
  }
}
?>
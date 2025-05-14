<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Create Account</title>
  <link rel="stylesheet" href="Signup.css" />
</head>

<body>
  <?php
  session_start();
  ?>
  <div class="responsive-background">
    <img src="photos/newloginimage.jpg" alt="Background Image" />
    <div class="container">
      <!-- <img src="https://cdn-icons-png.flaticon.com/512/104/104668.png" alt="Gym Logo" class="gym-logo" /> -->
      <h1>Create Account</h1>
      <div id="errorMessage" class="error-message"></div>
      <div id="successMessage" class="success-message"></div>
      <?php
      if (isset($_SESSION['error'])) {
        echo '<div class="error-message" style="display: block;">' . $_SESSION['error'] . '</div>';
        unset($_SESSION['error']);
      }
      if (isset($_SESSION['success'])) {
        echo '<div class="success-message" style="display: block;">' . $_SESSION['success'] . '</div>';
        unset($_SESSION['success']);
      }
      ?>

      <!-- Creating signup form -->
      <form id="SignupForm" action="signup_process.php" method="post">
        <div class="input-group">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" placeholder="Enter your username" required />
        </div>
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" required />
        </div>
        <button type="submit" class="login-btn">Sign Up</button>
      </form>

      <!-- Link to Login page -->
      <div class="links">
        <a href="login.php">Already have an account? Login</a>
      </div>
    </div>
  </div>
  
  <!-- Include the Signup.js file -->
  <script src="Signup.js"></script>
</body>

</html>
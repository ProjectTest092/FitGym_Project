<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GymFit - Member Login</title>
  <link rel="stylesheet" href="Login.css" />
</head>

<body>
  <?php
  session_start();
  ?>
  <div class="responsive-background">
    <img src="photos/newloginimage.jpg" alt="Background Image">
    <div class="login-container">
      <h1>Member Login</h1>
      <?php
      if (isset($_SESSION['error'])) {
          echo '<div class="error-message" style="display: block;">' . $_SESSION['error'] . '</div>';
          unset($_SESSION['error']);
      }
      ?>

      <!-- creating Form -->
      <form id="loginForm" action="login_process.php" method="post">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit" class="login-btn">Login</button>
      </form>

      <!-- Linking Signup Form -->
      <div class="links">
        <a href="#">Forgot Password?</a>
        <a href="signup.php">Create Account</a>
        <a href="Project.html">Back to Home</a>
      </div>
    </div>
  </div>
  <script src="Login.js"></script>
</body>

</html>
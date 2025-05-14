const SignupForm = document.getElementById('SignupForm');
const errorMessage = document.getElementById('errorMessage');

SignupForm.addEventListener('submit', function (e) {
     e.preventDefault();
     console.log("Form submitted");

     const username = document.getElementById('username').value;
     const email = document.getElementById('email').value;
     const password = document.getElementById('password').value;

     // Simple validation
     if (!validateEmail(email)) {
          showError('Please enter a valid email address');
          return;
     }

     if (password.length < 6) {
          showError('Password must be at least 6 characters');
          return;
     }

     // Create form data and submit
     const formData = new FormData();
     formData.append('username', username);
     formData.append('email', email);
     formData.append('password', password);

     // Show loading
     const submitBtn = document.querySelector('.login-btn');
     submitBtn.disabled = true;
     submitBtn.textContent = 'Creating Account...';

     console.log("Sending fetch request to signup_process.php");

     // Send to server
     fetch('signup_process.php', {
          method: 'POST',
          body: formData,
          headers: {
               'X-Requested-With': 'XMLHttpRequest'
          }
     })
          .then(response => {
               console.log("Response received:", response);
               if (!response.ok) {
                    console.error("Server returned error status:", response.status);
               }
               return response.text(); // Change to text() to see the actual response
          })
          .then(text => {
               console.log("Raw response text:", text);

               // Try to parse the response as JSON
               let data;
               try {
                    data = JSON.parse(text);
                    console.log("Parsed JSON data:", data);
               } catch (e) {
                    console.error("Failed to parse JSON:", e);
                    throw new Error("Invalid JSON response: " + text);
               }

               if (data.success) {
                    console.log("Success! Redirecting to:", data.redirect || 'Project.html');
                    showSuccess('Account created successfully! Redirecting...');
                    // Redirect to the specified page or default to Project.html
                    setTimeout(() => {
                         window.location.href = data.redirect || 'Project.html';
                    }, 1500);
               } else {
                    console.error("Error from server:", data.message);
                    showError(data.message || 'Failed to create account. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Sign Up';
               }
          })
          .catch(error => {
               console.error('Error details:', error);
               showError('An error occurred. Please try again.');
               submitBtn.disabled = false;
               submitBtn.textContent = 'Sign Up';
          });
});

function validateEmail(email) {
     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return re.test(email);
}

function showError(message) {
     console.log("Showing error:", message);
     errorMessage.textContent = message;
     errorMessage.style.display = 'block';
     errorMessage.style.color = '#e74c3c';
     // Clear error after 5 seconds instead of 3
     setTimeout(() => {
          errorMessage.style.display = 'none';
     }, 5000);
}

function showSuccess(message) {
     console.log("Showing success:", message);
     errorMessage.textContent = message;
     errorMessage.style.display = 'block';
     errorMessage.style.color = '#2ecc71';
}
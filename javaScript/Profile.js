        // Function to toggle the visibility of the password form
        function togglePasswordForm() {
        const passwordForm = document.getElementById('passwordForm');
        const updateInfoForm = document.getElementById('updateInfoForm');
        passwordForm.style.display = passwordForm.style.display === 'none' || passwordForm.style.display === '' ? 'block' : 'none';
        updateInfoForm.style.display = 'none'; // Hide the update info form
    }

    // Function to show the update info form and hide the password form
    function showUpdateInfoForm() {
        const passwordForm = document.getElementById('passwordForm');
        const updateInfoForm = document.getElementById('updateInfoForm');
        passwordForm.style.display = 'none'; // Hide the password form
        updateInfoForm.style.display = 'block'; // Show the update info form
        const currentEmail = document.getElementById('email').textContent.trim();
            const currentFirstName = document.getElementById('firstName').textContent.trim();
            const currentLastName = document.getElementById('lastName').textContent.trim();
            document.getElementById('newFirstName').value = currentFirstName;
            document.getElementById('newLastName').value = currentLastName;
            document.getElementById('newEmail').value = currentEmail;
    }

        // Function to update the password
        async function updatePassword() {
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validate new password and confirm password match
            if (newPassword !== confirmPassword) {
                alert('New password and confirmation do not match.');
                return;
            }

            // Proceed with password update if validation passes
            try {
                const email = document.getElementById('email').textContent.trim();
                if (!email) {
                    alert('Error: User email not found.');
                    return;
                }

                const updateResponse = await fetch('http://localhost:5000/users/updatePassword', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        currentPassword: currentPassword,
                        newPassword: newPassword
                    })
                });

                const updateData = await updateResponse.json();
                if (!updateResponse.ok) {
                    throw new Error(updateData.error || 'Error updating password.');
                }
                emailSpan.textContent = '';
                alert('Password updated successfully!');
                document.getElementById('passwordForm').style.display = 'none'; // Hide the form
            } catch (error) {
             //   alert('Error: ' + error.message);
                emailSpan.textContent = error.message;
            }
        }

        // Function to handle form submission
        function handleFormSubmit(event) {
            event.preventDefault();

            const passwordFeedback = document.getElementById('passwordFeedback').textContent;
            const strengthFeedback = document.getElementById('strengthFeedback').textContent;

            if (passwordFeedback !== 'Match' || !strengthFeedback.includes('Strong Password')) {
                alert('Password must be strong and match the confirmation password.');
                return;
            }

            updatePassword(); // Proceed with password update
        }

        // Function to check password strength
        function checkPasswordStrength() {
            const password = document.getElementById('newPassword').value;
            const feedback = document.getElementById('strengthFeedback');

            fetch('http://localhost:5000/users/checkPasswordStrength', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.isStrong) {
                    feedback.textContent = 'Strong Password';
                } else {
                    let errorMessage = 'Weak Password: ';
                    if (!data.hasCapital) errorMessage += 'Needs a capital letter. ';
                    if (!data.hasNum) errorMessage += 'Needs a number. ';
                    if (!data.isLongEnough) errorMessage += 'Needs to be at least 8 characters long.';
                    feedback.textContent = errorMessage;
                }
            })
            .catch(() => {
                feedback.textContent = 'Error checking password strength';
            });
        }

        // Function to check if passwords match
        function checkPasswordMatch() {
            const password = document.getElementById("newPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const feedback = document.getElementById('passwordFeedback');

            fetch('http://localhost:5000/users/checkPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password, confirmPassword })
            })
            .then(response => response.json())
            .then(data => {
                feedback.textContent = data.match ? 'Match' : 'No Match';
            })
            .catch(() => {
                feedback.textContent = 'Error checking password';
            });
        }

        // Event listeners
        document.addEventListener('DOMContentLoaded', () => {

            const passwordInput = document.getElementById('newPassword');
            passwordInput.addEventListener('input', checkPasswordStrength);

            const confirmPasswordInput = document.getElementById('confirmPassword');
            confirmPasswordInput.addEventListener('input', checkPasswordMatch);
        });







        
        async function checkEmailExists(email) {
    try {
        const response = await fetch('http://localhost:5000/users/checkEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();
        return data.exists;
    } catch (error) {
        console.error('Error checking email:', error);
        return false; // Assume the email does not exist if there's an error
    }
}






        document.addEventListener('DOMContentLoaded', async () => {
            try {
                const response = await fetch('http://localhost:5000/users/profile', {
                    method: 'GET',
                });

    
                const userData = await response.json();
                document.getElementById('firstName').textContent = userData.firstName;
                document.getElementById('lastName').textContent = userData.lastName;
                document.getElementById('email').textContent = userData.email;
                document.getElementById('createdEvents').textContent = userData.createdEvents.join(', ');
                document.getElementById('joinedEvents').textContent = userData.joinedEvents.join(', ');
    
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        });
    
        async function showUpdateForm() {
        try {
            
            const currentEmail = document.getElementById('email').textContent.trim();
            const currentFirstName = document.getElementById('firstName').textContent.trim();
            const currentLastName = document.getElementById('lastName').textContent.trim();

            if (!currentEmail) {
                alert('Error: User email not found.');
                return;
            }


            const newFirstName = document.getElementById('newFirstName').value.trim();
            const newLastName = document.getElementById('newLastName').value.trim();
            const newEmail = document.getElementById('newEmail').value.trim();



            // Validate new email
            if (newEmail && !validateEmail(newEmail)) {
                document.getElementById('emailSpan').textContent = 'Invalid email format.';
                return;
            }
            if (newFirstName === currentFirstName &&
                newLastName === currentLastName &&
                newEmail === currentEmail) {
                document.getElementById('emailSpan').textContent ='No changes were made.';
                return;
            }

            // Check if the new email is already in use
            if (newEmail !== currentEmail) {
                const emailExists = await checkEmailExists(newEmail);
                if (emailExists) {
                    document.getElementById('emailSpan').textContent = 'The email is already used. Please use a different email.';
                    return;
                }
            }

            const updateResponse = await fetch('http://localhost:5000/users/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: currentEmail, // Keep current email for identification
                    newFirstName,
                    newLastName,
                    newEmail
                })
            });

            const updateData = await updateResponse.json();
            if (!updateResponse.ok) {
                throw new Error(updateData.error || 'Error updating profile.');
            }

            alert('Profile updated successfully!');
            location.reload(); // Reload the page to reflect changes

        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    // Simple email validation function
    function validateEmail(email) {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Mock function for checking if an email exists
    async function checkEmailExists(email) {
        // Implement actual email existence check here
        // Return true if email exists, false otherwise
        return false;
    }


    
        document.getElementById('logoutButton').addEventListener('click', async (event) => {
            event.preventDefault();
    
            try {
                // Fetch the user who is logged in
                const response = await fetch('http://localhost:5000/users/logoutButton', {
                    method: 'GET',
                });
    
                if (!response.ok) {
                    throw new Error('Unable to fetch user');
                }
    
                const user = await response.json();
    
                if (!user || !user.email) {
                    alert('No user is currently logged in');
                    return;
                }
    
                // Send logout request
                const logoutResponse = await fetch('http://localhost:5000/users/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: user.email })
                });
    
                if (!logoutResponse.ok) {
                    const errorData = await logoutResponse.json();
                    throw new Error(errorData.error || 'Logout failed');
                }
    
                alert('Logout successful!');
                window.location.href = 'SignIn.html'; // Redirect to sign-in page
            } catch (error) {
                alert('Error logging out: ' + error.message);
            }
        });











        document.addEventListener("DOMContentLoaded", function() {
            checkSignInStatus();
        });
        
        function closePopup() {
            document.getElementById('popup').style.display = 'none';
        }
        
        function showPopup() {
            document.getElementById('popup').style.display = 'block';
        }
        
        function checkSignInStatus() {
            fetch('/findUser')
                .then(response => response.json())
                .then(user => {
                    if (!user) {
                        showPopup();
                    } else {
                        console.log("User is signed in.");
                    }
                })
                .catch(error => {
                    console.error('Error fetching user:', error);
                });
        }
        


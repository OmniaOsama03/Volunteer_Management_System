document.addEventListener('DOMContentLoaded', () => {
    // Fetch and set the profile picture URL from localStorage
    const imageUrl = localStorage.getItem('profilePictureUrl');
    if (imageUrl) {
        document.getElementById('profilePicture').src = imageUrl;
    }
});


// Add an event listener to the form with ID 'uploadForm'
document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default form submission

    const fileInput = document.getElementById('profilePictureInput');
    const file = fileInput.files[0];  // Get the first selected file

    if (file) {
        // Create a FileReader instance to read the file contents
        const reader = new FileReader();
        reader.onloadend = function() {
            const imageUrl = reader.result;  // Get the base64 data URL
            document.getElementById('profilePicture').src = imageUrl;

            // Store the base64 data URL in localStorage
            localStorage.setItem('profilePictureUrl', imageUrl);

            // Optional: Clear the file input field after uploading
            fileInput.value = '';
        };
    }
});





    document.addEventListener('DOMContentLoaded', function() {
        checkUserSignInStatus();
    });

    function checkUserSignInStatus() {
        var xhr = new XMLHttpRequest();
        // Sends a GET request to the server to retrieve user information from /users/findUser
        xhr.open('GET', 'http://35.224.154.82/users/findUser', true);

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                // Parse the JSON response from /findUser
                const user = JSON.parse(xhr.responseText);

                if (!user || user.isSignedIn === false) {
                    showPopup('<p><a href="/html/SignIn.html">Sign In</a> to join our volunteering events!</p><p><a href="/html/HomePage.html"> Go back</p>');
                } 
            } else {
                console.error('Error fetching user status:', xhr.statusText);
            }
        };
        xhr.onerror = function() {
            console.error('Request failed');
        };
        xhr.send();
    }
    function showPopup(message) {
        const popup = document.getElementById('popup');
        document.getElementById('popupMessage').innerHTML = message;
        popup.style.display = 'block';
    }




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
            const currentPassword = document.getElementById('currentPassword').value.trim();
            const newPassword = document.getElementById('newPassword').value.trim();

            if (!email || !currentPassword || !newPassword) {
                alert('Error: Please fill in all fields.');
                return;
            }
            // Sends a PATCH request to the server to update the user's password
            const updateResponse = await fetch('http://35.224.154.82/users/updatePassword', {
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
        errorSpan.textContent = '';
        alert('Password updated successfully!');
        document.getElementById('passwordForm').style.display = 'none'; // Hide the form
        } catch (error) {
            errorSpan.textContent = 'Error: ' + error.message;
        }}



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
        // Sends a POST request to the server to check the strength of the password
        fetch('http://35.224.154.82/users/checkPasswordStrength', {
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
        // Sends a POST request to the server to check if the passwords match
        fetch('http://35.224.154.82/users/checkPassword', {
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
    try {     // Sends a POST request to the server to check if the email exists
        const response = await fetch('http://35.224.154.82/users/checkEmail', {
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
            const response = await fetch('http://35.224.154.82/users/profile', {
                method: 'GET',
            });


            const userData = await response.json();
            document.getElementById('firstName').textContent = userData.firstName;
            document.getElementById('lastName').textContent = userData.lastName;
            document.getElementById('email').textContent = userData.email;


        } catch (error) {
            console.log('Error fetching user data:', error);
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
            document.getElementById('errorSpan').textContent = 'Invalid email format.';
            return;
        }
        if (newFirstName === currentFirstName &&
            newLastName === currentLastName &&
            newEmail === currentEmail) {
            document.getElementById('errorSpan').textContent ='No changes were made.';
            return;
        }
        if (newFirstName === "" ||
            newLastName === "" ||
            newEmail === "") {
            document.getElementById('errorSpan').textContent ='fill all fileds';
            return;
        }

        // Check if the new email is already in use
        if (newEmail !== currentEmail) {
            const emailExists = await checkEmailExists(newEmail);
            if (emailExists) {
                document.getElementById('errorSpan').textContent = 'The email is already used. Please use a different email.';
                return;
            }
        }

        const updateResponse = await fetch('http://35.224.154.82/users/update', {
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
            const response = await fetch('http://35.224.154.82/users/getLoggedInUser', {
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
            const logoutResponse = await fetch('http://35.224.154.82/users/logout', {
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

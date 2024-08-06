function isSignedIn() 
{
    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    
    // Define the request method and URL to check if the user is signed in
    xhr.open('GET', 'https://eventlink-431700.df.r.appspot.com/users/findUser', true);

    // Define the callback function for when the request completes
    xhr.onload = function() 
    {
        // Parse the JSON response
        const user = JSON.parse(xhr.responseText);
        
        // Check if user is signed in
        if (user && user._id) 
        {
            // User is signed in, hide the sign-in and sign-up buttons, show the pfp
            document.getElementById('auth-buttons').style.display = 'none';
            document.getElementById('pfp').style.display = 'block';
        } else 
        {
            // User is not signed in, show the sign-in and sign-up buttons, hide the pfp
            document.getElementById('auth-buttons').style.display = 'block';
            document.getElementById('pfp').style.display = 'none';
        }
    };

    // Send the request to check if the user is signed in
    xhr.send();
}

function hoverOnPfp() 
{
    document.getElementById('dim-overlay').style.display = 'block';
    document.getElementById('pfp').style.transform = 'scale(1.2)';
    document.getElementById('pfp-menu').style.display = 'block';
}

function notHoveringOnPfp() 
{
    document.getElementById('dim-overlay').style.display = 'none';
    document.getElementById('pfp').style.transform = 'scale(1)';
    document.getElementById('pfp-menu').style.display = 'none';
}

function viewProfile() 
{
    // Redirect to the profile page
    window.location.href = '../html/Profile.html';
}

async function logOut() 
{
    // Handle log out logic
    try {
        // Fetch the user who is logged in
        const response = await fetch('https://eventlink-431700.df.r.appspot.com/users/getLoggedInUser', {
            method: 'GET',
            credentials: 'include' // Assuming cookies or similar are used
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
        const logoutResponse = await fetch('https://eventlink-431700.df.r.appspot.com/users/logout', {
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
}

function signIn() 
{
    window.location.href = '../html/SignIn.html';
}

function signUp() 
{
    window.location.href = '../html/SignUp.html';
}
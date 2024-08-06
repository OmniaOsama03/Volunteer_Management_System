document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('event-date');

    // Create a new date object for tomorrow
    const AllowedData = new Date();

    // Set tomorrow's date
    AllowedData.setDate(AllowedData.getDate() + 1);

    // Format the date to YYYY-MM-DD
    const AllowedDataFormatted = AllowedData.toISOString().split('T')[0];

    // Set the minimum date attribute to tomorrow's date
    dateInput.setAttribute('min', AllowedDataFormatted);
});


// Handles the form submission, sends data to the server, and updates user events
async function handleFormSubmit(event) 
{
    event.preventDefault();

    const form = event.target;
    const data = 
    {
        name: form.elements['name'].value,
        title: form.elements['title'].value,
        description: form.elements['description'].value,
        location: form.elements['location'].value,
        date: form.elements['date'].value,
        time: form.elements['time'].value,
        category: form.elements['category'].value,
        visibility: form.elements['visibility'].value
    };

    try 
    {
        const response = await fetch('http://35.224.154.82/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Find the event ID based on the title
        const titleResponse = await fetch(`http://35.224.154.82/events/findEventId/${data.title}`);

        const titleData = await titleResponse.json(); //the event with the id
        console.log(titleData);
        const eventId = titleData._id;

        // Find the currently logged-in user
        const userResponse = await fetch('http://35.224.154.82/users/findUser');

        const userData = await userResponse.json(); //the user currently logged in
        const userId = userData._id;

        // Add the event to the user's created events
        const createEventResponse = await fetch(`http://35.224.154.82/users/createEvent/${eventId}/${userId}`, 
        {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json'
            }
        });

        const deleteEvent = await fetch(`http://35.224.154.82/events/deleteEvent/${eventId}`, 
            {
                method: 'DELETE',
                headers: 
                {
                    'Content-Type': 'application/json'
                }
            });

        //Display popup with message saying that it was created successfully
        const popupDiv = document.getElementById('popupMessage');

        document.getElementById('popup').style.display = 'block';
        popupDiv.innerHTML = '<p> The event has been successfully created! </p>';

        form.reset();

    } catch (error) {

        alert('Error creating event: ' + error.message);
    }
}


function closePopup() {
        document.getElementById('popup').style.display = 'none';
    }
    

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.querySelector('form');
        form.addEventListener('submit', handleFormSubmit);
    });


    document.addEventListener('DOMContentLoaded', function() {
        checkUserSignInStatus();
    });

    function checkUserSignInStatus() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://35.224.154.82/users/findUser', true);

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                // Parse the JSON response from /findUser
                const user = JSON.parse(xhr.responseText);

                if (!user || user.isSignedIn === false) {
                    showPopupLoging('<p><a href="/html/SignIn.html">Sign In</a> to create your events!</p><p><a href="/html/HomePage.html"> Go back</p>');
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

function showPopupLoging(message) {
    const popup = document.getElementById('popupl');
    document.getElementById('popupMessageLoging').innerHTML = message;
    popup.style.display = 'block';
}

        function signIn() 
        {
            window.location.href = '../html/SignIn.html';
        }

        function signUp() 
        {
            window.location.href = '../html/SignUp.html';
        }

        function isSignedIn() 
        {
        // Create a new XMLHttpRequest object
        const xhr = new XMLHttpRequest();
        
        // Define the request method and URL to check if the user is signed in
        xhr.open('GET', 'http://35.224.154.82/users/findUser', true);

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
                    const response = await fetch('http://35.224.154.82/users/getLoggedInUser', {
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
            }

            function viewProfile() 
            {
                window.location.href = '/html/Profile.html';
            }
    
  
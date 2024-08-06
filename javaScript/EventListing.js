function isSignedIn() 
{
    
    const xhr = new XMLHttpRequest();
    
    // Check if the user is signed in
    xhr.open('GET', 'http://35.224.154.82/users/findUser', true);

    // Callback function for when the request completes
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
    
    try 
    {
        // Fetch the user who is logged in
        const response = await fetch('http://35.224.154.82/users/getLoggedInUser', 
        {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Unable to fetch user');
        }

        //Store the response
        const user = await response.json();

        //Scenario where user isn't save
        if (!user || !user.email) 
        {
            alert('No user is currently logged in');
            return;
        }

        // Send logout request
        const logoutResponse = await fetch('http://35.224.154.82/users/logout', 
        {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ email: user.email })
        });

        //if the status of response isn't ok
        if (!logoutResponse.ok) 
        {
            const errorData = await logoutResponse.json();
            throw new Error(errorData.error || 'Logout failed');
        }

        alert('Logout successful!');
        window.location.href = 'SignIn.html'; // Redirect the user to sign-in page

    } catch (error) 
    {
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

function closePopup() 
{
    document.getElementById('popup').style.display = 'none';
}

function showPopup(message) 
{
    document.getElementById('popupMessage').innerHTML = message;
    document.getElementById('popup').style.display = 'block';
}

//displaying all events as the page loads
async function displayAllEvents() 
{
    try 
    {
        // Fetching all events from the server
        const response = await fetch('http://35.224.154.82/events/');

        // Parse the JSON response
        const events = await response.json();

        // Call the listEvent() function to display the events
        listEvent('all', events);

    } catch (error) 
    {
        console.error('Error fetching events:', error);
    }
}

//displaying events based on a given array of events
function listEvent(userAction, arrayOfEvents) 
{
    const centralSection = document.getElementById('central-section');
    centralSection.innerHTML = ''; // Clear previous events if any

    if (arrayOfEvents.length === 0) 
    {
        
        const noEventsMessage = document.createElement('div');
        noEventsMessage.classList.add('no-events-message'); //css

        if(userAction === "all")
        {
            noEventsMessage.innerHTML = 
        `
            <p>Sorry! There are no events at the moment!</p>
        `;
        }else
        {
        noEventsMessage.innerHTML = 
        `
            <p>Sorry! No event matches your ${userAction}</p>
        `;
        }

        centralSection.appendChild(noEventsMessage);

        return; // Exit the function early if there are no events
    }

    let eventHtml = '';

    arrayOfEvents.forEach(event => 
    {
        eventHtml += `
            <div class="event-item">
                <h2>${event.title}</h2>

                <div class="event-info">
                    <p>
                        <strong>Category:</strong> ${event.category}<br>
                        <strong>Date:</strong> ${extractDateComponents(event.date)}<br>
                        <strong>Time:</strong> ${event.time}<br>
                        <strong>Location:</strong> ${event.location}<br>
                        <strong>Description:</strong> ${event.description}<br>
                        <strong>This event is ${event.visibility}</strong> 
                    </p>
                    <button class="register-button" onclick="register('${event._id}')">Register</button>
                </div>
            </div>
        `;
    });

    centralSection.innerHTML += eventHtml;
}


//Function to get filtered events based on user input
function filterEvents() 
{
    // Retrieve filter values from the form
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const location = document.getElementById('location').value;
    const publicCheckbox = document.getElementById('public');
    const privateCheckbox = document.getElementById('private');

    // Create an array to hold selected visibility values (because u can check multiple)
    const visibility = []; 
    if (publicCheckbox.checked) visibility.push(publicCheckbox.value);
    if (privateCheckbox.checked) visibility.push(privateCheckbox.value);

    // Create a URLSearchParams object to handle query parameters
    const params = new URLSearchParams();
    if (category) 
    {
        params.append('category', category);
    }

    if (date) 
    {
        params.append('date', date);
    }

    if (location) 
    {
    params.append('location', location);
    }

    if (visibility)
    { 
    params.append('visibility', visibility);
    }


    // Perform AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://35.224.154.82/events/filter?${params.toString()}`, true);

    xhr.onload = function ()
    {
        //Storing the events we got
        const events = JSON.parse(xhr.responseText);
        console.log(events);

        // Display the events
        listEvent('filter', events);
    };

    xhr.send();
}

//To search for an event based on the title
function searchEvent() 
{
    // Retrieve the search term from the input field
    const searchTerm = document.getElementById('searchInput').value;

    // Create a URLSearchParams object to handle query parameters
    const params = new URLSearchParams();
    if (searchTerm) 
    {
        params.append('title', searchTerm);
    }

    // Perform AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://35.224.154.82/events/search?${params.toString()}`, true);

    xhr.onload = function () 
    {    
        // Parse the JSON response
        const events = JSON.parse(xhr.responseText);

        // Display the events
        listEvent('search', events);
    };

    xhr.send();
}

function displayJoinedEvents() 
{
    // Create a new XMLHttpRequest object to find the user
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://35.224.154.82/users/findUser', true);

    xhr.onload = function() 
    {
        const user = JSON.parse(xhr.responseText);

        if (!user) 
        {
            // User is not signed in
            document.getElementById('joined-events').innerHTML = '<div class="no-joined-events-message">Sign in to view events you have joined</div>';
            document.getElementById('created-events').innerHTML = '<div class="no-joined-events-message">Sign in to view events you have created</div>';
            return;
        }

        const userId = user._id;

        // Fetch all events
        const allEventsXhr = new XMLHttpRequest();
        allEventsXhr.open('GET', 'http://35.224.154.82/events/', true);

        allEventsXhr.onload = function() 
        {
            const allEvents = JSON.parse(allEventsXhr.responseText);

            // Fetch joined events for the user
            const joinedEventsXhr = new XMLHttpRequest();
            joinedEventsXhr.open('GET', `http://35.224.154.82/users/getJoinedEvents/${userId}`, true);

            joinedEventsXhr.onload = function() 
            {
                const joinedEventIds = JSON.parse(joinedEventsXhr.responseText);

                if(joinedEventIds.length === 0)
                {
                    document.getElementById('joined-events').innerHTML = '<div class="no-joined-events-message">You have not joined any event!</div>';
                }
                else
                {
                    // Filter the events
                    const joinedEvents = allEvents.filter(event => joinedEventIds.includes(event._id));

                    // Display the events
                    const joinedEventsDiv = document.getElementById('joined-events');
                    joinedEventsDiv.innerHTML = '';

                    joinedEvents.forEach(event => 
                    {
                        const eventDiv = document.createElement('div');
                        
                        eventDiv.className = 'joined-event-item';

                        eventDiv.innerHTML = `
                            <h3>${event.title}</h3>

                            <div class="joined-event-info">
                                <p>
                                <strong>Date: </strong> ${extractDateComponents(event.date)} <br>
                                <strong>Time: </strong> ${event.time}
                                </p>
                            </div>

                            <button class="delete-joined" onclick="checkDeleteJoined('${event._id}', '${event.title}', '${userId}')">delete</button>
                        `;

                        joinedEventsDiv.appendChild(eventDiv);
                    });
                }

                // Now fetch created events for the user
                const createdEventsXhr = new XMLHttpRequest();
                createdEventsXhr.open('GET', `http://35.224.154.82/users/getCreatedEvents/${userId}`, true);

                createdEventsXhr.onload = function() 
                {
                    const createdEventIds = JSON.parse(createdEventsXhr.responseText);

                    if(createdEventIds.length === 0)
                    {
                        document.getElementById('created-events').innerHTML = '<div class="no-joined-events-message">You have not created any event!</div>';
                    }
                    else
                    {
                        // Filter the events for the created events
                        const createdEvents = allEvents.filter(event => createdEventIds.includes(event._id));

                        // Display the created events
                        const createdEventsDiv = document.getElementById('created-events');
                        createdEventsDiv.innerHTML = '';

                        createdEvents.forEach(event => 
                        {
                            const eventDiv = document.createElement('div');
                            
                            eventDiv.className = 'joined-event-item';

                            eventDiv.innerHTML = `
                                <h3>${event.title}</h3>

                                <div class="joined-event-info">
                                    <p>
                                    <strong>Date: </strong> ${extractDateComponents(event.date)} <br>
                                    <strong>Time: </strong> ${event.time}
                                    </p>
                                </div>

                                <button class = "delete-created" onclick="checkDeleteCreated('${event._id}', '${event.title}', '${userId}')">delete</button>
                            `;

                            createdEventsDiv.appendChild(eventDiv);
                        });
                    }
                };

                createdEventsXhr.send();
            };

            joinedEventsXhr.send();
        };

        allEventsXhr.send();
    };

    xhr.send();
}


//just for formatting the date
function extractDateComponents(dateString) 
{
    // Parse the date string
    const date = new Date(dateString);

    // Extract day, month, and year
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

// Toggle the visibility of the delete button for joined events
function editJoined() 
{
    const buttons = document.getElementsByClassName('delete-joined');

    Array.from(buttons).forEach(button => 
    {
        if (button.style.display === 'none' || button.style.display === '') 
        {
            button.style.display = 'block';
        } 
        else 
        {
            button.style.display = 'none';
        }
    });
}

// Toggle the visibility of the delete button for created events
function editCreated() 
{
    const buttons = document.getElementsByClassName('delete-created');

    Array.from(buttons).forEach(button => 
    {
        if (button.style.display === 'none' || button.style.display === '') 
        {
            button.style.display = 'block';
        } 
        else 
        {
            button.style.display = 'none';
        }
    });
}


function checkDeleteJoined(eventID, eventTitle, userId)
{
    const message =
    `
    <p> Are you sure you would like to delete the event: ${eventTitle}</p>
    <button class="delete-button" onclick="deleteJoinedEvent('${eventID}', '${userId}')"> Delete!</button>
    `
    showPopup(message)
}

function checkDeleteCreated(eventID, eventTitle, userId)
{
    const message =
    `
    <p> Are you sure you would like to delete the event: ${eventTitle}</p>
    <button class="delete-button" onclick="deleteCreatedEvent('${eventID}', '${userId}')">Delete!</button>
    `

    showPopup(message)
}


function deleteJoinedEvent(eventId, userId)
{
    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    
    // Define the request method and URL to the delete endpoint
    xhr.open('DELETE', `http://35.224.154.82/users/deleteJoinedEvent/${userId}/${eventId}`, true);
    
    // Define the callback function for when the request completes
    xhr.onload = function() 
    {
            //Get the response from the endpoint
            const response = JSON.parse(xhr.responseText);

            console.log(response.message);
            
            // Hide the popup
            closePopup()

            // Refresh the list of joined events 
            displayJoinedEvents();

    };
    
    // Send the request
    xhr.send();
}

function deleteCreatedEvent(eventId, userId)
{
    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();
        
    // Define the request method and URL to the delete endpoint
    xhr.open('DELETE', `http://35.224.154.82/users/deleteCreatedEvent/${userId}/${eventId}`, true);

    // Define the callback function for when the request completes
    xhr.onload = function() 
    {
            //Get the response from the endpoint
            const response = JSON.parse(xhr.responseText);

            console.log(response.message);

            // Hide the popup
            closePopup()
            
            // Refresh the list of joined events 
            displayJoinedEvents();

            //Refresh list of all events
            displayAllEvents();
    };

    // Send the request
    xhr.send();
}

function register(eventId) 
{
    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    
    // Define the request method and URL to find the user
    xhr.open('GET', 'http://35.224.154.82/users/findUser', true);
    
    // Define the callback function for when the request completes
    xhr.onload = function() 
    {
            
            // Parse the JSON response from /findUser
            const user = JSON.parse(xhr.responseText);
            
            if (!user || user.isSignedIn === false) 
            {
                showPopup('<p> <a href = "/html/SignIn.html">Sign In</a> to join our volunteering events! </p> ');

            } else 
            {
                // User is signed in, proceed to register for the event
                const userId = user._id;
                
                // Create another XMLHttpRequest to register the event
                const registerXhr = new XMLHttpRequest();
                registerXhr.open('POST', `http://35.224.154.82/users/register/${eventId}/${userId}`, true);

                // Define the callback function for when the registration request completes
                registerXhr.onload = function() 
                {
                    const response = JSON.parse(registerXhr.responseText);
 
                    showPopup("<p>" + response.message + "</p>")

                };

                // Send the registration request
                registerXhr.send();
            }

            displayJoinedEvents();
    };

    // Send the request to find the user
    xhr.send();
}

module.exports = displayAllEvents;


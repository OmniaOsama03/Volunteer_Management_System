//displaying all events as the page loads
async function displayAllEvents() 
{

    try 
    {
        // Fetching all events from the server
        const response = await fetch('http://localhost:5000/events/');

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
        noEventsMessage.classList.add('no-events-message');

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
                        <strong>Date:</strong> ${event.date}<br>
                        <strong>Time:</strong> ${event.time}<br>
                        <strong>Location:</strong> ${event.location}<br>
                        <strong>Description:</strong> ${event.description}<br>
                        <strong>This event is ${event.visibility}</strong> 
                    </p>
                    <button class="register-button" onclick="register('${event.id}')">Register</button>
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
    xhr.open('GET', `http://localhost:5000/events/filter?${params.toString()}`, true);

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
function searchEvent() {
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
    xhr.open('GET', `http://localhost:5000/events/search?${params.toString()}`, true);

    xhr.onload = function () 
    {    
        // Parse the JSON response
        const events = JSON.parse(xhr.responseText);

        // Display the events
        listEvent('search', events);
    };

    xhr.send();
}



// Sample register function
function register(eventId) {
    console.log('Registering for event with ID:', eventId);
    // Implement AJAX call to register for event
}
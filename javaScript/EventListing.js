async function displayAllEvents() 
{
    console.log('works up to here');

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


function listEvent(userAction, arrayOfEvents) 
{
    const centralSection = document.getElementById('central-section');
    centralSection.innerHTML = ''; // Clear previous events if any

    if (arrayOfEvents.length === 0) 
    {
        
        const noEventsMessage = document.createElement('div');
        noEventsMessage.classList.add('no-events-message');

        noEventsMessage.innerHTML = 
        `
            <p>Sorry! No event matches your ${userAction}</p>
        `;

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
                        <strong>Visibility:</strong> ${event.visibility}
                    </p>
                    <button class="register-button" onclick="register('${event.id}')">Register</button>
                </div>
            </div>
        `;
    });

    centralSection.innerHTML += eventHtml;
}


// Sample register function
function register(eventId) {
    console.log('Registering for event with ID:', eventId);
    // Implement AJAX call to register for event
}
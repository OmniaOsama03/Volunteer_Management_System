async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const data = {
        name: form.elements['name'].value,
        title: form.elements['title'].value,
        description: form.elements['description'].value,
        location: form.elements['location'].value,
        date: form.elements['date'].value,
        time: form.elements['time'].value,
        category: form.elements['category'].value,
        visibility: form.elements['visibility'].value
    };

    try {
        const response = await fetch('http://localhost:5000/events', {
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
        const titleResponse = await fetch(`http://localhost:5000/events/findEventId/${data.title}`);

        const titleData = await titleResponse.json(); //the event with the id
        console.log(titleData);
        const eventId = titleData._id;

        // Find the currently logged-in user
        const userResponse = await fetch('http://localhost:5000/users/findUser');

        const userData = await userResponse.json(); //the user currently logged in
        const userId = userData._id;

        // Add the event to the user's created events
        const createEventResponse = await fetch(`http://localhost:5000/users/createEvent/${eventId}/${userId}`, 
        {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json'
            }
        });

        //Display popup with message
        const popupDiv = document.getElementById('popupMessage');

        document.getElementById('popup').style.display = 'block';
        popupDiv.innerHTML = '<p> The event has been successfully created! </p>';

        form.reset();

    } catch (error) {

        alert('Error creating event: ' + error.message);
    }
}

function closePopup() 
{
    document.getElementById('popup').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', handleFormSubmit);
});
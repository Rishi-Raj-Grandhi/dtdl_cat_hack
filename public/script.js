// Toggle active button
console.log('Script loaded'); 
function toggleActive(button) {
    const buttons = document.querySelectorAll('.button-container button');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

// Add event listeners to buttons
const buttons = document.querySelectorAll('.button-container button');
buttons.forEach(button => {
    button.addEventListener('click', async () => {
        toggleActive(button);
        try {
            const response = await axios.post('/');
            console.log('Server response:', response.data); // Log the response data
            updateBars(response.data);
        } catch (error) {
            console.error('Failed to fetch data from server', error);
        }
    });
});

// Update bar elements with data
function updateBars(data) {
    if (!data || typeof data.drive === 'undefined') {
        console.error('Invalid data received from server:', data);
        return;
    }
    updateBar('bar1', data.drive);
    updateBar('bar2', data.engine);
    updateBar('bar3', data.fuel);
    updateBar('bar4', data.misc);
}

function updateBar(id, percentage) {
    const bar = document.getElementById(id);
    const label = document.getElementById('label' + id.charAt(id.length - 1)); 
    
    if (!bar || !label) {
        console.error('Bar or label element not found for ID:', id);
        return;
    }

    bar.style.width = percentage + '%';
    label.textContent = percentage + '% LIFETIME';

    if (percentage < 50) {
        bar.style.backgroundColor = 'red';
    } else if (percentage >= 50 && percentage < 70) {
        bar.style.backgroundColor = 'yellow';
    } else {
        bar.style.backgroundColor = 'green';
    }
}

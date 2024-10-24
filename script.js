// Toggle functionality (already exists)
document.querySelectorAll('.toggle-btn').forEach(button => {
    button.addEventListener('click', function() {
        if (this.classList.contains('off')) {
            this.classList.remove('off');
            this.classList.add('on');
            this.textContent = 'Done';
        } else if (this.classList.contains('on')) {
            this.classList.remove('on');
            this.classList.add('in-progress');
            this.textContent = 'In Progress';
        } else {
            this.classList.remove('in-progress');
            this.classList.add('off');
            this.textContent = 'Not Done';
        }
    });
});

// Functionality to add a new task
document.getElementById('add-task-btn').addEventListener('click', function() {
    const taskName = document.getElementById('new-task').value; // Get input value
    if (taskName) {
        const taskContainer = document.createElement('div');
        taskContainer.classList.add('task');
        
        const taskSpan = document.createElement('span');
        taskSpan.classList.add('task-name');
        taskSpan.textContent = taskName; // Set task name
        
        const taskButton = document.createElement('button');
        taskButton.classList.add('toggle-btn', 'off');
        taskButton.textContent = 'Not Done'; // Set default status
        
        // Toggle status for new tasks
        taskButton.addEventListener('click', function() {
            if (this.classList.contains('off')) {
                this.classList.remove('off');
                this.classList.add('on');
                this.textContent = 'Done';
            } else if (this.classList.contains('on')) {
                this.classList.remove('on');
                this.classList.add('in-progress');
                this.textContent = 'In Progress';
            } else {
                this.classList.remove('in-progress');
                this.classList.add('off');
                this.textContent = 'Not Done';
            }
        });
        
        // Add remove button
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-btn');
        removeButton.textContent = 'Remove';
        
        // Remove task functionality
        removeButton.addEventListener('click', function() {
            taskContainer.remove(); // Remove the task from the list
        });

        // Append elements to the task container
        taskContainer.appendChild(taskSpan);
        taskContainer.appendChild(taskButton);
        taskContainer.appendChild(removeButton); // Add the remove button
        document.querySelector('.todo').appendChild(taskContainer); // Add task to the list
        
        document.getElementById('new-task').value = ''; // Clear input field
    }
});

// Add remove functionality to existing tasks
document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', function() {
        this.parentElement.remove(); // Remove the parent task container
    });
});


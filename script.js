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

document.getElementById('add-task-btn').addEventListener('click', function() {
    const taskName = document.getElementById('new-task').value; 
    if (taskName) {
        const taskContainer = document.createElement('div');
        taskContainer.classList.add('task');
        taskContainer.setAttribute('draggable', 'true'); 

        const taskSpan = document.createElement('span');
        taskSpan.classList.add('task-name');
        taskSpan.textContent = taskName;
    
        const taskButton = document.createElement('button');
        taskButton.classList.add('toggle-btn', 'off');
        taskButton.textContent = 'Not Done'; 
        
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
        
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-btn');
        removeButton.textContent = 'Remove';
        
        removeButton.addEventListener('click', function() {
            taskContainer.remove(); 
        });

        
        taskContainer.addEventListener('dragstart', function (e) {
            e.target.classList.add('dragging');
        });

        taskContainer.addEventListener('dragend', function () {
            taskContainer.classList.remove('dragging');
        });

        taskContainer.appendChild(taskSpan);
        taskContainer.appendChild(taskButton);
        taskContainer.appendChild(removeButton); 
        document.querySelector('.todo').appendChild(taskContainer); 
        
        document.getElementById('new-task').value = ''; 
    }
});

document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', function() {
        this.parentElement.remove(); 
    });
});

document.querySelectorAll('.task').forEach(task => {
    task.addEventListener('dragstart', function (e) {
        e.target.classList.add('dragging');
    });

    task.addEventListener('dragend', function () {
        task.classList.remove('dragging');
    });
});

document.querySelector('.todo').addEventListener('dragover', function (e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(this, e.clientY);
    const dragging = document.querySelector('.dragging');
    if (afterElement == null) {
        this.appendChild(dragging);
    } else {
        this.insertBefore(dragging, afterElement);
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


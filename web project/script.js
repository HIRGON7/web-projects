document.querySelectorAll('.toggle-btn').forEach(button => {
    button.addEventListener('click', function() {
        if (this.classList.contains('off')) {
            this.classList.remove('off');
            this.classList.add('on');
            this.textContent = 'On';
        } else {
            this.classList.remove('on');
            this.classList.add('off');
            this.textContent = 'Off';
        }
    });
});

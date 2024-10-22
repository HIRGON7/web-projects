document.querySelectorAll('.toggle-btn').forEach(button => {
    button.addEventListener('click', function() {
        if (this.classList.contains('off')) {
            this.classList.remove('off');
            this.classList.add('on');
            this.textContent = 'On';
        } else if(this.classList.contains('on')){
            this.classList.remove('on');
            this.classList.add('in-progress');
            this.textContent = 'In-Progress';
        }
        else{
            this.classList.remove('in-progress');
            this.classList.add('off');
            this.textContent = 'Off';
        }
    });
});

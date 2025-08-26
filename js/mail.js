document.addEventListener('DOMContentLoaded', () => {






const contactForm = document.getElementById('contact-form');
  
    if (contactForm) {
        const nameInp = document.getElementById('name');
        const emailInp = document.getElementById('email');
        const subjectInp = document.getElementById('subject');
        const messageInp = document.getElementById('message');
         const formStatus = document.getElementById('form-status');
        const submitButton = contactForm.querySelector('button[type="submit"]');

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            let isFormValid = true;

            
            const nameValue = nameInp.value.trim();
            const nameErrorDiv = nameInp.parentElement.querySelector('.error-message');
            if (nameValue === '') {
                isFormValid = false;
                nameErrorDiv.innerHTML = "Please enter your name";
                nameInp.style.border = "2px solid red";
            } else if (/\d/.test(nameValue)) {
                isFormValid = false;
                nameErrorDiv.innerHTML = "Please don't enter numbers in the name field";
                nameInp.style.border = "2px solid red";
            } else {
                nameErrorDiv.innerHTML = "";
                nameInp.style.border = "";
            }

         
            const emailValue = emailInp.value.trim();
            const emailErrorDiv = emailInp.parentElement.querySelector('.error-message');
            if (emailValue === '') {
                isFormValid = false;
                emailErrorDiv.innerHTML = "Please don't leave this field blank";
                emailInp.style.border = "2px solid red";
            } else if (!emailValue.includes('@') || !emailValue.includes('.')) {
                isFormValid = false;
                emailErrorDiv.innerHTML = "Please enter a valid email address";
                emailInp.style.border = "2px solid red";
            } else {
                emailErrorDiv.innerHTML = '';
                emailInp.style.border = '';
            }

          
            const subjValue = subjectInp.value.trim();
            const subjErrorDiv = subjectInp.parentElement.querySelector('.error-message');
            if (subjValue === '') {
                isFormValid = false;
                subjErrorDiv.innerHTML = "Please enter a subject";
                subjectInp.style.border = "2px solid red";
            } else {
                subjErrorDiv.innerHTML = "";
                subjectInp.style.border = "";
            }

            //mes
            const messageValue = messageInp.value.trim();
            const messageErrorDiv = messageInp.parentElement.querySelector('.error-message');
            if (messageValue === '') {
                isFormValid = false;
                messageErrorDiv.innerHTML = "Please enter a message";
                messageInp.style.border = "2px solid red";
            } else {
                messageErrorDiv.innerHTML = "";
                messageInp.style.border = "";
            }

        
            if (!isFormValid) {
                console.log('Validation failed. Form not submitted.');
                return;
            }

            const originalButtonText = submitButton.innerText;
            submitButton.disabled = true;
            submitButton.innerText = "Sending...";
            formStatus.innerHTML = "";

            emailjs.sendForm('service_21bi7r4', 'template_j1iks7m', contactForm)
                .then(() => {
                    formStatus.innerHTML = "Thanks! Your message has been sent.";
                    formStatus.style.color = "lightgreen";
                    contactForm.reset();
                }, (error) => {
                    console.log('EMAILJS FAILED...', error);
                    formStatus.innerHTML = "Oops! Something went wrong.";
                    formStatus.style.color = "red";
                })
                .finally(() => {
                    submitButton.disabled = false;
                    submitButton.innerText = originalButtonText;
                });
        });
    }

});
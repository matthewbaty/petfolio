async function signup_handler(event) {
    event.preventDefault();

    const first_name = $('#firstname_form').val().trim();
    const last_name = $('#lastname_form').val().trim();
    const email = $('#email_form').val().trim();
    const password = $('#password_form').val().trim();

    console.log(`first_name: ${first_name}\nlast_name: ${last_name}\nemail: ${email}\npassword: ${password}`);

    if (first_name && last_name && email && password) {
        const response = await fetch('/api/signup', {
            method: 'POST',
            body: JSON.stringify({ first_name, last_name, email, password }),
            headers: { 'Content-Type': 'application/json' }
        })

        if (response.ok) {
            document.location.href = '/login';
        } else {
            alert(`Failed to signup`);
        }
    }

}

$('#signup_btn').click(signup_handler);
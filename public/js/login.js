async function login_handler(event) {
    event.preventDefault();

    const username = $('#username_form').val().trim();
    const password = $('#password_form').val().trim();

    if (username && password) {
        const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        })

        if (response.ok) {
            document.location.replace('/');
        } else {
            $('#invalid_cred').show();
        }
    }

}

$('#login_btn').click(login_handler);
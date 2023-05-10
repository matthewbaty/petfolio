import {
    upload_file
} from './helpers.js';

async function get_form_values() {

    // Set the object for fields to be updated
    let update_values = {
        name: $('#name_form').val().trim(),
        species: $('#species_form').val().trim(),
        breed: $('#breed_form').val().trim(),
        birthdate: $('#birthdate_form').val().trim(),
        weight: $('#weight_form').val().trim()
    };

    // Remove fields that were not updated
    Object.keys(update_values).forEach((key) => {
        if (!update_values[key]) {
            delete update_values[key];
        } else if (key === 'birthdate') {
            update_values[key] = new Date(update_values[key]);
        }
    });

    return update_values;
}

async function update_pet(event) {
    event.preventDefault();
    $('#edit-section').hide();

    // Get the current pet_id from the url
    const url_split = document.location.pathname.split('/');
    const pet_id = url_split[url_split.length - 1];

    // Get the object for fields to be updated
    const update_values = await get_form_values();
    
    const pet_name = update_values.name ? update_values.name : $('#name_header').text().replace('Name: ', '').trim();

    // Update any fields that are not the file
    if (Object.keys(update_values).length > 0) {
        await fetch(`/api/pets/${pet_id}`, {
            method: 'PUT',
            body: JSON.stringify(update_values),
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch((error) => console.error('Error:', error));
    }

    const files = [{
            'type': 'pet_profile',
            'file': await $('#profile-img-input').prop('files')[0]
        },
        {
            'type': 'pet_vac_records',
            'file': await $('#vac-record-input').prop('files')[0]
        },
        {
            'type': 'pet_service_records',
            'file': await $('#service-record-input').prop('files')[0]
        }
    ];

    for (const file_obj of files) {
        const file = file_obj['file'];
        if (file) {
            // Upload file to api
            const api_response = await upload_file(file, `${pet_name}_${file_obj.type}`);

            // If the file is updated and a fileId is generated
            if (api_response.fileId) {

                // Delete has to be first
                // Delete the old file from the data base and the api
                await fetch('/api/files/file_by_owner', {
                    method: 'DELETE',
                    body: JSON.stringify({
                        owner_id: pet_id,
                        file_type: file_obj.type
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).catch((error) => console.error('Error:', error));

                // Upload the new file to the database
                await fetch('/api/files', {
                    method: 'PUT',
                    body: JSON.stringify({
                        file_id: api_response.fileId,
                        file_path: api_response.url,
                        file_type: file_obj.type,
                        owner_id: pet_id
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).catch((error) => console.error('Error:', error));
            }
        }
    }
    window.location.reload();
}

async function create_pet(event) {
    event.preventDefault();
    $('#edit-section').hide();
    
    // Get the object for fields to be updated
    const update_values = await get_form_values();

    const file = await $('#profile-img-input').prop('files')[0];
    if (Object.keys(update_values).length != 5) {
        alert(`All fields are required`)
    } else if (!file) {
        alert(`A picture of the pet must be uploaded`)
    } else {

        // Create the pet
        const pet_data = await fetch(`/api/pets`, {
                method: 'POST',
                body: JSON.stringify(update_values),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json())
            .catch((error) => console.error('Error:', error));

        const pet_name = pet_data.name;
        const pet_id = pet_data.pet_id;

        // Upload file to api
        const api_response = await upload_file(file, `${pet_name}_profile`);

        // If the file is updated and a fileId is generated
        if (api_response.fileId) {

            // Upload the new file to the database
            await fetch('/api/files', {
                method: 'PUT',
                body: JSON.stringify({
                    file_id: api_response.fileId,
                    file_path: api_response.url,
                    file_type: 'pet_profile',
                    owner_id: pet_id
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).catch((error) => console.error('Error:', error));

            window.location.href = `pet/${pet_id}`;

        }
    }
}


$('#edit-btn').click((event) => {
    event.preventDefault();
    $('#static-section').hide();
    $('#edit-section').show();
});

$('#create-save-btn').click(create_pet);
$('#update-save-btn').click(update_pet);
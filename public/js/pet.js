import { upload_file } from './helpers.js';

async function save_handler (event) {
    event.preventDefault();
    $('#edit-section').hide();
    
    const file = await $('#img-upload-input').prop('files')[0];
    if (file) {
    
        const pet_name = $('#name_form').text();
        const result = await upload_file(file, `${pet_name}_profile`);

        if (result.fileId) {
            const url_split = document.location.pathname.split('/');
            const pet_id = url_split[url_split.length - 1];

            $("#pet-img").attr('src', result.url);
            
            // Delete has to be first
            await fetch('/api/files/file_by_owner', {
                method: 'DELETE',
                body: JSON.stringify({ owner_id: pet_id, file_type: 'pet_profile' }),
                headers: { 'Content-Type': 'application/json' }
            });

            await fetch('/api/files', {
                method: 'PUT',
                body: JSON.stringify({ file_id: result.fileId, file_path: result.url, file_type: 'pet_profile', owner_id: pet_id}),
                headers: { 'Content-Type': 'application/json' }
            });

        }
    } 

    $('#static-section').show();
  
}

$('#edit-btn').click(() => {
    event.preventDefault();
    $('#static-section').hide();
    $('#edit-section').show();
});

$('#save-btn').click(save_handler);

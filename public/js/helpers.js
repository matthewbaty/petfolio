const imagekit = new ImageKit({
    publicKey: 'public_lkSMFMncXOSQS59s2TlNPGgmorU=',
    urlEndpoint: 'https://ik.imagekit.io/lscjf1cpc',
    authenticationEndpoint: `${document.location.origin}/signature`
});

export async function upload_file(file, file_name) {
    return imagekit.upload({
        file : file,
        fileName : file_name
    }).then(response => {
        return response;
    }).catch(error => {
        console.log(error);
        alert("Failed to upload file!");
    });
};

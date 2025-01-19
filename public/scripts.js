document.getElementById("uploadForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form from submitting normally

    const formData = new FormData();
    const fileInput = document.getElementById("pdf-upload");
    const file = fileInput.files[0]; // Get the uploaded file

    formData.append('pdf-file', file); // Append the file to the form data

    // Send the form data to the server
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.fileUrl) {
            // Display the link to the uploaded PDF
            document.getElementById("file-link").style.display = "block";
            document.getElementById("pdf-link").href = data.fileUrl;
        } else {
            alert('Failed to upload the file.');
        }
    })
    .catch(error => {
        alert('Error uploading file');
        console.error(error);
    });
});

// Handle the "View All PDFs" button click
document.getElementById("view-all-button").addEventListener("click", function() {
    // Fetch the list of uploaded PDFs from the server
    fetch('/get-uploaded-pdfs')
    .then(response => response.json())
    .then(data => {
        if (data.pdfFiles && data.pdfFiles.length > 0) {
            // Clear any existing list items
            const pdfLinksList = document.getElementById("pdf-links-list");
            pdfLinksList.innerHTML = '';

            // Add links for each PDF
            data.pdfFiles.forEach(pdfUrl => {
                const listItem = document.createElement("li");
                const pdfLink = document.createElement("a");
                pdfLink.href = pdfUrl;
                pdfLink.target = "_blank";
                pdfLink.textContent = pdfUrl;
                listItem.appendChild(pdfLink);
                pdfLinksList.appendChild(listItem);
            });

            // Show the PDF list section
            document.getElementById("pdf-list").style.display = "block";
        } else {
            alert("No PDFs available.");
        }
    })
    .catch(error => {
        console.error("Error fetching PDFs:", error);
    });
});

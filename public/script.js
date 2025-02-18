const table = document.getElementById('serviceTable').getElementsByTagName('tbody')[0];
const deploymentLinks = document.getElementById('deploymentLinks');

deploymentLinks.addEventListener('click', (event) => {
    event.preventDefault();
    const selectedDeployment = event.target.dataset.deployment;
    if (selectedDeployment) {
        fetchServices(selectedDeployment);
    }
});

async function fetchServices(deployment) {
    try {
        const response = await fetch(`/api/services?environment=${deployment}`);
        const services = await response.json();
        populateTable(services);
    } catch (error) {
        console.error('Error fetching services:', error);
    }
}

function populateTable(services) {
    table.innerHTML = "";

    services.forEach(service => {
        const row = table.insertRow();
        const nameCell = row.insertCell();
        const descCell = row.insertCell();
        const ipCell = row.insertCell();
        const portCell = row.insertCell();
        const contextCell = row.insertCell();
        const sslCell = row.insertCell();

        nameCell.textContent = service.service_name;
        descCell.textContent = service.description;
        ipCell.textContent = service.ip || "";
        portCell.textContent = service.port || "";
        contextCell.textContent = service.context_root || "";
        sslCell.textContent = service.ssl ? "Yes" : "No";

        nameCell.addEventListener('click', () => {
            const protocol = service.ssl ? "https://" : "http://";
            const ipOrName = service.ip || "";
            const port = service.port ? `:${service.port}` : "";
            const contextRoot = service.context_root || "";
            const url = `${protocol}${ipOrName}${port}${contextRoot}`;

            window.open(url, '_blank');
        });
        nameCell.style.cursor = 'pointer';
    });
}

//search functionality

document.getElementById('searchBox').addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase(); // Get the search term
    filterServices(searchTerm); // Filter the services
});

function filterServices(searchTerm) {
    const rows = document.querySelectorAll('#serviceTable tbody tr'); // Get all table rows

    rows.forEach(row => {
        const serviceName = row.cells[0].textContent.toLowerCase(); // Service Name column
        const description = row.cells[1].textContent.toLowerCase(); // Description column
        const ip = row.cells[2].textContent.toLowerCase(); // IP/ServiceName column
        const port = row.cells[3].textContent.toLowerCase(); // Port column
        const contextRoot = row.cells[4].textContent.toLowerCase(); // Context Root column
        const ssl = row.cells[5].textContent.toLowerCase(); // SSL column

        // Check if any column matches the search term
        if (serviceName.includes(searchTerm) ||
            description.includes(searchTerm) ||
            ip.includes(searchTerm) ||
            port.includes(searchTerm) ||
            contextRoot.includes(searchTerm) ||
            ssl.includes(searchTerm)) {
            row.style.display = ''; // Show the row
        } else {
            row.style.display = 'none'; // Hide the row
        }
    });
}

fetchServices('Production Primary');
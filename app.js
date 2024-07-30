const username = 'Quicksilver-lab'; // Replace with your GitHub username

// GitHub API URLs
const userUrl = `https://api.github.com/users/${username}`;
const reposUrl = `https://api.github.com/users/${username}/repos`;

// Fetch user profile information
fetch(userUrl)
    .then(response => response.json())
    .then(userData => {
        document.getElementById('username').innerText = `GitHub Username: ${userData.login}`;
        document.getElementById('public-repos').innerText = `Public Repositories: ${userData.public_repos}`;
    });

// Fetch repositories and commits information
fetch(reposUrl)
    .then(response => response.json())
    .then(reposData => {
        const repoNames = reposData.map(repo => repo.name);
        const commitPromises = repoNames.map(repoName => {
            return fetch(`https://api.github.com/repos/${username}/${repoName}/commits`)
                .then(response => response.json());
        });

        Promise.all(commitPromises).then(commitData => {
            const commitCounts = commitData.map(commits => commits.length);
            displayCharts(repoNames, commitCounts);
            populateTable(repoNames, commitCounts);
        });
    });

function displayCharts(repoNames, commitCounts) {
    const ctxRepo = document.getElementById('repoChart').getContext('2d');
    const ctxCommit = document.getElementById('commitChart').getContext('2d');

    new Chart(ctxRepo, {
        type: 'bar',
        data: {
            labels: repoNames,
            datasets: [{
                label: 'Number of Commits',
                data: commitCounts,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    new Chart(ctxCommit, {
        type: 'line',
        data: {
            labels: repoNames,
            datasets: [{
                label: 'Commits Over Repositories',
                data: commitCounts,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function populateTable(repoNames, commitCounts) {
    const tableBody = document.getElementById('repoTable').getElementsByTagName('tbody')[0];
    repoNames.forEach((repoName, index) => {
        const newRow = tableBody.insertRow();
        const nameCell = newRow.insertCell(0);
        const commitsCell = newRow.insertCell(1);

        nameCell.textContent = repoName;
        commitsCell.textContent = commitCounts[index];
    });
}

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
        document.getElementById('followers').innerText = `Followers: ${userData.followers}`;
    });

// Fetch repositories and commits information
fetch(reposUrl)
    .then(response => response.json())
    .then(reposData => {
        const repoNames = reposData.map(repo => repo.name);
        const stars = reposData.map(repo => repo.stargazers_count);
        const forks = reposData.map(repo => repo.forks_count);
        const commitPromises = repoNames.map(repoName => {
            return fetch(`https://api.github.com/repos/${username}/${repoName}/commits`)
                .then(response => response.json());
        });

        Promise.all(commitPromises).then(commitData => {
            const commitCounts = commitData.map(commits => commits.length);
            displayCharts(repoNames, commitCounts, stars, forks);
            populateTable(repoNames, stars, forks);
        });
    });

function displayCharts(repoNames, commitCounts, stars, forks) {
    const ctxRepo = document.getElementById('repoChart').getContext('2d');
    const ctxActivity = document.getElementById('activityChart').getContext('2d');

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

    new Chart(ctxActivity, {
        type: 'line',
        data: {
            labels: repoNames,
            datasets: [{
                label: 'Stars',
                data: stars,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                fill: true
            }, {
                label: 'Forks',
                data: forks,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
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

function populateTable(repoNames, stars, forks) {
    const tableBody = document.getElementById('repoTable').getElementsByTagName('tbody')[0];
    repoNames.forEach((repoName, index) => {
        const newRow = tableBody.insertRow();
        const nameCell = newRow.insertCell(0);
        const starsCell = newRow.insertCell(1);
        const forksCell = newRow.insertCell(2);

        nameCell.textContent = repoName;
        starsCell.textContent = stars[index];
        forksCell.textContent = forks[index];
    });
}

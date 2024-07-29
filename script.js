// script.js

const GITHUB_API_URL = "https://api.github.com";
const ACCESS_TOKEN = "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"; // Replace with your token

async function fetchData(url) {
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`
        }
    });
    return response.json();
}

async function getRepoData(repo) {
    const viewsUrl = `${GITHUB_API_URL}/repos/${repo}/traffic/views`;
    const clonesUrl = `${GITHUB_API_URL}/repos/${repo}/traffic/clones`;

    const viewsData = await fetchData(viewsUrl);
    const clonesData = await fetchData(clonesUrl);

    return { viewsData, clonesData };
}

async function getAllRepos(user) {
    const reposUrl = `${GITHUB_API_URL}/users/${user}/repos`;
    const repos = await fetchData(reposUrl);
    return repos;
}

async function loadData() {
    const user = "Quicksilver-lab"; // Replace with your GitHub username
    const repos = await getAllRepos(user);

    let totalViews = 0;
    let totalClones = 0;
    let uniqueVisitors = 0;
    let popularRepo = { name: "", views: 0 };

    const viewLabels = [];
    const viewDataPoints = [];
    const cloneDataPoints = [];

    for (const repo of repos) {
        const { viewsData, clonesData } = await getRepoData(repo.full_name);

        totalViews += viewsData.count;
        totalClones += clonesData.count;
        uniqueVisitors += viewsData.uniques;

        if (viewsData.count > popularRepo.views) {
            popularRepo.name = repo.name;
            popularRepo.views = viewsData.count;
        }

        viewsData.views.forEach((view, index) => {
            if (!viewLabels[index]) viewLabels[index] = view.timestamp;
            viewDataPoints[index] = (viewDataPoints[index] || 0) + view.count;
        });

        clonesData.clones.forEach((clone, index) => {
            cloneDataPoints[index] = (cloneDataPoints[index] || 0) + clone.count;
        });
    }

    document.getElementById("total-views").innerText = `Total Views: ${totalViews}`;
    document.getElementById("unique-visitors").innerText = `Unique Visitors: ${uniqueVisitors}`;
    document.getElementById("total-clones").innerText = `Total Clones: ${totalClones}`;
    document.getElementById("popular-repo").innerText = `Most Popular Repo: ${popularRepo.name}`;

    renderCharts(viewLabels, viewDataPoints, cloneDataPoints);
}

function renderCharts(labels, viewData, cloneData) {
    const ctxViews = document.getElementById("views-chart").getContext("2d");
    const ctxClones = document.getElementById("clones-chart").getContext("2d");

    new Chart(ctxViews, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Views",
                data: viewData,
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        }
    });

    new Chart(ctxClones, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Clones",
                data: cloneData,
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1
            }]
        }
    });
}

loadData();

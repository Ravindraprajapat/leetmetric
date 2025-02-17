document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("userinput");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const errorMessageContainer = document.getElementById("error-message");

    function validateUsername(username) {
        if (username.trim() === "") {
            errorMessageContainer.textContent = "Username should not be empty";
            return false;
        }
        const regex = /^[a-zA-Z][a-zA-Z0-9._]{2,15}$/;
        if (!regex.test(username)) {
            errorMessageContainer.textContent = "Invalid username. Use only letters, numbers, dots, or underscores.";
            return false;
        }
        errorMessageContainer.textContent = ""; // Clear error message
        return true;
    }

    async function fetchUserDetails(username) {
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const apiUrl = `https://leetcode-stats-api.herokuapp.com/${username}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error("Unable to fetch user details");
            }

            const data = await response.json();
            if (!data || data.status === "error") {
                throw new Error("No data found for this username");
            }

            console.log("User Data:", data);
            displayUserData(data);
        } catch (error) {
            statsContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
            console.error(error);
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    ;

    function displayUserData(data) {
        const easySolved = data.easySolved || 0;
        const totalEasy = data.totalEasy || 1;
        const mediumSolved = data.mediumSolved || 0;
        const totalMedium = data.totalMedium || 1;
        const hardSolved = data.hardSolved || 0;
        const totalHard = data.totalHard || 1;

        updateProgress(easySolved, totalEasy, easyLabel, easyProgressCircle);
        updateProgress(mediumSolved, totalMedium, mediumLabel, mediumProgressCircle);
        updateProgress(hardSolved, totalHard, hardLabel, hardProgressCircle);
    }

    searchButton.addEventListener("click", function () {
        const username = usernameInput.value.trim();
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });
});
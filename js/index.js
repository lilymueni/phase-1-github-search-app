// Wait for the DOM content to be fully loaded before executing JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Get references to HTML elements
  const form = document.getElementById('github-form');
  const searchInput = document.getElementById('search');
  const userList = document.getElementById('user-list');
  const reposList = document.getElementById('repos-list');
  let searchType = 'user'; // Initialize search type to 'user'

  // Event listener for form submission
  form.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const searchQuery = searchInput.value.trim(); // Get the search query from the input

    if (!searchQuery) {
      alert('Please enter a search query'); // Display an alert if the search query is empty
      return;
    }

    let url;
    if (searchType === 'user') {
      url = `https://api.github.com/search/users?q=${searchQuery}`; // Construct URL based on search type
    } else {
      url = `https://api.github.com/search/repositories?q=${searchQuery}`;
    }

    try {
      const response = await fetch(url); // Fetch data from the GitHub API
      const data = await response.json(); // Parse JSON response

      if (searchType === 'user') {
        displayUsers(data.items); // Display user search results
      } else {
        displayRepos(data.items); // Display repository search results
      }
    } catch (error) {
      console.error('Error fetching data:', error); // Log and display error message
      alert('An error occurred while fetching data from GitHub');
    }
  });

  // Function to display user search results
  function displayUsers(users) {
    userList.innerHTML = ''; // Clear previous user search results

    users.forEach(user => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <img src='${user.avatar_url}' alt='${user.login}' />
        <a href='${user.html_url}' target='_blank'>${user.login}</a>
      `;
      listItem.addEventListener('click', async function() {
        try {
          const response = await fetch(`https://api.github.com/users/${user.login}/repos`);
          const reposData = await response.json();
          displayRepos(reposData);
        } catch (error) {
          console.error('Error fetching repos:', error);
          alert('An error occurred while fetching user repositories');
        }
      });
      userList.appendChild(listItem);
    });
  }

  // Function to display repository search results
  function displayRepos(repos) {
    reposList.innerHTML = ''; // Clear previous repository search results

    repos.forEach(repo => {
      const repoItem = document.createElement('li');
      repoItem.innerHTML = `
        <a href='${repo.html_url}' target='_blank'>${repo.full_name}</a>
        <p>${repo.description || 'No description'}</p>
      `;
      reposList.appendChild(repoItem);
    });
  }

  // Create a toggle button to switch between user and repository search
  const toggleButton = document.createElement('button');
  toggleButton.textContent = 'Toggle Search Type';
  toggleButton.addEventListener('click', function() {
    searchType = searchType === 'user' ? 'repo' : 'user'; // Toggle search type
    searchInput.placeholder = `Search ${searchType === 'user' ? 'users' : 'repositories'}`;
  });

  form.appendChild(toggleButton); // Append toggle button to the form
});
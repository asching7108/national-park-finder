'use strict'

const apiKey = 'VGVQ4CiJE0afId5aJCo75ac3AbARFt5AjQ79HkhS';

const searchURL = 'https://developer.nps.gov/api/v1/parks';

function getNationalParks(searchTerm, maxResults = 10) {
  const params = {
    q: searchTerm,
    limit: maxResults,
    api_key: apiKey
  };
  /* doesn't work
  const options = {
    headers: new Headers({
      'X-Api-Key': 'VGVQ4CiJE0afId5aJCo75ac3AbARFt5AjQ79HkhS'
    })
  }; */
  const url = searchURL + '?' + formatQueryParams(params);
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(error => {
      $('#js-error-message').text(`something went wrong: ${error.message}`);
    });
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
}

function displayResults(responseJson) {
  $('#results-list').empty();
  for (let i = 0; i < responseJson.data.length; i ++) {
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <p><a href="${responseJson.data[i].url}">website</a></p>
      </li>`
    );
  }
}

function watchForm() {
  $('#js-form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getNationalParks(searchTerm, maxResults);
  });
}

$(watchForm);
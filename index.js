'use strict'

const apiKey = 'VGVQ4CiJE0afId5aJCo75ac3AbARFt5AjQ79HkhS';

const searchURL = 'https://developer.nps.gov/api/v1/parks';

const stateCode = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
  'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI',
  'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH',
  'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
  'WI', 'WY'];

function getNationalParks(searchTerm, maxResults = 10, selectedStates) {
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
  const url = searchURL + '?' + formatQueryParams(params, selectedStates);
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

function formatQueryParams(params, selectedStates) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    if (selectedStates.length) {
      for (let i = 0; i < selectedStates.length; i++) {
        queryItems[queryItems.length] = `stateCode=${selectedStates[i]}`;
      }
    }
    return queryItems.join('&');
}

function displayResults(responseJson) {
  $('#results-list').empty();
  if (responseJson.total == 0) {
    $('#results-list').append('<li><h3>No matched result.</h3></li>');
  }
  for (let i = 0; i < responseJson.data.length; i ++) {
    console.log(responseJson.data[i].fullName);
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <p><a href="${responseJson.data[i].url}">website</a></p>
      </li>`
    );
  }
  $('#results').removeClass('hidden');
}

function addState(state, selectedStates) {
  if ($(`#${state}`).length) {
    return;
  }
  $('.addedStates').append(`<span class="state-item" id="${state}">${state}</span>`);
  selectedStates[selectedStates.length] = state;
  $('.dropdown-content').toggleClass('hidden');
}

function removeState(state, selectedStates) {
  $('.addedStates').find(`#${state}`).remove();
  for (let i = 0; i < selectedStates.length; i++) {
    if (selectedStates[i] == state) {
      selectedStates[i] = selectedStates[selectedStates.length - 1];
      selectedStates.pop();
    }
  }
}

function watchForm() {
  const selectedStates = [];
  $('.dropbtn').click(event => {
    $('.dropdown-content').toggleClass('hidden');
  });
  $('.dropdown-content').click(event => {
    addState($(event.target).text(), selectedStates);
  });
  $('.addedStates').click(event => {
    removeState($(event.target).text(), selectedStates);
  });
  $('#js-form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getNationalParks(searchTerm, maxResults, selectedStates);
  });
}

function fillDropdownContent(stateCode) {
  for (let i = 0; i < stateCode.length; i++) {
    $('.dropdown-content').append(`<li class="dropdown-item">${stateCode[i]}</li>`);
  }
}

$(watchForm);
$(fillDropdownContent(stateCode));
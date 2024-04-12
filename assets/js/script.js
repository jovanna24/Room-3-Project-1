const resultContentEl = document.querySelector('#result-content');

function saveOrgSearches(organizations){
    localStorage.setItem('organizations', JSON.stringify(organizations))
}  

function readSearchesFromStorage() {
    let organizations = JSON.parse(localStorage.getItem('organizations')); 
    if(!organizations){
        organizations= [];
    }
    return organizations;
}


function searchApi(organization) {
    const publicaAPI = `https://projects.propublica.org/nonprofits/api/v2`;

    fetch(publicaAPI) 
        .then(function(response){
            if (!response.ok) {
                throw new Error('Server response was not ok.');
            } 
            return response.json(); 
        })
        .then(function(organization){
            console.log(organization); 
            displayOrganization(organization); 
        }) 
        .catch(function(error){
            console.log('Error fetching data', error); 
            resultContentEl.innerHTML = '<h3> Error fetching data, please try new search. </h3>';

        })
 }

function displayOrganization(organization) {
    if(!organization.name) {
        console.log('No results found.'); 
        resultContentEl.innerHTML = '<h3> Error fetching data, please try new search. </h3>';
    } else {
        resultContentEl.innerHTML= ''; 

        const resultCard = document.createElement('div'); 

        const resultBody = document.createElement('div'); 
        resultCard.append(resultBody); 

        const bodyContentEl = document.createElement('p');
        bodyContentEl.innerHTML +=
        `<strong>Organization Name: </strong> ${organization.sub_name}<br/>` +
        `<strong>Organization Address: </strong> ${organization.address}<br/>` +
        `<strong>Organization City: </strong> ${organization.city}<br/>` +

        resultContentEl.append(resultCard);

    }
}




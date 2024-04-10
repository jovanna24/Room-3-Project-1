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

fetch ('https://projects.propublica.org/nonprofits/api/v2', {
    method: 'GET', 
    headers: {
        'Content-type': 'application/json'
    }, 
    body: JSON.stringify({
        name: 'Organization 1'
    })
}).then(res => {
    return res.json()
})
.then(data => console.log(data)) 
.catch(error => console.log('ERROR'))
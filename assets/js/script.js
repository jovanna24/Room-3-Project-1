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



const create =(type) => document.createElement(type);

const createHeader =()=>{
    const image = create('img')
    image.setAttribute('src', "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Acme_Markets_lolo.svg/1200px-Acme_Markets_lolo.svg.png")
    app.append(image)
    const header = create('h1');
    header.innerText="User Database Search";
    app.append(header)
}

const createSearch=()=>{
    const searchDiv= create('div')
    searchDiv.classList.add('search-container')
    const form = create ('form')
    const searchBox= create('input')
    searchBox.classList.add('form-field')
    form.append(searchBox)
    searchBox.setAttribute('placeholder', 'Please Enter a Name, Emall Address, or Job Title to Search')

    searchBox.addEventListener('input', ev=>{
        searchBox.setAttribute('value', ev.target.value)
        let input = ev.target.value
        ev.preventDefault()
    })

    searchDiv.append(form)
    const buttonDiv=create('div')
    buttonDiv.classList.add('buttons')
    buttonDiv.append(createSubmitButton())
    buttonDiv.append(createClearButton())
    app.append(searchDiv)
    app.append(buttonDiv)
}

const createClearButton = ()=>{
    const clearButton = document.createElement('button')
    clearButton.classList.add("btn","btn-danger")
    clearButton.innerText='Clear'

    clearButton.addEventListener('click',ev=>{
        const input = document.querySelector('input');
        window.location.hash='';
        input.value='';
        render();
    })
    return clearButton
}

const createSubmitButton = ()=>{
    const submitButton = document.createElement('button');
    submitButton.classList.add("btn","btn-primary");
    submitButton.innerText='Submit';
    submitButton.addEventListener('click',ev=>{
        const form=document.querySelector('.form-field');
        const input = form.getAttribute('value');
        const inputHash = hashCode(input);
        window.location.hash =inputHash;
        
    })
    return submitButton
}

window.addEventListener('hashchange', ()=>{
    const form=document.querySelector('.form-field');
    const input = form.getAttribute('value');
    fetch(`https://acme-users-api-rev.herokuapp.com/api/users/search/${input}`)
    .then(response => response.json())
    .then(data => {
        if(data.users.length===50){
            searchTerm.innerText=`Displaying ${data.users.length}+ results for "${input}"`;
        } else if (data.users.length===0){
            searchTerm.innerText=`No Results`;
        } else {
            searchTerm.innerText=`Displaying ${data.users.length} results for "${input}"`;
        }
        searchTermDiv.classList.add('searchTermResults');
        searchTermDiv.append(searchTerm);
        app.append(searchTermDiv);
        renderTable(data.users);
        return data;
    });
    const searchTerm=create('h6');
    const searchTermDiv=create('div');
    console.log(window.location.hash);
})

const renderTable=(arr)=>{
    if (arr.length===0){
        const noResults=create('h2');
        //noResults.innerText='No Results'
        app.append(noResults);
        return;
    }
    const table=create('table');
    const tableDiv=create('div');
    const headerRow=create('tr');
    const tableHeader=create('thead');
    const nameHeader =create('th');
    nameHeader.innerText='Name';
    const emailHeader =create('th');
    emailHeader.innerText='Emaill Address';
    const titleHeader =create('th');
    titleHeader.innerText='Title';
    
    headerRow.append(nameHeader,emailHeader, titleHeader);
    tableHeader.append(headerRow);
    table.append(tableHeader);
    
    arr.forEach(currentUser => {
        const row=create('tr');
        const name=create('td');
        name.innerText=currentUser.fullName;
        const email=create('td');
        email.innerText=currentUser.email;
        const title=create('td');
        title.innerText=currentUser.title;
        row.append(name, email, title);
        table.append(row);
    })
    tableDiv.classList.add('table-container');
    tableDiv.append(table);
    app.append(tableDiv);
}

const render=()=>{
    app.innerHTML=''
    createHeader();
    createSearch();
    createSubmitButton();
}

function hashCode(s) {
    for(var i = 0, h = 0; i < s.length; i++)
        h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    return h;
}

render()

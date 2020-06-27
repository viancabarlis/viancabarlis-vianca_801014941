//changing background switcher
function changeBackground(id) {
    var btnValue = document.getElementById(id).value;
    var back = document.getElementsByClassName("background")[0];

    if (id === "background1") {
        back.style.backgroundImage = "url(background1.JPG)";
    }
    else if (id === "background2") {
        back.style.backgroundImage = "url(background2.JPG)";
    }
    else {
        back.style.backgroundImage = "url(background3.JPG)";
    }
}

//font resizer
function resizeFont() {
    document.getElementById("title").style.fontSize = "40px";
}

//global variables
var sections = ['blog1', 'blog2', 'blog3', 'blog4'];
var selected = 0;
var timer;

//stop slides for blogs
function stopSlides() {
    clearInterval(timer)
}

//play slides for blogs
function playSlides() {
    //setInterval takes in two parameters, the function and timer
    timer = setInterval(()=> {
        //set current selected blog to show
        //at first, the first paragraph will show and 2 and 3 will be hidden
        document.getElementById(sections[selected]).style.display = "block";
        switch (selected) {
            case 0:
                document.getElementById(sections[1]).style.display = "none";
                document.getElementById(sections[2]).style.display = "none";
                selected = 1
                break;
            case 1:
                document.getElementById(sections[0]).style.display = "none";
                document.getElementById(sections[2]).style.display = "none";
                selected = 2
                break;
            case 2:
                document.getElementById(sections[0]).style.display = "none";
                document.getElementById(sections[1]).style.display = "none";
                selected = 0
                break;
            default:
                break;
        }
    }, 5000); //pause for 5 seconds
}

const serverURI = 'http://167.172.150.145:5000/'

function showAddForm(){
    document.getElementById('user_add').style.display = "block";
    document.getElementById('user_listing').style.display = "none";
    document.getElementById('user_edit').style.display = "none";
    document.getElementById('landing_page').style.display = 'none';
    document.forms['user_add'].userFullName.value = ""
    document.forms['user_add'].userEmail.value = ""
    document.forms['user_add'].userActive.value = ""
}

function showList(){
    document.getElementById('user_add').style.display = "none";
    document.getElementById('user_listing').style.display = "block";
    document.getElementById('user_edit').style.display = "none";
    document.getElementById('landing_page').style.display = 'none';
    listUsers()
}

function showEditForm(userID){
    console.log(userID)
    axios.get(serverURI + 'users/' + userID)
        .then((response)=>{
            if (response.error != ""){
                console.log(response.data)
                document.getElementById('userID').innerHTML = response.data.data[0].userID
                // form = document.getElementById('user_edit');
                document.forms['user_edit'].userFullName.value = response.data.data[0].userFullName
                document.forms['user_edit'].userEmail.value = response.data.data[0].userEmail
                document.getElementById('user_add').style.display = "none";
                document.getElementById('user_listing').style.display = "none";
                document.getElementById('user_edit').style.display = "block";
                document.getElementById('landing_page').style.display = 'none';
            } else {
                document.getElementById('status').innerHTML = error;
                showStatus(0)
            }
        })
        .catch((connectionError)=>{
            console.log(connectionError)
            document.getElementById('status').innerHTML = connectionError
            showStatus(0)
        })
}

function showStatus(status){
    if (status == 0){
        document.getElementById('status').style.backgroundColor = "#fa113d";
        document.getElementById('status').style.color = "#fff";
    } else {
        document.getElementById('status').style.backgroundColor = "#AC7";
    }
    document.getElementById('status').style.display = "block";
    setTimeout(()=>{
        document.getElementById('status').style.display = "none";
    }, 4000)
}

function listUsers(){
    axios.get(serverURI + 'users')
        .then((response)=>{
            if (response.error != ""){
                console.log(response.data)
                generateUsersTable(response.data)
            } else {
                document.getElementById('status').innerHTML = error;
                showStatus(0)
            }
        })
        .catch((connectionError)=>{
            console.log(connectionError)
            document.getElementById('status').innerHTML = connectionError
            showStatus(0)
        })
}

function generateUsersTable(result){
    document.getElementById('user_listing').innerHTML = ''
    let table = document.createElement('table')
    row = table.insertRow(0);
    let userIDTH = document.createElement('th')
    userIDTH.innerHTML = 'User ID'
    row.appendChild(userIDTH);
    let userFullNameTH = document.createElement('th')
    userFullNameTH.innerHTML = 'User Full Name'
    row.appendChild(userFullNameTH);
    let userEmailTH = document.createElement('th')
    userEmailTH.innerHTML = 'User Email'
    row.appendChild(userEmailTH);
    let userOperationsTH = document.createElement('th')
    userOperationsTH.innerHTML = 'Operations'
    userOperationsTH.colSpan = '3'
    row.appendChild(userOperationsTH);
    // let userIDCell = row.insertCell(0).innerHTML = 'id'
    //     let userFullNameCell = row.insertCell(1).innerHTML = 'name'
    //     let userEmailCell = row.insertCell(2).innerHTML = 'email'
    for (let i=1; i< result.data.length; i++){
        let row = table.insertRow(i)
        let userIDCell = row.insertCell(0).innerHTML = result.data[i].userID
        let userFullNameCell = row.insertCell(1).innerHTML = result.data[i].userFullName
        let userEmailCell = row.insertCell(2).innerHTML = result.data[i].userEmail
        let userEditCell = row.insertCell(3);
        let userDeleteCell = row.insertCell(4);
        let userActivationCell = row.insertCell(5)
        let editLink = document.createElement('a')
        editLink.name = 'editLink'
        editLink.addEventListener('click', ()=>{
            showEditForm(result.data[i].userID) // pass the id
        })
        editLink.text = 'Edit'
        editLink.href = '#'
        userEditCell.appendChild(editLink)
        let deleteLink = document.createElement('a')
        deleteLink.name = 'deleteLink'
        deleteLink.addEventListener('click', ()=>{
            // deleteEmployee(dataObject[i].employeeID)
            if (confirm('are you sure you want to delete this record?')){
                deleteUser(result.data[i].userID)
                console.log('delete link', result.data[i].userID)
            }
        })
        deleteLink.href='#'
        deleteLink.text = 'Delete'
        userDeleteCell.appendChild(deleteLink)
        let activationLink = document.createElement('a');
        activationLink.name = 'ActivationLink'
        activationLink.addEventListener('click', ()=>{
            if (result.data[i].userActive == 0){
                // Call Activate function
                activateUser(result.data[i].userID)
            } else {
                // Call Deactivate Function
                deactivateUser(result.data[i].userID)
            }
            console.log('Activation link', i)
        })
        if (result.data[i].userActive == 0){
            activationLink.text = 'Activate'
        } else {
            activationLink.text = 'Deactivate'
        }

        activationLink.href = '#'
        userActivationCell.appendChild(activationLink)

    }
    document.getElementById('user_listing').appendChild(table)
}


function activateUser(userID){
    axios.patch(serverURI + 'users/'+ userID,
        {'id': userID, 'status': 1})
        .then((response)=>{
            if (response.error != ""){
                console.log(response.data)
                document.getElementById('status').innerHTML = response.data.data
                showStatus(1)
                showList()
            } else {
                document.getElementById('status').innerHTML = error;
                showStatus(0)
            }
        })
        .catch((connectionError)=>{
            console.log(connectionError)
            document.getElementById('status').innerHTML = connectionError
            showStatus(0)
        })

}

function deactivateUser(userID){
    axios.patch(serverURI + 'users/'+ userID, {'id': userID, 'status': 0})
        .then((response)=>{
            if (response.error != ""){
                console.log(response.data)
                document.getElementById('status').innerHTML = response.data.data
                showStatus(1)
                showList()
            } else {
                document.getElementById('status').innerHTML = error;
                showStatus(0)
            }
        })
        .catch((connectionError)=>{
            console.log(connectionError)
            document.getElementById('status').innerHTML = connectionError
            showStatus(0)
        })
}

function deleteUser(userID){
    axios.delete(serverURI + 'users/'+ userID)
        .then((response)=>{
            if (response.error != ""){
                console.log(response.data)
                document.getElementById('status').innerHTML = response.data.data
                showStatus(1)
                showList()
            } else {
                document.getElementById('status').innerHTML = error;
                showStatus(0)
            }
        })
        .catch((connectionError)=>{
            console.log(connectionError)
            document.getElementById('status').innerHTML = connectionError
            showStatus(0)
        })
}

function saveUserChanges(){
    userID = document.getElementById('userID').innerHTML
    userFullName = document.forms['user_edit'].userFullName.value
    userEmail = document.forms['user_edit'].userEmail.value
    axios.put(serverURI + 'users/'+ userID,
        {
            'id': userID,
            'userFullName': userFullName,
            'userEmail': userEmail
        })
        .then((response)=>{
            if (response.error != ""){
                console.log(response.data)
                document.getElementById('status').innerHTML = response.data.data
                showStatus(1)
                showList()
            } else {
                document.getElementById('status').innerHTML = error;
                showStatus(0)
            }
        })
        .catch((connectionError)=>{
            console.log(connectionError)
            document.getElementById('status').innerHTML = connectionError
            showStatus(0)
        })
    return false;
}

function addUser(){
    userFullName = document.forms['user_add'].userFullName.value
    userEmail = document.forms['user_add'].userEmail.value
    userActive = document.forms['user_add'].userActive.value
    axios.post(serverURI + 'users/',
        {
            'userFullName': userFullName,
            'userEmail': userEmail,
            'userActive': userActive
        })
        .then((response)=>{
            if (response.error != ""){
                console.log(response.data)
                document.getElementById('status').innerHTML = response.data.data
                showStatus(1)
                showList()
            } else {
                document.getElementById('status').innerHTML = error;
                showStatus(0)
            }
        })
        .catch((connectionError)=>{
            console.log(connectionError)
            document.getElementById('status').innerHTML = connectionError
            showStatus(0)
        })
    return false;
}
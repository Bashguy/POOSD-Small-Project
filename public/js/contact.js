//Extenstion for the endpoints and the URL for the API requests
const urlBase = 'http://smallproject.cjanua.xyz/api';
const extension = 'php';

//Variables
let userId = 0;
let firstName = "";
let lastName = "";

//Saves the user inforrmation
function saveCookie() {

	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();

}

//Reads user information
function readCookie() {

	userId = -1;

	let data = document.cookie;
	let splits = data.split(",");

	for(var i = 0; i < splits.length; i++) {

		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" ) {

			firstName = tokens[1];

		}
		else if( tokens[0] == "lastName" ) {

			lastName = tokens[1];

		}
		else if( tokens[0] == "userId" ) {

			userId = parseInt( tokens[1].trim() );

		}

	}
	
	//Redirects if not logged in
	if( userId < 0 ) {

		window.location.href = "index.html";

	}

}

//Handles user login
function doLogin() {

	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;

	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login: login, password: password};
	let jsonPayload = JSON.stringify(tmp);
	
	let url = urlBase + '/login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {

		xhr.onreadystatechange = function() {

			if (this.readyState == 4 && this.status == 200) {

				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;
		
				if( userId < 1 ) {

					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;

				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";

			}

		};

		xhr.send(jsonPayload);

	}

	catch(err) {

		document.getElementById("loginResult").innerHTML = err.message;

	}

}

//Handles user registration
function doRegister() 
{
  const payload = {
    firstName: document.getElementById('firstName').value,
    lastName:  document.getElementById('lastName').value,
    username:  document.getElementById('username').value,
    password:  document.getElementById('password').value
  };

  fetch('/api/register.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then((response) => response.json())
    .then((json) => {
      // If there’s any error from the server
      if (json.error && json.error.length > 0) 
      {
        // If “Username already exists,” show a special popup
        if (json.error.includes("Username already exists"))
        {
          alert("An account with that username already exists. Please choose another username.");
        } 
        else
        {
          // Otherwise return error
          alert("Error: " + json.error);
        }
      } 
      else 
      {
        alert("Registration successful! Please login");
        // Optionally redirect after success:
        // window.location.href = "login.html";
      }
    })
    .catch((err) => {
      alert("Error: " + err);
    });
}

//Logs out the user and clears storage
function doLogout() {

	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "login.html";

}

//Creates a new contact
function add() {

	let contactFirstName = document.getElementById("firstName").value;
	let contactLastName = document.getElementById("lastName").value;
	let contactEmail = document.getElementById("email").value;
	let contactNumber = document.getElementById("number").value;

	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {firstName:contactFirstName, lastName:contactLastName, email:contactEmail, number:contactNumber, userId:userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Create.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {

		xhr.onreadystatechange = function() {

			if (this.readyState == 4 && this.status == 200) {

				document.getElementById("contactAddResult").innerHTML = "Contact has been added";

			}

		};

		xhr.send(jsonPayload);

	}

	catch(err) {

		document.getElementById("contactAddResult").innerHTML = err.message;

	}

	loadContacts();
	
}

//Searches for a contact
function search() {

	let searchContact = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:searchContact, userId:userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {

		xhr.onreadystatechange = function() {

			if (this.readyState == 4 && this.status == 200) {

				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been found";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ ) {

					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 ) {

						contactList += "<br />\r\n";

					}

				}
				
				document.getElementsByTagName("p")[0].innerHTML = contactList;

			}

		};

		xhr.send(jsonPayload);

	}

	catch(err) {

		document.getElementById("contactSearchResult").innerHTML = err.message;

	}
	
}

//Updates contacts
function edit() {

	let contactFirstName = document.getElementById("firstName").value;
	let contactLastName = document.getElementById("lastName").value;
	let contactEmail = document.getElementById("email").value;
	let contactNumber = document.getElementById("number").value;

	document.getElementById("contactEditResult").innerHTML = "";

	let tmp = {firstName:contactFirstName, lastName:contactLastName, email:contactEmail, number:contactNumber, userId:userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/edit.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {

		xhr.onreadystatechange = function() {

			if (this.readyState == 4 && this.status == 200) {

				document.getElementById("contactEditResult").innerHTML = "Contact has been edited";

			}

		};

		xhr.send(jsonPayload);

	}

	catch(err) {

		document.getElementById("contactEditResult").innerHTML = err.message;

	}

}

//Deletes contacts
function deleteContact() {

	document.getElementById("contactDeleteResult").innerHTML = "";

	let tmp = {firstName:firstName, lastName:lastName, userId:userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/delete." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {

		xhr.onreadystatechange = function() {

			if (this.readyState == 4 && this.status == 200) {

				document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted";

			}

		};

		xhr.send(jsonPayload);

	}

	catch(err) {

		document.getElementById("contactDeleteResult").innerHTML = err.message;
		
	}

}

async function loadContacts() {

    let url = urlBase + "/getContacts." + extension;
    let jsonPayload = JSON.stringify({ user_id: userId });
    console.log(jsonPayload);

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: jsonPayload,
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        if (jsonResponse.error) {
          alert("Error: " + jsonResponse.error);
          return;
        }

        let contactList = document.getElementById("contactList");
        contactList.innerHTML = ""; // Clear the table before loading new contacts

        jsonResponse.results.forEach((contact) => {
          let row = document.createElement("tr");

          row.innerHTML = `
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>
                <button class="edit-btn" onclick="window.location.href='EditContact.html?id=${contact.id}'">Edit</button>
                <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
                </td>

            `;

          contactList.appendChild(row);
        });

        if (jsonResponse.results.length === 0) {
          let noResultsRow = document.createElement("tr");
          noResultsRow.innerHTML = `<td colspan="3" style="text-align: center;">No contacts found</td>`;
          contactList.appendChild(noResultsRow);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while loading contacts. Please try again.");
      });
  }

/*
async function loadContacts() {
    await delay(400);

    let xhr = new XMLHttpRequest();
    let url = urlBase + "/getContacts." + extension; // Ensure consistent URL format

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    let payload = { IDnum: userId }; // Ensure the correct user ID is sent
    let jsonPayload = JSON.stringify(payload);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {

			let contacts = JSON.parse(xhr.responseText);
			console.log(xhr.responseText);
			let contactListHTML = "";

			for(let i=0; i<contacts.results.length; i++)
			{
				contactListHTML += contacts.results[i];
				if(i < contacts.results.length - 1)
				{
					contactListHTML += "<br />\r\n";
				}	
			}
			document.getElementsByTagName("p")[0].innerHTML = contactsListHTML;
        }
    };

    xhr.send(jsonPayload);
}
*/

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = function () {
    if (window.location.pathname.endsWith('contacts.html')) {
        readCookie(); // Ensure `userId` is read
	console.log("User ID: " + userId); //DEBUG
        if (userId > 0) {
            loadContacts();
        }
    }
}

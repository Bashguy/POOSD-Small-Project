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
          console.log("An account with that username already exists. Please choose another username.");
        } 
        else
        {
          // Otherwise return error
          console.log("Error: " + json.error);
        }
      } 
      else 
      {
        window.location.href = "login.html";
      }
    })
    .catch((err) => {
      console.log("Error: " + err);
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

// Creates a new contact
function add() {
    let contactFirstName = document.getElementById("firstname").value;
    let contactLastName = document.getElementById("lastname").value;
    let contactEmail = document.getElementById("email").value;
    let contactNumber = document.getElementById("number").value;

    document.getElementById("contactAddResult").innerHTML = "";

    let tmp = {
        FirstName: contactFirstName,
        LastName: contactLastName,
        Email: contactEmail,
        PhoneNumber: contactNumber,
        IDnum: userId
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Create.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    document.getElementById("contactAddResult").innerHTML = "Contact has been added";
                    clearForm();  // Clear the form fields after successful addition
                    loadContacts(); // Reload contacts after adding
                } else {
                    document.getElementById("contactAddResult").innerHTML = "Error adding contact";
                }
            }
        };

        xhr.send(jsonPayload);
        loadContacts();
    } catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}

// Clear form fields
function clearForm() {
    document.getElementById("firstname").value = "";
    document.getElementById("lastname").value = "";
    document.getElementById("email").value = "";
    document.getElementById("number").value = "";
}

//Searches for a contact
function search() {
    let searchContact = document.getElementById("searchText").value.toLowerCase();

    let contactList = document.getElementById("contactList");
    let rows = contactList.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].getElementsByTagName("td");
        let match = false;

        for (let j = 0; j < cells.length - 1; j++) { // Exclude the last cell with buttons
            if (cells[j].innerText.toLowerCase().includes(searchContact)) {
                match = true;
                break;
            }
        }

        if (match) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

//Updates contacts
function edit() {
    let contactId = document.getElementById("editContactId").value;
    let contactFirstName = document.getElementById("editFirstname").value;
    let contactLastName = document.getElementById("editLastname").value;
    let contactEmail = document.getElementById("editEmail").value;
    let contactNumber = document.getElementById("editNumber").value;

	document.getElementById("contactEditResult").innerHTML = "";

	let tmp = {
        ID: contactId,
        FirstName: contactFirstName,
        LastName: contactLastName,
        Email: contactEmail,
        PhoneNumber: contactNumber,
        IDnum: userId
    };
    let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Update.' + extension;
	let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactEditResult").innerHTML = "Contact has been edited";
                loadContacts(); // Reload contacts after editing
                closeModal(); // Close the modal
            } else {
                document.getElementById("contactEditResult").innerHTML = "Error editing contact";
            }
        };
		xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactEditResult").innerHTML = err.message;
    }

}

// Function to open the modal
function openModal(contact) {
    document.getElementById("editContactId").value = contact.ID;
    document.getElementById("editFirstname").value = contact.FirstName;
    document.getElementById("editLastname").value = contact.LastName;
    document.getElementById("editEmail").value = contact.Email;
    document.getElementById("editNumber").value = contact.PhoneNumber;
    document.getElementById("editModal").style.display = "block";
}

// Function to close the modal
function closeModal() {
    document.getElementById("editModal").style.display = "none";
}

//Deletes contacts
function deleteContact(contactId) {
    //document.getElementById("contactDeleteResult").innerHTML = "";

    let tmp = { IDnum: userId, id: contactId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + "/Delete." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                //document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted";
            } else {
                //document.getElementById("contactDeleteResult").innerHTML = "Error deleting contact";
            }
        };

        xhr.send(jsonPayload);
		
		loadContacts(); // Reload contacts after deleting

    } catch (err) {
        //document.getElementById("contactDeleteResult").innerHTML = err.message;
    }
}
async function loadContacts() {
    await delay(400);

    let xhr = new XMLHttpRequest();
    let url = urlBase + "/getContacts." + extension;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    let payload = { IDnum: userId };
    let jsonPayload = JSON.stringify(payload);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let contacts = JSON.parse(xhr.responseText);
            let contactList = document.getElementById("contactList");
            contactList.innerHTML = "";

            for (let i = 0; i < contacts.length; i++) {
                let formattedNumber = formatPhoneNumber(contacts[i].PhoneNumber);

                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${contacts[i].FirstName}</td>
                    <td>${contacts[i].LastName}</td>
                    <td>${contacts[i].Email}</td>
                    <td>${formattedNumber}</td>
                    <td>
                        <button class="edit-btn" onclick='openModal(${JSON.stringify(contacts[i])})'>Edit</button>
                        <button onclick="deleteContact(${contacts[i].ID})" id="delete">Delete</button>
                    </td>
                `;

                contactList.appendChild(row);
            }

            if (contacts.length === 0) {
                let noResultsRow = document.createElement("tr");
                noResultsRow.innerHTML = `<td colspan="5" style="text-align: center;">No contacts found</td>`;
                contactList.appendChild(noResultsRow);
            }
        }
    };

    xhr.send(jsonPayload);
}

// Function to format phone number
function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return "";

    // Remove non-digits
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');

    // Format as xxx-xxx-xxxx
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    }

    return phoneNumber; // Return as-is if not matching expected format
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = function () {
    if (window.location.pathname.endsWith('contacts.html')) {
        readCookie(); // Ensure `userId` is read
        if (userId > 0) {
            loadContacts();
        }
    }
}

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
function register() {

    let rFirstName = document.getElementById("first-name").value;
    let rLastName = document.getElementById("last-name").value;
    let rEmail = document.getElementById("email").value;
    let rUsername = document.getElementById("username").value;
    let rPassword = document.getElementById("password").value;

    document.getElementById("registerResult").innerHTML = "";

    let tmp = {firstName: rFirstName, lastName: rLastName, email: rEmail, username: rUsername, password: rPassword};

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset-UTF-8");

    try {

        xhr.onreadystatechange = function () {

            if (this.readyState == 4 && this.status == 200) {

                let jsonObject = JSON.parse(xhr.responseText);

                if(userId < 1) {

                    document.getElementById("registerResult").innerHTML = "Account already Exists" + jsonObject.err;
                    return;

                }

                document.getElementById("registerResult").innerHTML = "Nice";

                firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "login.html";

            }

        };

        xhr.send(jsonPayload);

    }

    catch(err) {

        document.getElementById("registerResult").innerHTML = err.message;

    }

}

//Logs out the user and clears storage
function doLogout() {

	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";

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

	let url = urlBase + '/AddContact.' + extension;
	
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
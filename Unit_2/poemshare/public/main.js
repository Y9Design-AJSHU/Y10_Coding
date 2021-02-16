


		//Store information about your firebase so we can connect
		
		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//IMPORTANT: REPLACE THESE WITH YOUR VALUES (these ones won't work)
		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

		var config = {
			apiKey: "AIzaSyCMJ4Lmv_h1VTFgsjsrGe4gshz9EZ1zGeM",
			authDomain: "poemshare-c773d.firebaseapp.com",
			databaseURL: "https://poemshare-c773d-default-rtdb.firebaseio.com",
			projectId: "poemshare-c773d",
			storageBucket: "poemshare-c773d.appspot.com",
			messagingSenderId: "525083780147",
			appId: "1:525083780147:web:5563e5103478d382bfef46",
			measurementId: "G-9K4BT4ZGP0"
		};
		
		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

		//initialize your firebase
		firebase.initializeApp(config);

		firebase.auth().onAuthStateChanged(function(user) 
			{
				if (user == null) 
					{
						document.getElementById("myModal").style.display = "none";
						document.getElementById("loginBtn").innerHTML = "Login with Google"
						return;
					} 
				else 
					{
						document.getElementById("myModal").style.display = "none";
						document.getElementById("loginBtn").innerHTML = "Logout"
						uidKey = user.uid; 
						userName = user.displayName;
						uEmail = user.email;
					} 
			}); 

			
			var modal = document.getElementById("myModal");

			// Get the button that opens the modal
			var btn = document.getElementById("myBtn");

			// Get the <span> element that closes the modal
			var span = document.getElementsByClassName("close")[0];

			// When the user clicks the button, open the modal 
			btn.onclick = function() {
				var user = firebase.auth().currentUser;
			if (!user){
				alert("Please sign-in to post a poem.")
				return;
			}
			  modal.style.display = "block";
			}

			// When the user clicks on <span> (x), close the modal
			span.onclick = function() {
			  modal.style.display = "none";
			}

			// When the user clicks anywhere outside of the modal, close it
			window.onclick = function(event) {
			  if (event.target == modal) {
			    modal.style.display = "none";
			  }
			}

		function postPoemClose(){
					document.getElementById("myModal").style.display = "none";
		}
		function postPoemOpen(){
			if (document.getElementById("myModal").style.display == "block"){
				postPoemClose()
			}else{
				var user = firebase.auth().currentUser;
				if(user){
					document.getElementById("myModal").style.display = "block";
				}else{
					alert("Please sign-in to post a poem!")
				}

				
			}
		}

		

		var database = firebase.database();
		
		//create a variable to hold our orders list from firebase
		var firebasePoemsCollection = database.ref().child('poems');
		//this function is called when the submit button is clicked
		function submitPoem() {
			

			//Grab order data from the form
			if (document.getElementById('poemName').value.length==0 || quill.root==0){
				alert("Please don't leave any blanks!")
				return false
			}
			var poem = {
				title: document.getElementById('poemName').value, //another way you could write is $('#myForm [name="fullname"]').
				notes: quill.root.innerHTML,
				poetName: userName,
				likes: 0,
				time: timeStamp(),
				poetID: uidKey,

				//another way you could write is $('#myForm [name="fullname"]').
			};
			document.getElementById('poemName').value = ""
			quill.setContents([{ insert: '\n' }]);
			modal.style.display = "none";
			//'push' (aka add) your order to the existing list
			firebasePoemsCollection.push(poem); //'orders' is the name of the 'collection' (aka database table)
			
		};


		function like(key) {
			var user = firebase.auth().currentUser;
			if (!user){
				alert("Please sign-in to like a poem.")
				return;
			}			
			console.log(key)
			var refUser = firebase.database().ref().child('poems').child(key).child('likes').child('users').child(uidKey);
			var refCounter = firebase.database().ref().child('poems').child(key).child('likes').child('count');
			refUser.transaction(function(username) {
				console.log(username)
			    if(username != true){
			    	refCounter.transaction(function(currentLikes) {return (currentLikes) + 1});
			    	return true
			    }
			    if(username == true){
			    	refCounter.transaction(function(currentLikes) {return (currentLikes) - 1});
			    	return false
			    }
			  });
			
		}
		function report(key) {
			var user = firebase.auth().currentUser;
			if (!user){
				alert("Please sign-in to report a poem.")
				return;
			}			
			console.log(key)
			var refUser = firebase.database().ref().child('poems').child(key).child('reports').child('users').child(uidKey);
			var indiRef = firebase.database().ref().child('poems').child(key).child('reports').child('individualReports').child(uidKey);

			
			refUser.transaction(function(username) {
			    if(username != true){
			    	var reportReason = prompt("Why should the poem be removed?")
			    	if(reportReason.length==0){
			    		return
			    	}
			    	var reportContentWAuthor = 
					{
					comment: reportReason,
					author: userName,
					userID: uidKey, //another way you could write is $('#myForm [name="fullname"]').
					//another way you could write is $('#myForm [name="fullname"]').
					};
			    	indiRef.push(reportContentWAuthor);
			    	return true
			    }else{
			    	alert("You can only report a poem once. We will look into the report and identify whether it merits removal or not. Thanks.")
			    }
			  });
			
		}

		function deletePost(key) {
			console.log(key)
			var refUser = firebase.database().ref().child('poems').child(key).child("poetID");
			var indiRef = firebase.database().ref().child('poems').child(key);

			
			refUser.transaction(function(username) {
			    if(username == uidKey){
			    	var confirmIt = confirm("Are you sure you want to delete your poem?");
			    	if(confirmIt){
			    		indiRef.remove();
			    	}else{
			    		return;
			    	}
			    }else{
			    	alert("You can only delete your own poem.")
			    }
			  });
			
		}

		function comment(key) {
			var user = firebase.auth().currentUser;
			if (!user){
				alert("Please sign-in to comment on a poem.")
				return;
			}
			var refUser = firebase.database().ref().child('poems').child(key).child('comments').child('users').child(uidKey);
			var refCounter = firebase.database().ref().child('poems').child(key).child('comments').child('individualComments');
			if (document.getElementById("comment"+key).value.length==0){
				alert("Please don't leave any blanks!")
				return false
			}
			var commentContentWAuthor = {
				comment: document.getElementById("comment"+key).value,
				author: userName,
				time: timeStamp(),//another way you could write is $('#myForm [name="fullname"]').
				//another way you could write is $('#myForm [name="fullname"]').
			};
			var commentContent = {
				comment: document.getElementById("comment"+key).value,
				time: timeStamp(), //another way you could write is $('#myForm [name="fullname"]').
				//another way you could write is $('#myForm [name="fullname"]').
			};

			//'push' (aka add) your order to the existing list
			refUser.push(commentContent);
			refCounter.push(commentContentWAuthor); //'orders' is the name o
			document.getElementById("comment"+key).value = '';

		}

		function loadCommments(key) {
			var ref = firebase.database().ref().child('poems').child(key).child('comments').child('individualComments');
			ref.on('value', function(comments){
				comments.forEach(function (eachComment){
					var commentValue = eachComment.val()
					var comments = document.getElementById("comments"+key);
					var newElementNode = document.createElement("div")
				  	newElementNode.innerHTML = "<hr style='border-top: 0.5px dotted black;margin: 10px 0px 10px 0px;'><h5 style='font-family: DM Mono, monospace !important;'>" + commentValue.author + " — "+commentValue.time+"<span></span></h5><p style='padding-top:10px;font-family: DM Mono, monospace !important;'>" + commentValue.comment + "</p>";
				  	comments.appendChild(newElementNode);

				})


				/*comments.forEach(function (eachComment){
					var commentValue = eachComment.val()
					var comments = document.getElementById("comments"+key);
					var node = document.createElement("LI");
					var textnode = document.createTextNode(commentValue.author + " says " + commentValue.comment);
  					var textnodeText = document.createTextNode(commentValue.author + " says " + commentValue.comment);
  					node.appendChild(textnode);
  					comments.appendChild(node);*/

				/*console.log(ref)
				function addComment(name, comment) {
				  var comments = document.getElementById("comments"+key);
				  comments.innerHTML = "<hr><h4>" + name + " says<span></span></h4><p>" + comment + "</p>";
				}
				ref.once("value", function(snapshot) {
				  var comment = snapshot.val();
				  console.log(comment.author + comment.comment)
				  addComment(comment.author, comment.comment);
				});*/
			});
			
		}
		function likeCounter(count){
			console.log(parseInt(count))
			if(parseInt(count)>0){
				return(count)
			}
			else if (count=="undefined"){
				return(0)
			}
			else{
				return(0)
			}
		}

		function signIn() 
			{
				var user = firebase.auth().currentUser;
				if(user){
					alert("You are already logged-in with the email "+uEmail+". If you would like to change emails, please logout first then login with the new email.")
					return false;
				}
				var provider = new firebase.auth.GoogleAuthProvider();
				firebase.auth()
			  .signInWithPopup(provider)
			  .then((result) => {
			    /** @type {firebase.auth.OAuthCredential} */
			    var credential = result.credential;

			    // This gives you a Google Access Token. You can use it to access the Google API.
			    var token = credential.accessToken;
			    // The signed-in user info.
			    var user = result.user;
			    // ...
			    location.reload();

			  }).catch((error) => {
			    // Handle Errors here.
			    var errorCode = error.code;
			    var errorMessage = error.message;
			    // The email of the user's account used.
			    var email = error.email;
			    // The firebase.auth.AuthCredential type that was used.
			    var credential = error.credential;
			    // ...
			  }); 
			}
		function signOut() 
            {	
                firebase.auth().signOut()
                .then(function() 
                {
                   alert('You have logged-out successfully!')
                   location.reload();
                }, function(error) 
                {
                    console.log('Signout Failed')  
                });
            }     

        function inOrOut(){
			var user = firebase.auth().currentUser;
			if(user){
				console.log("sign-out0")
				signOut()
				console.log("sign-out")
				return;
			}else{
				console.log("sign-in0")
				signIn()
				console.log("sign-in")
				return;
			
			}
		}
		
		//create a 'listener's which waits for changes to the values inside the firebaseOrdersCollection 
		firebasePoemsCollection.on('value',function(poems){
		


			//create an empty string that will hold our new HTML
			var allPoemsHtml = "";
			

			//this is saying foreach order do the following function...
			poems.forEach(function(firebasePoemReference){
				
				//this gets the actual data (JSON) for the order.
				var poem = firebasePoemReference.val(); //could be order //check your console to see it!
				//create html for the individual order
				//note: this is hard to make look pretty! Be sure to keep your indents nice :-)
				//IMPORTANT: we use ` here instead of ' (notice the difference?) That allows us to use enters
				function checkIfMine(){
					var user = firebase.auth().currentUser;
					if (!user){
						return "none"
					}else if(poem.poetID == uidKey){
						return "inline-flex"
					}else{
						return "none"
					}
				}
				var individialPoemHtml =	`<br><div class='item' style="padding:10px;border-bottom: 5px solid black; margin:5px;">
												<h3 style="font-family: 'DM Mono', monospace !important;display:inline-flex;" >`+poem.title+`&nbsp;</h3> <div id="mobileShow"><br></div>
												<button class="upvoteButton" style="display:inline-flex; font-size:20px;" onclick="like('`+firebasePoemReference.key+`')"><i class="fa fa-arrow-up"></i></button>
												<h4 style="font-family: 'DM Mono', monospace !important;display:inline-flex;">`+likeCounter(poem.likes.count)+`</h4>&nbsp;
												<button class="upvoteButton" style="display:inline-flex; font-size:20px;" onclick="report('`+firebasePoemReference.key+`')"><i class="fa fa-flag"></i></button>
												<button class="upvoteButton" id="delete" style="display:`+checkIfMine()+`; float:right;" onclick="deletePost('`+firebasePoemReference.key+`')"><img src="trash-fill.svg" style="height:20px" alt="trash can. delete.">
</button><br><br>

												<div><p class="ql-size-normal">`+poem.notes+`</p></div><br>
												<p>~ `+poem.poetName+`</p>
												<p>`+poem.time+`</p><br>

											
	<div style="border-top:1px solid black;padding-top:5px;">			
	<br>							 
      <div>
        <div style="margin-bottom:15px;"><i>Add Your Comment</i></div>
        <form action="#" >
          <div>
            <textarea style="margin-bottom:5px;" id="comment`+firebasePoemReference.key+`" rows="3" cols="30" placeholder="Comment"></textarea>
          </div>
          <button onclick="comment('`+firebasePoemReference.key+`')">COMMENT</button>
        </form>  
      </div>

      <div>
        <ul id="comments`+firebasePoemReference.key+`" style="font-family: 'DM Mono', monospace !important;"></ul>
      	<script type="text/javascript">
		   loadCommments('`+firebasePoemReference.key+`');
		</script>
      </div>
      </div>
      <br><br>
	</div>`;

		
				
				//add the individual order html to the end of the allOrdersHtml list
				allPoemsHtml = allPoemsHtml + individialPoemHtml;
			});
			if(allPoemsHtml.length==0){
				allPoemsHtml = "<h4 style='font-family: DM Mono, monospace !important;'>There are currently no poems posted.</h4>"
			}
			//actaull put the html on the page inside the element with the id PreviousOrders
			$('#previousPoems').html(allPoemsHtml);
			
			//note: an alternative approach would be to create a hidden html element for one order on the page, duplicate it in the forEach loop, unhide it, and replace the information, and add it back. 
		});
	

	function timeStamp() {
  var now = new Date();
  var date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];
  var time = [now.getHours(), now.getMinutes()];
  var suffix = (time[0] < 12) ? "AM" : "PM";
  time[0] = (time[0] < 12) ? time[0] : time[0] - 12;

  for (var i = 1; i < 3; i++) {
    if (time[i] < 10) {
      time[i] = "0" + time[i];
    }
  }

  return date.join("/") + ", " + time.join(":") + " " + suffix;
}





		var quill = new Quill('#editor-container', {
			modules: {
				'toolbar': [
					[{ 'size': [] }],
					[ 'bold', 'italic', 'underline', 'strike' ],
					[{ 'color': [] }, { 'background': [] }],
					[{ 'script': 'super' }, { 'script': 'sub' }],
					[{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block' ],
					[{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }],
					[ 'direction', { 'align': [] }],
					[ 'link', 'image', 'video', 'formula' ],
					[ 'clean' ]
				]
				
			},

			theme: 'snow'
		});
		






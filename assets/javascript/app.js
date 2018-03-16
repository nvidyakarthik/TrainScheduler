  var config = {
    apiKey: "AIzaSyAc2wGtnh35TVciTvSu-FV8KWAYnEM-_iM",
    authDomain: "trainschedulerproject-b3734.firebaseapp.com",
    databaseURL: "https://trainschedulerproject-b3734.firebaseio.com",
    projectId: "trainschedulerproject-b3734",
    storageBucket: "trainschedulerproject-b3734.appspot.com",
    messagingSenderId: "216486738815"
  };
  firebase.initializeApp(config); 
  var database = firebase.database();
   database.ref().on("child_added",function(childSnapshot){
     
    
      console.log("Name :"+childSnapshot.val().name);
      console.log("Destination "+childSnapshot.val().destination);
      console.log("Train Time :"+childSnapshot.val().trainTime);
      console.log("Frequency "+childSnapshot.val().frequency);
      //var dateFormat=moment(childSnapshot.val().dateAdded).format("hh:mm a");
      //console.log("date format "+dateFormat);
      var firstTime=moment(childSnapshot.val().trainTime).format("HH:mm");
      var tFrequency=childSnapshot.val().frequency;
     
      // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

      
      var tableRow=$("<tr id="+childSnapshot.key+">");  
      var cell1=$("<td>").append(childSnapshot.val().name); 
      var cell2=$("<td>").append(childSnapshot.val().destination); 
      var cell3=$("<td>").append(childSnapshot.val().frequency);
      var cell4= $("<td>").append(moment(nextTrain).format("hh:mm a"));
      var cell5= $("<td>").append(tMinutesTillTrain);
      var cell6=$("<td>").append("<button class='btn btn-primary' id='edit' data-editKey='"+childSnapshot.key+"' type='submit'>Edit</button>");
      var cell7=$("<td>").append("<button class='btn btn-primary' id='delete' data-delKey='"+childSnapshot.key+"' type='submit'>Delete</button>")
      tableRow.append(cell1).append(cell2).append(cell3).append(cell4).append(cell5).append(cell6).append(cell7);
      $("tbody").append(tableRow);

  }); 

  $("tbody").on("click",'#delete', function(event) {
    
    var key=$(this).attr('data-delKey');
    database.ref().child(key).remove();
    var rowId=this.parentNode.parentNode.rowIndex;
    document.getElementById("myTable").deleteRow(rowId);
    

  });
  


  

    // Capture Button Click
    $("#add-train").on("click", function(event) {
      // prevent form from trying to submit/refresh the page
      event.preventDefault();

      // Capture User Inputs and store them into variables
      var trainName = $("#tname-input").val().trim();
      var trainDestination = $("#destination-input").val().trim();
      var trainTime = $("#trainTime-input").val().trim();
      var trainFrequency = $("#frequency-input").val().trim();

      // Console log each of the user inputs to confirm we are receiving them
      console.log(trainName);
      console.log(trainDestination);
      console.log(trainTime);
      console.log(trainFrequency);
      database.ref().push({
          name:trainName,
          destination:trainDestination,
          traintime:trainTime,
          frequency:trainFrequency,
          dateAdded:firebase.database.ServerValue.TIMESTAMP
    
  });

     /*  // Output all of the new information into the relevant HTML sections
      $("#name-display").text(name);
      $("#email-display").text(email);
      $("#age-display").text(age);
      $("#comment-display").text(comment); */

    });

    var provider = new firebase.auth.GoogleAuthProvider();
    function signIn(){
           
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        location.href="trainSchedule.html";
        console.log("This is a test user "+user);
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("This is a error message "+errorMessage);
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    }
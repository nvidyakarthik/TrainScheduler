var config = {
    apiKey: "AIzaSyAc2wGtnh35TVciTvSu-FV8KWAYnEM-_iM",
    authDomain: "trainschedulerproject-b3734.firebaseapp.com",
    databaseURL: "https://trainschedulerproject-b3734.firebaseio.com",
    projectId: "trainschedulerproject-b3734",
    storageBucket: "",
    messagingSenderId: "216486738815"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
   database.ref().on("child_added",function(childSnapshot){
    
      console.log("Name :"+childSnapshot.val().name);
      console.log("Destination "+childSnapshot.val().destination);
      console.log("Train Time :"+childSnapshot.val().trainTime);
      console.log("Frequency "+childSnapshot.val().frequency);
      var dateFormat=moment(childSnapshot.val().dateAdded).format("hh:mm a");
      console.log("date format "+dateFormat);

      
      var tableRow=$("<tr>");  
      var cell1=$("<td>").append(childSnapshot.val().name); 
      var cell2=$("<td>").append(childSnapshot.val().destination); 
      var cell3=$("<td>").append(childSnapshot.val().frequency);
      var cell4= $("<td>").append(dateFormat);
      var cell5= $("<td>").append("min");
      tableRow.append(cell1).append(cell2).append(cell3).append(cell4).append(cell5);
      $("tbody").append(tableRow);

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
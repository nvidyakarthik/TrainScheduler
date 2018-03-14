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

     
    });
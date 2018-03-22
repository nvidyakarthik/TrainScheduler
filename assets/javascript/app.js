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

function minutesTillTrain(firstTrain, tFrequency) {
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);
  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = tFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
  return tMinutesTillTrain;

}


database.ref("/trainInfo").on("child_added", function (childSnapshot) {
  console.log("Name :" + childSnapshot.val().trainname);
  console.log("Destination " + childSnapshot.val().destination);
  console.log("Train Time :" + childSnapshot.val().traintime);
  console.log("Frequency " + childSnapshot.val().frequency);
  //var dateFormat=moment(childSnapshot.val().dateAdded).format("hh:mm a");
  //console.log("date format "+dateFormat);
  var tFrequency = childSnapshot.val().frequency;

  // Minute Until Train
  var tMinutesTillTrain = minutesTillTrain(childSnapshot.val().traintime, tFrequency);
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


  var tableRow = $("<tr id=" + childSnapshot.key + ">");
  var cell1 = $("<td>").append(childSnapshot.val().trainname);
  var cell2 = $("<td>").append(childSnapshot.val().destination);
  var cell3 = $("<td>").append(childSnapshot.val().frequency);
  var cell4 = $("<td>").append(moment(nextTrain).format("hh:mm a"));
  var cell5 = $("<td>").append(tMinutesTillTrain);
  var cell6 = $("<td>").append("<button class='btn btn-primary' id='edit' data-editKey='" + childSnapshot.key + "' type='submit'>Edit</button>");
  var cell7 = $("<td>").append("<button class='btn btn-primary' id='delete' data-delKey='" + childSnapshot.key + "' type='submit'>Delete</button>")
  tableRow.append(cell1).append(cell2).append(cell3).append(cell4).append(cell5).append(cell6).append(cell7);
  $("tbody").append(tableRow);

});


$(document).ready(function () {
  console.log("ready!");
  $("#editForm").hide();
});

$("tbody").on("click", '#close-edit', function (event) {
  $("#editForm").hide();
});

$("tbody").on("click", '#edit', function (event) {
  $("#editForm").show();
  var key = $(this).attr('data-editKey');
  $("#edit-key").val(key);
  var rowId = this.parentNode.parentNode.rowIndex;
  $("#rowIndex").val(rowId);
  database.ref("/trainInfo").child(key).on("value", function (snapshot) {
    console.log("edit object :" + snapshot.val().trainname);
    $("#edit-tname").val(snapshot.val().trainname);
    $("#edit-destination").val(snapshot.val().destination);
    $("#edit-trainTime").val(snapshot.val().traintime);
    $("#edit-frequency").val(snapshot.val().frequency);

  });
});


$("tbody").on("click", '#delete', function (event) {

  var key = $(this).attr('data-delKey');
  database.ref("/trainInfo").child(key).remove();
  var rowId = this.parentNode.parentNode.rowIndex;
  document.getElementById("myTable").deleteRow(rowId);


});


// function for edit form submit updates values in firebase
$("#edit-train").on("click", function (event) {
  // prevent form from trying to submit/refresh the page
  event.preventDefault();
  // Capture User Inputs and store them into variables
  
  var editTrainName = $("#edit-tname").val().trim();
  var editTrainDestination = $("#edit-destination").val().trim();
  var editTrainTime = $("#edit-trainTime").val().trim();
  var editTrainFrequency = $("#edit-frequency").val().trim();
  var editKey = $("#edit-key").val();
  console.log("edit key:" + editKey);
  var updatedRow = "";

  database.ref("/trainInfo").child(editKey).set({
    trainname: editTrainName,
    destination: editTrainDestination,
    traintime: editTrainTime,
    frequency: editTrainFrequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP

  });

  // Clear text fields
  $("#edit-tname").val("");
  $("#edit-destination").val("");
  $("#edit-trainTime").val("");
  $("#edit-frequency").val("");
  $("#editForm").hide();


  database.ref("/trainInfo").child(editKey).once("value", function (childSnapshot) {
    var tFrequency = childSnapshot.val().frequency;
    // Minute Until Train
    var tMinutesTillTrain = minutesTillTrain(childSnapshot.val().traintime, tFrequency);
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    //update row html
    updatedRow = "<tr id=" + childSnapshot.key + ">";
    var cell1 = "<td>" + childSnapshot.val().trainname + "</td>";
    var cell2 = "<td>" + childSnapshot.val().destination + "</td>";
    var cell3 = "<td>" + tFrequency + "</td>";
    var cell4 = "<td>" + moment(nextTrain).format("hh:mm a") + "</td>";
    var cell5 = "<td>" + tMinutesTillTrain + "</td>";
    var cell6 = "<td><button class='btn btn-primary' id='edit' data-editKey='" + childSnapshot.key + "' type='submit'>Edit</button></td>";
    var cell7 = "<td><button class='btn btn-primary' id='delete' data-delKey='" + childSnapshot.key + "' type='submit'>Delete</button></td>";
    updatedRow = updatedRow + cell1 + cell2 + cell3 + cell4 + cell5 + cell6 + cell7 + "</tr>";
    // $("tbody").append(updatedRow);
  });
  console.log(updatedRow);
  $("#" + editKey).replaceWith(updatedRow);


});





// This function adds Train information to firebase
$("#add-train").on("click", function (event) {
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
  if(trainName!="" && trainDestination!="" && trainName!="" && trainFrequency!=""){
  database.ref("/trainInfo").push({
    trainname: trainName,
    destination: trainDestination,
    traintime: trainTime,
    frequency: trainFrequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP

  });
}
else{
  alert("Please enter all the fields.");
}

  // Clear text fields
   $("#tname-input").val("");
   $("#destination-input").val("");
   $("#trainTime-input").val("");
   $("#frequency-input").val(""); 

});

var provider = new firebase.auth.GoogleAuthProvider();
function signIn() {

  firebase.auth().signInWithPopup(provider).then(function (result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    location.href = "trainSchedule.html";
    console.log("This is a test user " + user);
    // ...
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("This is a error message " + errorMessage);
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}




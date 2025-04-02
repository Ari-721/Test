// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyB0X4T6Ew4i6-ywdBcqNxiDqBLRDiEAgwE",
    authDomain: "test1-af633.firebaseapp.com",
    databaseURL: "https://test1-af633-default-rtdb.firebaseio.com",
    projectId: "test1-af633",
    storageBucket: "test1-af633.firebasestorage.app",
    messagingSenderId: "670643976599",
    appId: "1:670643976599:web:5f31e054919382271d2cd2"
});





const database = firebase.database();

// Post a comment
function addComment() {
    const commentText = document.getElementById("commentInput").value;
    if (commentText.trim() === "") return;

    database.ref("comments").push({
        text: commentText,
        timestamp: Date.now()
    });

    document.getElementById("commentInput").value = "";
}

// Display comments
database.ref("comments").on("child_added", (snapshot) => {
    const comment = snapshot.val();
    const commentsList = document.getElementById("commentsList");
    commentsList.innerHTML += `<p><strong>User:</strong> ${comment.text}</p>`;
});

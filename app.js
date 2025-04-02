// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyB0X4T6Ew4i6-ywdBcqNxiDqBLRDiEAgwE",
    authDomain: "test1-af633.firebaseapp.com",
    databaseURL: "test1-af633.firebaseapp.com",
    projectId: "test1-af633",
    storageBucket: "test1-af633.firebasestorage.app",
    messagingSenderId: "670643976599",
    appId: "1:670643976599:web:5f31e054919382271d2cd2"
});

const database = firebase.database();

// Post a comment
function addComment() {
    const commentText = document.getElementById("commentInput").value.trim();
    if (!commentText) return;

    database.ref("comments").push({
        text: commentText,
        timestamp: Date.now()
    })
    .then(() => console.log("✅ Comment saved to Firebase!"))
    .catch((error) => console.error("❌ Firebase save error:", error));
}

    document.getElementById("commentInput").value = "";
}

// Display comments
// Load existing comments when the page opens
window.onload = function() {
    database.ref("comments").once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const comment = childSnapshot.val();
            displayComment(comment);
        });
    });
};

// Function to display a single comment
function displayComment(comment) {
    const commentsList = document.getElementById("commentsList");
    commentsList.innerHTML += `<p><strong>User:</strong> ${comment.text}</p>`;
}

// Listen for NEW comments (real-time updates)
database.ref("comments").on("child_added", (snapshot) => {
    displayComment(snapshot.val());
});

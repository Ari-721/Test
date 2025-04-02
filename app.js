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



// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Load ALL comments when page loads
function loadComments() {
  database.ref("comments").once("value")
    .then((snapshot) => {
      const commentsList = document.getElementById("commentsList");
      commentsList.innerHTML = ""; // Clear existing
      
      snapshot.forEach((childSnapshot) => {
        const comment = childSnapshot.val();
        commentsList.innerHTML += `
          <div class="comment">
            <p>${comment.text}</p>
            <small>${new Date(comment.timestamp).toLocaleString()}</small>
          </div>
        `;
      });
    })
    .catch((error) => {
      console.error("Error loading comments:", error);
    });
}

// Post new comment
function addComment() {
  const commentText = document.getElementById("commentInput").value.trim();
  if (!commentText) return;

  const newComment = {
    text: commentText,
    timestamp: Date.now()
  };

  database.ref("comments").push(newComment)
    .then(() => {
      document.getElementById("commentInput").value = "";
      console.log("Comment saved!");
    })
    .catch((error) => {
      console.error("Error saving comment:", error);
    });
}

// Real-time listener for new comments
database.ref("comments").on("child_added", (snapshot) => {
  const comment = snapshot.val();
  const commentsList = document.getElementById("commentsList");
  
  commentsList.innerHTML += `
    <div class="comment">
      <p>${comment.text}</p>
      <small>${new Date(comment.timestamp).toLocaleString()}</small>
    </div>
  `;
});

// Load comments when page loads
window.addEventListener("DOMContentLoaded", loadComments);

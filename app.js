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







// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// ========================
// 2. THEME TOGGLE (FIXED)
// ========================
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const html = document.documentElement;
      const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
    
    // Set initial theme
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }
});

// ========================
// 3. COMMENT SYSTEM (FIXED)
// ========================
function setupComments() {
  const commentBtn = document.getElementById('comment-btn');
  const commentBox = document.querySelector('.comment-box');
  
  if (commentBtn && commentBox) {
    // Toggle comment box
    commentBtn.addEventListener('click', () => {
      commentBox.classList.toggle('active');
    });

    // Post comment
    window.addComment = function() {
      const commentInput = document.getElementById('commentInput');
      const commentText = commentInput.value.trim();
      
      if (commentText) {
        db.ref('comments').push({
          text: commentText,
          timestamp: Date.now(),
          author: "User"
        }).then(() => {
          commentInput.value = '';
        }).catch(console.error);
      }
    };

    // Load comments
    db.ref('comments').on('child_added', (snapshot) => {
      const comment = snapshot.val();
      const commentsList = document.getElementById('commentsList');
      if (commentsList) {
        commentsList.innerHTML += `
          <div class="comment">
            <p><strong>${comment.author}:</strong> ${comment.text}</p>
            <small>${new Date(comment.timestamp).toLocaleString()}</small>
          </div>
        `;
      }
    });
  }
}

// ========================
// 4. LIKE SYSTEM (FIXED)
// ========================
window.likePhoto = function(photoId) {
  console.log("Like button clicked for:", photoId); // Debug 1
  
  const photoRef = firebase.database().ref(`photos/${photoId}`);
  
  photoRef.transaction((photo) => {
    console.log("Current photo data:", photo); // Debug 2
    
    if (!photo) {
      return { likes: 1 }; // Initialize if doesn't exist
    }
    return {
      ...photo,
      likes: (photo.likes || 0) + 1
    };
  }).then((result) => {
    console.log("Transaction result:", result); // Debug 3
    if (result.committed) {
      document.querySelectorAll(`[data-id="${photoId}"] .like-count`)
        .forEach(el => el.textContent = result.snapshot.val().likes);
    }
  }).catch((error) => {
    console.error("Full error:", error); // Debug 4
  });
};

// ========================
// 5. INITIALIZE EVERYTHING
// ========================
document.addEventListener('DOMContentLoaded', () => {
  setupComments();
});

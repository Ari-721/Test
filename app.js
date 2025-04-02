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
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Set initial theme
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
}

// ===== COMMENT SYSTEM =====
const commentBtn = document.getElementById('comment-btn');
const commentBox = document.querySelector('.comment-box');

// Toggle comment box
commentBtn.addEventListener('click', () => {
    commentBox.classList.toggle('active');
});

// Add new comment
function addComment() {
    const commentText = document.getElementById('commentInput').value.trim();
    if (!commentText) return;

    const newComment = {
        text: commentText,
        timestamp: Date.now(),
        author: "Anonymous"
    };

    db.ref('comments').push(newComment)
        .then(() => {
            document.getElementById('commentInput').value = '';
        })
        .catch(error => {
            console.error("Error saving comment:", error);
        });
}

// Load comments
function loadComments() {
    db.ref('comments').on('value', (snapshot) => {
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = '';
        
        snapshot.forEach((childSnapshot) => {
            const comment = childSnapshot.val();
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <p><strong>${comment.author}:</strong> ${comment.text}</p>
                <small>${new Date(comment.timestamp).toLocaleString()}</small>
            `;
            commentsList.appendChild(commentElement);
        });
    });
}

// ===== LIKE SYSTEM =====
function likePhoto(photoId) {
    const likeRef = db.ref(`photos/${photoId}/likes`);
    
    likeRef.transaction((currentLikes) => {
        return (currentLikes || 0) + 1;
    }).then(() => {
        // Update like count display
        likeRef.once('value').then((snapshot) => {
            const likeCountElements = document.querySelectorAll(`.photo-card[data-id="${photoId}"] .like-count`);
            likeCountElements.forEach(el => {
                el.textContent = snapshot.val();
            });
        });
    });
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    loadComments();
    
    // Initialize like counts
    db.ref('photos').once('value').then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const photoId = childSnapshot.key;
            const likes = childSnapshot.val().likes || 0;
            const likeCountElements = document.querySelectorAll(`.photo-card[data-id="${photoId}"] .like-count`);
            likeCountElements.forEach(el => {
                el.textContent = likes;
            });
        });
    });
});

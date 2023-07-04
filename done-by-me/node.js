// server.js (main file)

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Note: Change this to 'true' if using HTTPS
}));

// Sample data (replace with database interactions)
let blogPosts = [
  { id: '1', title: 'First Post', content: 'This is my first blog post.', creator: 'John', date: '2023-07-01' },
  { id: '2', title: 'Second Post', content: 'This is my second blog post.', creator: 'Alice', date: '2023-07-02' }
];

// Routes
app.get('/', (req, res) => {
  // Check if user is logged in
  const isLoggedIn = req.session.isLoggedIn || false;

  res.send(`
    <h1>Welcome to the Blog Site</h1>
    ${isLoggedIn ? '<a href="/dashboard">Dashboard</a> | <a href="/logout">Log Out</a>' : '<a href="/login">Log In</a>'}
    <div id="blog-posts">
      ${blogPosts.map(post => `
        <div class="blog-post">
          <h2>${post.title}</h2>
          <p>${post.content}</p>
          <p>By: ${post.creator}</p>
          <p>Date: ${post.date}</p>
        </div>
      `).join('')}
    </div>
  `);
});

app.get('/dashboard', (req, res) => {
  // Check if user is logged in
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const userPosts = blogPosts.filter(post => post.creator === req.session.username);

  res.send(`
    <h1>Dashboard</h1>
    <a href="/">Home</a> | <a href="/logout">Log Out</a>
    <h2>Your Posts</h2>
    ${userPosts.map(post => `
      <div class="blog-post">
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <button onclick="deletePost('${post.id}')">Delete</button>
        <button onclick="updatePost('${post.id}')">Update</button>
      </div>
    `).join('')}
    <h2>Add New Post</h2>
    <form action="/add-post" method="POST">
      <input type="text" name="title" placeholder="Title" required>
      <textarea name="content" placeholder="Content" required></textarea>
      <button type="submit">Create Post</button>
    </form>
    <script>
      function deletePost(postId) {
        // Perform an HTTP DELETE request to delete the post
        fetch('/api/blog-posts/' + postId, { method: 'DELETE' })
          .then(response => {
            if (response.ok) {
              window.location.reload();
            }
          })
          .catch(error => {
            console.error('Error deleting post:', error);
          });
      }

      function updatePost(postId) {
        // Redirect to the update post page
        window.location.href = '/update-post/' + postId;
      }
    </script>
  `);
});

app.get('/login', (req, res) => {
  // Check if user is already logged in
  if (req.session.isLoggedIn) {
    res.redirect('/dashboard');
    return;
  }

  res.send(`
    <h1>Log In</h1>
    <form action="/login" method="POST">
      <input type="text" name="username" placeholder="Username" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Log In</button>
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Authenticate user (replace with your authentication logic)
  if (username === 'admin' && password === 'password') {
    req.session.isLoggedIn = true;
    req.session.username = username;
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.post('/add-post', (req, res) => {
  // Check if user is logged in
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const { title, content } = req.body;

  // Create a new blog post (replace with database insert)
  const newPost = {
    id: uuidv4(),
    title,
    content,
    creator: req.session.username,
    date: new Date().toISOString().split('T')[0]
  };

  blogPosts.push(newPost);
  res.redirect('/dashboard');
});

app.delete('/api/blog-posts/:postId', (req, res) => {
  // Check if user is logged in
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  const { postId } = req.params;

  // Find the post index
  const postIndex = blogPosts.findIndex(post => post.id === postId);

  if (postIndex !== -1) {
    // Delete the post
    blogPosts.splice(postIndex, 1);
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


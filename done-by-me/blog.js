// Function to fetch blog posts from the server
function fetchBlogPosts() {
    // Perform an HTTP GET request to fetch the blog posts
    fetch('/api/blog-posts')
      .then(response => response.json())
      .then(blogPosts => {
        // Clear the existing blog posts container
        const blogPostsContainer = document.getElementById('blog-posts');
        blogPostsContainer.innerHTML = '';
  
        // Loop through each blog post and create HTML elements to display them
        blogPosts.forEach(blogPost => {
          const postElement = document.createElement('div');
          postElement.classList.add('blog-post');
  
          const titleElement = document.createElement('h2');
          titleElement.innerText = blogPost.title;
  
          const contentElement = document.createElement('p');
          contentElement.innerText = blogPost.content;
  
          const creatorElement = document.createElement('p');
          creatorElement.innerText = `By: ${blogPost.creator}`;
  
          const dateElement = document.createElement('p');
          dateElement.innerText = `Date: ${blogPost.date}`;
  
          postElement.appendChild(titleElement);
          postElement.appendChild(contentElement);
          postElement.appendChild(creatorElement);
          postElement.appendChild(dateElement);
  
          blogPostsContainer.appendChild(postElement);
        });
      })
      .catch(error => {
        console.error('Error fetching blog posts:', error);
      });
  }
  
  // Call the fetchBlogPosts function when the page loads
  window.addEventListener('load', fetchBlogPosts);
  
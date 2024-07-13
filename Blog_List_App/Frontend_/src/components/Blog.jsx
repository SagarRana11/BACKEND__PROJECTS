const Blog = ({ blog }) => (
  <div className="blogDiv">
    {blog.title} {blog.author}
  </div>  
)

export default Blog
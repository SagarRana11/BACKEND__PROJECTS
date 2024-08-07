import react from "react"
import { useState } from "react"
const Blog = ({ blog, handleDelete, handleLike }) => {
  const [visible ,setVisible] = useState(false)
  const hideWhenVisible = {display: visible? 'null':''}
  const showWhenVisible = {display: visible? '':'null'}

  const toggleVisibility = ()=>{
    setVisible(!visible)
  }

  const BlogDetails =()=>{
    return(
      <div>
        <div>
        <h2>likes : {blog.likes}</h2>
        <button onClick={()=>handleLike(blog)}>like</button>

        </div>
        <a href={blog.url}>{blog.url}</a>
      </div>
    )
  }


  return(
    <div className="blogDiv">
      <div className="blogHeader">
        <p> {blog.title}</p> 
        <div>
          <button onClick={toggleVisibility}>{visible? 'hide':'show'}</button>
          <button className="deleteBtn" onClick={()=>handleDelete(blog.id)} >delete</button>

        </div>

      </div>

      {visible && <BlogDetails />
      }
    </div>  
  )
}

export default Blog
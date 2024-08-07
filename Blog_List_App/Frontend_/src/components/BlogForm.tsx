import React, { useState } from 'react'
import Blogservices from '../services/blogs'

const BlogForm = (props) => {
   const [title,setTitle] =useState('')
   const [author,setAuthor] =useState('')
   const [url,setUrl] =useState('')
    const { setBlogs, blogs, setErrorMessage,blogFormRef } = props
    
    const handleSubmit = async(e)=>{
      e.preventDefault()
      blogFormRef.current.toggleVisibility()
      try{
         const inputObject = {
            title,
            author,
            url,
         }
         const newBlog = await Blogservices
            .create(inputObject)
         setBlogs(blogs.concat(newBlog))
         setAuthor('')
         setTitle('')
         setUrl('')
         setErrorMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
         setTimeout(()=>{
            setErrorMessage(null)
         },5000)
      }catch(error){
         console.log(error)
         setErrorMessage(`${error.message}`)
         setTimeout(()=>{
            setErrorMessage(null)
         },5000)
      }


       
    }

    return (
    <div>
      <form className='createForm' onSubmit={handleSubmit}>
      <h2>Create new Blog</h2>

        
        <div>
            <p> Title </p>
            <input name="Title" value={title} onChange={({target})=>setTitle(target.value)} />
        </div>

        <div>
               <p> Author </p>

               <input name="Author" value={author} onChange={({target})=>setAuthor(target.value)} />
        </div>
        <div>
               <p> Url </p>

               <input name="Url" value={url} onChange={({target})=>setUrl(target.value)} />
        </div>
        

        <button className='loginBtn' type='submit'>Add</button>
      </form>
    </div>
  )
}

export default BlogForm

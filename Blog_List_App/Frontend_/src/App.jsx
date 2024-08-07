import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/loginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import BlogServices from './services/blogs'
import Togglable from './components/Togglable'





const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)
  const [createVisible, setCreateVisible] = useState(false)
  const blogFormRef = useRef()



  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }
  console.log("user", user)

  const handleDelete =(id)=>{
    blogService
       .deleteBlog(id)
    setBlogs(blogs.filter(blog => blog.id !== id))   
  }

  const handleLike=async(blog)=>{
    console.log('updating', blog)
    const updatedBlog = await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1
    })

    setBlogs(blogs.map(b => b.id === blog.id ? updatedBlog : b))



  }
  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div className='loginDiv' style={hideWhenVisible}>
          <h2>Log in to read the blogs</h2>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm username={username} setUsername={setUsername} password={password} setPassword={setPassword} user={user} setUser={setUser} />
        </div>

      </div>
    )
  }

  const createForm = () => {
    return (
      <Togglable buttonLebel="new blog" ref={blogFormRef}>
         <BlogForm 
           setBlogs={setBlogs}
           blogs={blogs}
           setErrorMessage={setErrorMessage}
           blogFormRef={blogFormRef}
         />
      </Togglable>
    )
  }



  return (
    <div>
      {errorMessage !== null && <Notification errorMessage={errorMessage} />}

      {user === null
        ? loginForm()
        : (
          <>
            <header>
              <h2>{user.username} logged in </h2>
              <button onClick={handleLogout}>logout</button>
            </header>

            <h1>Blogs</h1>
            {createForm()}
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} handleDelete={handleDelete} handleLike={handleLike} />)}

          </>

        )}

    </div>
  )
}

export default App
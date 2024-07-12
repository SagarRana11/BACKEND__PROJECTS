import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/loginForm'
import CreateForm from './components/CreateForm'
import Notification from './components/Notification'
import BlogServices from './services/blogs'





const App = () => {
  const [username , setUsername] = useState('')
  const [password , setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [title , setTitle] = useState('')
  const [author , setAuthor] = useState('')
  const [url , setUrl] = useState('')
  const [errorMessage, setErrorMessage] =useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
  useEffect(()=>{
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  },[])

  const handleLogout =()=>{
    window.localStorage.clear()
    setUser(null)
  }
  console.log("user", user)

  return (
    <div>
      {errorMessage !== null && <Notification errorMessage={errorMessage} />}
      
      {user === null 
      ? <LoginForm username={username} setUsername={setUsername} password={password} setPassword={setPassword} user={user} setUser ={setUser} /> 
      : (
        <> 
          <header>
            <h2>{user.username} logged in </h2>
            <button onClick={handleLogout}>logout</button>
          </header>
          
          <h1>Blogs</h1>
          <CreateForm 
            title={title} 
            author={author}
            url={url}
            setTitle={setTitle}
            setAuthor={setAuthor}
            setUrl={setUrl} 
            blogs={blogs}
            setBlogs={setBlogs} 
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
          {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />)}

        </>

      )}
     
    </div>
  )
}

export default App
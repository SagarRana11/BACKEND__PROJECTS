const mongoose = require('mongoose');
const MONGODB_URL = "mongodb+srv://ranasagar97411:ranasagar97411@cluster0.f8fqylv.mongodb.net/testBlogApp?retryWrites=true&w=majority&appName=Cluster0"

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        const conn = await mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`Connection is made ${conn.connection.port}`)

    } catch (error) {
        console.error(error)
    }
};

const main = async () => {
    await connectDB()

    const blogSchema = new mongoose.Schema({
        title: String,
        author: String,
        url: String,
        likes: Number
    })
    blogSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject.__v
        }
    })
    const Blog = mongoose.model('Blog', blogSchema)

    const blog = new Blog({
        title: "How I started to code",
        author: "Sagar Rana",
        url: "myBlog.com",
        likes: 123
    })
    try {
        const result = await blog.save();
        console.log('note saved!', result);

        const blogs = await Blog.find({});
        blogs.forEach(blog => {
            console.log(blog);
        });
    } catch (error) {
        console.log(error.message);
    } finally {
        mongoose.connection.close();
    }


}
main()
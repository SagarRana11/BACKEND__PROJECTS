require('dotenv').config()
require('express-async-errors')


// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const express = require('express')
const app = express()


const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})
//swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

const connectDB = require('./db/connect');
// product router
const productRouter = require('./routes/productRoutes');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.static('./public'))

app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(fileUpload({ useTempFiles: true }));

//swagger route
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
//routes
app.use('/api/v1/products', productRouter)
// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);








const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port http://localhost:${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
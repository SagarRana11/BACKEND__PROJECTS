const requstLogger = (req, res, next) => {
    console.log("Request url:", req.url)
    console.log("Request method:", req.method)
    console.log("Request pathname", req.path)

    next()
}

module.exports = { requstLogger }
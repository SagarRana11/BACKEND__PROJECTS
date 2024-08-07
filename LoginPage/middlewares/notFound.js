const notfound = (req, res) => {
    res.status(400).json({ message: "route not found" })
}

module.exports = notfound
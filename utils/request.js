const request = async (func, req, res, next) => {
    try {
        const data = await func(req.body);
        res.send(data);
    } catch(err) {
        console.log(func)
        console.error(err);
        next(err)
    }
}

module.exports = request;
module.exports = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({ error: 'You must log in!' });
    }

    next();
};

// next function indicates when you call it, it would pass the request off to the next middle ware in the chain.
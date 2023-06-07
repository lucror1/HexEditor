function getIndex(req, res, next) {
    if (req.url === "/") {
        // Render index.pug w/ csrf token
        res.render("index", {
            csrftoken: req.session.csrftoken
        });
        return;
    }
    next();
}

export { getIndex };
export default { getIndex };
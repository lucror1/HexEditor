import path from "path";

// Based off of https://stackoverflow.com/a/9802006
function error404(req, res, next) {
    res.status(404);
  
    if (req.accepts('html')) {
      res.sendFile(path.resolve("../www/404.html"));
      return;
    }
  
    if (req.accepts('json')) {
      res.json({ error: 'Not found' });
      return;
    }
  
    res.type('txt').send('Not found');
}

export { error404 };
export default error404;
function sendError(res, type: string): void {
    res.send({
        error: true,
        type: type
    });
}

// TODO: this might cause problems and mask errors
function detectMiddlewareError(error, req, res, next) {
    if (error instanceof SyntaxError) {
        sendError(res, "bad input");
    } else {
        next();
    }
}

export { sendError, detectMiddlewareError };
export default { sendError, detectMiddlewareError };
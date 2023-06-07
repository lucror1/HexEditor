function sendError(res, type: string): void {
    res.send({
        error: true,
        type: type
    });
}

export { sendError };
export default { sendError };
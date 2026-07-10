const errorHandler = (err, req, res, next) => {
    // Log the error internally
    console.error(err.stack);

    // Send a generic error message to the client
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        msg: 'Ocurrió un error interno en el servidor. Por favor, intente de nuevo más tarde.',
        // Only include stack trace if not in production
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};

module.exports = errorHandler;

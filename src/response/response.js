export const response = (statusCode, data, message, res) => {
    res.status(statusCode).json(
        {
            data,
            message
        }
    )
}

export const responseError = (statusCode, message, res) => {
    res.status(statusCode).json(
        {
            message
        }
    )
}

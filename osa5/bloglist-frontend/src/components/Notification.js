const Notification = ({ message, errorMessage }) => {
    if (message === null && errorMessage === null) {
        return (null)
    }
    if (message) {
        return (
            <div className='message'>
                <p>{message}</p>
            </div>
        )
    }
    else {
        return (
            <div className='errorMessage'>
                <p>{errorMessage}</p>
            </div>
        )
    }
}

export default Notification
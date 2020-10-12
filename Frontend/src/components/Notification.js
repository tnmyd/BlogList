import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ message, type }) => {
    return(
        <>
            <div className={`${type}`}>
                {message}
            </div>
        </>
    );
};

Notification.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
};

export default Notification;
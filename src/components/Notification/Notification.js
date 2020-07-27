import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import "./Notification.scss";

const Notification = ({ boardTitle, message, removeNotification }) => {
  const shortenText = (text, maxChars) => {
    return text.length > maxChars ? `${text.substring(0, maxChars - 3)}...` : text;
  }

  return (
    <div className="notification">
      <div className="notification-body">
        <h2>{shortenText(boardTitle, 22)}</h2>
        <span>{shortenText(message, 55)}</span>
      </div>
      <CloseIcon onClick={removeNotification} />
    </div>
  )
}

export default Notification
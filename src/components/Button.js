import React from 'react';

const Button = ({id = '', iconStyle = 'fas', icon, title, onClick}) => {

  return (
    <button
      id={id}
      className="my-lg-3 mx-3 btn btn-outline-primary rounded-circle d-flex justify-content-center align-items-center fz-20"
      title={title}
      onClick={onClick}>
      <i className={iconStyle + " fa-" + icon}></i>
    </button>
  );
}

export default Button;

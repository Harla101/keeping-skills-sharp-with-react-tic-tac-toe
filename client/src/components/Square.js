import React from 'react';
import PropTypes from 'prop-types';

const Square = ({ value, onClick, className }) => (
  <button className={`square ${className}`} onClick={onClick}>
    {value}
  </button>
);

Square.defaultProps = {
  className: '',
};

Square.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Square;

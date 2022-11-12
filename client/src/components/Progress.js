import React from 'react';
import PropTypes from 'prop-types';

const Progress = ({ percentage }) => {
  return (
    <div className='progress' style={{ width: `${100}%` }}>
      <div
        className='progress-bar progress-bar-striped bg-success center'
        
        role='progressbar'
        style={{ width: `${percentage}%` }}
        aria-label="label"
      >
        {percentage}%
      </div>
    </div>
  );
};

Progress.propTypes = {
  percentage: PropTypes.number.isRequired
};

export default Progress;

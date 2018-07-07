import React from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/display-name

/**
 * @param lastUpdate
 * @param light {bool}
 * @return {JSX.Element}
 * @constructor
 */
const Clock = ({lastUpdate, light}) => {
  return (
    <div className={light ? 'light' : ''}>
      {format(new Date(lastUpdate))}
      <style jsx>{`
        div {
          padding: 15px;
          display: inline-block;
          color: #82FA58;
          font: 50px menlo, monaco, monospace;
          background-color: #000;
        }

        .light {
          background-color: #999;
        }
      `}</style>
    </div>
  );
};

/**
 * @type {{lastUpdate: shim, light: shim}}
 */
Clock.propTypes = {
  lastUpdate: PropTypes.any,
  light: PropTypes.bool,
};

export default Clock;

const format = t => `${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}:${
  pad(t.getUTCSeconds())}`;

const pad = n => n < 10 ? `0${n}` : n;

import React, { useState } from 'react';

const DotConnector = () => {
  const [dots, setDots] = useState([]);
  const [lines, setLines] = useState([]);

  const handleDotClick = (dotIndex) => {
    // Add the clicked dot to the list of selected dots
    setDots((prevDots) => [...prevDots, dotIndex]);

    // If we have selected two dots, create a line connecting them
    if (dots.length === 1) {
      const [startDot, endDot] = dots;
      setLines((prevLines) => [...prevLines, { start: startDot, end: endDot }]);
    }
  };

  const renderDots = () => {
    const dotElements = [];
    for (let i = 0; i < 25; i++) {
      const isDotSelected = dots.includes(i);
      dotElements.push(
        <div
          key={i}
          className={`dot ${isDotSelected ? 'selected' : ''}`}
          onClick={() => handleDotClick(i)}
          style={{
            width: '20px',
            height: '20px',
            background: isDotSelected ? 'red' : 'blue',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
        ></div>
      );
    }
    return dotElements;
  };

  const renderLines = () => {
    return lines.map((line, index) => (
      <div
        key={index}
        className="line"
        style={calculateLineStyle(line.start, line.end)}
      ></div>
    ));
  };

  const calculateLineStyle = (startDot, endDot) => {
    const startX = startDot % 5;
    const startY = Math.floor(startDot / 5);
    const endX = endDot % 5;
    const endY = Math.floor(endDot / 5);

    const left = Math.min(startX, endX) * 60;
    const top = Math.min(startY, endY) * 60;
    const width = Math.abs(endX - startX) * 60 + 60;
    const height = Math.abs(endY - startY) * 60 + 60;

    return {
      left: left + 'px',
      top: top + 'px',
      width: width + 'px',
      height: height + 'px',
      background: 'green',
    };
  };

  return (
    <div className="dot-connector">
      <div className="dot-grid">{renderDots()}</div>
      <div className="line-grid">{renderLines()}</div>
    </div>
  );
};

export default DotConnector;




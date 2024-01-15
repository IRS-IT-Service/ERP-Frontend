import React, { Component } from 'react';

class DotGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dots: Array(25).fill(false), // Initially, all dots are unclicked
      lines: [],
    };
  }

  handleDotClick = (index) => {
    const { dots, lines } = this.state;
    if (!dots[index]) {
      dots[index] = true;
      if (lines.length % 2 === 1) {
        const [prevDotIndex] = lines.slice(-1);
        lines.pop(); // Remove the previous dot index
        lines.push(prevDotIndex, index); // Add the new line
      }
      this.setState({ dots, lines });
    }
  };

  render() {
    const { dots, lines } = this.state;

    return (
      <div>
        <div className="dot-grid">
          {dots.map((isClicked, index) => (
            <div
              key={index}
              className={`dot ${isClicked ? 'clicked' : ''}`}
              onClick={() => this.handleDotClick(index)}
            ></div>
          ))}
        </div>
        <svg className="lines">
          {lines.map((lineIndex, index) => (
            <line
              key={index}
              x1={dots[lineIndex].x}
              y1={dots[lineIndex].y}
              x2={dots[lines[index + 1]].x}
              y2={dots[lines[index + 1]].y}
              stroke="black"
            />
          ))}
        </svg>
      </div>
    );
  }
}

export default DotGrid;


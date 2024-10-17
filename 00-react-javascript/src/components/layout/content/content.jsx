import React from 'react';
import './content.css';

const Content = () => {
  // thêm logic tùy chỉnh khác tại đây
  const handleTitleClick = (title) => {
    alert(`You clicked on ${title}`);
  };
  return (
    <React.Fragment>
      <div className="content-wrapper">
        <div onClick={() => handleTitleClick('New Songs 1')}>New Songs</div>
        <div onClick={() => handleTitleClick('New Songs')}>New Songs</div>
      </div>
      <React.Fragment>
        <div className="content-wrapper-0">
          <React.Fragment>
            <div className="content-wrapper-2">
              <div onClick={() => handleTitleClick('New Songs 1')}>
                New Songs 2
              </div>
              <div onClick={() => handleTitleClick('New Songs')}>
                New Songs2
              </div>
              <div onClick={() => handleTitleClick('New Songs')}>
                New Songs2
              </div>
            </div>
          </React.Fragment>
          <div className="content-4">
            <div className="content-wrapper-3">
              <div onClick={() => handleTitleClick('New Songs 1')}>
                New Songs3
              </div>
              <div onClick={() => handleTitleClick('New Songs')}>
                New Songs3
              </div>
            </div>
            <div className="content-wrapper-3">
              <div onClick={() => handleTitleClick('New Songs 1')}>
                New Songs3
              </div>
              <div onClick={() => handleTitleClick('New Songs')}>
                New Songs3
              </div>
            </div>
            <div className="content-wrapper-3">
              <div onClick={() => handleTitleClick('New Songs 1')}>
                New Songs3
              </div>
              <div onClick={() => handleTitleClick('New Songs')}>New Songs</div>
            </div>
            <div className="content-wrapper-3">
              <div onClick={() => handleTitleClick('New Songs 1')}>
                New Songs3
              </div>
              <div onClick={() => handleTitleClick('New Songs')}>New Songs</div>
            </div>
            <div className="content-wrapper-3">
              <div onClick={() => handleTitleClick('New Songs 1')}>
                New Songs3
              </div>
              <div onClick={() => handleTitleClick('New Songs')}>
                New Songs3
              </div>
            </div>
            <div className="content-wrapper-3">
              <div onClick={() => handleTitleClick('New Songs 1')}>
                New Songs3
              </div>
              <div onClick={() => handleTitleClick('New Songs')}>
                New Songs3
              </div>
            </div>
            <div className="content-wrapper-3">
              <div onClick={() => handleTitleClick('New Songs 1')}>
                New Songs3
              </div>
              <div onClick={() => handleTitleClick('New Songs')}>
                New Songs3
              </div>
            </div>
            <div className="content-wrapper-3">
              <div onClick={() => handleTitleClick('New Songs 1')}>
                New Songs3
              </div>
              <div onClick={() => handleTitleClick('New Songs')}>
                New Songs3
              </div>
            </div>
            <div className="content-wrapper-3">
              <div onClick={() => handleTitleClick('New Songs 1')}>
                New Songs33
              </div>
              <div onClick={() => handleTitleClick('New Songs')}>
                New Songs33
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    </React.Fragment>
  );
};

export default Content;

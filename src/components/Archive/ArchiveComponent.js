import React from 'react';
import { Accordion } from 'react-bootstrap';
import './ArchiveComponent.css';
import { IconButton } from '@mui/material';
import { generateArchiveData } from '../../utils/generateArchiveData';

const ArchiveComponent = ({ originalData, handleYearClick, handleMonthClick, handlePostClick }) => {

  const archiveData = generateArchiveData(originalData);

  return (
    <div className="archive-section">
      <h3 className='text-center'>Archives</h3>
      <Accordion defaultActiveKey="0">
        {Object.entries(archiveData).reverse().map(([year, months], index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
            <Accordion.Header onClick={() => handleYearClick(year)}>
              <IconButton></IconButton> {year}
            </Accordion.Header>
            <Accordion.Body>
              {Object.entries(months).map(([month, posts], index) => (
                <div key={index}>
                  <p className="month-title" onClick={() => handleMonthClick(year, month)}>{month} ({posts.length})</p>
                  <ul>
                    {posts.map((post, index) => (
                      <li key={index} onClick={() => handlePostClick(post)} className="titles">
                        {post.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default ArchiveComponent;
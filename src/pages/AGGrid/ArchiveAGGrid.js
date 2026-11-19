import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';

function ArchiveAGGrid() {
  const [gridData, setGridData] = useState([]);
  const [quickFilterText, setQuickFilterText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/data');
      console.log('Response from API:', response);
      setGridData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const columnDefs = [
    { headerName: 'Post ID', field: 'post_id', editable: true},
    { headerName: 'Title', field: 'title', editable: true },
    { headerName: 'Username', field: 'username', editable: true },
    { headerName: 'Date', field: 'date', editable: true },
  ];

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true
  }), []);

  const cellClickedListener = useCallback(e => {
    console.log('cellClicked', e);
  }, []);

  const onFilterTextBoxChanged = useCallback(() => {
    const filterText = document.getElementById("filter-text-box").value;
    setQuickFilterText(filterText);
  }, []);

  return (
    <div>
      <h1>Archives</h1>
      <div className="example-wrapper">
        <div className="example-header">
          <span>Search:</span>
          <input type="text" id="filter-text-box" placeholder="Search..." onInput={onFilterTextBoxChanged} />
        </div>
        <div className='ag-theme-alpine' style={{ height: '500px', width: '800px' }}>
          <AgGridReact
            rowData={gridData}  
            onCellClicked={cellClickedListener}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection='multiple' 
            animateRows={true}
            pagination={true}
            paginationPageSize={20}
            quickFilterText={quickFilterText}  
          />
        </div>
      </div>
    </div>
  );
}

export default ArchiveAGGrid;


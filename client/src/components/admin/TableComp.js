import React, {useCallback, useMemo, useState} from 'react'
import DataTable from 'react-data-table-component-with-filter'
import Button from 'react-bootstrap/Button'; 
import DownloadIcon from '@mui/icons-material/Download';

function TableComp(props) {

  
  function convertArrayOfObjectsToCSV(array) {
    let result;
    
    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = Object.keys(props.data[0]);
    
    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach(item => {
    	let ctr = 0;
    	keys.forEach(key => {
    		if (ctr > 0) result += columnDelimiter;

    		result += item[key];
    		
    		ctr++;
    	});
    	result += lineDelimiter;
    });

    return result;
  }
  function downloadCSV(array) {
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
    	csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
  }

  
  const Export = ({ onExport }) => <Button onClick={e => onExport(e.target.value)}><DownloadIcon/> Export to CSV</Button>;

  const actionsMemo = useMemo(() => <Export onExport={() => downloadCSV(props.data)} />, []);

  const customStyles = {
    	headRow: {
    		style: {
    			border: 'none',
                borderRadius: '5px',
                backgroundColor: 'rgb(189 206 234)'
    		},
    	},
    	headCells: {
    		style: {
    			color: '#202124',
    			fontSize: '19px',
    		},
    	},
    	rows: {
    		highlightOnHoverStyle: {
    			backgroundColor: '#f2f7ff',
    			borderBottomColor: '#FFFFFF',
    			borderRadius: '15px',
    			outline: '1px solid #FFFFFF',
    		},
    	},
    	pagination: {
    		style: {
    		},
    	},
    };

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState(props.data);

  const handleRowSelected = useCallback(state => {
    setSelectedRows(state.selectedRows);
  }, []);

  const contextActions = useMemo(() => {
    const handleDelete = () => {
        
        // if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.title)}?`)) {
        //     setToggleCleared(!toggleCleared);
        //     setData(differenceBy(data, selectedRows, 'title'));
        // }
    };

    const handleEdit = () => {
        if(selectedRows.lengh == 0 || selectedRows.length > 1) alert('Cannot edit more than one row at a time')


    }

    return (
        <div>
            
            <Button key="edit" onClick={handleEdit} style={{ backgroundColor: 'green', marginRight:'8px' }} >
                Edit
            </Button>
            <Button key="delete" onClick={handleDelete} style={{ backgroundColor: 'red' }} >
                Delete
            </Button>
        </div>
    );
  }, [data, selectedRows, toggleCleared]);

  return (
    <DataTable
        columns={props.col}
        data={data}
        
        customStyles={customStyles}
        highlightOnHover
		pointerOnHover
        pagination
        responsive
        fixedHeader
        selectableRows
        contextActions={contextActions}
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleCleared}
        fixedHeaderScrollHeight={300}
        actions={actionsMemo}
    />
  )
}

export default TableComp
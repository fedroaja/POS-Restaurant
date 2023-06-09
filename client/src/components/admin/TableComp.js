import React, { useCallback, useMemo, useState } from "react";
import DataTable from "react-data-table-component-with-filter";
import Button from "react-bootstrap/Button";
import DownloadIcon from "@mui/icons-material/Download";

function TableComp(props) {
  function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(props.data[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }
  function downloadCSV(array) {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
  }

  const Export = ({ onExport }) => (
    <Button onClick={(e) => onExport(e.target.value)}>
      <DownloadIcon /> Export to CSV
    </Button>
  );

  const actionsMemo = useMemo(
    () => <Export onExport={() => downloadCSV(props.data)} />,
    []
  );

  const customStyles = {
    headRow: {
      style: {
        border: "none",
        borderRadius: "5px",
        backgroundColor: "rgb(189 206 234)",
      },
    },
    headCells: {
      style: {
        color: "#202124",
        fontSize: "19px",
      },
    },
    rows: {
      highlightOnHoverStyle: {
        backgroundColor: "#f2f7ff",
        borderBottomColor: "#FFFFFF",
        outline: "1px solid #FFFFFF",
      },
    },
    pagination: {
      style: {},
    },
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const contextActions = useMemo(() => {
    const handleDelete = async () => {
      // if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.title)}?`)) {
      //     setToggleCleared(!toggleCleared);
      //     setData(differenceBy(data, selectedRows, 'title'));
      // }
      switch (props.fgTable) {
        case "product":
          {
            const myData = {
              productId: selectedRows.map((obj) => obj.id),
            };
            let result = await fetch(
              process.env.REACT_APP_BASE_URL + "/trans/product_delete",
              {
                method: "delete",
                body: JSON.stringify(myData),
                headers: {
                  "Content-type": "application/json;charset=UTF-8",
                },
                credentials: "include",
              }
            );
            result = await result.json().then((data) => {
              if (data.ECode !== 0) {
                alert(data.EMsg);
                return;
              }

              const resultData = props.data.filter(function (objFromA) {
                return !selectedRows.find(function (objFromB) {
                  return objFromA.id === objFromB.id;
                });
              });

              props.setData(resultData);
              setToggleCleared(!toggleCleared);
            });
          }
          break;
        case "category":
          {
            const myData = {
              ctgId: selectedRows.map((obj) => obj.ctg_id),
            };
            let result = await fetch(
              process.env.REACT_APP_BASE_URL + "/trans/ctg_delete",
              {
                method: "delete",
                body: JSON.stringify(myData),
                headers: {
                  "Content-type": "application/json;charset=UTF-8",
                },
                credentials: "include",
              }
            );
            result = await result.json().then((data) => {
              if (data.ECode !== 0) {
                alert(data.EMsg);
                return;
              }

              const resultData = props.data.filter(function (objFromA) {
                return !selectedRows.find(function (objFromB) {
                  return objFromA.ctg_id === objFromB.ctg_id;
                });
              });

              props.setData(resultData);
              setToggleCleared(!toggleCleared);
            });
          }
          break;
        case "table":
          {
            const myData = {
              tableId: selectedRows.map((obj) => obj.table_id),
            };
            let result = await fetch(
              process.env.REACT_APP_BASE_URL + "/trans/table_delete",
              {
                method: "delete",
                body: JSON.stringify(myData),
                headers: {
                  "Content-type": "application/json;charset=UTF-8",
                },
                credentials: "include",
              }
            );
            result = await result.json().then((data) => {
              if (data.ECode !== 0) {
                alert(data.EMsg);
                return;
              }

              const resultData = props.data.filter(function (objFromA) {
                return !selectedRows.find(function (objFromB) {
                  return objFromA.table_id === objFromB.table_id;
                });
              });

              props.setData(resultData);
              setToggleCleared(!toggleCleared);
            });
          }
          break;
        case "user":
          {
            const myData = {
              userId: selectedRows.map((obj) => obj.ID),
            };
            let result = await fetch(
              process.env.REACT_APP_BASE_URL + "/trans/user_delete",
              {
                method: "delete",
                body: JSON.stringify(myData),
                headers: {
                  "Content-type": "application/json;charset=UTF-8",
                },
                credentials: "include",
              }
            );
            result = await result.json().then((data) => {
              if (data.ECode !== 0) {
                alert(data.EMsg);
                return;
              }

              const resultData = props.data.filter(function (objFromA) {
                return !selectedRows.find(function (objFromB) {
                  return objFromA.ID === objFromB.ID;
                });
              });

              props.setData(resultData);
              setToggleCleared(!toggleCleared);
            });
          }
          break;
        default:
          return;
      }
    };

    const handleEdit = () => {
      if (selectedRows.lengh == 0 || selectedRows.length > 1) {
        alert("Cannot edit more than one row at a time");
        return;
      }
      switch (props.fgTable) {
        case "product":
          props.setModalProps([
            {
              title: "Edit Product",
              fgMode: "E",
              fgModal: "product",
            },
          ]);
          break;
        case "category":
          props.setModalProps([
            {
              title: "Edit Category",
              fgMode: "E",
              fgModal: "category",
            },
          ]);
          break;
        case "table":
          {
            props.setModalProps([
              {
                title: "Edit Table",
                fgMode: "E",
                fgModal: "table",
              },
            ]);
          }
          break;
        case "user":
          {
            props.setModalProps([
              {
                title: "Edit User",
                fgMode: "E",
                fgModal: "user",
              },
            ]);
          }
          break;
        default:
          return;
      }
      props.setDataEdit(selectedRows);
      props.setModalShow(true);
      setToggleCleared(!toggleCleared);
    };

    const handleReset = () => {
      if (selectedRows.lengh == 0 || selectedRows.length > 1) {
        alert("Cannot reset password more than one row at a time");
        return;
      }

      props.setModalProps([
        {
          title: "Reset Password",
          fgMode: "R",
          fgModal: "reset",
        },
      ]);
      props.setDataEdit(selectedRows);
      props.setModalShow(true);
      setToggleCleared(!toggleCleared);
    };

    return (
      <div>
        {props.fgTable == "user" ? (
          <Button
            key="reset"
            onClick={handleReset}
            style={{ backgroundColor: "#048dff", marginRight: "8px" }}
          >
            Reset Password
          </Button>
        ) : (
          ""
        )}
        <Button
          key="edit"
          onClick={handleEdit}
          style={{ backgroundColor: "green", marginRight: "8px" }}
        >
          Edit
        </Button>
        <Button
          key="delete"
          onClick={handleDelete}
          style={{ backgroundColor: "red" }}
        >
          Delete
        </Button>
      </div>
    );
  }, [props.data, selectedRows, toggleCleared]);

  return (
    <DataTable
      columns={props.col}
      data={props.data}
      paginationRowsPerPageOptions={[10]}
      customStyles={customStyles}
      highlightOnHover
      pointerOnHover
      pagination
      responsive
      fixedHeader
      selectableRows={props.fgTable != "transaction"}
      contextActions={contextActions}
      onSelectedRowsChange={handleRowSelected}
      clearSelectedRows={toggleCleared}
      fixedHeaderScrollHeight={300}
      actions={actionsMemo}
    />
  );
}

export default TableComp;

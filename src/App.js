import { useMutation, useQuery } from "@apollo/client";
import { CREATE_TODO, DELETE_TODO, UPDATE_TODO } from "../src/Graphql/Mutation";
import { getALL } from "../src/Graphql/Query";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { forwardRef } from 'react';
import MaterialTable from "material-table";
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

function App() {
  const { loading, error, data, refetch } = useQuery(getALL);
  const [createTodo] = useMutation(CREATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [todo, setTodo] = useState([]);
  useEffect(() => {
    if (!loading && data) {
      const modifiedData = data.allTodos.map(post => ({
        ...post,
        // tableData: {} // Add an empty tableData object
      }));
      setTodo(modifiedData);
    }
  }, [loading, data]);

  if (loading) return <center><h1>Loading</h1></center>;
  if (error) return <center><h1>{error.message}</h1></center>;

  const addTodo = (newData) => {
    return new Promise((resolve, reject) => {
      createTodo({
        variables: {
          title: newData.title,
          description: newData.description,
        },
      }).then(() => {
        resolve();
        refetch(); // Refresh data after adding
      }).catch((error) => {
        reject(error);
      });
    });
  };

  const removeTodo = (oldData) => {
    return new Promise((resolve, reject) => {
      deleteTodo({
        variables: {
          id: oldData.id,
        },
      }).then(() => {
        refetch(); // Refresh data after deletion
        resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  };

  const updateSingleTodo = (newData, oldData) => {
    return new Promise((resolve, reject) => {
      updateTodo({
        variables: {
          id: newData.id,
          title: newData.title,
          description: newData.description,
        },
      }).then(() => {
        refetch(); // Refresh data after update
        resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  };


  const tableIcons = {
    Add: forwardRef((props, ref) => <Button TouchRippleProps={true} variant='outlined' color='primary'>Add</Button>),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };
  console.log(data);
  var columns = [
    // { title: "id", field: "id", editable: false },
    {
      title: "Title", field: "title",
      validate: rowData => rowData.title === undefined || rowData.title === "" ? "Required" : true
    },
    {
      title: "Description", field: "description",
      cellStyle: { color: 'blue' },
      validate: rowData => rowData.description === undefined || rowData.description === "" ? "Required" : true
    },
  ]


  return (
    <div className="App" style={{ marginTop: "60px" }}>
      <h2 style={{ textAlign: "center" }}>
        Todo Details
      </h2>
      <MaterialTable
        mt={90}
        title="Todo Details"
        columns={columns}
        data={todo}
        icons={tableIcons}
     
        options={{
          selection: true,
          columnsButton: true,
          draggable: true,
          grouping: false,
          sorting: true,
          search: true,
          paging: true,
          pageSizeOptions: [5, 10, 20, 25, 50, 75, 100],
          paginationPosition: "both",
          exportButton: true,
          exportAllData: true,
          exportFileName: "Users Data",
          filtering: true,
          searchFieldAlignment: "right",
          searchAutoFocus: true,
          searchFieldVariant: "outlined",
          actionsColumnIndex: -1,
          addRowPosition: "first",
          headerStyle: {
            size: '150px',
            fontStyle: "italic", backgroundColor: "skyblue"
          },
        }}
        editable={{
          onRowUpdate: (newData, oldData) =>
          updateSingleTodo(newData, oldData),
          onRowAdd: (newData) =>
            addTodo(newData),
          onRowDelete: (oldData) =>
            removeTodo(oldData),
        }}
      />
    </div>
  );
}

export default App;
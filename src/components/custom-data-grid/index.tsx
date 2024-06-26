import { Ref, forwardRef } from 'react'
import Box from '@mui/material/Box'
import { DataGrid, DataGridProps, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { styled } from '@mui/material'

// const columns: GridColDef[] = [
//   { field: 'id', headerName: 'ID', width: 90 },
//   {
//     field: 'firstName',
//     headerName: 'First name',
//     width: 150,
//     editable: true
//   },
//   {
//     field: 'lastName',
//     headerName: 'Last name',
//     width: 150,
//     editable: true
//   },
//   {
//     field: 'age',
//     headerName: 'Age',
//     type: 'number',
//     width: 110,
//     editable: true
//   },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 160,
//     valueGetter: (params: GridValueGetterParams) => `${params.row.firstName || ''} ${params.row.lastName || ''}`
//   }
// ]

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 }
// ]

const StyleCustomGrid = styled(DataGrid)<DataGridProps>(({ theme }) => ({
  '.MuiDataGrid-withBorderColor': {
    outline: 'none !important'
  },
  '.MuiDataGrid-selectedRowCount': {
    display: 'none'
  },

  '.MuiDataGrid-columnHeaderTitle': {
    textTransform: 'capitalize',
    color: theme.palette.primary.main
  },

  '& .MuiDataGrid-columnHeaderTitleContainer': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  '& .MuiDataGrid-cell--textLeft': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}))

const CustomDataGrid = forwardRef((props: DataGridProps, ref: Ref<any>) => {
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <StyleCustomGrid
        {...props}
        // rows={rows}
        // columns={columns}
        // initialState={{
        //   pagination: {
        //     paginationModel: {
        //       pageSize: 5
        //     }
        //   }
        // }}
        // pageSizeOptions={[5]}
        // checkboxSelection
        // disableRowSelectionOnClick
      />
    </Box>
  )
})

export default CustomDataGrid

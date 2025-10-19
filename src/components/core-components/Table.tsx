import React from 'react';
import {
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableContainer as MuiTableContainer,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  Paper,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
export interface Column {
  field: string;
  headerName: string | React.ReactNode;
  renderCell?: (value: any, row: { [key: string]: any }) => React.ReactNode;
  getActions?: (row: { [key: string]: any }, rowIndex: number) => React.ReactNode;
  align?: 'center' | 'left' | 'right' | 'inherit' | 'justify' | undefined;
  style?: any;
  width?: any;
  minWidth?: any;
  maxWidth?: any;
  flex?: number | string;
  sx?: any;
}

interface ReusableTableProps {
  stickyHeader?: boolean;
  columns: Column[];
  rows: { [key: string]: any }[];
  renderOptionsCell?: (row: { [key: string]: any }) => React.ReactNode;
  lastRowRef?: React.RefObject<HTMLTableRowElement>;
  selectedRow?: number;
  onRowSelect?: (rowIndex: number) => void;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  scrollbarWidth?: string;
  headerHeight?: string | number;
  tableContainerSx?: any
}

const Table: React.FC<ReusableTableProps> = ({
  columns,
  rows,
  renderOptionsCell,
  stickyHeader,
  lastRowRef,
  onRowSelect,
  selectedRow,
  onScroll,
  scrollbarWidth,
  headerHeight,
  tableContainerSx={}
}) => {
  function handleRowClick(event: React.MouseEvent, rowIndex: number) {
    event.stopPropagation();
    onRowSelect?.(rowIndex);
  }

  return (
    <MuiTableContainer
      component={Paper}
      elevation={0}
      onScroll={onScroll}
      sx={{
        border: `1px solid #e2e8f0`,
        borderRadius: '8px',
        boxSizing: 'border-box',
        scrollbarWidth: scrollbarWidth || 'thin',
        '&::-webkit-scrollbar': {
          width: scrollbarWidth || 'thin',
        },
        bgcolor: 'white',
        ...tableContainerSx || {},
      }}
    >
      <MuiTable stickyHeader={stickyHeader}>
        <MuiTableHead>
          <MuiTableRow>
            {columns?.map(column => (
              <MuiTableCell
                key={column.field}
                align={column.align || 'left'}
                sx={{
                  width: column.width || 'auto',
                  minWidth: column.minWidth || 'auto',
                  maxWidth: column.maxWidth || 'auto',
                  height: headerHeight || 'auto',
                }}
              >
                <Typography noWrap variant="body1">
                  {column.headerName}
                </Typography>
              </MuiTableCell>
            ))}
            {renderOptionsCell && (
              <MuiTableCell key="options" align="right" sx={{ height: headerHeight || 'auto' }}>
                <Typography variant="body1">
                  <MoreVertIcon />
                </Typography>
              </MuiTableCell>
            )}
          </MuiTableRow>
        </MuiTableHead>
        <MuiTableBody>
          {rows?.map((row, rowIndex) => (
            <MuiTableRow
              onClick={event => handleRowClick(event, rowIndex)}
              ref={rowIndex === rows?.length - 1 ? lastRowRef : null}
              key={rowIndex}
              sx={{
                cursor: 'pointer',
                background:  row?.isOutDated ? '#f87171' : selectedRow === rowIndex ? '#3b82f6' : '#FFF',
                ':hover': { backgroundColor: '#3b82f6' },
                borderBottom: rowIndex !== rows.length - 1 ? `1px solid #e2e8f0` : 'none',
              }}
            >
              {columns?.map(column => (
                <MuiTableCell
                  key={column.field}
                  align={column.align || 'left'}
                  sx={{
                    paddingY: 1,
                    width: column.width || 'auto',
                    minWidth: column.minWidth || 'auto',
                    maxWidth: column.maxWidth || 'auto',
                    borderBottom:
                      rowIndex !== rows.length - 1 ? `1px solid #e2e8f0` : 'none',
                      ...(column?.sx || {})
                  }}
                >
                  {column?.renderCell
                    ? column.renderCell(row[column?.field], row)
                    : column.getActions
                      ? column.getActions(row, rowIndex)
                      : row[column.field]}
                </MuiTableCell>
              ))}
              {renderOptionsCell && (
                <MuiTableCell
                  align="right"
                  key="options"
                  sx={{
                    borderBottom:
                      rowIndex !== rows.length - 1 ? `1px solid #e2e8f0` : 'none',
                  }}
                >
                  {renderOptionsCell(row)}
                </MuiTableCell>
              )}
            </MuiTableRow>
          ))}
        </MuiTableBody>
      </MuiTable>
    </MuiTableContainer>
  );
};

export default Table;

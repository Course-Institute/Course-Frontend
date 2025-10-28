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
        border: 'none',
        borderRadius: '12px',
        boxSizing: 'border-box',
        background: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        overflow: 'auto',
        scrollbarWidth: scrollbarWidth || 'thin',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f5f9',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#cbd5e1',
          borderRadius: '4px',
          '&:hover': {
            background: '#94a3b8',
          },
        },
        ...tableContainerSx || {},
      }}
    >
      <MuiTable stickyHeader={stickyHeader}>
        <MuiTableHead>
          <MuiTableRow
            sx={{
              backgroundColor: '#f8fafc',
              borderBottom: '2px solid #e2e8f0',
              '& .MuiTableCell-head': {
                backgroundColor: '#f8fafc',
              },
            }}
          >
            {columns?.map(column => (
              <MuiTableCell
                key={column.field}
                align={column.align || 'left'}
                sx={{
                  width: column.width || 'auto',
                  minWidth: column.minWidth || 'auto',
                  maxWidth: column.maxWidth || 'auto',
                  height: headerHeight || '56px',
                  backgroundColor: '#f8fafc',
                  borderBottom: '2px solid #e2e8f0',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  padding: '16px 12px',
                }}
              >
                <Typography noWrap variant="body2" sx={{ fontWeight: 600 }}>
                  {column.headerName}
                </Typography>
              </MuiTableCell>
            ))}
            {renderOptionsCell && (
              <MuiTableCell 
                key="options" 
                align="right" 
                sx={{ 
                  height: headerHeight || '56px',
                  backgroundColor: '#f8fafc',
                  borderBottom: '2px solid #e2e8f0',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
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
                background: row?.isOutDated 
                  ? '#fef2f2' 
                  : selectedRow === rowIndex 
                    ? '#eff6ff' 
                    : rowIndex % 2 === 0 
                      ? '#FFFFFF' 
                      : '#f8fafc',
                transition: 'all 0.2s ease-in-out',
                borderBottom: rowIndex !== rows.length - 1 ? `1px solid #f1f5f9` : 'none',
                '&:hover': { 
                  backgroundColor: '#f1f5f9',
                  transform: 'translateX(2px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                },
              }}
            >
              {columns?.map(column => (
                <MuiTableCell
                  key={column.field}
                  align={column.align || 'left'}
                  sx={{
                    padding: '14px 12px',
                    width: column.width || 'auto',
                    minWidth: column.minWidth || 'auto',
                    maxWidth: column.maxWidth || 'auto',
                    borderBottom:
                      rowIndex !== rows.length - 1 ? `1px solid #f1f5f9` : 'none',
                    color: '#334155',
                    fontSize: '0.875rem',
                    fontWeight: 400,
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
                      rowIndex !== rows.length - 1 ? `1px solid #f1f5f9` : 'none',
                    padding: '14px 12px',
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

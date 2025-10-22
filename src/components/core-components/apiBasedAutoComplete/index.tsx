import React, {useState } from 'react';
import { Autocomplete, TextField, CircularProgress, Checkbox, Chip } from '@mui/material';
import type { AutocompleteRenderGetTagProps } from '@mui/material';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { getAutoCompleteList } from './genricService';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import theme from '../../../theme';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;

interface Option {
  [key: string]: any;
  name?: any;
}

interface PropsInterface {
  onSelect: (value: any, event: any) => void;
  apiPath: string;
  multiple?: boolean;
  selectedOptions?: Option[] | null | any;
  defaultData?: Option;
  searchKey?: string;
  searchedValue?: string | undefined | null;
  [key: string]: any;
  label: string;
  helperText?: string;
  freeSolo?: boolean;
  alternateKeyToPick?: string;
  showChipDeleteIcon?: boolean;
  disableCloseOnSelect?: boolean;
  blurOnSelect?: boolean;
  customRenderOptionsLabel?: (option: any) => string;
  hideClearIcon?: boolean;
  renderChip?: (option: any, tagProps: any) => React.ReactNode;
  required?: boolean;

}

const ApiBasedAutoComplete = ({
  onSelect,
  searchedValue = '',
  apiPath = '',
  searchKey = 'name',
  keyToPick,
  idKey,
  limitTags,
  label,
  defaultData = {},
  multiple,
  selectedOptions = [],
  customActionMethod = 'POST',
  hideCheckbox,
  helperText,
  freeSolo = false,
  alternateKeyToPick,
  showChipDeleteIcon = true,
  blurOnSelect = true,
  disableCloseOnSelect = false,
  customRenderOptionsLabel,
  hideClearIcon,
  renderChip,
  required,
  ...props
}: PropsInterface) => {
  const [inputValue, setInputValue] = useState<any>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const queryClient = new QueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['searchResults', apiPath, debouncedQuery],
    queryFn: () =>
      getAutoCompleteList(apiPath, customActionMethod, {
        [searchKey]: inputValue || null,
        ...defaultData,
      }),
    refetchOnWindowFocus: false,
    enabled: debouncedQuery?.length > 0,
  });

  const handleInputChange = (event: any) => {
    const value = event.target.value;
    setInputValue(value);

    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeoutId = setTimeout(() => {
      setDebouncedQuery(value);
    }, 500);

    setDebounceTimeout(timeoutId);
  };

  const handleSelect = (event: any, newValue: any) => {
    setInputValue('');
    onSelect(newValue, event);
  };

  const handleBlur = () => {
    if (freeSolo && inputValue?.trim()) {
      onSelect(inputValue.trim(), null);
    }

    if (debouncedQuery) {
      invalidateQuery();
      setInputValue('');
    }
  };

  const invalidateQuery = () => {
    queryClient.removeQueries({ queryKey: ['searchResults', apiPath, debouncedQuery] });
    setDebouncedQuery('');
  };

  const options = data?.data || [];

  const handleFocus = () => {
    refetch();
  };
  return (
    <Autocomplete
      onChange={handleSelect}
      options={options}
      value={selectedOptions}
      blurOnSelect={blurOnSelect}
      multiple={multiple}
      freeSolo={freeSolo}
      limitTags={limitTags || -1}
      filterOptions={opts => opts}
      clearIcon={hideClearIcon ? null : undefined}
      disableCloseOnSelect={disableCloseOnSelect}
      getOptionLabel={(option: any) => {
        if (typeof option === 'string') return option;
        
        if (customRenderOptionsLabel) {
          return customRenderOptionsLabel(option);
        }
        
        return `${option?.[keyToPick] || ''}`;
      }}
      isOptionEqualToValue={(option, value) => option?.[idKey] === value?.[idKey]}
      renderOption={(props, option, { selected }) => {
        let label = '';
        if (customRenderOptionsLabel) {
          label = customRenderOptionsLabel(option);
        } else {
          label = (keyToPick && option && option[keyToPick])
            ? option[keyToPick]
            : (alternateKeyToPick && option && option[alternateKeyToPick])
              ? option[alternateKeyToPick]
              : '';
        }
        return (
        <li {...props} key={option?.[idKey]}>
          {multiple && !hideCheckbox && (
            <span>
              <Checkbox 
                icon={icon} 
                checked={selected} 
                style={{ marginRight: 8 }}
                sx={{
                  '&.Mui-checked': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            </span>
          )}
          <span>{label}</span>
        </li>
        );
      }}
      renderTags={(
        value: any[],
        getTagProps: AutocompleteRenderGetTagProps
      ) =>
        
        value.map((option, index) => {
          let label = '';
          if (customRenderOptionsLabel) {
            label = customRenderOptionsLabel(option);
          } else {
            label = (keyToPick && option && option[keyToPick])
              ? option[keyToPick]
              : (alternateKeyToPick && option && option[alternateKeyToPick])
                ? option[alternateKeyToPick]
                : '';
          }
          const tagProps = getTagProps({ index });
              if (renderChip) {
              return renderChip(option, tagProps);
            }
          const { key: _omitKey, ...restTagProps } = tagProps;
          return (
            <Chip
              key={option?.[idKey] || index}
              label={label}
              {...(showChipDeleteIcon ? restTagProps : { ...restTagProps, onDelete: undefined })}
            />
          );
        })
      }
      renderInput={params => (
        <>
       <TextField
            {...params}
            label={label}
            variant={props?.variant || 'outlined'}
            size={props?.size || 'medium'} 
            fullWidth
            onBlur={handleBlur}
            onChange={value => handleInputChange(value)}
            value={params.inputProps}
            error={props?.error}
            required={required}
            helperText={helperText}
            onFocus={handleFocus}
            InputProps={{
              ...params.InputProps, 
              ...props?.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    params.InputProps.endAdornment
                  )}
                </React.Fragment>
              ),
            }}
          />
      </>
      )}
      noOptionsText={
        isLoading
          ? 'Loading...'
          : isError
            ? 'Error fetching data'
            : options.length === 0
              ? 'No results found'
              : 'Type to search'
      }
      {...props}
    />
  );
};

export default ApiBasedAutoComplete;

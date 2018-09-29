import React from 'react';
import { string, func, element, oneOfType } from 'prop-types';
import PapaParse from 'papaparse';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
// const PapaParse = require('papaparse/papaparse.min.js');

const CSVReader = ({
  cssClass = 'csv-reader-input',
  label,
  onFileLoaded,
  onError,
  inputId = null,
}) => {
  const handleChangeFile = e => {
    let reader = new FileReader();
    const filename = e.target.files[0].name;

    reader.onload = event => {
      const csvData = PapaParse.parse(event.target.result, {
        error: onError,
        header: true,
      });
      console.log('csvData', csvData);
      onFileLoaded(csvData.data, csvData.meta, filename);
    };

    reader.readAsText(e.target.files[0]);
  };

  return (
    <div className={cssClass}>
      {label && <FormLabel htmlFor={inputId}>{label}</FormLabel>}
      <input
        id={inputId}
        type="file"
        onChange={e => handleChangeFile(e)}
        accept="text/csv"
        style={{
          width: 0,
          height: 0,
          opacity: 0,
          overflow: 'hidden',
          position: 'absolute',
          zIndex: 1,
        }}
      />
      <Button
        component="label"
        variant="outlined"
        size="small"
        color="primary"
        htmlFor={inputId}
        disableRipple={true}
        style={{
          marginLeft: '1rem',
        }}
      >
        Choose file
      </Button>
    </div>
  );
};

CSVReader.propTypes = {
  cssClass: string,
  label: oneOfType([string, element]),
  onFileLoaded: func,
  onError: func,
  inputId: string,
};

export default CSVReader;

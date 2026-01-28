import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Spinner } from 'react-bootstrap';

function SearchInput({
  placeholder = 'Search...',
  onSearch,
  loading = false,
  debounceMs = 300,
}) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value.trim()) {
        onSearch(value.trim());
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, onSearch]);

  return (
    <InputGroup>
      <Form.Control
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {loading && (
        <InputGroup.Append>
          <InputGroup.Text>
            <Spinner animation="border" size="sm" />
          </InputGroup.Text>
        </InputGroup.Append>
      )}
    </InputGroup>
  );
}

export default SearchInput;

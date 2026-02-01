import React from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';

function SearchBar({ searchQuery, onChange, onSubmit }) {
  return (
    <Form onSubmit={onSubmit} className="mb-4">
      <Row>
        <Col md={6} lg={5}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search apps by name, CMDB ID, or description..."
              value={searchQuery}
              onChange={onChange}
              style={{ fontSize: '0.9375rem' }}
            />
            <Button variant="dark" type="submit">
              Search
            </Button>
          </InputGroup>
        </Col>
      </Row>
    </Form>
  );
}

export default SearchBar;

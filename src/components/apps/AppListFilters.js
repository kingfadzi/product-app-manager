import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

const RESCAT_OPTIONS = ['Critical', 'High', 'Medium', 'Low'];

function AppListFilters({
  searchTerm,
  setSearchTerm,
  stackFilter,
  productFilter,
  tcFilter,
  resCatFilter,
  stacks,
  productOptions,
  tcOptions,
  updateFilter
}) {
  return (
    <Row className="mb-3 g-2">
      <Col xs={12} sm={6} lg={3}>
        <Form.Control
          type="text"
          placeholder="Search apps..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Col>
      <Col xs={6} sm={3} lg={2}>
        <FilterSelect
          value={stackFilter}
          onChange={(v) => updateFilter('stack', v)}
          placeholder="All Stacks"
          options={stacks.map(s => ({ id: s, name: s }))}
        />
      </Col>
      <Col xs={6} sm={3} lg={2}>
        <FilterSelect
          value={productFilter}
          onChange={(v) => updateFilter('product', v)}
          placeholder="All Products"
          options={productOptions}
        />
      </Col>
      <Col xs={6} sm={3} lg={2}>
        <FilterSelect
          value={tcFilter}
          onChange={(v) => updateFilter('tc', v)}
          placeholder="All TCs"
          options={tcOptions}
        />
      </Col>
      <Col xs={6} sm={3} lg={2}>
        <FilterSelect
          value={resCatFilter}
          onChange={(v) => updateFilter('resCat', v)}
          placeholder="All ResCat"
          options={RESCAT_OPTIONS.map(r => ({ id: r, name: r }))}
        />
      </Col>
    </Row>
  );
}

function FilterSelect({ value, onChange, placeholder, options }) {
  return (
    <Form.Control
      as="select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt.id} value={opt.id}>{opt.name}</option>
      ))}
    </Form.Control>
  );
}

export default AppListFilters;

import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

const RESCAT_OPTIONS = ['Critical', 'High', 'Medium', 'Low'];

function AppListFilters({
  stackFilter,
  productFilter,
  tcFilter,
  tierFilter,
  resCatFilter,
  stacks,
  productOptions,
  tcOptions,
  tierOptions,
  updateFilter,
  showTcFilter = true
}) {
  return (
    <Row className="mb-3 g-2">
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
      {showTcFilter && (
        <Col xs={6} sm={3} lg={2}>
          <FilterSelect
            value={tcFilter}
            onChange={(v) => updateFilter('tc', v)}
            placeholder="All TCs"
            options={tcOptions}
          />
        </Col>
      )}
      <Col xs={6} sm={3} lg={2}>
        <FilterSelect
          value={tierFilter}
          onChange={(v) => updateFilter('tier', v)}
          placeholder="All Tiers"
          options={tierOptions.map(t => ({ id: t, name: t }))}
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

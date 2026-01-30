import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Card, Table, Form, Alert } from 'react-bootstrap';
import StepIndicator from '../../common/StepIndicator';
import { getHealthColor } from './helpers';
import { outcomesApi } from '../../../services/api';

const INITIAL_WIZARD_DATA = {
  productDeltaDoc: '',
  architectureDeltaDoc: '',
  serviceVisionDeltaDoc: '',
  questionnaire: {
    impactsData: '',
    impactsSecurity: '',
    impactsAccessibility: '',
    requiresArchReview: '',
    deploymentStrategy: ''
  },
  selectedGuilds: []
};

function BusinessOutcomeModal({ show, outcome, guildSmes, onHide, readOnly }) {
  const [viewMode, setViewMode] = useState('review');
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState(INITIAL_WIZARD_DATA);

  const loadEngagementData = useCallback(async () => {
    if (!outcome) return;
    try {
      const savedData = await outcomesApi.getEngagement(outcome.id);
      setWizardData({
        productDeltaDoc: savedData.productDeltaDoc || savedData.product_delta_doc || '',
        architectureDeltaDoc: savedData.architectureDeltaDoc || savedData.architecture_delta_doc || '',
        serviceVisionDeltaDoc: savedData.serviceVisionDeltaDoc || savedData.service_vision_delta_doc || '',
        questionnaire: savedData.questionnaire || INITIAL_WIZARD_DATA.questionnaire,
        selectedGuilds: savedData.selectedGuilds || savedData.selected_guilds || []
      });
    } catch (err) {
      console.error('Error fetching outcome engagement:', err);
      setWizardData(INITIAL_WIZARD_DATA);
    }
  }, [outcome]);

  useEffect(() => {
    if (show && outcome) {
      setViewMode('review');
      setWizardStep(1);
      loadEngagementData();
    }
  }, [show, outcome, loadEngagementData]);

  const handleClose = () => {
    setViewMode('review');
    setWizardStep(1);
    onHide();
  };

  const handleSave = async () => {
    if (!outcome) return;
    try {
      await outcomesApi.saveEngagement(outcome.id, wizardData);
      setViewMode('review');
    } catch (err) {
      console.error('Error saving outcome engagement:', err);
    }
  };

  const toggleGuild = (guildId) => {
    setWizardData(prev => ({
      ...prev,
      selectedGuilds: prev.selectedGuilds.includes(guildId)
        ? prev.selectedGuilds.filter(id => id !== guildId)
        : [...prev.selectedGuilds, guildId]
    }));
  };

  if (!outcome) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <div className="d-flex justify-content-between align-items-center w-100" style={{ paddingRight: '1rem' }}>
          <Modal.Title style={{ fontSize: '1rem', fontWeight: 600 }}>
            {outcome.id} - {outcome.summary}
          </Modal.Title>
          {viewMode === 'review' && !readOnly && (
            <Button variant="outline-primary" size="sm" onClick={() => setViewMode('edit')}>
              Guild Engagement
            </Button>
          )}
        </div>
      </Modal.Header>
      <Modal.Body style={{ paddingTop: '0.5rem' }}>
        {viewMode === 'review' ? (
          <ReviewMode outcome={outcome} wizardData={wizardData} guildSmes={guildSmes} />
        ) : (
          <EditMode
            outcome={outcome}
            wizardData={wizardData}
            setWizardData={setWizardData}
            wizardStep={wizardStep}
            guildSmes={guildSmes}
            toggleGuild={toggleGuild}
          />
        )}
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'space-between' }}>
        {viewMode === 'review' ? (
          <>
            <div />
            <Button variant="secondary" onClick={handleClose} style={{ fontSize: '0.875rem' }}>
              Close
            </Button>
          </>
        ) : (
          <>
            {wizardStep > 1 ? (
              <Button variant="outline-secondary" onClick={() => setWizardStep(s => s - 1)} style={{ fontSize: '0.875rem' }}>
                ← Back
              </Button>
            ) : <div />}
            <div>
              <Button variant="secondary" onClick={() => setViewMode('review')} className="mr-2" style={{ fontSize: '0.875rem' }}>
                Cancel
              </Button>
              {wizardStep < 4 ? (
                <Button variant="dark" onClick={() => setWizardStep(s => s + 1)} style={{ fontSize: '0.875rem' }}>
                  Next →
                </Button>
              ) : (
                <Button
                  variant="success"
                  onClick={handleSave}
                  style={{ fontSize: '0.875rem' }}
                  disabled={wizardData.selectedGuilds.length === 0}
                >
                  Submit Request
                </Button>
              )}
            </div>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}

function ReviewMode({ outcome, wizardData, guildSmes }) {
  return (
    <div>
      <DetailsCard outcome={outcome} />
      <DeltaDocCard wizardData={wizardData} />
      <GuildAssessmentCard wizardData={wizardData} />
      <AssignedGuildsCard wizardData={wizardData} guildSmes={guildSmes} />
    </div>
  );
}

function DetailsCard({ outcome }) {
  return (
    <Card className="mb-3">
      <Card.Header style={{ background: 'none' }}><strong>Details</strong></Card.Header>
      <Card.Body>
        <Table size="sm" className="mb-0" borderless>
          <tbody>
            <tr>
              <td className="text-muted" style={{ width: '120px' }}>Fix Releases</td>
              <td>
                {(outcome.fixReleases || []).length > 0
                  ? outcome.fixReleases.map((release, i) => (
                      <span key={release}>
                        {i > 0 && ', '}
                        <a href={`https://jira.example.com/issues/?jql=fixVersion="${release}"`} target="_blank" rel="noopener noreferrer">{release}</a>
                      </span>
                    ))
                  : '-'}
              </td>
              <td className="text-muted" style={{ width: '120px' }}>Status</td>
              <td>{outcome.status}</td>
            </tr>
            <tr>
              <td className="text-muted">Navigator ID</td>
              <td>
                {outcome.navigatorId
                  ? <a href={`https://navigator.example.com/${outcome.navigatorId}`} target="_blank" rel="noopener noreferrer">{outcome.navigatorId}</a>
                  : '-'}
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="text-muted">Description</td>
              <td colSpan={3}>{outcome.description}</td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

function DeltaDocCard({ wizardData }) {
  return (
    <Card className="mb-3">
      <Card.Header style={{ background: 'none' }}><strong>Delta Documentation</strong></Card.Header>
      <Card.Body>
        <Table size="sm" className="mb-0" borderless>
          <tbody>
            <DocRow label="Product Delta" url={wizardData.productDeltaDoc} />
            <DocRow label="Architecture Delta" url={wizardData.architectureDeltaDoc} />
            <DocRow label="Service Vision Delta" url={wizardData.serviceVisionDeltaDoc} />
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

function DocRow({ label, url }) {
  return (
    <tr>
      <td className="text-muted" style={{ width: '150px' }}>{label}</td>
      <td>
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">View Document &rarr;</a>
        ) : (
          <span className="text-muted">Not provided</span>
        )}
      </td>
    </tr>
  );
}

function GuildAssessmentCard({ wizardData }) {
  const { questionnaire } = wizardData;
  const formatYesNo = (val) => val === 'yes' ? 'Yes' : val === 'no' ? 'No' : '—';
  const formatStrategy = (val) => {
    if (val === 'standard') return 'Standard Release';
    if (val === 'hotfix') return 'Hotfix';
    if (val === 'feature-flag') return 'Feature Flag';
    return '—';
  };

  return (
    <Card className="mb-3">
      <Card.Header style={{ background: 'none' }}><strong>Guild Engagement Assessment</strong></Card.Header>
      <Card.Body>
        <Table size="sm" className="mb-0" borderless>
          <tbody>
            <tr>
              <td className="text-muted" style={{ width: '150px' }}>Impacts Data</td>
              <td>{formatYesNo(questionnaire.impactsData)}</td>
              <td className="text-muted" style={{ width: '150px' }}>Arch Review</td>
              <td>{formatYesNo(questionnaire.requiresArchReview)}</td>
            </tr>
            <tr>
              <td className="text-muted">Impacts Security</td>
              <td>{formatYesNo(questionnaire.impactsSecurity)}</td>
              <td className="text-muted">Deploy Strategy</td>
              <td>{formatStrategy(questionnaire.deploymentStrategy)}</td>
            </tr>
            <tr>
              <td className="text-muted">Impacts Accessibility</td>
              <td>{formatYesNo(questionnaire.impactsAccessibility)}</td>
              <td></td><td></td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

function AssignedGuildsCard({ wizardData, guildSmes }) {
  const assignedSmes = guildSmes.filter(sme => wizardData.selectedGuilds.includes(sme.id));

  return (
    <Card>
      <Card.Header style={{ background: 'none' }}><strong>Assigned Guilds</strong></Card.Header>
      <Card.Body>
        {assignedSmes.length === 0 ? (
          <p className="text-muted mb-0">No guilds assigned</p>
        ) : (
          <Table size="sm" className="mb-0" borderless>
            <tbody>
              {assignedSmes.map(sme => (
                <tr key={sme.id}>
                  <td><a href={`mailto:${sme.email}`}>{sme.name}</a></td>
                  <td>{sme.guild}</td>
                  <td style={{ width: '30px', textAlign: 'center' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: getHealthColor(sme.health) }} />
                  </td>
                  <td style={{ width: '30px', textAlign: 'center' }}>
                    {sme.blocked ? <span style={{ color: '#dc3545' }}>&#x26D4;</span> : <span style={{ color: '#28a745' }}>&#x2713;</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

function EditMode({ outcome, wizardData, setWizardData, wizardStep, guildSmes, toggleGuild }) {
  return (
    <>
      <StepIndicator steps={['Details', 'Changes', 'Questionnaire', 'Request']} currentStep={wizardStep} />
      {wizardStep === 1 && <Step1Details outcome={outcome} />}
      {wizardStep === 2 && <Step2Changes wizardData={wizardData} setWizardData={setWizardData} />}
      {wizardStep === 3 && <Step3Questionnaire wizardData={wizardData} setWizardData={setWizardData} />}
      {wizardStep === 4 && <Step4Request wizardData={wizardData} guildSmes={guildSmes} toggleGuild={toggleGuild} />}
    </>
  );
}

function Step1Details({ outcome }) {
  return (
    <div>
      <h6 className="mb-3">Business Outcome Details</h6>
      <table className="table table-sm table-borderless">
        <tbody>
          <tr>
            <td className="text-muted" style={{ width: '140px' }}>Fix Releases</td>
            <td>
              {(outcome.fixReleases || []).length > 0
                ? outcome.fixReleases.map((release, i) => (
                    <span key={release}>
                      {i > 0 && ', '}
                      <a href={`https://jira.example.com/issues/?jql=fixVersion="${release}"`} target="_blank" rel="noopener noreferrer">{release}</a>
                    </span>
                  ))
                : '-'}
            </td>
          </tr>
          <tr><td className="text-muted">Description</td><td>{outcome.description}</td></tr>
          <tr>
            <td className="text-muted">Navigator ID</td>
            <td>
              {outcome.navigatorId
                ? <a href={`https://navigator.example.com/${outcome.navigatorId}`} target="_blank" rel="noopener noreferrer">{outcome.navigatorId}</a>
                : '-'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function Step2Changes({ wizardData, setWizardData }) {
  return (
    <div>
      <h6 className="mb-3">Add Changes to Application</h6>
      <p className="text-muted small">Add delta documentation links for this change.</p>
      <Form.Group className="mb-3">
        <Form.Label>Product Delta Doc</Form.Label>
        <Form.Control type="url" placeholder="https://confluence.example.com/..." value={wizardData.productDeltaDoc} onChange={(e) => setWizardData({ ...wizardData, productDeltaDoc: e.target.value })} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Architecture Delta Doc</Form.Label>
        <Form.Control type="url" placeholder="https://confluence.example.com/..." value={wizardData.architectureDeltaDoc} onChange={(e) => setWizardData({ ...wizardData, architectureDeltaDoc: e.target.value })} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Service Vision Delta Doc</Form.Label>
        <Form.Control type="url" placeholder="https://confluence.example.com/..." value={wizardData.serviceVisionDeltaDoc} onChange={(e) => setWizardData({ ...wizardData, serviceVisionDeltaDoc: e.target.value })} />
      </Form.Group>
    </div>
  );
}

function Step3Questionnaire({ wizardData, setWizardData }) {
  const updateQ = (key, value) => setWizardData({ ...wizardData, questionnaire: { ...wizardData.questionnaire, [key]: value } });

  return (
    <div>
      <h6 className="mb-3">Guild Engagement Questionnaire</h6>
      <p className="text-muted small">Answer the following to determine required guild engagements.</p>
      <QuestionSelect label="Does this change impact data architecture?" value={wizardData.questionnaire.impactsData} onChange={(v) => updateQ('impactsData', v)} />
      <QuestionSelect label="Does this change have security implications?" value={wizardData.questionnaire.impactsSecurity} onChange={(v) => updateQ('impactsSecurity', v)} />
      <QuestionSelect label="Does this change impact accessibility?" value={wizardData.questionnaire.impactsAccessibility} onChange={(v) => updateQ('impactsAccessibility', v)} />
      <QuestionSelect label="Does this require architecture review?" value={wizardData.questionnaire.requiresArchReview} onChange={(v) => updateQ('requiresArchReview', v)} />
      <Form.Group className="mb-3">
        <Form.Label>Deployment strategy</Form.Label>
        <Form.Control as="select" value={wizardData.questionnaire.deploymentStrategy} onChange={(e) => updateQ('deploymentStrategy', e.target.value)}>
          <option value="">Select...</option>
          <option value="standard">Standard Release</option>
          <option value="hotfix">Hotfix</option>
          <option value="feature-flag">Feature Flag</option>
        </Form.Control>
      </Form.Group>
    </div>
  );
}

function QuestionSelect({ label, value, onChange }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control as="select" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select...</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Form.Control>
    </Form.Group>
  );
}

function Step4Request({ wizardData, guildSmes, toggleGuild }) {
  return (
    <div>
      <h6 className="mb-3">Request Guild Engagement</h6>
      <p className="text-muted small">Select the guild members you want to engage with:</p>
      {guildSmes.map(sme => {
        const isRecommended = isGuildRecommended(sme.guild, wizardData.questionnaire);
        return (
          <Form.Check
            key={sme.id}
            type="checkbox"
            id={`sme-${sme.id}`}
            className="mb-2"
            checked={wizardData.selectedGuilds.includes(sme.id)}
            onChange={() => toggleGuild(sme.id)}
            label={
              <span>
                {sme.name} <span className="text-muted">({sme.guild})</span>
                {isRecommended && <span className="text-success ml-2" style={{ fontSize: '12px' }}>(Recommended)</span>}
              </span>
            }
          />
        );
      })}
      {wizardData.selectedGuilds.length > 0 && (
        <Alert variant="info" className="mt-3">
          Click "Submit Request" to notify {wizardData.selectedGuilds.length} guild member(s) and create engagement tickets.
        </Alert>
      )}
    </div>
  );
}

function isGuildRecommended(guild, questionnaire) {
  if (guild === 'Data' && questionnaire.impactsData === 'yes') return true;
  if (guild === 'Security' && questionnaire.impactsSecurity === 'yes') return true;
  if (guild === 'Accessibility' && questionnaire.impactsAccessibility === 'yes') return true;
  if (guild === 'Ent. Architecture' && questionnaire.requiresArchReview === 'yes') return true;
  if (guild === 'Srv. Transition' && questionnaire.deploymentStrategy) return true;
  return false;
}

export default BusinessOutcomeModal;

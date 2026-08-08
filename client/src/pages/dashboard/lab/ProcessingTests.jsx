import LabTestList from './LabTestList.jsx';
export default function ProcessingTests() {
  return <LabTestList title="Processing Tests" description="Tests with collected samples currently being processed in the lab." statusFilter="sample_collected" />;
}

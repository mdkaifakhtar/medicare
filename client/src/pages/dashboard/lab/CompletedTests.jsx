import LabTestList from './LabTestList.jsx';
export default function CompletedTests() {
  return <LabTestList title="Completed Tests" description="Tests with reports uploaded, awaiting verification and approval." statusFilter="completed" />;
}

import LabTestList from './LabTestList.jsx';
export default function PendingTests() {
  return <LabTestList title="Pending Tests" description="All tests that have been requested and are awaiting sample collection." statusFilter="pending" />;
}

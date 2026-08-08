import LabTestList from './LabTestList.jsx';
export default function SampleCollection() {
  return <LabTestList title="Sample Collection" description="Tests awaiting sample collection. Collect samples to move them to processing." statusFilter="pending" />;
}

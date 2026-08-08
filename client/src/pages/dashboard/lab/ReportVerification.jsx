import LabTestList from './LabTestList.jsx';
export default function ReportVerification() {
  return <LabTestList title="Report Verification" description="Reports uploaded by technicians awaiting verification before final approval." statusFilter="completed" />;
}

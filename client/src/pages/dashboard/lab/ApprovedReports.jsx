import LabTestList from './LabTestList.jsx';
export default function ApprovedReports() {
  return <LabTestList title="Approved Reports" description="All approved lab reports ready for download and patient delivery." statusFilter="approved" />;
}

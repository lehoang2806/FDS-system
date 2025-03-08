import { Button, Card, Table } from "flowbite-react";
import { FaUser, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import '../../../assets/css/staff/StaffUserDetailPage.scss'
export default function StaffUserDetailPage() {
    return (
        <div className="page-container">
            <div className="card-wrapper">
                <Card className="user-card">
                    <h2 className="card-title">View User</h2>

                    <div className="user-info">
                        <div className="info-block">
                            <p className="label">User Status:</p>
                            <p className="value">Active</p>
                        </div>
                        <div className="info-block">
                            <p className="label">Registration Date:</p>
                            <p className="value">
                                <FaCalendarAlt className="icon" /> Tuesday, February 25, 2025
                            </p>
                        </div>
                    </div>

                    <div className="user-details">
                        <p className="section-title">User Information:</p>
                        <div className="details-grid">
                            <p><FaUser className="icon" /> <b>Tên:</b> John Doe</p>
                            <p><b>Email:</b> johndoe@example.com</p>
                            <p><b>Role:</b> Admin</p>
                            <p><b>Sdt:</b> +123456789</p>
                            <p><b>Address:</b> 123 Main St</p>
                            <p><b>Birth Day:</b> 01/01/1990</p>
                        </div>
                    </div>

                    <div className="certificate-section">
                        <p className="section-title">User Certificate:</p>
                        <Table className="user-table">
                            <Table.Head>
                                <Table.HeadCell>Image Certificate</Table.HeadCell>
                                <Table.HeadCell>Status</Table.HeadCell>
                                <Table.HeadCell>Application Date</Table.HeadCell>
                                <Table.HeadCell>View Certificate</Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>Courage</Table.Cell>
                                    <Table.Cell>10</Table.Cell>
                                    <Table.Cell>9</Table.Cell>
                                    <Table.Cell>90</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </div>

                    <div className="button-container">
                        <Button href="/users" className="custom-back-button">
                            <FaArrowLeft className="icon" /> Back to User
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}

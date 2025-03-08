import { Button, Card, Table, ToggleSwitch, Pagination } from "flowbite-react";
import { Breadcrumb } from "flowbite-react";
import { useState } from "react";
import { FiUsers, FiSearch, FiEdit3, FiCheckCircle, FiXCircle } from "react-icons/fi";
import "../../../assets/css/staff/StaffUserListPage.scss"; // Import SCSS

export default function StaffUserListPage() {
    const [status, setStatus] = useState({
        user1: true,
        user2: false,
        user3: true,
        user4: false,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 3;

    const users = [
        { id: 101, name: "A", email: "a@gmail.com", role: "Recipient", key: "user1" },
        { id: 102, name: "B", email: "b@gmail.com", role: "Donor", key: "user2" },
        { id: 103, name: "C", email: "c@gmail.com", role: "Recipient", key: "user3" },
        { id: 104, name: "D", email: "d@gmail.com", role: "Donor", key: "user4" },
        { id: 105, name: "E", email: "e@gmail.com", role: "Recipient", key: "user5" },
    ];

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div className="staff-user-detail">
            {/* Breadcrumb */}
            <Breadcrumb aria-label="Default breadcrumb example">
                <Breadcrumb.Item href="/dashboard">
                    <FiUsers className="breadcrumb-icon" /> Dashboard
                </Breadcrumb.Item>
                <Breadcrumb.Item>View User</Breadcrumb.Item>
            </Breadcrumb>

            {/* Statistics Cards */}
            <div className="stats-container">
                <Card className="stat-card blue">
                    <FiUsers className="stat-icon" />
                    <p className="stat-title">Total</p>
                    <p className="stat-number">7 Users</p>
                </Card>
                <Card className="stat-card red">
                    <FiXCircle className="stat-icon" />
                    <p className="stat-title">Inactive</p>
                    <p className="stat-number">3 Users</p>
                </Card>
                <Card className="stat-card green">
                    <FiCheckCircle className="stat-icon" />
                    <p className="stat-title">Recipient</p>
                    <p className="stat-number">3 Users</p>
                </Card>
                <Card className="stat-card yellow">
                    <FiUsers className="stat-icon" />
                    <p className="stat-title">Donor</p>
                    <p className="stat-number">1 User</p>
                </Card>
            </div>

            {/* User Table */}
            <Card className="user-card">
                <h2 className="card-title">User Management</h2>
                <div className="search-container">
                    <FiSearch className="search-icon" />
                    <input type="text" placeholder="Search User" className="search-input" />
                </div>

                <Table className="user-table">
                    <Table.Head>
                        <Table.HeadCell>ID</Table.HeadCell>
                        <Table.HeadCell>Username</Table.HeadCell>
                        <Table.HeadCell>Email</Table.HeadCell>
                        <Table.HeadCell>Role</Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
                        <Table.HeadCell>Action</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {currentUsers.map((user) => (
                            <Table.Row key={user.id} className="table-row">
                                <Table.Cell>{user.id}</Table.Cell>
                                <Table.Cell>{user.name}</Table.Cell>
                                <Table.Cell>{user.email}</Table.Cell>
                                <Table.Cell>{user.role}</Table.Cell>
                                <Table.Cell>
                                    <ToggleSwitch
                                        checked={status[user.key]}
                                        onChange={() =>
                                            setStatus((prev) => ({ ...prev, [user.key]: !prev[user.key] }))
                                        }
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Button size="xs" className="edit-btn">
                                        <FiEdit3 className="edit-icon" /> Edit
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>

                {/* Pagination */}
                <div className="pagination-container">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(users.length / usersPerPage)}
                        onPageChange={(page) => setCurrentPage(page)}
                        showIcons
                    />
                </div>
            </Card>
        </div>
    );
}

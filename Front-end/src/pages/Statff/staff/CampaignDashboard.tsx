import { Button, Card, Badge, Table, Pagination } from "flowbite-react";
import { useState } from "react";
import { HiOutlineEye } from "react-icons/hi";
import styles from "../../../assets/css/staff/StaffCampaignDashboard.module.scss"; // Import SCSS

export default function StaffCampaignDashboard() {
    const [currentPage, setCurrentPage] = useState(1);

    const campaigns = [
        { id: 101, name: "A", address: "A@gmail.com", quantity: "Recipient", status: "Approve" },
        { id: 102, name: "A", address: "A@gmail.com", quantity: "Donor", status: "Reject" },
        { id: 103, name: "A", address: "A@gmail.com", quantity: "Donor", status: "Reject" },
        { id: 104, name: "A", address: "A@gmail.com", quantity: "Recipient", status: "Pending" },
        { id: 105, name: "A", address: "A@gmail.com", quantity: "Donor", status: "Approve" },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Campaign</h2>
                <Button className={styles.createButton}>Create Campaign</Button>
            </div>

            <div className={styles.stats}>
                <Card><span>Total</span> <Badge color="indigo">7 Campaigns</Badge></Card>
                <Card><span>Reject</span> <Badge color="red">3 Campaigns</Badge></Card>
                <Card><span>Approve</span> <Badge color="green">3 Campaigns</Badge></Card>
                <Card><span>Pending</span> <Badge color="yellow">1 Campaign</Badge></Card>
            </div>

            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell>Id</Table.HeadCell>
                    <Table.HeadCell>Name</Table.HeadCell>
                    <Table.HeadCell>Address</Table.HeadCell>
                    <Table.HeadCell>Quantity</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>Action</Table.HeadCell>
                </Table.Head>
                <Table.Body className={styles.tableBody}>
                    {campaigns.map((campaign) => (
                        <Table.Row key={campaign.id} className={styles.tableRow}>
                            <Table.Cell>{campaign.id}</Table.Cell>
                            <Table.Cell>{campaign.name}</Table.Cell>
                            <Table.Cell>{campaign.address}</Table.Cell>
                            <Table.Cell>{campaign.quantity}</Table.Cell>
                            <Table.Cell>
                                <Badge className={styles[campaign.status.toLowerCase()]}>
                                    {campaign.status}
                                </Badge>
                            </Table.Cell>
                            <Table.Cell>
                                <Button className={styles.actionButton}>
                                    <HiOutlineEye className={styles.icon} />
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>

            <div className={styles.pagination}>
                <Pagination currentPage={currentPage} totalPages={2} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
}

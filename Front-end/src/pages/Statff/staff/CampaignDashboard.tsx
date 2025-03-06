import { Button, Card, Badge, Table, Pagination } from 'flowbite-react';
import { useState } from 'react';
import { HiOutlineEye } from 'react-icons/hi';

export default function StaffCampaignDashboard() {
    const [currentPage, setCurrentPage] = useState(1);

    const campaigns = [
        { id: 101, name: 'A', address: 'A@gmail.com', quantity: 'Recipient', status: 'Approve' },
        { id: 102, name: 'A', address: 'A@gmail.com', quantity: 'Donor', status: 'Reject' },
        { id: 103, name: 'A', address: 'A@gmail.com', quantity: 'Donor', status: 'Reject' },
        { id: 104, name: 'A', address: 'A@gmail.com', quantity: 'Recipient', status: 'Pending' },
        { id: 105, name: 'A', address: 'A@gmail.com', quantity: 'Donor', status: 'Approve' },
    ];

    const statusColors = {
        Approve: 'green',
        Reject: 'red',
        Pending: 'yellow',
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Campaign</h2>
                <Button color="purple">Create Campaign</Button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
                <Card><span className="text-lg">Total</span> <Badge color="indigo">7 Campaigns</Badge></Card>
                <Card><span className="text-lg">Reject</span> <Badge color="red">3 Campaigns</Badge></Card>
                <Card><span className="text-lg">Approve</span> <Badge color="green">3 Campaigns</Badge></Card>
                <Card><span className="text-lg">Pending</span> <Badge color="yellow">1 Campaign</Badge></Card>
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
                <Table.Body className="divide-y">
                    {campaigns.map((campaign) => (
                        <Table.Row key={campaign.id} className="bg-white">
                            <Table.Cell>{campaign.id}</Table.Cell>
                            <Table.Cell>{campaign.name}</Table.Cell>
                            <Table.Cell>{campaign.address}</Table.Cell>
                            <Table.Cell>{campaign.quantity}</Table.Cell>
                            <Table.Cell>
                                <Badge color={statusColors[campaign.status as keyof typeof statusColors]}>
                                    {campaign.status}
                                </Badge>

                            </Table.Cell>
                            <Table.Cell>
                                <Button color="light">
                                    <HiOutlineEye className="h-5 w-5" />
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>

            <div className="flex justify-end mt-4">
                <Pagination currentPage={currentPage} totalPages={2} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
}

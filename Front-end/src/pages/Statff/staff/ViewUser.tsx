import { Button, Card, Table } from 'flowbite-react';
import { Breadcrumb } from 'flowbite-react';

export default function ViewUser() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Breadcrumb aria-label="Default breadcrumb example">
        <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>View User</Breadcrumb.Item>
      </Breadcrumb>
      
      <Card className="mt-4 p-6">
        <h2 className="text-xl font-semibold">View User</h2>
        <div className="mt-4 border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 font-medium">User Status:</p>
              <p className="text-black">Active</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Registration Date:</p>
              <p className="text-black">Tuesday, February 25, 2025</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-gray-600 font-medium">User Information:</p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <p><span className="font-medium">Tên:</span> John Doe</p>
              <p><span className="font-medium">Email:</span> johndoe@example.com</p>
              <p><span className="font-medium">Role:</span> Admin</p>
              <p><span className="font-medium">Sdt:</span> +123456789</p>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-gray-600 font-medium">User Certificate:</p>
            <Table className="mt-2">
              <Table.Head>
                <Table.HeadCell>Image Certificate</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Application Date</Table.HeadCell>
                <Table.HeadCell>View Certificate</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                <Table.Row>
                  <Table.Cell>Courage</Table.Cell>
                  <Table.Cell>10</Table.Cell>
                  <Table.Cell>9</Table.Cell>
                  <Table.Cell>90</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
          
          <div className="mt-6">
            <Button color="purple" href="/users">Back to User</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

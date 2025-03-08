import "../../../assets/css/staff/StaffViewNewsPage.scss";

import { Card, Table, Button, Pagination, TextInput } from "flowbite-react";
import {
  FaSearch,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
} from "react-icons/fa";

export default function StaffViewNewsPage() {
  return (
    <div className="news-container">
      {/* Tiêu đề */}
      <h2 className="page-title">News</h2>

      {/* Thống kê */}
      <div className="stats-container">
        {statsData.map((stat) => (
          <Card key={stat.id} className={`stat-card ${stat.className}`}>
            <p className="stat-title">{stat.title}</p>
            <p className="stat-number">{stat.number} News</p>
          </Card>
        ))}
      </div>

      {/* Tìm kiếm và tạo tin mới */}
      <div className="actions-container">
        <TextInput
          icon={FaSearch}
          placeholder="Search News"
          className="search-input"
        />
        <Button className="create-news-button">
          <FaPlus className="icon" /> Create News
        </Button>
      </div>

      {/* Bảng tin tức */}
      <Card className="news-table-container">
        <Table className="news-table">
          <Table.Head>
            <Table.HeadCell>
              <input type="checkbox" />
            </Table.HeadCell>
            <Table.HeadCell>Id</Table.HeadCell>
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Content</Table.HeadCell>
            <Table.HeadCell>Interested</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {newsData.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <input type="checkbox" />
                </Table.Cell>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>{item.title}</Table.Cell>
                <Table.Cell>{item.content}</Table.Cell>
                <Table.Cell>{item.interested}</Table.Cell>
                <Table.Cell>
                  <span className={`status-badge ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <FaEye className="action-icon" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {/* Thanh phân trang */}
        <div className="pagination-container">
          <button className="button pagination">
            <FaChevronLeft className="mr-1" /> Previous
          </button>
          <button className="button pagination">
            Next <FaChevronRight className="ml-1" />
          </button>
        </div>
      </Card>
    </div>
  );
}

// Dữ liệu thống kê
const statsData = [
  { id: 1, title: "Total", number: 7, className: "total" },
  { id: 2, title: "Reject", number: 3, className: "reject" },
  { id: 3, title: "Approve", number: 3, className: "approve" },
  { id: 4, title: "Pending", number: 1, className: "pending" },
];

// Dữ liệu mẫu
const newsData = [
  {
    id: 101,
    title: "A",
    content: "A@gmail.com",
    interested: "Recipient",
    status: "Approve",
  },
  {
    id: 102,
    title: "A",
    content: "A@gmail.com",
    interested: "Donor",
    status: "Reject",
  },
  {
    id: 103,
    title: "A",
    content: "A@gmail.com",
    interested: "Donor",
    status: "Reject",
  },
  {
    id: 104,
    title: "A",
    content: "A@gmail.com",
    interested: "Recipient",
    status: "Pending",
  },
  {
    id: 105,
    title: "A",
    content: "A@gmail.com",
    interested: "Donor",
    status: "Approve",
  },
];

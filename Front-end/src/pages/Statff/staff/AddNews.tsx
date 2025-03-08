import { Button, Card, TextInput, Textarea } from "flowbite-react";
import { useState } from "react";
import { HiOutlineX, HiCheck } from "react-icons/hi";
import "../../../assets/css/staff/StaffAddNewsPage.scss";
export default function StaffAddNewsPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <div className="staff-add-news">
      <Card className="card-container">
        <h2 className="header">Add News</h2>
        <div className="status-container">
          <span>#103</span>
          <div className="buttons">
            <Button className="cancel-button">
              <HiOutlineX className="icon" /> Cancel
            </Button>
            <Button className="create-button">
              <HiCheck className="icon" /> Create News
            </Button>
          </div>
        </div>
        <div className="status-container">
          <div>
            <p>News Status:</p>
            <p>Pending</p>
          </div>
          <div>
            <p>Created Date:</p>
            <p>29-02-2025</p>
          </div>
        </div>
        <div className="input-group">
          <TextInput
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </Card>
    </div>
  );
}

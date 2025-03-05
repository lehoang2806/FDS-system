import { Button, Card, TextInput, Textarea } from "flowbite-react";
import { useState } from "react";
import { HiOutlineX, HiCheck } from "react-icons/hi";

export default function StaffAddNewsPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Card className="shadow-md max-w-4xl mx-auto">
                <h2 className="text-lg font-semibold text-gray-700">Add News</h2>
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-gray-600">#103</span>
                    <div className="flex space-x-2">
                        <Button color="failure" size="sm">
                            <HiOutlineX className="mr-1" /> Cancel
                        </Button>
                        <Button color="success" size="sm">
                            <HiCheck className="mr-1" /> Create News
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <p className="text-sm text-gray-600">News Status</p>
                        <p className="text-gray-800 font-medium">Pending</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Created Date</p>
                        <p className="text-gray-800 font-medium">29-02-2025</p>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
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

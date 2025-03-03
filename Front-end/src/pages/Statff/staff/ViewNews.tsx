import { Button, Card } from 'flowbite-react';

export default function ViewNews() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">View News</h2>
        
        <Card>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">#101</span>
            <span className="text-sm text-gray-500">Created Date: Tuesday, February 25, 2025</span>
          </div>
          
          <div className="mt-4">
            <p><strong>Campaign Status:</strong> <span className="text-green-600">Approved</span></p>
          </div>
          
          <div className="mt-4">
            <p className="font-semibold">News Information:</p>
            <p>Title: <span className="text-gray-700">Sample Title</span></p>
            <p>Content: <span className="text-gray-700">Lorem ipsum dolor sit amet...</span></p>
          </div>
          
          <div className="mt-4">
            <p className="font-semibold">Interested Information:</p>
            <div className="border p-3 rounded-lg">
              <p><strong>User Name:</strong> Courage</p>
              <p><strong>Registration Date:</strong> 90</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <p className="text-lg font-bold">Grand Total: 99</p>
            <div className="flex space-x-3">
              <Button color="gray">Back to News</Button>
              <Button color="blue">Edit News</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

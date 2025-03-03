import React from "react";
import { Button, TextInput, Card, Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

const AddCampaign = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item href="#">
          <HiHome className="mr-2 h-5 w-5" /> Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item>Add Campaign</Breadcrumb.Item>
      </Breadcrumb>

      {/* Card Container */}
      <Card className="p-6 bg-white shadow-md">
        <h2 className="text-lg font-semibold mb-4">Add Campaign</h2>

        {/* Status and Date Row */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Campaign Status: <strong>Pending</strong></span>
          <span className="text-gray-600">Created Date: 25-02-2025</span>
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <TextInput id="name" type="text" placeholder="Name" />
          <TextInput id="quantity" type="number" placeholder="Quantity" />
          <TextInput id="address" type="text" placeholder="Address" />
          <TextInput id="unit" type="text" placeholder="Unit" />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button color="failure">Cancel</Button>
          <Button color="success">Create Campaign</Button>
        </div>
      </Card>
    </div>
  );
};

export default AddCampaign;

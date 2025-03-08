import { Button, TextInput, Card } from "flowbite-react";
import "../../../assets/css/staff/LoginPage.scss"; // Import file SCSS

export default function LoginPage() {
  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-left">
          <h2 className="login-title">Let's get you signed in</h2>
          <div className="login-form">
            <label>Username</label>
            <TextInput type="text" placeholder="Enter your username" />
            <label>Password</label>
            <TextInput type="password" placeholder="Enter your password" />
            <Button className="login-button">Sign In</Button>
          </div>
        </div>
        <div className="login-right">
          <h3 className="system-title">FDS System</h3>
          <p className="system-description">
            Donec justo tortor, malesuada vitae faucibus ac, tristique sit amet
            massa. Aliquam dignissim nec felis quis imperdiet.
          </p>
        </div>
      </Card>
    </div>
  );
}

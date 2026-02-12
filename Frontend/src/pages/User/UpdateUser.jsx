import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/AuthContext";
import api from "../../axios";

const UpdateUser = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { _id } = user;

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast.error("All fields are required");
      return;
    }

    //password logic
    if (showPasswordFields) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error("All password fields are required");
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }

      if (newPassword.length < 6) {
        toast.error("New password must be at least 6 characters");
        return;
      }
    }

    const updateUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    };
    if (showPasswordFields) {
      updateUser.currentPassword = currentPassword;
      updateUser.newPassword = newPassword;
    }

    try {
      const res =  await api.put(`/me/${_id}`, updateUser);
      // toast.success("Profile updated successfully!");
      toast.success(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordFields(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <>
      <section className="hero-section-allPages">
        <div className="hero-section-allPages-content">
          <h1>Your Coffee Profile</h1>
          <p>
            Manage your preferences, update your details, and keep track of your
            BrewMaster rewards all in one place.
          </p>
        </div>
      </section>

      <section
        className="updateUser-page"
        style={{ background: "#f5efe6", padding: "0px 0px" }}
      >
        <form className="form" onSubmit={handleSubmit}>
          <h3>Update Account</h3>
          <p className="subtitle">Edit your profile details</p>
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <p className="actions">
            If you want to change password{" "}
            <span onClick={() => setShowPasswordFields(!showPasswordFields)}>
              Click here
            </span>
          </p>

          {showPasswordFields && (
            <>
              <label>Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <label>Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </>
          )}

          <button type="submit">Update Profile</button>
        </form>
      </section>
    </>
  );
};

export default UpdateUser;

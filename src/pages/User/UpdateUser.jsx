import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import toast from "react-hot-toast";

import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

const UpdateUser = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState(null);

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setEmail(data.email || user.email);
          setCreatedAt(data.createdAt?.toDate() || null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("No authenticated user found!");
        return;
      }

      if (showPasswordFields) {
        if (
          !currentPassword ||
          !newPassword ||
          newPassword !== confirmPassword
        ) {
          toast.error("Please check your password fields!");
          return;
        }

        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword,
        );
        await reauthenticateWithCredential(user, credential);

        await updatePassword(user, newPassword);
        toast.success("Password updated successfully!");
      }

      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          firstName,
          lastName,
          email,
          uid: user.uid,
          role: "user",
          createdAt: serverTimestamp(),
        },
        { merge: true },
      );

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
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
          {/* 
          <p>
            Account created at: {createdAt ? createdAt.toLocaleString() : "N/A"}
          </p> */}

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

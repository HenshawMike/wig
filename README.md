
# Admin Dashboard & Firebase Setup

This document outlines the steps to set up the Firebase project and manage the admin dashboard functionalities.

## Firebase Setup

After receiving the code, you need to configure your Firebase project to ensure everything works correctly.

### 1. Create a Firebase Project

If you haven't already, create a new project in the [Firebase Console](https://console.firebase.google.com/).

### 2. Configure Firebase Authentication

- In the Firebase Console, go to **Authentication**.
- Click on the **Sign-in method** tab.
- Enable the **Email/Password** sign-in provider.

### 3. Set Up Firestore Database

- Go to the **Firestore Database** section in the Firebase Console.
- Create a new database.
- Start in **production mode** to ensure your data is secure. You will need to configure security rules to allow access to your data.

### 4. Configure Environment Variables

- In the root of the project, create a new file named `.env.local`.
- Add your Firebase project's configuration to this file. You can find your project's configuration in the Firebase Console under **Project settings** > **General** > **Your apps** > **SDK setup and configuration**.

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Admin Dashboard

The admin dashboard includes functionalities to manage users and products.

### User Management

- **Add, Edit, and Delete Users:** The admin can manage users in the **Users** section.
- **Admin Roles:** The admin can assign or revoke admin privileges for other users.

### Cloud Functions for User Management

Since user management actions like creating, editing, and deleting users require admin privileges, these actions should be handled by Firebase Cloud Functions.

- **Create User:** A Cloud Function is needed to create a new user with an email and password.
- **Update User:** A Cloud Function is needed to update a user's information, such as their display name or admin status.
- **Delete User:** A Cloud Function is needed to delete a user from Firebase Authentication.

You will need to implement these Cloud Functions in the `functions` directory and deploy them to your Firebase project.

### Example: Create User Cloud Function

Here is an example of a Cloud Function to create a new user:

```javascript
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.createUser = functions.https.onCall(async (data, context) => {
  // Check if the user is an admin
  if (context.auth.token.admin !== true) {
    return { error: "Only admins can create users." };
  }

  const { email, password, displayName } = data;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    // You might want to add the user to the Firestore 'users' collection as well
    await admin.firestore().collection("users").doc(userRecord.uid).set({
      email,
      displayName,
      isAdmin: false, // or based on a parameter
      createdAt: new Date(),
    });

    return { uid: userRecord.uid };
  } catch (error) {
    console.error("Error creating new user:", error);
    throw new functions.https.HttpsError("internal", "Error creating user.");
  }
});
```

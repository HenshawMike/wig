import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const isAdmin = async (uid: string): Promise<boolean> => {
    const user = await admin.auth().getUser(uid);
    return user.customClaims?.admin === true;
};

export const listUsers = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const uid = context.auth.uid;
    if (!(await isAdmin(uid))) {
        throw new functions.https.HttpsError('permission-denied', 'Only admins can list users.');
    }

    try {
        const userRecords = await admin.auth().listUsers();
        return { users: userRecords.users.map(user => ({ uid: user.uid, email: user.email, displayName: user.displayName, customClaims: user.customClaims })) };
    } catch (error) {
        throw new functions.https.HttpsError('internal', 'Error listing users', error);
    }
});

export const updateUser = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const adminUid = context.auth.uid;
    if (!(await isAdmin(adminUid))) {
        throw new functions.https.HttpsError('permission-denied', 'Only admins can update users.');
    }

    const { uid, ...claims } = data;
    try {
        await admin.auth().setCustomUserClaims(uid, { admin: claims.isAdmin });

        // Also update user in firestore
        await admin.firestore().collection('users').doc(uid).update(claims);

        return { message: 'User updated successfully' };
    } catch (error) {
        throw new functions.https.HttpsError('internal', 'Error updating user', error);
    }
});

export const createUser = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const adminUid = context.auth.uid;
    if (!(await isAdmin(adminUid))) {
        throw new functions.https.HttpsError('permission-denied', 'Only admins can create users.');
    }

    const { email, password, displayName, isAdmin: newAdminStatus } = data;
    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName,
        });

        await admin.auth().setCustomUserClaims(userRecord.uid, { admin: newAdminStatus });

        // Also create user in firestore
        await admin.firestore().collection('users').doc(userRecord.uid).set({
            email,
            displayName,
            isAdmin: newAdminStatus,
            createdAt: new Date(),
        });

        return { uid: userRecord.uid };
    } catch (error) {
        throw new functions.https.HttpsError('internal', 'Error creating user', error);
    }
});

export const deleteUser = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const adminUid = context.auth.uid;
    if (!(await isAdmin(adminUid))) {
        throw new functions.https.HttpsError('permission-denied', 'Only admins can delete users.');
    }

    const { uid } = data;
    try {
        await admin.auth().deleteUser(uid);

        // Also delete user from firestore
        await admin.firestore().collection('users').doc(uid).delete();

        return { message: 'User deleted successfully' };
    } catch (error) {
        throw new functions.https.HttpsError('internal', 'Error deleting user', error);
    }
});

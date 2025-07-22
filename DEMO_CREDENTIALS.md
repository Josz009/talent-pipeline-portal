# Demo Credentials

Since Firebase Firestore rules are blocking all access, you have two options:

## Option 1: Update Firestore Rules (Recommended)

Go to: https://console.firebase.google.com/project/pipeline-job-e2952/firestore/rules

Replace the current rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users full access
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Then click "Publish"

## Option 2: Temporary Testing Rules

For testing only, you can use:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ WARNING: Option 2 allows anyone to read/write your database. Only use for testing!

## Demo Users

Once rules are updated, you can sign up with any email/password through the app.

Example:
- Email: admin@example.com
- Password: Admin123!
- Role: Select "Admin" during signup
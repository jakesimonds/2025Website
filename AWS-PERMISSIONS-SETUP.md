# Add AWS Amplify Permissions - Step by Step

## Your IAM User
`jakesimonds` in account `684264267721`

## Steps to Add Permissions (AWS Console as Root/Admin)

### 1. Login to AWS Console
- Go to https://console.aws.amazon.com/
- Sign in as root user or admin user

### 2. Navigate to IAM
- In the search bar at the top, type **IAM**
- Click on **IAM** (Identity and Access Management)

### 3. Go to Users
- In the left sidebar, click **Users**
- Find and click on **jakesimonds**

### 4. Add Permissions
- Click the **Add permissions** button (or **Permissions** tab → **Add permissions**)
- Select **Attach policies directly**

### 5. Attach AWS Managed Policy
**Option A: Full Amplify Access (Recommended for personal account)**
- In the search box, type: **AmplifyBackendDeployFullAccess**
- Check the box next to **AmplifyBackendDeployFullAccess**
- Also search for and check: **AdministratorAccess-Amplify**

**Option B: Custom Policy (More Restrictive)**
If you want minimal permissions, create a custom policy instead:
- Click **Create policy** (opens new tab)
- Click **JSON** tab
- Paste this:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "amplify:*"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateRole",
                "iam:AttachRolePolicy",
                "iam:PutRolePolicy",
                "iam:PassRole",
                "iam:GetRole"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "cloudformation:*"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:*"
            ],
            "Resource": "*"
        }
    ]
}
```
- Click **Next**
- Name it: **AmplifyDeploymentAccess**
- Click **Create policy**
- Go back to the user permissions tab, refresh, search for **AmplifyDeploymentAccess**, and check it

### 6. Review and Attach
- Click **Next** (Review)
- Click **Add permissions**

### 7. Verify
You should see the new policy/policies listed under "Permissions policies" for the jakesimonds user.

---

## After Adding Permissions

Come back to the terminal and we'll retry:
```bash
amplify init
```

---

## Quick Reference - AWS Managed Policies to Add

For easiest setup, attach these two:
1. **AdministratorAccess-Amplify**
2. **AmplifyBackendDeployFullAccess**

These give full Amplify permissions without needing custom JSON.

---

## Troubleshooting

If you still get permission errors after adding policies:
1. Wait 1-2 minutes for IAM changes to propagate
2. Run: `aws sts get-caller-identity` to verify your user
3. May need to add CloudFormation, S3, IAM permissions if not using full Amplify policies

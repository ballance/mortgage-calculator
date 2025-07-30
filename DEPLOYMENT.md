# Deployment Guide

This guide explains how to deploy the mortgage calculator to AWS using Terraform.

## Prerequisites

1. **AWS CLI** configured with appropriate credentials
2. **Terraform** installed (>= 1.0)
3. **Node.js** and npm for building the application
4. **Route53 hosted zone** for `bastionforge.com` already set up in your AWS account

## Setup

1. **Configure Terraform variables:**
   ```bash
   cd terraform
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your specific values if needed
   ```

2. **Initialize Terraform:**
   ```bash
   cd terraform
   terraform init
   ```

## Deployment

### Option 1: Automated Deployment (Recommended)

Use the provided deployment script:

```bash
./deploy.sh
```

This script will:
- Build the React application
- Initialize and apply Terraform configuration
- Sync files to S3
- Invalidate CloudFront cache

### Option 2: Manual Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy infrastructure:**
   ```bash
   cd terraform
   terraform plan
   terraform apply
   ```

3. **Upload files to S3:**
   ```bash
   aws s3 sync ../dist/ s3://$(terraform output -raw s3_bucket_name) --delete
   ```

4. **Invalidate CloudFront cache:**
   ```bash
   aws cloudfront create-invalidation --distribution-id $(terraform output -raw cloudfront_distribution_id) --paths "/*"
   ```

## What Gets Created

- **S3 Bucket**: Hosts static website files
- **CloudFront Distribution**: CDN for fast global delivery and HTTPS
- **ACM Certificate**: SSL/TLS certificate for HTTPS (auto-validated via DNS)
- **Route53 Record**: DNS A record pointing to CloudFront distribution

## Accessing Your Site

Once deployed, your mortgage calculator will be available at:
https://amortize.bastionforge.com

## Updating the Site

To update the site with new changes:

1. Make your code changes
2. Run `./deploy.sh` again

The script will rebuild the application and sync only changed files to S3.

## Cleanup

To destroy all AWS resources:

```bash
cd terraform
terraform destroy
```

**Warning**: This will permanently delete your S3 bucket and all associated resources.

## Troubleshooting

- **Certificate validation takes time**: ACM certificate validation can take 5-30 minutes
- **CloudFront propagation**: Changes to CloudFront can take 5-15 minutes to propagate globally
- **DNS propagation**: Route53 changes typically propagate within 60 seconds

## Cost Considerations

- **S3**: Very low cost for storage and requests
- **CloudFront**: Free tier includes 1TB transfer/month
- **Route53**: ~$0.50/month per hosted zone + query charges
- **ACM Certificate**: Free for use with AWS services
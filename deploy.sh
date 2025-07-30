#!/bin/bash

set -e

echo "🏗️  Building the application..."
npm run build

echo "🚀 Deploying to AWS..."

cd terraform

echo "📋 Initializing Terraform..."
terraform init

echo "📋 Planning Terraform deployment..."
terraform plan

echo "🚀 Applying Terraform configuration..."
terraform apply -auto-approve

echo "📁 Syncing files to S3..."
BUCKET_NAME=$(terraform output -raw s3_bucket_name)
aws s3 sync ../dist/ s3://$BUCKET_NAME --delete

echo "🔄 Invalidating CloudFront cache..."
DISTRIBUTION_ID=$(terraform output -raw cloudfront_distribution_id)
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

echo "✅ Deployment complete!"
echo "🌐 Website URL: $(terraform output -raw website_url)"
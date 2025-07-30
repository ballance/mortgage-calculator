variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "domain_name" {
  description = "The domain name for the website"
  type        = string
  default     = "amortize.bastionforge.com"
}

variable "root_domain" {
  description = "The root domain for Route53 hosted zone"
  type        = string
  default     = "bastionforge.com"
}

variable "bucket_name" {
  description = "S3 bucket name (must be globally unique)"
  type        = string
  default     = "amortize-bastionforge-com-static-site"
}
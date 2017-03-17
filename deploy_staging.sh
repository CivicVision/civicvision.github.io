bundle exec middleman build
aws s3 cp build s3://donor-retention-cv --recursive

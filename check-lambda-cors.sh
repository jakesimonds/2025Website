#!/bin/bash

# Script to check Lambda Function URL CORS configuration
# This will show you the current CORS settings for your Lambda Function URL

echo "Checking Lambda Function URL CORS configuration..."
echo ""

# You need to know your function name
# Try to list all functions first
echo "Listing all Lambda functions in your account:"
aws lambda list-functions --query 'Functions[*].FunctionName' --output table

echo ""
echo "Enter your Lambda function name from the list above:"
read FUNCTION_NAME

echo ""
echo "Getting Function URL config for: $FUNCTION_NAME"
aws lambda get-function-url-config --function-name "$FUNCTION_NAME"

echo ""
echo "If you see 'Cors' in the output above, CORS is configured."
echo "If you see an error or no 'Cors' section, CORS is NOT configured."

# Calculator Data Logging CDK

This CDK project sets up a DynamoDB table to log calculator inputs with no specific schema requirements.

## Deployment Instructions

1. Configure AWS credentials:
   ```
   aws configure
   ```

2. Build the CDK project:
   ```
   cd cdk
   npm run build
   ```

3. Deploy the stack:
   ```
   npm run deploy
   ```

4. After deployment, note the following outputs:
   - DynamoDB Table Name
   - API Gateway Endpoint URL (if applicable)

5. Update the React application with the API Gateway URL:
   - Create or modify `.env.local` in the React project root
   - Add: `REACT_APP_API_ENDPOINT=https://your-api-endpoint.execute-api.region.amazonaws.com/prod`

## Infrastructure Components

- DynamoDB Table (CalculatorUserData)
  - Partition Key: id (string)
  - Sort Key: timestamp (number) via GSI
  - On-demand billing
  - Retention policy: RETAIN

- IAM Roles
  - Public write access (for anonymous users)
  - No public read access

## Table Structure

The table has minimal structure by design:
- `id`: UUID for each record
- `timestamp`: When the data was recorded
- `data`: JSON string containing calculator input data

This allows for flexibility as the calculator evolves over time.
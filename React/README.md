# Financial Projection Calculator

A React application that helps users project their financial future based on various inputs.

## Features

- Financial projections based on user inputs
- Tax calculations for different provinces
- Multiple account types (TFSA, RRSP, RRIF, LIRA, LIF)
- CSV export of projection data
- Visualization of financial projections
- Anonymous data logging to DynamoDB

## Setup

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Testing

```bash
npm test
```

## DynamoDB Data Logging

This project includes anonymous data logging to AWS DynamoDB. The logging infrastructure is defined in the `cdk` directory and deployed using the AWS CDK.

### Deployment

1. Navigate to the CDK directory:
   ```bash
   cd cdk
   ```

2. Build the CDK project:
   ```bash
   npm run build
   ```

3. Deploy the stack:
   ```bash
   npm run deploy
   ```

4. After deployment, the API Gateway URL will be shown in the outputs. This value is already configured in the `.env` file.

### Environment Configuration

- `.env`: Contains production environment variables (checked into git)
- `.env.local`: Local overrides (not checked into git)
- `.env.example`: Example configuration

### Data Structure

The DynamoDB table has minimal structure by design:
- `id`: UUID for each record
- `timestamp`: When the data was recorded
- `data`: JSON string containing calculator input data

This allows for flexibility as the calculator evolves over time.
/**
 * Utility for logging calculator inputs to DynamoDB
 */

// This is a simple utility to log calculator inputs to DynamoDB
// The table has no schema as we just store arbitrary JSON data
export interface LogData {
  id: string;           // Unique identifier (UUID)
  timestamp: number;    // Current timestamp
  calculatorData: any;  // Arbitrary calculator input data
}

// Base URL for API Gateway endpoint (using Vite environment variables)
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

/**
 * Log calculator data to DynamoDB
 * @param calculatorData - The calculator input data to log
 * @returns Promise resolving to success or error
 */
export async function logCalculatorData(calculatorData: any): Promise<boolean> {
  try {
    // Skip if no API endpoint is configured
    if (!API_ENDPOINT) {
      console.warn('DynamoDB logging disabled - no API endpoint configured');
      return false;
    }
    
    console.log('Logging calculator data to DynamoDB at:', API_ENDPOINT);

    // Generate a random UUID for the record
    const id = crypto.randomUUID();
    
    // Create the log data with timestamp
    const logData: LogData = {
      id,
      timestamp: Date.now(),
      calculatorData,
    };

    // Convert to string for storage (DynamoDB can store JSON but we're using string for simplicity)
    const stringData = JSON.stringify(logData);

    const url = `${API_ENDPOINT}/log`;
    console.log('Sending data to:', url);
    
    // Send the data to DynamoDB via API Gateway
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        timestamp: logData.timestamp,
        data: stringData,
      }),
      mode: 'cors', // Explicitly set CORS mode
    });

    console.log('Response status:', response.status);
    
    const responseText = await response.text();
    console.log('Response:', responseText);
    
    if (!response.ok) {
      console.error('Failed to log calculator data:', responseText);
      return false;
    }

    console.log('Successfully logged calculator data');
    return true;
  } catch (error) {
    console.error('Error logging calculator data:', error);
    return false;
  }
}
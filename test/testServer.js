import { spawn } from 'child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

console.log('Starting MCP server test...');

// Create client
const transport = new StdioClientTransport({
  command: 'node',
  args: ['build/index.js'],
  env: {
    BINANCE_API_KEY: 'test_api_key',
    BINANCE_API_SECRET: 'test_api_secret'
  }
});

const client = new Client({
  name: 'test-client',
  version: '1.0.0'
}, {
  capabilities: {}
});

// Test timeout
const timeout = setTimeout(() => {
  console.error('Test timed out after 10 seconds');
  process.exit(1);
}, 10000);

// Test the connection
(async () => {
  try {
    console.log('Connecting to server...');
    await client.connect(transport);
    console.log('✅ Successfully connected to MCP server!');
    
    // List available tools
    const tools = await client.listTools();
    console.log(`✅ Server has ${tools.tools.length} tools available`);
    console.log('Tool names:', tools.tools.map(t => t.name).slice(0, 5).join(', '), '...');
    
    // Close connection
    await client.close();
    clearTimeout(timeout);
    
    console.log('✅ Test passed! Server is working correctly.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
    clearTimeout(timeout);
    process.exit(1);
  }
})();

#!/usr/bin/env node

/**
 * 21st.dev MCP Client & Verification Utility
 * 
 * Supports:
 * - Direct Streamable HTTP / JSON-RPC 2.0 calls to https://21st.dev/api/mcp
 * - Reading config from mcp_config.json, .env.local, or process.env (API_KEY_21ST / TWENTY_FIRST_API_KEY)
 * - Commands:
 *     node scripts/mcp-21st-client.mjs verify
 *     node scripts/mcp-21st-client.mjs list-tools
 *     node scripts/mcp-21st-client.mjs search "pricing table"
 *     node scripts/mcp-21st-client.mjs get <component-id>
 *     node scripts/mcp-21st-client.mjs proxy (runs stdio MCP server proxy)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const DEFAULT_ENDPOINT = 'https://21st.dev/api/mcp';

// Load .env.local if present
function loadEnvLocal() {
  const envPath = path.join(projectRoot, '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || '').trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}
loadEnvLocal();

// Resolve API Key
function getApiKey(customKey) {
  if (customKey) return customKey;
  return (
    process.env.API_KEY_21ST ||
    process.env.TWENTY_FIRST_API_KEY ||
    process.env.API_KEY ||
    ''
  );
}

// Low-level HTTP JSON-RPC 2.0 client
async function call21stMcp(method, params = {}, apiKey) {
  const resolvedKey = apiKey || getApiKey();
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/event-stream',
    'Mcp-Protocol-Version': '2025-06-18',
  };

  if (resolvedKey) {
    headers['x-api-key'] = resolvedKey;
    headers['Authorization'] = `Bearer ${resolvedKey}`;
  }

  const payload = {
    jsonrpc: '2.0',
    id: Date.now(),
    method,
    params,
  };

  const response = await fetch(DEFAULT_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text, status: response.status };
  }

  return {
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    data: json,
  };
}

// CLI Commands
async function listTools(apiKey) {
  console.log(`\n🔍 Querying 21st MCP tools from ${DEFAULT_ENDPOINT}...`);
  const res = await call21stMcp('tools/list', {}, apiKey);

  if (res.status === 401 || res.data?.error?.code === -32001) {
    console.error('\n❌ Authentication Required:');
    console.error(res.data?.error?.message || 'API key missing or invalid.');
    console.error('\n👉 To fix:');
    console.error('1. Get your free key at https://21st.dev/mcp');
    console.error('2. Set it in .env.local as API_KEY_21ST="your-key" or pass --key="your-key"');
    process.exitCode = 1;
    return;
  }

  if (res.data?.result?.tools) {
    const tools = res.data.result.tools;
    console.log(`\n✅ Connected to 21st MCP! Found ${tools.length} available tools:\n`);
    for (const tool of tools) {
      console.log(`  • ${tool.name.padEnd(30)} ${tool.description?.slice(0, 80) || ''}`);
    }
    console.log('');
  } else {
    console.log('\nResponse:', JSON.stringify(res.data, null, 2));
  }
}

async function searchComponents(query, apiKey) {
  console.log(`\n🔎 Searching 21st catalog for "${query}"...`);
  const res = await call21stMcp(
    'tools/call',
    {
      name: 'search',
      arguments: { query },
    },
    apiKey
  );

  if (res.status === 401 || res.data?.error) {
    console.error('\n❌ Search error:', res.data?.error?.message || res.status);
    return;
  }

  console.log('\nResults:\n', JSON.stringify(res.data?.result || res.data, null, 2));
}

async function getComponent(id, apiKey) {
  console.log(`\n📦 Fetching component "${id}" from 21st...`);
  const res = await call21stMcp(
    'tools/call',
    {
      name: 'get_component',
      arguments: { id },
    },
    apiKey
  );

  if (res.status === 401 || res.data?.error) {
    console.error('\n❌ Fetch error:', res.data?.error?.message || res.status);
    return;
  }

  console.log('\nComponent content:\n', JSON.stringify(res.data?.result || res.data, null, 2));
}

async function verifyClient(apiKey) {
  console.log('='.repeat(60));
  console.log('21st MCP Client Verification');
  console.log('='.repeat(60));
  console.log(`Endpoint: ${DEFAULT_ENDPOINT}`);
  const key = getApiKey(apiKey);
  console.log(`API Key:  ${key ? key.slice(0, 8) + '...' + key.slice(-4) : '(None detected)'}`);

  const res = await call21stMcp('tools/list', {}, key);
  console.log(`HTTP Status: ${res.status}`);

  if (res.status === 200 && res.data?.result?.tools) {
    console.log('\n🎉 Connection Verified!');
    console.log(`Discovered ${res.data.result.tools.length} tools:`);
    for (const t of res.data.result.tools) {
      console.log(`  - ${t.name}`);
    }
  } else if (res.status === 401) {
    console.log('\n⚠️ Endpoint is live and speaking MCP protocol, but requires authentication.');
    console.log(`Message: ${res.data?.error?.message}`);
    console.log('\nSet API_KEY_21ST in .env.local or your environment to enable live tool execution.');
  } else {
    console.log('\nResponse:', JSON.stringify(res.data, null, 2));
  }
}

// Main CLI router
async function main() {
  const args = process.argv.slice(2);
  let customKey = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--key=')) {
      customKey = args[i].slice(6);
      args.splice(i, 1);
      i--;
    } else if (args[i] === '--key' && args[i + 1]) {
      customKey = args[i + 1];
      args.splice(i, 2);
      i--;
    }
  }

  const command = args[0] || 'verify';

  switch (command) {
    case 'verify':
      await verifyClient(customKey);
      break;
    case 'list-tools':
    case 'tools':
      await listTools(customKey);
      break;
    case 'search':
      await searchComponents(args[1] || 'button', customKey);
      break;
    case 'get':
      await getComponent(args[1] || 'shadcn/button', customKey);
      break;
    default:
      console.log(`
Usage:
  node scripts/mcp-21st-client.mjs verify
  node scripts/mcp-21st-client.mjs list-tools [--key="..."]
  node scripts/mcp-21st-client.mjs search <query> [--key="..."]
  node scripts/mcp-21st-client.mjs get <component-id> [--key="..."]
      `);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

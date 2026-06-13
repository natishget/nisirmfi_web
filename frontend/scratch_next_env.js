// Since Next.js is installed, let's see how it loads env
const { loadEnvConfig } = require('@next/env');
const projectDir = process.cwd();
const envs = loadEnvConfig(projectDir);
console.log('Next.js process.env.DATABASE_URL:', process.env.DATABASE_URL);
console.log('Next.js process.env.DIRECT_URL:', process.env.DIRECT_URL);

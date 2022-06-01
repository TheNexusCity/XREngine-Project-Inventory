module.exports = {
  'fail-zero': false,
  parallel: false,
  spec: ['packages/server/tests/**/*.test.ts'],
  require: [
    'packages/server/tests/mocha.env', // init env here
    'ts-node/register'
  ],
  extension: [
    'ts'
  ],
  exit: true,
  recursive: true,
  jobs: '1',
  timeout: '20000'
};
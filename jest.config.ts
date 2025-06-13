import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.ts'],
  setupFiles: [
    '<rootDir>/tests/setupEnv.ts',
    '<rootDir>/tests/__mocks__/supabaseClient.ts'
  ],
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@auth/supabase-adapter|@auth/core)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@auth/supabase-adapter$': '<rootDir>/node_modules/@auth/supabase-adapter/index.js'
  }
}

export default config
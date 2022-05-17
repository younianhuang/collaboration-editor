module.exports = {
  coverageDirectory: 'coverage',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  preset: 'ts-jest',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.ts$': 'ts-jest',
  },
  moduleDirectories: ['node_modules'],
};

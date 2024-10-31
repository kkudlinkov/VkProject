module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom', // Изменено с 'node' на 'jsdom'
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.spec.json',  // Указываем на новый конфиг
        },
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
import path from 'path';

// Library
import SVGSpritemapPlugin from '../lib/';

const warnings = [{
    options: {
        sprite: {
            generate: {
                view: true,
                use: false
            }
        }
    },
    message: 'Using sprite.generate.view requires sprite.generate.use to be enabled'
}, {
    options: {
        sprite: {
            generate: {
                use: true,
                symbol: false
            }
        }
    },
    message: 'Using sprite.generate.use requires sprite.generate.symbol to be enabled'
}, {
    options: {
        sprite: {
            generate: {
                title: true,
                symbol: false
            }
        }
    },
    message: 'Using sprite.generate.title requires sprite.generate.symbol to be enabled'
}, {
    options: {
        sprite: {
            generate: {
                symbol: true,
                view: true
            }
        }
    },
    message: 'Both sprite.generate.symbol and sprite.generate.view are set to true which will cause identifier conflicts, use a string value (postfix) for either of these options'
}, {
    options: {
        styles: {
            filename: 'test.css'
        }
    },
    message: 'Variables are not supported when using CSS'
}, {
    options: {
        styles: {
            filename: 'test.scss',
            format: 'fragment'
        }
    },
    message: 'Variables will not work when using styles.format \'fragments\''
}, {
    options: {
        sprite: {
            generate: {
                view: false
            }
        },
        styles: {
            filename: 'test.scss',
            format: 'fragment'
        }
    },
    message: 'Using styles.format with value \'fragment\' in combination with sprite.generate.view with value false will result in CSS fragments not working correctly'
}];

warnings.forEach((warning) => {
    it(`Should show a helpful warning with configuration \`${JSON.stringify(warning.options)}\``, (done) => {
        global.__WEBPACK__({
            mode: 'development',
            plugins: [
                new SVGSpritemapPlugin(path.resolve(__dirname, 'input/svg/variables-basic.svg'), warning.options)
            ]
        }, (error, stats) => {
            const { warnings: messages = [] } = stats.toJson();

            if (global.__WEBPACK_VERSION__.startsWith('4.')) {
                expect(messages.filter((message) => message.includes(warning.message))).toHaveLength(1);
            } else {
                expect(messages.filter((message) => message.message.includes(warning.message))).toHaveLength(1);
            }

            done();
        });
    });
});

it('Should includes warnings coming back from the styles formatter', (done) => {
    global.__WEBPACK__({
        mode: 'development',
        plugins: [
            new SVGSpritemapPlugin(path.resolve(__dirname, 'input/svg/variables-default-value-mismatch.svg'), {
                styles: {
                    filename: 'test.scss',
                    format: 'fragment'
                }
            })
        ]
    }, (error, stats) => {
        const { warnings: messages = [] } = stats.toJson();

        if (global.__WEBPACK_VERSION__.startsWith('4.')) {
            expect(messages.filter((message) => message.includes('Mismatching default values'))).toHaveLength(1);
            expect(messages.filter((message) => message.includes('Variables will not work when using styles.format \'fragments\''))).toHaveLength(1);
        } else {
            expect(messages.filter((message) => message.message.includes('Mismatching default values'))).toHaveLength(1);
            expect(messages.filter((message) => message.message.includes('Variables will not work when using styles.format \'fragments\''))).toHaveLength(1);
        }

        done();
    });
});

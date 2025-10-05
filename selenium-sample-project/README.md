# Selenium Java Sample Project

This project demonstrates best practices for Selenium WebDriver automation with Java.

## 🚀 Quick Start

### Prerequisites
- Java 11 or higher
- Maven 3.6+
- Chrome and/or Firefox browser

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd selenium-sample-project

# Install dependencies
mvn clean install
```

### Running Tests
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=BasicSeleniumTest

# Run tests with specific browser
mvn test -Dbrowser=firefox
```

## 📁 Project Structure
```
selenium-sample-project/
├── src/
│   ├── main/java/
│   │   └── com/example/pages/     # Page Object classes
│   └── test/
│       ├── java/
│       │   └── com/example/
│       │       ├── tests/         # Test classes
│       │       └── utils/         # Utility classes
│       └── resources/
│           └── log4j2.xml         # Logging configuration
├── test-output/                   # Test reports and screenshots
├── pom.xml                        # Maven configuration
├── testng.xml                     # TestNG suite configuration
└── README.md
```

## 🧪 Features

- **Page Object Model** - Clean separation of page elements and test logic
- **Cross-browser Testing** - Support for Chrome and Firefox
- **Parallel Execution** - Run tests in parallel for faster execution
- **Screenshot on Failure** - Automatically capture screenshots when tests fail
- **ExtentReports** - Beautiful HTML reports with test results
- **Logging** - Comprehensive logging with Log4j2
- **WebDriverManager** - Automatic browser driver management

## 📊 Test Reports

After running tests, find reports in:
- ExtentReports: `test-output/ExtentReport_*.html`
- Screenshots: `test-output/screenshots/`
- Logs: `test-output/selenium-tests.log`

## 🛠️ Configuration

### Browser Options
Configure browser options in `BaseTest.java`:
- Headless mode
- Window size
- Browser arguments

### Timeouts
Default timeouts:
- Implicit wait: 10 seconds
- Page load timeout: 30 seconds
- Explicit wait: 20 seconds

## 📚 Best Practices Demonstrated

1. **Page Object Model** - Maintainable test structure
2. **Base Test Class** - Common setup/teardown logic
3. **Explicit Waits** - Reliable element interaction
4. **Test Listeners** - Enhanced reporting
5. **Parallel Execution** - Faster test runs
6. **Cross-browser Testing** - Better coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.
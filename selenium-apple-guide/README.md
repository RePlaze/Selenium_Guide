# Apple-Style Selenium WebDriver Framework

A clean, minimal, and powerful test automation framework built with Selenium WebDriver, TestNG, and Maven.

## 🚀 Quick Start

### Prerequisites
- Java 11 or higher
- Maven 3.6+
- Chrome/Firefox/Safari browser

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd selenium-apple-guide

# Install dependencies
mvn clean install

# Run smoke tests
mvn test -Dgroups=smoke
```

## 📁 Project Structure

```
selenium-apple-framework/
├── src/
│   ├── main/java/
│   │   └── com/apple/automation/
│   │       ├── core/           # Framework core (DriverManager, BasePage, BaseTest)
│   │       ├── pages/          # Page Objects
│   │       ├── utils/          # Utilities (Config, Screenshots, Retry)
│   │       └── listeners/      # Test listeners
│   └── test/
│       ├── java/               # Test classes
│       └── resources/          # Test configuration
├── docs/                       # Documentation
├── pom.xml                     # Maven configuration
└── README.md                   # This file
```

## 🧪 Running Tests

### Run all tests
```bash
mvn test
```

### Run specific test groups
```bash
# Smoke tests only
mvn test -Dgroups=smoke

# Regression tests
mvn test -Dgroups=regression

# Exclude flaky tests
mvn test -Dgroups="regression" -DexcludedGroups="flaky"
```

### Run with specific browser
```bash
# Chrome (default)
mvn test -Dbrowser=chrome

# Firefox
mvn test -Dbrowser=firefox

# Safari (macOS only)
mvn test -Dbrowser=safari

# Headless mode
mvn test -Dbrowser=chrome -Dheadless=true
```

### Run specific test class
```bash
mvn test -Dtest=AppleE2ETest
```

### Run specific test method
```bash
mvn test -Dtest=AppleE2ETest#testProductSearchFunctionality
```

## 📊 Test Reports

### Allure Reports
```bash
# Generate Allure report
mvn allure:report

# Open Allure report
mvn allure:serve
```

### TestNG Reports
TestNG reports are automatically generated in `target/surefire-reports/`

## 🔧 Configuration

Edit `src/test/resources/config.properties` to customize:
- Base URL
- Timeouts
- Browser settings
- Retry count
- Screenshot settings

## 📖 Documentation

See the comprehensive guide at `docs/SELENIUM_GUIDE.md` for:
- Detailed framework architecture
- Best practices
- Code examples
- Anti-patterns to avoid

## 🏗️ CI/CD Integration

### GitHub Actions
```yaml
- name: Run Selenium Tests
  run: mvn clean test -Dbrowser=chrome -Dheadless=true
```

### Jenkins
```groovy
sh 'mvn clean test -Dbrowser=${BROWSER} -Dgroups=${TEST_GROUP}'
```

## 🎯 Key Features

- **Page Object Model** - Clean separation of test logic and page elements
- **Thread-Safe** - Supports parallel execution
- **Cross-Browser** - Chrome, Firefox, Safari, Edge support
- **Comprehensive Logging** - Log4j2 with colored console output
- **Allure Integration** - Beautiful test reports
- **Retry Mechanism** - Automatic retry for flaky tests
- **Screenshot on Failure** - Automatic screenshot capture
- **Data-Driven Testing** - TestNG DataProvider support
- **Configuration Management** - External properties file
- **Clean Architecture** - SOLID principles applied

## 🤝 Contributing

1. Follow the existing code style
2. Write clean, readable tests
3. Use meaningful test names
4. Add appropriate logging
5. Update documentation

## 📝 License

This project is created for educational purposes.
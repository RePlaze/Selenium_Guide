# Selenium WebDriver Guide
*Clean. Minimal. Powerful.*

---

## I. Introduction to Selenium WebDriver

### What is Selenium?
Selenium WebDriver is a collection of open-source APIs that allows you to automate web browser interactions. It provides a programming interface to create and execute test cases.

### Why Selenium?
- **Cross-browser** — Works with Chrome, Firefox, Safari, Edge
- **Multi-language** — Supports Java, Python, C#, JavaScript
- **Active community** — Continuous updates and support
- **Integration ready** — Works seamlessly with TestNG, Maven, CI/CD

### Architecture Overview
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Test      │────▶│  WebDriver  │────▶│   Browser   │
│   Code      │     │     API     │     │   Driver    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                     │
                           ▼                     ▼
                    ┌─────────────┐     ┌─────────────┐
                    │   Browser   │◀────│   Browser   │
                    │  Commands   │     │  Instance   │
                    └─────────────┘     └─────────────┘
```

### 🎯 Quick Reference
- **WebDriver** = Browser automation API
- **TestNG** = Test framework with annotations
- **Maven** = Build and dependency management

---

## II. Project Setup

### Maven Project Structure
```
selenium-apple-framework/
├── pom.xml
├── src/
│   ├── main/java/
│   │   └── com/apple/automation/
│   │       ├── core/
│   │       │   ├── DriverManager.java
│   │       │   └── BasePage.java
│   │       ├── pages/
│   │       │   └── HomePage.java
│   │       ├── utils/
│   │       │   └── TestUtils.java
│   │       └── listeners/
│   │           └── TestListener.java
│   └── test/
│       ├── java/com/apple/automation/tests/
│       │   └── HomePageTest.java
│       └── resources/
│           ├── testng.xml
│           └── config.properties
└── target/
```

### Essential pom.xml
```xml
<dependencies>
    <!-- Core -->
    <dependency>
        <groupId>org.seleniumhq.selenium</groupId>
        <artifactId>selenium-java</artifactId>
        <version>4.25.0</version>
    </dependency>
    
    <!-- Driver Management -->
    <dependency>
        <groupId>io.github.bonigarcia</groupId>
        <artifactId>webdrivermanager</artifactId>
        <version>5.9.2</version>
    </dependency>
    
    <!-- Test Framework -->
    <dependency>
        <groupId>org.testng</groupId>
        <artifactId>testng</artifactId>
        <version>7.10.2</version>
    </dependency>
</dependencies>
```

### First Test
```java
public class FirstTest {
    private WebDriver driver;
    
    @BeforeMethod
    public void setup() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
    }
    
    @Test
    public void openApple() {
        driver.get("https://www.apple.com");
        assertThat(driver.getTitle()).contains("Apple");
    }
    
    @AfterMethod
    public void teardown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
```

### 🎯 Quick Reference
- **pom.xml** — Dependencies and build configuration
- **WebDriverManager** — Auto-manages browser drivers
- **@Test** — Marks a test method

---

## III. WebDriver Core

### Browser Management
```java
// Chrome with options
ChromeOptions options = new ChromeOptions();
options.addArguments("--start-maximized");
options.addArguments("--disable-notifications");
WebDriver driver = new ChromeDriver(options);

// Firefox
FirefoxOptions firefoxOptions = new FirefoxOptions();
firefoxOptions.addPreference("dom.webnotifications.enabled", false);
WebDriver driver = new FirefoxDriver(firefoxOptions);

// Safari (macOS only)
WebDriver driver = new SafariDriver();
```

### Window Control
```java
// Size and position
driver.manage().window().maximize();
driver.manage().window().setSize(new Dimension(1200, 800));
driver.manage().window().setPosition(new Point(100, 50));

// Navigation
driver.get("https://www.apple.com");
driver.navigate().back();
driver.navigate().forward();
driver.navigate().refresh();

// Get info
String title = driver.getTitle();
String url = driver.getCurrentUrl();
String pageSource = driver.getPageSource();
```

### Best Practices
- ✅ Always use `driver.quit()` in finally/teardown
- ✅ Set implicit wait globally: `driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10))`
- ✅ Use options for headless testing in CI/CD
- ❌ Don't use `driver.close()` for single window apps

### 🎯 Quick Reference
- **get()** — Navigate to URL
- **quit()** — Close browser and clean resources
- **manage()** — Access browser settings

---

## IV. Elements & Selectors

### Finding Elements
```java
// By ID (fastest, most reliable)
WebElement logo = driver.findElement(By.id("apple-logo"));

// By CSS Selector (flexible, fast)
WebElement navItem = driver.findElement(By.cssSelector(".nav-item:first-child"));

// By XPath (powerful but slower)
WebElement button = driver.findElement(By.xpath("//button[contains(text(),'Buy')]"));

// By Class Name
WebElement product = driver.findElement(By.className("product-card"));

// By Link Text
WebElement link = driver.findElement(By.linkText("iPhone"));

// Multiple elements
List<WebElement> products = driver.findElements(By.className("product"));
```

### CSS Selector Mastery
```java
// Child elements
By.cssSelector("div > p")              // Direct child
By.cssSelector("div p")                // Any descendant

// Attributes
By.cssSelector("[data-testid='submit']")     // Exact match
By.cssSelector("[href*='apple.com']")        // Contains
By.cssSelector("[class^='btn-']")            // Starts with
By.cssSelector("[class$='-primary']")        // Ends with

// Pseudo-selectors
By.cssSelector("li:nth-child(3)")            // 3rd item
By.cssSelector("button:not(:disabled)")      // Not disabled
```

### XPath Power
```java
// Text content
By.xpath("//button[text()='Buy Now']")
By.xpath("//button[contains(text(),'Buy')]")

// Following sibling
By.xpath("//label[text()='Email']/following-sibling::input")

// Parent navigation
By.xpath("//span[@class='price']/parent::div")

// Complex conditions
By.xpath("//div[@class='product' and @data-available='true']")
```

### Custom Selector Methods
```java
public class ElementUtils {
    
    public static By byTestId(String testId) {
        return By.cssSelector(String.format("[data-testid='%s']", testId));
    }
    
    public static By byText(String text) {
        return By.xpath(String.format("//*[text()='%s']", text));
    }
    
    public static By containsText(String text) {
        return By.xpath(String.format("//*[contains(text(),'%s')]", text));
    }
}
```

### Best Practices
- ✅ Prefer ID and data-testid attributes
- ✅ Use CSS over XPath when possible
- ✅ Create reusable selector methods
- ❌ Avoid absolute XPath (starts with /)
- ❌ Don't rely on dynamic classes

### 🎯 Quick Reference
- **ID** — Fastest, unique
- **CSS** — Fast, flexible
- **XPath** — Powerful, can traverse up
- **findElements()** — Returns list, never throws exception

---

## V. Waits & Synchronization

### Wait Types Comparison
```java
// ❌ Thread.sleep - NEVER use
Thread.sleep(5000);  // Always waits full time

// ⚠️ Implicit Wait - Use carefully
driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
// Applied globally, can slow down negative tests

// ✅ Explicit Wait - Recommended
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement element = wait.until(
    ExpectedConditions.elementToBeClickable(By.id("submit"))
);

// ✅ Fluent Wait - Maximum control
Wait<WebDriver> wait = new FluentWait<>(driver)
    .withTimeout(Duration.ofSeconds(30))
    .pollingEvery(Duration.ofMillis(500))
    .ignoring(NoSuchElementException.class);
```

### Common Wait Conditions
```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

// Presence
wait.until(ExpectedConditions.presenceOfElementLocated(By.id("result")));

// Visibility
wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("popup")));

// Clickability
wait.until(ExpectedConditions.elementToBeClickable(By.id("button")));

// Text presence
wait.until(ExpectedConditions.textToBePresentInElement(element, "Success"));

// Custom condition
wait.until(driver -> driver.findElements(By.className("item")).size() > 5);
```

### Advanced Wait Patterns
```java
public class SmartWait {
    private final WebDriver driver;
    private final WebDriverWait wait;
    
    public SmartWait(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }
    
    public WebElement waitAndClick(By locator) {
        WebElement element = wait.until(
            ExpectedConditions.elementToBeClickable(locator)
        );
        element.click();
        return element;
    }
    
    public void waitForPageLoad() {
        wait.until(driver -> 
            ((JavascriptExecutor) driver)
                .executeScript("return document.readyState")
                .equals("complete")
        );
    }
    
    public void waitForAjax() {
        wait.until(driver ->
            ((JavascriptExecutor) driver)
                .executeScript("return jQuery.active == 0")
        );
    }
}
```

### Anti-patterns to Avoid
```java
// ❌ BAD: Multiple implicit waits
driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(30));

// ❌ BAD: Mixing implicit and explicit
driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
new WebDriverWait(driver, Duration.ofSeconds(10)).until(...);

// ❌ BAD: Catching all exceptions
try {
    driver.findElement(By.id("element")).click();
} catch (Exception e) {
    // Hiding real issues
}
```

### 🎯 Quick Reference
- **Implicit** — Global, applies to all findElement
- **Explicit** — Specific condition, recommended
- **Fluent** — Polling interval + ignore exceptions
- **ExpectedConditions** — Pre-built wait conditions

---

## VI. Actions & JavaScript Executor

### Action Chains
```java
Actions actions = new Actions(driver);

// Click
actions.click(element).perform();
actions.doubleClick(element).perform();
actions.contextClick(element).perform();  // Right-click

// Hover
actions.moveToElement(element).perform();

// Drag and Drop
actions.dragAndDrop(source, target).perform();
// Or with offset
actions.dragAndDropBy(element, xOffset, yOffset).perform();

// Complex chains
actions
    .moveToElement(menu)
    .pause(Duration.ofMillis(500))
    .click(submenu)
    .perform();

// Keyboard actions
actions
    .keyDown(Keys.CONTROL)
    .click(element1)
    .click(element2)
    .keyUp(Keys.CONTROL)
    .perform();
```

### JavaScript Executor
```java
JavascriptExecutor js = (JavascriptExecutor) driver;

// Click when regular click fails
js.executeScript("arguments[0].click();", element);

// Scroll
js.executeScript("window.scrollTo(0, document.body.scrollHeight)");
js.executeScript("arguments[0].scrollIntoView(true);", element);

// Get values
String text = (String) js.executeScript(
    "return arguments[0].innerText", element
);

// Set attributes
js.executeScript(
    "arguments[0].setAttribute('value', 'test')", inputElement
);

// Remove attributes
js.executeScript(
    "arguments[0].removeAttribute('disabled')", button
);

// Highlight element (for debugging)
js.executeScript(
    "arguments[0].style.border='3px solid red'", element
);
```

### When to Use JavaScript
```java
public class JSHelper {
    private final JavascriptExecutor js;
    
    public JSHelper(WebDriver driver) {
        this.js = (JavascriptExecutor) driver;
    }
    
    // ✅ Good: When element is covered
    public void forceClick(WebElement element) {
        js.executeScript("arguments[0].click();", element);
    }
    
    // ✅ Good: Custom scrolling
    public void smoothScroll(WebElement element) {
        js.executeScript(
            "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'})", 
            element
        );
    }
    
    // ✅ Good: Wait for Angular
    public void waitForAngular() {
        js.executeAsyncScript(
            "var callback = arguments[arguments.length - 1];" +
            "angular.element(document.body).injector().get('$browser')" +
            ".notifyWhenNoOutstandingRequests(callback);"
        );
    }
    
    // ❌ Bad: Bypassing application logic
    public void badPractice() {
        // Don't use JS to bypass validations
        js.executeScript("document.getElementById('submit').disabled = false");
    }
}
```

### 🎯 Quick Reference
- **Actions** — Mouse and keyboard simulation
- **perform()** — Execute action chain
- **JavascriptExecutor** — Direct DOM manipulation
- **executeScript()** — Synchronous JS
- **executeAsyncScript()** — Async JS with callback

---

## VII. Frames, Windows & Alerts

### Frame Handling
```java
// Switch to frame by index
driver.switchTo().frame(0);

// Switch to frame by name/id
driver.switchTo().frame("frameName");

// Switch to frame by WebElement
WebElement frameElement = driver.findElement(By.id("frame"));
driver.switchTo().frame(frameElement);

// Switch back to main content
driver.switchTo().defaultContent();

// Switch to parent frame
driver.switchTo().parentFrame();

// Frame utility
public void switchToFrameAndPerform(String frameId, Runnable action) {
    try {
        driver.switchTo().frame(frameId);
        action.run();
    } finally {
        driver.switchTo().defaultContent();
    }
}
```

### Window Management
```java
// Get current window handle
String mainWindow = driver.getWindowHandle();

// Get all window handles
Set<String> allWindows = driver.getWindowHandles();

// Switch to new window
String mainWindow = driver.getWindowHandle();
// Perform action that opens new window
button.click();

// Wait for new window
new WebDriverWait(driver, Duration.ofSeconds(10))
    .until(ExpectedConditions.numberOfWindowsToBe(2));

// Switch to new window
Set<String> allWindows = driver.getWindowHandles();
for (String window : allWindows) {
    if (!window.equals(mainWindow)) {
        driver.switchTo().window(window);
        break;
    }
}

// Close current and switch back
driver.close();
driver.switchTo().window(mainWindow);
```

### Alert Handling
```java
// Wait for alert
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
Alert alert = wait.until(ExpectedConditions.alertIsPresent());

// Simple alert
alert.accept();  // OK
alert.dismiss(); // Cancel

// Get text
String alertText = alert.getText();

// Prompt alert
alert.sendKeys("Input text");
alert.accept();

// Utility method
public String handleAlert(boolean accept, String inputText) {
    try {
        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        String text = alert.getText();
        
        if (inputText != null) {
            alert.sendKeys(inputText);
        }
        
        if (accept) {
            alert.accept();
        } else {
            alert.dismiss();
        }
        
        return text;
    } catch (TimeoutException e) {
        throw new RuntimeException("No alert present");
    }
}
```

### 🎯 Quick Reference
- **switchTo()** — Navigate between contexts
- **defaultContent()** — Return to main page
- **getWindowHandles()** — All open windows
- **Alert** — Handle JavaScript popups

---

## VIII. Cookies & Storage

### Cookie Management
```java
// Get all cookies
Set<Cookie> cookies = driver.manage().getCookies();

// Get specific cookie
Cookie sessionCookie = driver.manage().getCookieNamed("sessionId");

// Add cookie
Cookie cookie = new Cookie.Builder("user", "john_doe")
    .domain("apple.com")
    .path("/")
    .isSecure(true)
    .isHttpOnly(true)
    .expiresOn(new Date(System.currentTimeMillis() + 3600000))
    .build();
driver.manage().addCookie(cookie);

// Delete cookies
driver.manage().deleteCookieNamed("user");
driver.manage().deleteAllCookies();

// Cookie utility
public void loginWithCookie(String token) {
    driver.get("https://apple.com");
    Cookie authCookie = new Cookie("auth_token", token);
    driver.manage().addCookie(authCookie);
    driver.navigate().refresh();
}
```

### Local Storage
```java
JavascriptExecutor js = (JavascriptExecutor) driver;

// Set item
js.executeScript("localStorage.setItem('key', 'value')");

// Get item
String value = (String) js.executeScript(
    "return localStorage.getItem('key')"
);

// Remove item
js.executeScript("localStorage.removeItem('key')");

// Clear all
js.executeScript("localStorage.clear()");

// Storage utility
public class StorageHelper {
    private final JavascriptExecutor js;
    
    public StorageHelper(WebDriver driver) {
        this.js = (JavascriptExecutor) driver;
    }
    
    public void setLocalStorage(String key, String value) {
        js.executeScript(
            "localStorage.setItem(arguments[0], arguments[1])", 
            key, value
        );
    }
    
    public String getLocalStorage(String key) {
        return (String) js.executeScript(
            "return localStorage.getItem(arguments[0])", key
        );
    }
    
    public void setSessionStorage(String key, String value) {
        js.executeScript(
            "sessionStorage.setItem(arguments[0], arguments[1])", 
            key, value
        );
    }
}
```

### 🎯 Quick Reference
- **Cookie** — Server-side storage
- **localStorage** — Persistent client storage
- **sessionStorage** — Session-only storage
- **executeScript()** — Access storage via JS

---

## IX. Framework Architecture

### Driver Factory Pattern
```java
public class DriverFactory {
    private static final ThreadLocal<WebDriver> driverThreadLocal = new ThreadLocal<>();
    
    public enum BrowserType {
        CHROME, FIREFOX, SAFARI, EDGE
    }
    
    public static WebDriver createDriver(BrowserType browserType) {
        WebDriver driver;
        
        switch (browserType) {
            case CHROME:
                WebDriverManager.chromedriver().setup();
                ChromeOptions chromeOptions = new ChromeOptions();
                chromeOptions.addArguments("--disable-notifications");
                chromeOptions.addArguments("--start-maximized");
                driver = new ChromeDriver(chromeOptions);
                break;
                
            case FIREFOX:
                WebDriverManager.firefoxdriver().setup();
                FirefoxOptions firefoxOptions = new FirefoxOptions();
                firefoxOptions.addPreference("dom.webnotifications.enabled", false);
                driver = new FirefoxDriver(firefoxOptions);
                break;
                
            case SAFARI:
                driver = new SafariDriver();
                break;
                
            case EDGE:
                WebDriverManager.edgedriver().setup();
                driver = new EdgeDriver();
                break;
                
            default:
                throw new IllegalArgumentException("Browser not supported: " + browserType);
        }
        
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        driver.manage().window().maximize();
        
        driverThreadLocal.set(driver);
        return driver;
    }
    
    public static WebDriver getDriver() {
        return driverThreadLocal.get();
    }
    
    public static void quitDriver() {
        WebDriver driver = driverThreadLocal.get();
        if (driver != null) {
            driver.quit();
            driverThreadLocal.remove();
        }
    }
}
```

### Base Page Pattern
```java
public abstract class BasePage {
    protected WebDriver driver;
    protected WebDriverWait wait;
    protected JavascriptExecutor js;
    protected Actions actions;
    
    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        this.js = (JavascriptExecutor) driver;
        this.actions = new Actions(driver);
        PageFactory.initElements(driver, this);
    }
    
    protected WebElement waitAndFind(By locator) {
        return wait.until(ExpectedConditions.presenceOfElementLocated(locator));
    }
    
    protected void waitAndClick(By locator) {
        WebElement element = wait.until(
            ExpectedConditions.elementToBeClickable(locator)
        );
        element.click();
    }
    
    protected void waitAndType(By locator, String text) {
        WebElement element = waitAndFind(locator);
        element.clear();
        element.sendKeys(text);
    }
    
    protected boolean isElementPresent(By locator) {
        try {
            driver.findElement(locator);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }
    
    protected void scrollToElement(WebElement element) {
        js.executeScript("arguments[0].scrollIntoView(true);", element);
    }
    
    protected void waitForPageLoad() {
        wait.until(driver -> 
            js.executeScript("return document.readyState").equals("complete")
        );
    }
    
    public abstract boolean isPageLoaded();
}
```

### Base Test Class
```java
public abstract class BaseTest {
    protected WebDriver driver;
    protected Logger logger = LogManager.getLogger(this.getClass());
    
    @BeforeMethod(alwaysRun = true)
    @Parameters({"browser"})
    public void setUp(@Optional("chrome") String browser) {
        logger.info("Starting test with browser: {}", browser);
        
        DriverFactory.BrowserType browserType = 
            DriverFactory.BrowserType.valueOf(browser.toUpperCase());
        driver = DriverFactory.createDriver(browserType);
    }
    
    @AfterMethod(alwaysRun = true)
    public void tearDown(ITestResult result) {
        if (result.getStatus() == ITestResult.FAILURE) {
            captureScreenshot(result.getName());
        }
        
        logger.info("Test completed: {} - {}", 
            result.getName(), 
            result.getStatus() == ITestResult.SUCCESS ? "PASSED" : "FAILED"
        );
        
        DriverFactory.quitDriver();
    }
    
    protected void captureScreenshot(String testName) {
        try {
            TakesScreenshot screenshot = (TakesScreenshot) driver;
            File srcFile = screenshot.getScreenshotAs(OutputType.FILE);
            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss")
                .format(new Date());
            File destFile = new File(
                "screenshots/" + testName + "_" + timestamp + ".png"
            );
            FileUtils.copyFile(srcFile, destFile);
            logger.info("Screenshot saved: {}", destFile.getPath());
        } catch (IOException e) {
            logger.error("Failed to capture screenshot", e);
        }
    }
}
```

### Test Listener
```java
public class TestListener implements ITestListener, ISuiteListener {
    private static final Logger logger = LogManager.getLogger(TestListener.class);
    
    @Override
    public void onStart(ISuite suite) {
        logger.info("Test Suite started: {}", suite.getName());
    }
    
    @Override
    public void onTestStart(ITestResult result) {
        logger.info("Test started: {}", result.getName());
    }
    
    @Override
    public void onTestSuccess(ITestResult result) {
        logger.info("Test passed: {} ({}ms)", 
            result.getName(), 
            result.getEndMillis() - result.getStartMillis()
        );
    }
    
    @Override
    public void onTestFailure(ITestResult result) {
        logger.error("Test failed: {}", result.getName());
        logger.error("Failure reason: ", result.getThrowable());
        
        // Attach screenshot to Allure report
        if (DriverFactory.getDriver() != null) {
            Allure.addAttachment(
                "Screenshot",
                new ByteArrayInputStream(
                    ((TakesScreenshot) DriverFactory.getDriver())
                        .getScreenshotAs(OutputType.BYTES)
                )
            );
        }
    }
    
    @Override
    public void onTestSkipped(ITestResult result) {
        logger.warn("Test skipped: {}", result.getName());
    }
    
    @Override
    public void onFinish(ISuite suite) {
        logger.info("Test Suite finished: {}", suite.getName());
    }
}
```

### 🎯 Quick Reference
- **ThreadLocal** — Thread-safe driver storage
- **PageFactory** — Initialize @FindBy elements
- **BaseTest** — Common test setup/teardown
- **ITestListener** — Hook into test lifecycle

---

## X. TestNG Integration

### Test Structure
```java
public class ProductSearchTest extends BaseTest {
    
    private HomePage homePage;
    private SearchPage searchPage;
    
    @BeforeMethod
    public void initPages() {
        homePage = new HomePage(driver);
        searchPage = new SearchPage(driver);
    }
    
    @Test(priority = 1, groups = {"smoke", "search"})
    @Description("Verify user can search for iPhone")
    public void testSearchIPhone() {
        homePage.open();
        homePage.searchFor("iPhone");
        
        assertThat(searchPage.getResultsCount())
            .as("Search results should be displayed")
            .isGreaterThan(0);
        
        assertThat(searchPage.getFirstResultTitle())
            .as("First result should contain search term")
            .containsIgnoringCase("iPhone");
    }
    
    @Test(dataProvider = "searchTerms", groups = {"regression"})
    public void testSearchMultipleProducts(String searchTerm, int minResults) {
        homePage.open();
        homePage.searchFor(searchTerm);
        
        assertThat(searchPage.getResultsCount())
            .as("Minimum results for %s", searchTerm)
            .isGreaterThanOrEqualTo(minResults);
    }
    
    @DataProvider(name = "searchTerms")
    public Object[][] searchTerms() {
        return new Object[][] {
            {"MacBook", 5},
            {"iPad", 3},
            {"Apple Watch", 2}
        };
    }
}
```

### TestNG XML Configuration
```xml
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="Apple Test Suite" parallel="tests" thread-count="3">
    
    <listeners>
        <listener class-name="com.apple.automation.listeners.TestListener"/>
    </listeners>
    
    <test name="Smoke Tests">
        <parameter name="browser" value="chrome"/>
        <groups>
            <run>
                <include name="smoke"/>
            </run>
        </groups>
        <classes>
            <class name="com.apple.automation.tests.ProductSearchTest"/>
            <class name="com.apple.automation.tests.NavigationTest"/>
        </classes>
    </test>
    
    <test name="Cross Browser Test">
        <parameter name="browser" value="firefox"/>
        <classes>
            <class name="com.apple.automation.tests.CompatibilityTest"/>
        </classes>
    </test>
    
</suite>
```

### Advanced TestNG Features
```java
public class AdvancedTestFeatures {
    
    // Retry failed tests
    @Test(retryAnalyzer = RetryAnalyzer.class)
    public void testWithRetry() {
        // Test that might be flaky
    }
    
    // Timeout
    @Test(timeOut = 30000)  // 30 seconds
    public void testWithTimeout() {
        // Long running test
    }
    
    // Dependencies
    @Test
    public void testLogin() {
        // Login test
    }
    
    @Test(dependsOnMethods = "testLogin")
    public void testProfile() {
        // Requires login
    }
    
    // Soft assertions
    @Test
    public void testWithSoftAssertions() {
        SoftAssert softAssert = new SoftAssert();
        
        softAssert.assertEquals(title, "Apple");
        softAssert.assertTrue(logo.isDisplayed());
        softAssert.assertNotNull(searchBox);
        
        softAssert.assertAll();  // Throws if any assertion failed
    }
}

// Retry Analyzer
public class RetryAnalyzer implements IRetryAnalyzer {
    private int retryCount = 0;
    private static final int maxRetryCount = 2;
    
    @Override
    public boolean retry(ITestResult result) {
        if (retryCount < maxRetryCount) {
            retryCount++;
            return true;
        }
        return false;
    }
}
```

### 🎯 Quick Reference
- **@Test** — Mark test method
- **@DataProvider** — Parameterized tests
- **groups** — Categorize tests
- **priority** — Execution order
- **parallel** — Concurrent execution

---

## XI. Parallel Execution

### TestNG Parallel Configuration
```xml
<!-- Method level parallelism -->
<suite name="Parallel Suite" parallel="methods" thread-count="5">
    <test name="Parallel Test">
        <classes>
            <class name="com.apple.automation.tests.AllTests"/>
        </classes>
    </test>
</suite>

<!-- Class level parallelism -->
<suite name="Parallel Suite" parallel="classes" thread-count="3">
    <test name="Parallel Test">
        <classes>
            <class name="com.apple.automation.tests.Test1"/>
            <class name="com.apple.automation.tests.Test2"/>
            <class name="com.apple.automation.tests.Test3"/>
        </classes>
    </test>
</suite>

<!-- Test level parallelism -->
<suite name="Parallel Suite" parallel="tests" thread-count="2">
    <test name="Chrome Test">
        <parameter name="browser" value="chrome"/>
        <classes>
            <class name="com.apple.automation.tests.CrossBrowserTest"/>
        </classes>
    </test>
    <test name="Firefox Test">
        <parameter name="browser" value="firefox"/>
        <classes>
            <class name="com.apple.automation.tests.CrossBrowserTest"/>
        </classes>
    </test>
</suite>
```

### Thread-Safe Page Objects
```java
public class ThreadSafePage extends BasePage {
    // Use ThreadLocal for thread safety
    private static ThreadLocal<String> currentUrl = new ThreadLocal<>();
    
    @FindBy(css = "[data-testid='search']")
    private WebElement searchBox;
    
    public ThreadSafePage(WebDriver driver) {
        super(driver);
        currentUrl.set(driver.getCurrentUrl());
    }
    
    public void search(String term) {
        // Each thread has its own driver instance
        searchBox.sendKeys(term);
        searchBox.submit();
        
        logger.info("Thread {} searched for: {}", 
            Thread.currentThread().getId(), term);
    }
}
```

### Selenium Grid Setup
```java
// Grid configuration
public class GridDriverFactory {
    
    public static WebDriver createRemoteDriver(String hubUrl, String browser) {
        DesiredCapabilities capabilities = new DesiredCapabilities();
        capabilities.setBrowserName(browser);
        capabilities.setPlatform(Platform.ANY);
        
        ChromeOptions options = new ChromeOptions();
        options.merge(capabilities);
        
        try {
            return new RemoteWebDriver(new URL(hubUrl), options);
        } catch (MalformedURLException e) {
            throw new RuntimeException("Invalid hub URL: " + hubUrl, e);
        }
    }
}

// Docker Compose for Grid
```

```yaml
# docker-compose.yml
version: '3'
services:
  selenium-hub:
    image: selenium/hub:latest
    ports:
      - "4444:4444"
      
  chrome:
    image: selenium/node-chrome:latest
    depends_on:
      - selenium-hub
    environment:
      - HUB_HOST=selenium-hub
      - NODE_MAX_INSTANCES=5
      - NODE_MAX_SESSION=5
      
  firefox:
    image: selenium/node-firefox:latest
    depends_on:
      - selenium-hub
    environment:
      - HUB_HOST=selenium-hub
      - NODE_MAX_INSTANCES=5
      - NODE_MAX_SESSION=5
```

### 🎯 Quick Reference
- **parallel** — methods, classes, tests, instances
- **thread-count** — Number of threads
- **ThreadLocal** — Thread-safe variables
- **RemoteWebDriver** — Grid execution

---

## XII. CI/CD Integration

### Maven Commands
```bash
# Run all tests
mvn clean test

# Run specific test group
mvn clean test -Dgroups=smoke

# Run with specific browser
mvn clean test -Dbrowser=firefox

# Generate Allure report
mvn clean test
mvn allure:report
mvn allure:serve

# Run in headless mode
mvn clean test -Dheadless=true
```

### Jenkins Pipeline
```groovy
pipeline {
    agent any
    
    tools {
        maven 'Maven-3.8.6'
        jdk 'JDK-11'
    }
    
    parameters {
        choice(
            name: 'BROWSER',
            choices: ['chrome', 'firefox', 'edge'],
            description: 'Select browser for testing'
        )
        choice(
            name: 'TEST_SUITE',
            choices: ['smoke', 'regression', 'all'],
            description: 'Select test suite to run'
        )
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Test') {
            steps {
                script {
                    sh """
                        mvn clean test \
                        -Dbrowser=${params.BROWSER} \
                        -Dgroups=${params.TEST_SUITE}
                    """
                }
            }
        }
        
        stage('Report') {
            steps {
                script {
                    allure([
                        includeProperties: false,
                        jdk: '',
                        properties: [],
                        reportBuildPolicy: 'ALWAYS',
                        results: [[path: 'target/allure-results']]
                    ])
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        failure {
            emailext(
                subject: "Test Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "Test execution failed. Check ${env.BUILD_URL}",
                to: "qa-team@company.com"
            )
        }
    }
}
```

### GitHub Actions
```yaml
name: Selenium Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        browser: [chrome, firefox]
        
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 11
      uses: actions/setup-java@v3
      with:
        java-version: '11'
        distribution: 'temurin'
        
    - name: Cache Maven dependencies
      uses: actions/cache@v3
      with:
        path: ~/.m2
        key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
        
    - name: Run tests
      run: mvn clean test -Dbrowser=${{ matrix.browser }}
      
    - name: Generate Allure Report
      if: always()
      run: mvn allure:report
      
    - name: Upload Allure Results
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: allure-results-${{ matrix.browser }}
        path: target/allure-results
        
    - name: Publish Test Report
      if: always()
      uses: dorny/test-reporter@v1
      with:
        name: Test Results - ${{ matrix.browser }}
        path: target/surefire-reports/*.xml
        reporter: java-junit
```

### 🎯 Quick Reference
- **mvn clean test** — Run tests
- **-D** — Pass system properties
- **allure:serve** — Open report locally
- **matrix** — Run multiple configurations

---

## XIII. Best Practices & Anti-patterns

### ✅ Best Practices

#### 1. Page Object Model
```java
// Good: Encapsulated page objects
public class LoginPage extends BasePage {
    @FindBy(id = "username")
    private WebElement usernameField;
    
    @FindBy(id = "password")
    private WebElement passwordField;
    
    @FindBy(css = "[data-testid='login-button']")
    private WebElement loginButton;
    
    public LoginPage(WebDriver driver) {
        super(driver);
    }
    
    public HomePage login(String username, String password) {
        usernameField.sendKeys(username);
        passwordField.sendKeys(password);
        loginButton.click();
        return new HomePage(driver);
    }
}
```

#### 2. Explicit Waits
```java
// Good: Specific wait conditions
public void waitForProductsToLoad() {
    wait.until(ExpectedConditions.visibilityOfAllElements(productCards));
    wait.until(driver -> productCards.size() > 0);
}
```

#### 3. Meaningful Assertions
```java
// Good: Descriptive assertions
assertThat(searchResults.size())
    .as("Search for '%s' should return at least %d results", 
        searchTerm, expectedMin)
    .isGreaterThanOrEqualTo(expectedMin);
```

#### 4. Test Independence
```java
// Good: Each test is independent
@BeforeMethod
public void setUp() {
    driver.manage().deleteAllCookies();
    driver.get(BASE_URL);
}
```

### ❌ Anti-patterns to Avoid

#### 1. Hard-coded Waits
```java
// Bad: Fixed sleep
Thread.sleep(5000);

// Good: Dynamic wait
wait.until(ExpectedConditions.elementToBeClickable(button));
```

#### 2. Test Dependencies
```java
// Bad: Tests depend on execution order
@Test(priority = 1)
public void testCreateUser() { }

@Test(priority = 2)
public void testLoginWithCreatedUser() { }  // Depends on test 1

// Good: Independent tests
@Test
public void testLoginWithValidCredentials() {
    // Create test data within the test
}
```

#### 3. Catching All Exceptions
```java
// Bad: Hiding failures
try {
    element.click();
} catch (Exception e) {
    // Ignoring all exceptions
}

// Good: Specific handling
try {
    element.click();
} catch (StaleElementReferenceException e) {
    element = driver.findElement(locator);
    element.click();
}
```

#### 4. Absolute XPath
```java
// Bad: Brittle selector
By.xpath("/html/body/div[1]/div[2]/form/input[1]")

// Good: Relative, meaningful selector
By.xpath("//form[@id='login']//input[@name='username']")
```

### Quality Checklist

- [ ] **No hard-coded waits** - Use explicit waits
- [ ] **Independent tests** - Each test can run alone
- [ ] **Meaningful names** - Tests describe what they verify
- [ ] **Single responsibility** - One test, one scenario
- [ ] **Proper cleanup** - Close resources in teardown
- [ ] **Error handling** - Graceful failure with logs
- [ ] **No test data pollution** - Clean state between tests
- [ ] **Stable selectors** - Prefer IDs and data attributes
- [ ] **Parallel-ready** - Thread-safe implementation
- [ ] **CI/CD integrated** - Runs in pipeline

### Framework Maintenance

1. **Regular Updates**
   - Update Selenium and dependencies monthly
   - Test against new browser versions
   - Review and refactor flaky tests

2. **Code Reviews**
   - Review test code like production code
   - Ensure patterns are followed
   - Check for anti-patterns

3. **Performance Monitoring**
   - Track test execution time
   - Identify slow tests
   - Optimize wait strategies

4. **Documentation**
   - Keep README updated
   - Document complex utilities
   - Maintain test case descriptions

---

## 🎯 Master Reference Card

### Essential Imports
```java
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.*;
import org.openqa.selenium.interactions.Actions;
import org.testng.annotations.*;
import static org.assertj.core.api.Assertions.*;
```

### Quick Patterns
```java
// Wait and click
wait.until(ExpectedConditions.elementToBeClickable(locator)).click();

// Safe text retrieval
String text = wait.until(ExpectedConditions.presenceOfElementLocated(locator)).getText();

// JavaScript click
((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);

// Switch to new window
String mainWindow = driver.getWindowHandle();
// ... action that opens new window
driver.getWindowHandles().stream()
    .filter(handle -> !handle.equals(mainWindow))
    .findFirst()
    .ifPresent(driver.switchTo()::window);
```

### Command Line
```bash
# Run specific test
mvn test -Dtest=LoginTest#testValidLogin

# Debug mode
mvn -Dmaven.surefire.debug test

# Skip tests
mvn clean install -DskipTests

# Specific profile
mvn test -P smoke-tests
```

---

---

## XIV. Perfect E2E Test Example

### Apple Website Test - Best Practices Showcase

Here's a complete E2E test that demonstrates all best practices in action:

```java
package com.apple.automation.tests;

import com.apple.automation.core.BaseTest;
import com.apple.automation.pages.AppleBagPage;
import com.apple.automation.pages.AppleHomePage;
import com.apple.automation.pages.AppleSearchResultsPage;
import io.qameta.allure.*;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

import static org.assertj.core.api.Assertions.*;

/**
 * Example E2E test for Apple website demonstrating best practices:
 * - Page Object Model (POM)
 * - Parametric tests with DataProvider
 * - Atomic test design
 * - Comprehensive logging
 * - Allure reporting integration
 * - Clean, readable code
 */
@Epic("Apple Website")
@Feature("Product Search and Navigation")
public class AppleE2ETest extends BaseTest {
    
    private AppleHomePage homePage;
    private AppleSearchResultsPage searchResultsPage;
    private AppleBagPage bagPage;
    
    @BeforeMethod(alwaysRun = true)
    public void initializePages() {
        homePage = new AppleHomePage(driver);
    }
    
    @Test(
        groups = {"smoke", "search"},
        description = "Verify user can search for products and view results"
    )
    @Story("Product Search")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Test validates that search functionality works correctly")
    public void testProductSearchFunctionality() {
        step("Search for iPhone", () -> {
            searchResultsPage = homePage.search("iPhone");
        });
        
        step("Verify search results", () -> {
            assertThat(searchResultsPage.getResultsCount())
                .as("Search results for 'iPhone' should be displayed")
                .isGreaterThan(0);
            
            assertThat(searchResultsPage.getFirstResultTitle())
                .as("First result should contain search term")
                .containsIgnoringCase("iPhone");
        });
        
        step("Log search results", () -> {
            int resultsCount = searchResultsPage.getResultsCount();
            logger.info("Found {} results for 'iPhone'", resultsCount);
            addAllureInfo("Results Count", String.valueOf(resultsCount));
        });
    }
    
    @Test(
        dataProvider = "searchTerms",
        groups = {"regression", "search"},
        description = "Verify search works for multiple product types"
    )
    @Story("Parametric Product Search")
    @Severity(SeverityLevel.NORMAL)
    public void testParametricProductSearch(String searchTerm, int minExpectedResults) {
        step(String.format("Search for '%s'", searchTerm), () -> {
            searchResultsPage = homePage.search(searchTerm);
        });
        
        step("Verify minimum results", () -> {
            int actualResults = searchResultsPage.getResultsCount();
            
            assertThat(actualResults)
                .as("Search for '%s' should return at least %d results", 
                    searchTerm, minExpectedResults)
                .isGreaterThanOrEqualTo(minExpectedResults);
            
            logger.info("Search '{}' returned {} results", searchTerm, actualResults);
        });
    }
    
    @DataProvider(name = "searchTerms")
    public Object[][] searchTerms() {
        return new Object[][] {
            {"MacBook", 3},
            {"iPad", 3},
            {"Apple Watch", 2},
            {"AirPods", 2}
        };
    }
}
```

### Key Best Practices Demonstrated

#### 1. **Clean Test Structure**
- Clear test method names that describe what is being tested
- Logical grouping with `@BeforeMethod` for setup
- Step-by-step execution with Allure `step()` method

#### 2. **Page Object Model**
```java
// Pages are initialized once and reused
private AppleHomePage homePage;

// Page interactions are abstracted
searchResultsPage = homePage.search("iPhone");
```

#### 3. **Fluent Assertions**
```java
assertThat(searchResultsPage.getResultsCount())
    .as("Search results for 'iPhone' should be displayed")
    .isGreaterThan(0);
```

#### 4. **Parametric Testing**
```java
@Test(dataProvider = "searchTerms")
public void testParametricProductSearch(String searchTerm, int minExpectedResults) {
    // Test runs multiple times with different data
}
```

#### 5. **Comprehensive Logging**
```java
logger.info("Search '{}' returned {} results", searchTerm, actualResults);
addAllureInfo("Results Count", String.valueOf(resultsCount));
```

#### 6. **Atomic Tests**
- Each test is independent
- Tests can run in any order
- No dependencies between tests

#### 7. **Allure Integration**
```java
@Epic("Apple Website")
@Feature("Product Search and Navigation")
@Story("Product Search")
@Severity(SeverityLevel.CRITICAL)
```

#### 8. **Error Handling**
- BaseTest handles screenshots on failure
- Retry analyzer for flaky tests
- Proper cleanup in `@AfterMethod`

### Running the Perfect Test

```bash
# Run single test
mvn test -Dtest=AppleE2ETest#testProductSearchFunctionality

# Run with Allure report
mvn clean test
mvn allure:serve

# Run in parallel
mvn test -Dparallel=methods -DthreadCount=3
```

### Test Execution Flow

```
1. BaseTest.setUp()
   ├── Creates WebDriver
   ├── Navigates to base URL
   └── Logs test start

2. Test Method Execution
   ├── Initialize page objects
   ├── Execute test steps
   ├── Make assertions
   └── Log results

3. BaseTest.tearDown()
   ├── Capture screenshot (if failed)
   ├── Log test result
   └── Quit WebDriver
```

### Why This Test is "Perfect"

1. **Readable** - Anyone can understand what it tests
2. **Maintainable** - Changes are easy to implement
3. **Reliable** - No flakiness, proper waits
4. **Informative** - Comprehensive logging and reporting
5. **Reusable** - Components can be used in other tests
6. **Fast** - Optimized execution, no unnecessary waits
7. **Scalable** - Easy to add more tests following same pattern

---

*Remember: Great tests are maintainable tests. Write them as if the person maintaining them is a violent psychopath who knows where you live.*
package com.apple.automation.core;

import com.apple.automation.utils.ConfigReader;
import com.apple.automation.utils.ScreenshotUtil;
import io.qameta.allure.Allure;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.testng.ITestResult;
import org.testng.annotations.*;

import java.io.ByteArrayInputStream;
import java.lang.reflect.Method;

/**
 * Base test class providing common setup and teardown functionality.
 * All test classes should extend this class.
 */
public abstract class BaseTest {
    
    protected WebDriver driver;
    protected final Logger logger = LogManager.getLogger(this.getClass());
    protected ConfigReader config;
    
    @BeforeSuite(alwaysRun = true)
    public void beforeSuite() {
        logger.info("=== Test Suite Started ===");
        config = ConfigReader.getInstance();
    }
    
    @BeforeMethod(alwaysRun = true)
    @Parameters({"browser", "headless"})
    public void setUp(Method method, 
                      @Optional("chrome") String browser,
                      @Optional("false") String headless) {
        
        logger.info("===== Starting test: {} =====", method.getName());
        logger.info("Browser: {}, Headless: {}", browser, headless);
        
        // Create driver based on parameters
        DriverManager.BrowserType browserType = getBrowserType(browser, Boolean.parseBoolean(headless));
        driver = DriverManager.createDriver(browserType);
        
        // Navigate to base URL
        String baseUrl = config.getProperty("base.url", "https://www.apple.com");
        logger.info("Navigating to: {}", baseUrl);
        driver.get(baseUrl);
    }
    
    @AfterMethod(alwaysRun = true)
    public void tearDown(ITestResult result) {
        try {
            // Log test result
            logTestResult(result);
            
            // Take screenshot on failure
            if (result.getStatus() == ITestResult.FAILURE) {
                captureFailureDetails(result);
            }
            
        } finally {
            // Always quit driver
            DriverManager.quitDriver();
            logger.info("===== Test completed: {} =====\n", result.getName());
        }
    }
    
    @AfterSuite(alwaysRun = true)
    public void afterSuite() {
        logger.info("=== Test Suite Completed ===");
    }
    
    /**
     * Determines browser type based on parameters.
     */
    private DriverManager.BrowserType getBrowserType(String browser, boolean headless) {
        String browserLower = browser.toLowerCase();
        
        if (headless) {
            switch (browserLower) {
                case "chrome":
                    return DriverManager.BrowserType.CHROME_HEADLESS;
                case "firefox":
                    return DriverManager.BrowserType.FIREFOX_HEADLESS;
                default:
                    logger.warn("Headless mode not supported for {}. Using regular mode.", browser);
            }
        }
        
        switch (browserLower) {
            case "chrome":
                return DriverManager.BrowserType.CHROME;
            case "firefox":
                return DriverManager.BrowserType.FIREFOX;
            case "safari":
                return DriverManager.BrowserType.SAFARI;
            case "edge":
                return DriverManager.BrowserType.EDGE;
            default:
                logger.warn("Unknown browser: {}. Defaulting to Chrome.", browser);
                return DriverManager.BrowserType.CHROME;
        }
    }
    
    /**
     * Logs test result with duration.
     */
    private void logTestResult(ITestResult result) {
        long duration = result.getEndMillis() - result.getStartMillis();
        String status = getStatusString(result.getStatus());
        
        logger.info("Test: {} - Status: {} - Duration: {}ms", 
            result.getName(), 
            status, 
            duration);
        
        // Add duration to Allure report
        Allure.addAttachment("Test Duration", String.format("%d ms", duration));
    }
    
    /**
     * Captures failure details including screenshot and page source.
     */
    private void captureFailureDetails(ITestResult result) {
        try {
            // Capture screenshot
            byte[] screenshot = ScreenshotUtil.captureScreenshot(driver);
            
            // Attach to Allure report
            Allure.addAttachment("Failed Screenshot", 
                new ByteArrayInputStream(screenshot));
            
            // Log failure details
            logger.error("Test failed: {}", result.getName());
            logger.error("Failure reason:", result.getThrowable());
            
            // Capture page source for debugging
            String pageSource = driver.getPageSource();
            Allure.addAttachment("Page Source", "text/html", pageSource, "html");
            
            // Log current URL
            String currentUrl = driver.getCurrentUrl();
            logger.error("Failed at URL: {}", currentUrl);
            Allure.addAttachment("Failed URL", currentUrl);
            
        } catch (Exception e) {
            logger.error("Failed to capture failure details", e);
        }
    }
    
    /**
     * Converts test status to readable string.
     */
    private String getStatusString(int status) {
        switch (status) {
            case ITestResult.SUCCESS:
                return "PASSED";
            case ITestResult.FAILURE:
                return "FAILED";
            case ITestResult.SKIP:
                return "SKIPPED";
            default:
                return "UNKNOWN";
        }
    }
    
    /**
     * Gets the current WebDriver instance.
     * Useful for page object initialization.
     */
    protected WebDriver getDriver() {
        if (driver == null) {
            throw new IllegalStateException("WebDriver is not initialized. Ensure setUp() is called.");
        }
        return driver;
    }
    
    /**
     * Adds custom information to Allure report.
     */
    protected void addAllureInfo(String name, String value) {
        Allure.addAttachment(name, value);
    }
    
    /**
     * Adds test step to Allure report.
     */
    protected void step(String stepName, Runnable stepAction) {
        logger.info("Executing step: {}", stepName);
        Allure.step(stepName, stepAction);
    }
}
package com.apple.automation.listeners;

import com.apple.automation.core.DriverManager;
import com.apple.automation.utils.ScreenshotUtil;
import io.qameta.allure.Allure;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.testng.*;

import java.io.ByteArrayInputStream;

/**
 * TestNG listener for enhanced test reporting and lifecycle management.
 */
public class TestListener implements ITestListener, ISuiteListener, IInvokedMethodListener {
    
    private static final Logger logger = LogManager.getLogger(TestListener.class);
    private static final String SEPARATOR = "=" .repeat(80);
    
    @Override
    public void onStart(ISuite suite) {
        logger.info("\n{}", SEPARATOR);
        logger.info("TEST SUITE STARTED: {}", suite.getName());
        logger.info("Parallel: {}", suite.getParallel());
        logger.info("{}\n", SEPARATOR);
        
        // Clean up old screenshots
        ScreenshotUtil.cleanupScreenshots(7); // Keep for 7 days
    }
    
    @Override
    public void onFinish(ISuite suite) {
        logger.info("\n{}", SEPARATOR);
        logger.info("TEST SUITE FINISHED: {}", suite.getName());
        logger.info("Total Run Time: {} seconds", 
            (System.currentTimeMillis() - suite.getStartMillis()) / 1000);
        logger.info("{}\n", SEPARATOR);
    }
    
    @Override
    public void onTestStart(ITestResult result) {
        String testName = result.getMethod().getMethodName();
        String className = result.getTestClass().getName();
        
        logger.info("\n{}", "-".repeat(60));
        logger.info("TEST STARTED: {}.{}", className, testName);
        logger.info("Description: {}", result.getMethod().getDescription());
        logger.info("Groups: {}", String.join(", ", result.getMethod().getGroups()));
        logger.info("{}", "-".repeat(60));
        
        // Add test info to Allure
        Allure.addAttachment("Test Class", className);
        Allure.addAttachment("Test Method", testName);
    }
    
    @Override
    public void onTestSuccess(ITestResult result) {
        long duration = result.getEndMillis() - result.getStartMillis();
        
        logger.info("✓ TEST PASSED: {} ({}ms)", 
            result.getName(), 
            duration);
        
        // Add success info to Allure
        Allure.addAttachment("Status", "PASSED");
        Allure.addAttachment("Duration", String.format("%d ms", duration));
    }
    
    @Override
    public void onTestFailure(ITestResult result) {
        String testName = result.getName();
        Throwable throwable = result.getThrowable();
        
        logger.error("✗ TEST FAILED: {}", testName);
        logger.error("Failure Reason:", throwable);
        
        // Capture failure details
        captureFailureEvidence(result);
        
        // Add failure info to Allure
        Allure.addAttachment("Status", "FAILED");
        Allure.addAttachment("Error Message", throwable.getMessage());
        Allure.addAttachment("Stack Trace", getStackTrace(throwable));
    }
    
    @Override
    public void onTestSkipped(ITestResult result) {
        logger.warn("⚠ TEST SKIPPED: {}", result.getName());
        
        if (result.getThrowable() != null) {
            logger.warn("Skip Reason: {}", result.getThrowable().getMessage());
        }
        
        Allure.addAttachment("Status", "SKIPPED");
    }
    
    @Override
    public void beforeInvocation(IInvokedMethod method, ITestResult testResult) {
        if (method.isConfigurationMethod()) {
            logger.debug("Executing configuration method: {}", 
                method.getTestMethod().getMethodName());
        }
    }
    
    @Override
    public void afterInvocation(IInvokedMethod method, ITestResult testResult) {
        if (method.isConfigurationMethod() && !testResult.isSuccess()) {
            logger.error("Configuration method failed: {}", 
                method.getTestMethod().getMethodName());
        }
    }
    
    /**
     * Captures screenshots and additional evidence on test failure.
     */
    private void captureFailureEvidence(ITestResult result) {
        WebDriver driver = DriverManager.getDriver();
        
        if (driver != null) {
            try {
                // Capture screenshot
                byte[] screenshot = ScreenshotUtil.captureScreenshot(driver);
                Allure.addAttachment("Failure Screenshot", 
                    new ByteArrayInputStream(screenshot));
                
                // Save screenshot to file
                String screenshotPath = ScreenshotUtil.captureAndSaveScreenshot(
                    driver, result.getName());
                logger.info("Screenshot saved: {}", screenshotPath);
                
                // Capture page details
                String currentUrl = driver.getCurrentUrl();
                String pageTitle = driver.getTitle();
                
                Allure.addAttachment("Failed URL", currentUrl);
                Allure.addAttachment("Page Title", pageTitle);
                
                logger.info("Failed at URL: {}", currentUrl);
                logger.info("Page Title: {}", pageTitle);
                
            } catch (Exception e) {
                logger.error("Failed to capture failure evidence", e);
            }
        }
    }
    
    /**
     * Formats stack trace for better readability.
     */
    private String getStackTrace(Throwable throwable) {
        StringBuilder sb = new StringBuilder();
        sb.append(throwable.toString()).append("\n");
        
        for (StackTraceElement element : throwable.getStackTrace()) {
            sb.append("\tat ").append(element).append("\n");
            
            // Stop at test method to keep trace concise
            if (element.getClassName().contains("com.apple.automation.tests")) {
                sb.append("\t... (truncated)");
                break;
            }
        }
        
        return sb.toString();
    }
}
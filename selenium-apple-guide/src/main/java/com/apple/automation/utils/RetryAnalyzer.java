package com.apple.automation.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.IRetryAnalyzer;
import org.testng.ITestResult;

/**
 * Retry analyzer for handling flaky tests.
 * Configurable retry count via properties.
 */
public class RetryAnalyzer implements IRetryAnalyzer {
    
    private static final Logger logger = LogManager.getLogger(RetryAnalyzer.class);
    private int retryCount = 0;
    private final int maxRetryCount;
    
    public RetryAnalyzer() {
        ConfigReader config = ConfigReader.getInstance();
        this.maxRetryCount = config.getIntProperty("retry.count", 2);
    }
    
    @Override
    public boolean retry(ITestResult result) {
        if (retryCount < maxRetryCount) {
            retryCount++;
            logger.warn("Retrying test '{}' - Attempt {} of {}", 
                result.getName(), 
                retryCount, 
                maxRetryCount);
            
            // Log the failure reason
            if (result.getThrowable() != null) {
                logger.warn("Retry reason: {}", result.getThrowable().getMessage());
            }
            
            return true;
        }
        
        logger.error("Test '{}' failed after {} retries", 
            result.getName(), 
            maxRetryCount);
        
        return false;
    }
}
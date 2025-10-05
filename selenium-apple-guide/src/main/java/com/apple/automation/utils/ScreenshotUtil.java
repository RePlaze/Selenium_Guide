package com.apple.automation.utils;

import org.apache.commons.io.FileUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Utility class for capturing screenshots.
 */
public class ScreenshotUtil {
    
    private static final Logger logger = LogManager.getLogger(ScreenshotUtil.class);
    private static final String SCREENSHOT_DIR = "target/screenshots";
    private static final String DATE_FORMAT = "yyyyMMdd_HHmmss";
    
    static {
        // Create screenshot directory if it doesn't exist
        new File(SCREENSHOT_DIR).mkdirs();
    }
    
    /**
     * Captures screenshot and returns as byte array.
     */
    public static byte[] captureScreenshot(WebDriver driver) {
        try {
            return ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
        } catch (Exception e) {
            logger.error("Failed to capture screenshot", e);
            return new byte[0];
        }
    }
    
    /**
     * Captures screenshot and saves to file.
     */
    public static String captureAndSaveScreenshot(WebDriver driver, String testName) {
        try {
            TakesScreenshot screenshot = (TakesScreenshot) driver;
            File srcFile = screenshot.getScreenshotAs(OutputType.FILE);
            
            String timestamp = new SimpleDateFormat(DATE_FORMAT).format(new Date());
            String fileName = String.format("%s_%s.png", testName, timestamp);
            File destFile = new File(SCREENSHOT_DIR, fileName);
            
            FileUtils.copyFile(srcFile, destFile);
            logger.info("Screenshot saved: {}", destFile.getAbsolutePath());
            
            return destFile.getAbsolutePath();
            
        } catch (IOException e) {
            logger.error("Failed to save screenshot", e);
            return null;
        }
    }
    
    /**
     * Captures full page screenshot (if supported by driver).
     */
    public static byte[] captureFullPageScreenshot(WebDriver driver) {
        try {
            // This requires specific driver capabilities
            // For now, fallback to regular screenshot
            return captureScreenshot(driver);
        } catch (Exception e) {
            logger.error("Failed to capture full page screenshot", e);
            return new byte[0];
        }
    }
    
    /**
     * Cleans up old screenshots.
     */
    public static void cleanupScreenshots(int daysToKeep) {
        File screenshotDir = new File(SCREENSHOT_DIR);
        if (!screenshotDir.exists()) {
            return;
        }
        
        long cutoffTime = System.currentTimeMillis() - (daysToKeep * 24 * 60 * 60 * 1000L);
        
        File[] files = screenshotDir.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.lastModified() < cutoffTime) {
                    if (file.delete()) {
                        logger.info("Deleted old screenshot: {}", file.getName());
                    }
                }
            }
        }
    }
}
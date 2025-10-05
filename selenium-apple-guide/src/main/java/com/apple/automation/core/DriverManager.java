package com.apple.automation.core;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.safari.SafariDriver;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.Duration;

/**
 * Thread-safe WebDriver factory and manager.
 * Implements the Factory pattern for browser instantiation.
 */
public class DriverManager {
    
    private static final Logger logger = LogManager.getLogger(DriverManager.class);
    private static final ThreadLocal<WebDriver> driverThreadLocal = new ThreadLocal<>();
    private static final Duration DEFAULT_TIMEOUT = Duration.ofSeconds(10);
    
    public enum BrowserType {
        CHROME("chrome"),
        FIREFOX("firefox"),
        SAFARI("safari"),
        EDGE("edge"),
        CHROME_HEADLESS("chrome-headless"),
        FIREFOX_HEADLESS("firefox-headless");
        
        private final String browserName;
        
        BrowserType(String browserName) {
            this.browserName = browserName;
        }
        
        public String getBrowserName() {
            return browserName;
        }
    }
    
    /**
     * Creates a new WebDriver instance based on the specified browser type.
     * 
     * @param browserType The type of browser to create
     * @return WebDriver instance
     */
    public static WebDriver createDriver(BrowserType browserType) {
        logger.info("Creating {} driver", browserType.getBrowserName());
        
        WebDriver driver;
        
        switch (browserType) {
            case CHROME:
                driver = createChromeDriver(false);
                break;
                
            case CHROME_HEADLESS:
                driver = createChromeDriver(true);
                break;
                
            case FIREFOX:
                driver = createFirefoxDriver(false);
                break;
                
            case FIREFOX_HEADLESS:
                driver = createFirefoxDriver(true);
                break;
                
            case SAFARI:
                driver = createSafariDriver();
                break;
                
            case EDGE:
                driver = createEdgeDriver();
                break;
                
            default:
                throw new IllegalArgumentException("Unsupported browser: " + browserType);
        }
        
        configureDriver(driver);
        driverThreadLocal.set(driver);
        
        logger.info("{} driver created successfully", browserType.getBrowserName());
        return driver;
    }
    
    /**
     * Creates Chrome driver with options.
     */
    private static WebDriver createChromeDriver(boolean headless) {
        WebDriverManager.chromedriver().setup();
        
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-popup-blocking");
        options.addArguments("--disable-translate");
        options.addArguments("--start-maximized");
        
        // Performance improvements
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        
        if (headless) {
            options.addArguments("--headless");
            options.addArguments("--window-size=1920,1080");
        }
        
        // Enable logging for debugging
        options.setCapability("goog:loggingPrefs", 
            java.util.Map.of("browser", "ALL", "driver", "ALL"));
        
        return new ChromeDriver(options);
    }
    
    /**
     * Creates Firefox driver with options.
     */
    private static WebDriver createFirefoxDriver(boolean headless) {
        WebDriverManager.firefoxdriver().setup();
        
        FirefoxOptions options = new FirefoxOptions();
        options.addPreference("dom.webnotifications.enabled", false);
        options.addPreference("dom.push.enabled", false);
        
        if (headless) {
            options.addArguments("--headless");
            options.addArguments("--width=1920");
            options.addArguments("--height=1080");
        }
        
        return new FirefoxDriver(options);
    }
    
    /**
     * Creates Safari driver (macOS only).
     */
    private static WebDriver createSafariDriver() {
        // Safari doesn't require WebDriverManager
        return new SafariDriver();
    }
    
    /**
     * Creates Edge driver with options.
     */
    private static WebDriver createEdgeDriver() {
        WebDriverManager.edgedriver().setup();
        
        EdgeOptions options = new EdgeOptions();
        options.addArguments("--disable-notifications");
        options.addArguments("--start-maximized");
        
        return new EdgeDriver(options);
    }
    
    /**
     * Configures common driver settings.
     */
    private static void configureDriver(WebDriver driver) {
        driver.manage().timeouts().implicitlyWait(DEFAULT_TIMEOUT);
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
        driver.manage().timeouts().scriptTimeout(Duration.ofSeconds(30));
        
        // Maximize window (except for Safari which doesn't support it reliably)
        if (!(driver instanceof SafariDriver)) {
            driver.manage().window().maximize();
        }
        
        // Delete cookies for clean state
        driver.manage().deleteAllCookies();
    }
    
    /**
     * Gets the driver instance for the current thread.
     * 
     * @return WebDriver instance or null if not initialized
     */
    public static WebDriver getDriver() {
        return driverThreadLocal.get();
    }
    
    /**
     * Quits the driver and removes it from ThreadLocal.
     */
    public static void quitDriver() {
        WebDriver driver = driverThreadLocal.get();
        if (driver != null) {
            try {
                driver.quit();
                logger.info("Driver quit successfully");
            } catch (Exception e) {
                logger.error("Error quitting driver", e);
            } finally {
                driverThreadLocal.remove();
            }
        }
    }
    
    /**
     * Checks if driver is active and responsive.
     * 
     * @return true if driver is active, false otherwise
     */
    public static boolean isDriverActive() {
        WebDriver driver = driverThreadLocal.get();
        if (driver == null) {
            return false;
        }
        
        try {
            driver.getTitle();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
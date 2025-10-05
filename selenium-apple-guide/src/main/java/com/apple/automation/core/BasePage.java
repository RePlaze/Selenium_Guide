package com.apple.automation.core;

import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import io.qameta.allure.Step;

import java.time.Duration;
import java.util.List;
import java.util.function.Function;

/**
 * Base class for all page objects.
 * Provides common functionality and utilities for page interactions.
 */
public abstract class BasePage {
    
    protected final WebDriver driver;
    protected final WebDriverWait wait;
    protected final WebDriverWait longWait;
    protected final Actions actions;
    protected final JavascriptExecutor js;
    protected final Logger logger;
    
    private static final Duration DEFAULT_WAIT = Duration.ofSeconds(10);
    private static final Duration LONG_WAIT = Duration.ofSeconds(30);
    private static final Duration POLLING_INTERVAL = Duration.ofMillis(500);
    
    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, DEFAULT_WAIT);
        this.longWait = new WebDriverWait(driver, LONG_WAIT);
        this.actions = new Actions(driver);
        this.js = (JavascriptExecutor) driver;
        this.logger = LogManager.getLogger(this.getClass());
        
        PageFactory.initElements(driver, this);
        
        // Wait for page to be loaded
        waitForPageLoad();
        
        // Verify page is loaded correctly
        if (!isPageLoaded()) {
            throw new IllegalStateException(
                String.format("Page %s is not loaded properly", this.getClass().getSimpleName())
            );
        }
    }
    
    /**
     * Abstract method to verify if the page is loaded.
     * Must be implemented by each page class.
     */
    public abstract boolean isPageLoaded();
    
    /**
     * Waits for element and returns it.
     */
    @Step("Wait for element: {locator}")
    protected WebElement waitForElement(By locator) {
        logger.debug("Waiting for element: {}", locator);
        return wait.until(ExpectedConditions.presenceOfElementLocated(locator));
    }
    
    /**
     * Waits for element to be visible.
     */
    @Step("Wait for element to be visible: {locator}")
    protected WebElement waitForVisible(By locator) {
        logger.debug("Waiting for element to be visible: {}", locator);
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }
    
    /**
     * Waits for element to be clickable and clicks it.
     */
    @Step("Click on element: {locator}")
    protected void click(By locator) {
        logger.debug("Clicking on element: {}", locator);
        WebElement element = wait.until(ExpectedConditions.elementToBeClickable(locator));
        highlightElement(element);
        element.click();
    }
    
    /**
     * Waits for element and types text.
     */
    @Step("Type '{text}' into element: {locator}")
    protected void type(By locator, String text) {
        logger.debug("Typing '{}' into element: {}", text, locator);
        WebElement element = waitForVisible(locator);
        highlightElement(element);
        element.clear();
        element.sendKeys(text);
    }
    
    /**
     * Gets text from element.
     */
    @Step("Get text from element: {locator}")
    protected String getText(By locator) {
        logger.debug("Getting text from element: {}", locator);
        return waitForVisible(locator).getText().trim();
    }
    
    /**
     * Checks if element is present on the page.
     */
    protected boolean isElementPresent(By locator) {
        try {
            driver.findElement(locator);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }
    
    /**
     * Checks if element is visible on the page.
     */
    protected boolean isElementVisible(By locator) {
        try {
            return driver.findElement(locator).isDisplayed();
        } catch (NoSuchElementException e) {
            return false;
        }
    }
    
    /**
     * Waits for list of elements.
     */
    protected List<WebElement> waitForElements(By locator) {
        logger.debug("Waiting for elements: {}", locator);
        return wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(locator));
    }
    
    /**
     * Scrolls to element using JavaScript.
     */
    @Step("Scroll to element: {element}")
    protected void scrollToElement(WebElement element) {
        logger.debug("Scrolling to element");
        js.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element);
        pause(500); // Small pause for smooth scrolling
    }
    
    /**
     * Performs hover action on element.
     */
    @Step("Hover over element: {locator}")
    protected void hover(By locator) {
        logger.debug("Hovering over element: {}", locator);
        WebElement element = waitForVisible(locator);
        actions.moveToElement(element).perform();
    }
    
    /**
     * Performs JavaScript click when regular click fails.
     */
    @Step("Force click on element using JavaScript")
    protected void jsClick(WebElement element) {
        logger.debug("Performing JavaScript click");
        js.executeScript("arguments[0].click();", element);
    }
    
    /**
     * Highlights element for debugging (adds red border).
     */
    private void highlightElement(WebElement element) {
        try {
            String originalStyle = element.getAttribute("style");
            js.executeScript("arguments[0].style.border='2px solid red'", element);
            pause(100);
            js.executeScript("arguments[0].setAttribute('style', arguments[1])", element, originalStyle);
        } catch (Exception e) {
            // Ignore highlighting errors
        }
    }
    
    /**
     * Custom fluent wait with specific condition.
     */
    protected <T> T fluentWait(Function<WebDriver, T> condition, Duration timeout) {
        return new FluentWait<>(driver)
            .withTimeout(timeout)
            .pollingEvery(POLLING_INTERVAL)
            .ignoring(NoSuchElementException.class)
            .ignoring(StaleElementReferenceException.class)
            .until(condition);
    }
    
    /**
     * Waits for page to be fully loaded.
     */
    @Step("Wait for page to load")
    protected void waitForPageLoad() {
        logger.debug("Waiting for page to load");
        wait.until(driver -> js.executeScript("return document.readyState").equals("complete"));
    }
    
    /**
     * Waits for jQuery AJAX calls to complete.
     */
    @Step("Wait for AJAX to complete")
    protected void waitForAjax() {
        logger.debug("Waiting for AJAX to complete");
        try {
            wait.until(driver -> (Boolean) js.executeScript("return jQuery.active == 0"));
        } catch (Exception e) {
            // jQuery might not be present on the page
            logger.debug("jQuery not found or AJAX wait failed");
        }
    }
    
    /**
     * Gets current page title.
     */
    public String getPageTitle() {
        return driver.getTitle();
    }
    
    /**
     * Gets current URL.
     */
    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }
    
    /**
     * Refreshes the page.
     */
    @Step("Refresh page")
    public void refreshPage() {
        logger.info("Refreshing page");
        driver.navigate().refresh();
        waitForPageLoad();
    }
    
    /**
     * Takes screenshot of current page.
     */
    public byte[] takeScreenshot() {
        return ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
    }
    
    /**
     * Small pause for animations or transitions.
     * Use sparingly and prefer proper waits.
     */
    protected void pause(long milliseconds) {
        try {
            Thread.sleep(milliseconds);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
    
    /**
     * Switch to frame by index or name.
     */
    protected void switchToFrame(String frameNameOrId) {
        logger.debug("Switching to frame: {}", frameNameOrId);
        wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt(frameNameOrId));
    }
    
    /**
     * Switch back to default content.
     */
    protected void switchToDefaultContent() {
        logger.debug("Switching to default content");
        driver.switchTo().defaultContent();
    }
    
    /**
     * Accepts browser alert.
     */
    @Step("Accept alert")
    protected void acceptAlert() {
        logger.debug("Accepting alert");
        wait.until(ExpectedConditions.alertIsPresent());
        driver.switchTo().alert().accept();
    }
    
    /**
     * Gets alert text and accepts it.
     */
    protected String getAlertText() {
        logger.debug("Getting alert text");
        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        String text = alert.getText();
        alert.accept();
        return text;
    }
}
package com.example.tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.Duration;

public class BasicSeleniumTest {
    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeMethod
    public void setUp() {
        // Setup ChromeDriver using WebDriverManager
        WebDriverManager.chromedriver().setup();
        
        // Configure Chrome options
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.addArguments("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
        
        // Initialize driver
        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        
        // Initialize WebDriverWait
        wait = new WebDriverWait(driver, Duration.ofSeconds(20));
    }

    @Test
    public void testGoogleSearch() {
        // Navigate to Google
        driver.get("https://www.google.com");
        
        // Find search box
        WebElement searchBox = driver.findElement(By.name("q"));
        
        // Type search query
        searchBox.sendKeys("Selenium WebDriver");
        
        // Submit the search
        searchBox.submit();
        
        // Wait for results
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("search")));
        
        // Verify results are displayed
        WebElement results = driver.findElement(By.id("search"));
        Assert.assertTrue(results.isDisplayed(), "Search results not displayed");
        
        // Verify page title contains search term
        Assert.assertTrue(driver.getTitle().contains("Selenium WebDriver"), 
            "Page title doesn't contain search term");
    }

    @Test
    public void testNavigationAndInteraction() {
        // Navigate to a demo site
        driver.get("https://www.selenium.dev/selenium/web/web-form.html");
        
        // Wait for page to load
        WebElement textInput = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.id("my-text-id"))
        );
        
        // Enter text
        textInput.sendKeys("Selenium Test");
        
        // Find and enter password
        WebElement passwordInput = driver.findElement(By.name("my-password"));
        passwordInput.sendKeys("SecurePassword123");
        
        // Find and click dropdown
        WebElement dropdown = driver.findElement(By.name("my-select"));
        dropdown.click();
        
        // Select an option
        WebElement option = driver.findElement(By.xpath("//option[@value='2']"));
        option.click();
        
        // Submit the form
        WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));
        submitButton.click();
        
        // Wait for confirmation
        WebElement message = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.className("lead"))
        );
        
        // Verify submission
        Assert.assertTrue(message.getText().contains("Received"), 
            "Form submission confirmation not received");
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
package com.apple.automation.pages;

import com.apple.automation.core.BasePage;
import io.qameta.allure.Step;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Page Object for Apple Homepage.
 * Demonstrates clean, maintainable page object pattern.
 */
public class AppleHomePage extends BasePage {
    
    // Locators
    private static final By APPLE_LOGO = By.cssSelector("a.ac-gn-link-apple");
    private static final By SEARCH_BUTTON = By.cssSelector("a.ac-gn-link-search");
    private static final By SEARCH_INPUT = By.cssSelector("input.ac-gn-searchform-input");
    private static final By BAG_BUTTON = By.cssSelector("a.ac-gn-link-bag");
    private static final By NAV_MENU_ITEMS = By.cssSelector("ul.ac-gn-list li.ac-gn-item");
    
    // Page Factory elements
    @FindBy(css = ".ribbon-drop-wrapper")
    private WebElement promoRibbon;
    
    @FindBy(css = ".unit-wrapper.unit-hero")
    private List<WebElement> heroUnits;
    
    @FindBy(css = "a.ac-gn-link")
    private List<WebElement> navigationLinks;
    
    public AppleHomePage(WebDriver driver) {
        super(driver);
    }
    
    @Override
    public boolean isPageLoaded() {
        return isElementVisible(APPLE_LOGO) && 
               isElementVisible(SEARCH_BUTTON);
    }
    
    /**
     * Opens the search interface.
     */
    @Step("Open search")
    public AppleSearchResultsPage openSearch() {
        logger.info("Opening search interface");
        click(SEARCH_BUTTON);
        waitForVisible(SEARCH_INPUT);
        return new AppleSearchResultsPage(driver);
    }
    
    /**
     * Performs a search.
     */
    @Step("Search for: {searchTerm}")
    public AppleSearchResultsPage search(String searchTerm) {
        logger.info("Searching for: {}", searchTerm);
        
        // Open search if not already open
        if (!isElementVisible(SEARCH_INPUT)) {
            click(SEARCH_BUTTON);
        }
        
        type(SEARCH_INPUT, searchTerm);
        WebElement searchField = driver.findElement(SEARCH_INPUT);
        searchField.submit();
        
        return new AppleSearchResultsPage(driver);
    }
    
    /**
     * Navigates to a product page via navigation menu.
     */
    @Step("Navigate to product: {productName}")
    public void navigateToProduct(String productName) {
        logger.info("Navigating to product: {}", productName);
        
        List<WebElement> navItems = waitForElements(NAV_MENU_ITEMS);
        
        WebElement productLink = navItems.stream()
            .filter(item -> item.getText().equalsIgnoreCase(productName))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException(
                "Product not found in navigation: " + productName));
        
        highlightAndClick(productLink);
    }
    
    /**
     * Gets all navigation menu items.
     */
    public List<String> getNavigationItems() {
        return navigationLinks.stream()
            .map(WebElement::getText)
            .filter(text -> !text.isEmpty())
            .collect(Collectors.toList());
    }
    
    /**
     * Checks if promotional ribbon is displayed.
     */
    public boolean isPromoRibbonDisplayed() {
        return isElementVisible(By.cssSelector(".ribbon-drop-wrapper"));
    }
    
    /**
     * Opens the shopping bag.
     */
    @Step("Open shopping bag")
    public AppleBagPage openBag() {
        logger.info("Opening shopping bag");
        click(BAG_BUTTON);
        return new AppleBagPage(driver);
    }
    
    /**
     * Gets the number of hero units (featured products) on the page.
     */
    public int getHeroUnitsCount() {
        return heroUnits.size();
    }
    
    /**
     * Clicks on Apple logo to return to homepage.
     */
    @Step("Click Apple logo")
    public void clickAppleLogo() {
        logger.info("Clicking Apple logo");
        click(APPLE_LOGO);
        waitForPageLoad();
    }
    
    /**
     * Highlights element and clicks it (for demo purposes).
     */
    private void highlightAndClick(WebElement element) {
        js.executeScript("arguments[0].style.border='2px solid blue'", element);
        pause(300); // Brief pause to see the highlight
        element.click();
    }
}
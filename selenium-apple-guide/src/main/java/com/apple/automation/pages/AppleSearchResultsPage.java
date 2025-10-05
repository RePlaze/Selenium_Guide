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
 * Page Object for Apple Search Results page.
 */
public class AppleSearchResultsPage extends BasePage {
    
    // Locators
    private static final By SEARCH_RESULTS_CONTAINER = By.cssSelector(".rf-serp-results");
    private static final By SEARCH_RESULT_ITEMS = By.cssSelector(".rf-serp-product-item");
    private static final By NO_RESULTS_MESSAGE = By.cssSelector(".rf-serp-noresults");
    private static final By SEARCH_SUGGESTIONS = By.cssSelector(".ac-gn-searchresults-item");
    
    @FindBy(css = ".rf-serp-product-item-title")
    private List<WebElement> resultTitles;
    
    @FindBy(css = ".rf-serp-product-item-price")
    private List<WebElement> resultPrices;
    
    @FindBy(css = ".rf-serp-exploration-curated-position")
    private WebElement curatedSection;
    
    public AppleSearchResultsPage(WebDriver driver) {
        super(driver);
    }
    
    @Override
    public boolean isPageLoaded() {
        // Either results or no results message should be visible
        return isElementVisible(SEARCH_RESULTS_CONTAINER) || 
               isElementVisible(NO_RESULTS_MESSAGE);
    }
    
    /**
     * Gets the number of search results.
     */
    @Step("Get search results count")
    public int getResultsCount() {
        if (isNoResultsDisplayed()) {
            return 0;
        }
        
        List<WebElement> results = waitForElements(SEARCH_RESULT_ITEMS);
        logger.info("Found {} search results", results.size());
        return results.size();
    }
    
    /**
     * Gets all result titles.
     */
    public List<String> getResultTitles() {
        return resultTitles.stream()
            .map(WebElement::getText)
            .map(String::trim)
            .collect(Collectors.toList());
    }
    
    /**
     * Gets the title of the first result.
     */
    public String getFirstResultTitle() {
        if (resultTitles.isEmpty()) {
            throw new IllegalStateException("No search results found");
        }
        return resultTitles.get(0).getText().trim();
    }
    
    /**
     * Clicks on a result by index.
     */
    @Step("Click on result number: {index}")
    public void clickResult(int index) {
        List<WebElement> results = waitForElements(SEARCH_RESULT_ITEMS);
        
        if (index < 0 || index >= results.size()) {
            throw new IllegalArgumentException(
                String.format("Invalid result index: %d. Available results: %d", 
                    index, results.size()));
        }
        
        WebElement result = results.get(index);
        scrollToElement(result);
        result.click();
        logger.info("Clicked on result #{}", index + 1);
    }
    
    /**
     * Clicks on a result by title.
     */
    @Step("Click on result with title containing: {titlePart}")
    public void clickResultByTitle(String titlePart) {
        WebElement result = resultTitles.stream()
            .filter(element -> element.getText().toLowerCase()
                .contains(titlePart.toLowerCase()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException(
                "No result found with title containing: " + titlePart));
        
        scrollToElement(result);
        result.click();
        logger.info("Clicked on result with title: {}", result.getText());
    }
    
    /**
     * Checks if no results message is displayed.
     */
    public boolean isNoResultsDisplayed() {
        return isElementVisible(NO_RESULTS_MESSAGE);
    }
    
    /**
     * Gets the no results message text.
     */
    public String getNoResultsMessage() {
        if (!isNoResultsDisplayed()) {
            return "";
        }
        return getText(NO_RESULTS_MESSAGE);
    }
    
    /**
     * Gets search suggestions if available.
     */
    public List<String> getSearchSuggestions() {
        if (!isElementPresent(SEARCH_SUGGESTIONS)) {
            return List.of();
        }
        
        return driver.findElements(SEARCH_SUGGESTIONS).stream()
            .map(WebElement::getText)
            .filter(text -> !text.isEmpty())
            .collect(Collectors.toList());
    }
    
    /**
     * Checks if curated content section is displayed.
     */
    public boolean isCuratedSectionDisplayed() {
        return isElementVisible(By.cssSelector(".rf-serp-exploration-curated-position"));
    }
    
    /**
     * Gets price for a specific result.
     */
    public String getResultPrice(int index) {
        if (index < 0 || index >= resultPrices.size()) {
            return "Price not available";
        }
        return resultPrices.get(index).getText().trim();
    }
    
    /**
     * Filters results by price range.
     */
    public List<WebElement> filterResultsByPriceRange(double minPrice, double maxPrice) {
        return driver.findElements(SEARCH_RESULT_ITEMS).stream()
            .filter(item -> {
                try {
                    String priceText = item.findElement(By.cssSelector(".rf-serp-product-item-price"))
                        .getText()
                        .replaceAll("[^0-9.]", "");
                    double price = Double.parseDouble(priceText);
                    return price >= minPrice && price <= maxPrice;
                } catch (Exception e) {
                    return false;
                }
            })
            .collect(Collectors.toList());
    }
}